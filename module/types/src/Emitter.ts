//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
type Listener = (...args: any) => void;

/**
 * An event emitter.
 */
class Emitter<EventEnum = string> {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * The listener functions.
	 */
	private readonly _emitter_listeners: Map<EventEnum, Listener[]>;

	/**
	 * A map for suppressed events.
	 */
	private readonly _emitter_suppression: Map<EventEnum, boolean>;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructor:                                                                                              |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a new emitter.
	 */
	public constructor() {
		this._emitter_listeners = new Map();
		this._emitter_suppression = new Map();
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Adds an event listener.
	 *
	 * @param event The event name.
	 * @param listener The listener function.
	 */
	public addListener(event: EventEnum, listener: Listener): void {
		let listeners = this._emitter_listeners.get(event);
		if (listeners == null) this._emitter_listeners.set(event, (listeners = []));

		let evt = {
			listener: listener,
			cancel: false
		};

		this.emit(<any>'[[emitter:add]]', event, evt);
		if (!evt.cancel) listeners.push(listener);
	}

	/**
	 * Removes an event listener.
	 *
	 * @param event The event name.
	 * @param listener The listener function.
	 */
	public removeListener(event: EventEnum, listener: Listener): void {
		let listeners = this._emitter_listeners.get(event);
		if (listeners == null) return;
		let index = listeners.findIndex(l => l === listener);
		if (index === -1) return;

		let evt = {
			listener: listener,
			cancel: false
		};

		this.emit(<any>'[[emitter:remove]]', event, evt);
		if (!evt.cancel) listeners.splice(index, 1);
	}

	public suppressListeners(event: EventEnum, suppress: boolean): void {
		this._emitter_suppression.set(event, suppress);
	}

	/**
	 * Emits an event.
	 *
	 * @param event The event name.
	 * @param args The event arguments.
	 */
	public emit(event: EventEnum, ...args: any): void {
		let listeners = this._emitter_listeners.get(event);
		if (listeners === undefined) return;
		if (this._emitter_suppression.get(event) === true) return;

		for (let i = 0, n = listeners.length; i < n; i++) {
			listeners[i](...args);
		}
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default Emitter;
export {Emitter};
