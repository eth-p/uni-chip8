//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Emitter from '@chipotle/types/Emitter';

import DOMReady from './DOMReady';

// ---------------------------------------------------------------------------------------------------------------------
// Application:
// ---------------------------------------------------------------------------------------------------------------------

/**
 * An object representing a web application.
 *
 * ## Example
 *
 *     class MyAppBase {
 *
 *     }
 *
 *     const MyApp = new Application<typeof MyAppBase, MyAppBase>(MyAppBase);
 *     class MyFragment extends MyApp {
 *
 *     }
 *
 * ## Events
 *
 * - `ready` -- Called when the app is loaded.
 */
function Application<BASE_CONSTRUCTOR, BASE_CLASS>(base: BASE_CONSTRUCTOR): Fragment<BASE_CONSTRUCTOR, BASE_CLASS> {
	let waiting: ({_status: boolean})[] = [];
	let ready_app = false;
	let emitter = new Emitter();

	function fireReady() {
		if (ready_app) return;
		if (waiting.find(frag => !frag._status) === undefined) {
			emitter.emit('ready');
			ready_app = true;
		}
	}

	const fragment: Fragment<BASE_CONSTRUCTOR, BASE_CLASS> = <any>class extends (<any>base) {
		// -----------------------------------------------------------------------------------------------------
		// | Fields:                                                                                           |
		// -----------------------------------------------------------------------------------------------------

		private static _status = false;

		// -----------------------------------------------------------------------------------------------------
		// | Constructor:                                                                                      |
		// -----------------------------------------------------------------------------------------------------

		protected constructor() {
			super();

			setTimeout(async () => {
				// Stage 1.
				await [
					typeof this.initData === 'function' ? this.initData() : null,
					typeof this.initDOM === 'function' ? DOMReady().then(() => this.initDOM!()) : null,
					typeof this.initTrigger === 'function' ? this.initTrigger() : null,
					typeof this.initState === 'function' ? this.initState() : null
				].filter(f => f != null);

				// Stage 2.
				await [typeof this.initListener === 'function' ? this.initListener() : null].filter(f => f != null);

				// Ready.
				(<any>this.constructor).ready();
			}, 0);
		}

		// -----------------------------------------------------------------------------------------------------
		// | Hooks:                                                                                            |
		// -----------------------------------------------------------------------------------------------------

		/**
		 * Called when the DOM is loaded.
		 */
		protected initDOM?: () => Promise<void>;

		/**
		 * Called when the fragment should load external data.
		 */
		protected initData?: () => Promise<void>;

		/**
		 * Called when the fragment should bind application triggers.
		 */
		protected initTrigger?: () => Promise<void>;

		/**
		 * Called when the fragment should add providers to the application state.
		 */
		protected initState?: () => Promise<void>;

		/**
		 * Called after all the other initializers.
		 * This should add listeners to things.
		 */
		protected initListener?: () => Promise<void>;

		// -----------------------------------------------------------------------------------------------------
		// | Methods:                                                                                          |
		// -----------------------------------------------------------------------------------------------------

		protected static ready(): void {
			this._status = true;
			fireReady();
		}
	};

	// Hook emitter for 'ready'.
	emitter.addListener('[[emitter:add]]', (name: string, details: any) => {
		switch (name) {
			case 'ready': {
				if (ready_app) {
					details.listener();
					details.cancel = true;
					return;
				}

				break;
			}

			default:
				break;
		}
	});

	// Bind shared emitter into fragment class and prototype.
	for (let name of Object.getOwnPropertyNames(Emitter.prototype)) {
		let fn = (<any>emitter)[name].bind(emitter);

		(<any>fragment.prototype)[name] = fn;
		(<any>fragment)[name] = fn;
	}

	// Add loaded to fragment static.
	fragment.depends = function(fragments: any) {
		waiting.push(...fragments);

		for (let frag of fragments) {
			new frag();
		}

		fireReady();
	};

	// Add base static to fragment static.
	Object.assign(fragment, base);

	// Return fragment.
	return fragment;
}

// ---------------------------------------------------------------------------------------------------------------------
// Fragment:
// ---------------------------------------------------------------------------------------------------------------------

/**
 * A fragment of the application.
 */
interface FragmentClass<BASE> extends Emitter<'ready' | string> {}

/**
 * A superclass for application fragments.
 */
interface FragmentConstructor<BASE_CONSTRUCTOR, BASE_CLASS> extends Emitter<'ready'> {
	new <T>(): FragmentClass<BASE_CLASS> & BASE_CLASS;

	/**
	 * Loads a class as an application fragment.
	 */
	depends(fragments: any[]): void;
}

type Fragment<BASE_CONSTRUCTOR, BASE_CLASS> = FragmentConstructor<BASE_CONSTRUCTOR, BASE_CLASS> & BASE_CONSTRUCTOR;

// ---------------------------------------------------------------------------------------------------------------------
export default Application;
export {Application};
export {Fragment};
export {FragmentClass};
export {FragmentConstructor};
