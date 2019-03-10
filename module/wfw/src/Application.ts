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
	let waiting: ([boolean])[] = [];
	let ready_app = false;
	let emitter = new Emitter();

	function fireReady() {
		if (ready_app) return;
		if (waiting.find(([w]) => !w) === undefined) {
			emitter.emit('ready');
			ready_app = true;
		}
	}

	const fragment: Fragment<BASE_CONSTRUCTOR, BASE_CLASS> = <any>class extends (<any>base) {
		// -----------------------------------------------------------------------------------------------------
		// | Fields:                                                                                           |
		// -----------------------------------------------------------------------------------------------------

		private static _status = [false];

		// -----------------------------------------------------------------------------------------------------
		// | Constructor:                                                                                      |
		// -----------------------------------------------------------------------------------------------------

		protected constructor() {
			super();

			setTimeout(() => {
				if (typeof (<any>this).init === 'function') {
					DOMReady((<any>this).init.bind(this));
				}
			}, 0);
		}

		// -----------------------------------------------------------------------------------------------------
		// | Methods:                                                                                          |
		// -----------------------------------------------------------------------------------------------------

		protected ready(): void {
			(<any>this.constructor).ready();
		}

		protected static ready(): void {
			this._status[0] = true;
			fireReady();
		}
	};

	// Hook emitter for 'ready' and 'dom'.
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
		waiting.push(...fragments.map((fragment: any) => fragment._status));

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
interface FragmentClass<BASE> extends Emitter<'ready' | string> {
	/**
	 * Method to be called when the application fragment is loaded.
	 * Failure to call this will result in the application never emitting `app ready` events.
	 */
	ready(): void;
}

/**
 * A superclass for application fragments.
 */
interface FragmentConstructor<BASE_CONSTRUCTOR, BASE_CLASS> extends Emitter<'ready'> {
	new <T>(): FragmentClass<BASE_CLASS> & BASE_CLASS;

	/**
	 * Notes which classes are required to call {@link FragmentClass#ready} before the application can be
	 * considered ready.
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
