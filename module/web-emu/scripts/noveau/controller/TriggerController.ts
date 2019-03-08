//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import App from '../App';
import Trigger from '@chipotle/wfw/Trigger';

// ---------------------------------------------------------------------------------------------------------------------

/**
 * The class that handles binding HTML buttons to triggers.
 */
class TriggerController extends App {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	protected listenerCache: Map<String, (click: MouseEvent) => void>;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructors:                                                                                             |
	// -------------------------------------------------------------------------------------------------------------

	public constructor() {
		super();

		this.listenerCache = new Map();
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Hooks:                                                                                                    |
	// -------------------------------------------------------------------------------------------------------------

	protected init(this: App.Fragment<this>): void {
		for (let button of document.querySelectorAll('[data-trigger]')) {
			this.register(<HTMLElement>button);
		}

		this.ready();
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Gets the listener for a specific trigger.
	 *
	 * @param trigger The trigger ID.
	 *
	 * @returns A function to call the trigger.
	 * @throws Error When the trigger ID is invalid.
	 */
	protected getListener(this: App.Fragment<this>, trigger: string): (click: MouseEvent) => void {
		let listener = this.listenerCache.get(trigger);
		if (listener != null) return listener;

		// Find trigger object.
		let splits = trigger.split(/(?:\.|->)/);
		let target: any = this.triggers;
		while (splits.length > 0) {
			target = (<any>target)[splits.shift()!];
			if (target == null) throw new Error(`Invalid trigger: ${trigger}.`);
		}

		if (!(target instanceof Trigger)) {
			throw new Error(`Invalid trigger: ${trigger}.`);
		}

		// Create listener to call trigger object.
		listener = () => {
			target.trigger();
		};

		// Return it.
		this.listenerCache.set(trigger, listener);
		return listener;
	}

	/**
	 * Adds an event listener to an element with a `data-trigger` attribute.
	 * @param element The element.
	 */
	public register(this: App.Fragment<this>, element: HTMLElement): void {
		let trigger = element.getAttribute('data-trigger');
		if (trigger == null) return;

		for (let pattern of trigger.includes(';') ? trigger.split(/;\s*/) : [trigger]) {
			element.addEventListener('click', this.getListener(pattern));
		}
	}

	/**
	 * Removes an event listener from an element with a `data-trigger` attribute.
	 * @param element The element.
	 */
	public unregister(this: App.Fragment<this>, element: HTMLElement): void {
		let trigger = element.getAttribute('data-trigger');
		if (trigger == null) return;

		for (let pattern of trigger.includes(';') ? trigger.split(/;\s*/) : [trigger]) {
			element.removeEventListener('click', this.getListener(pattern));
		}
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default TriggerController;
export {TriggerController};
