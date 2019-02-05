//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
type Listener = (...args: any) => void;

/**
 * An event emitter.
 */
class Emitter {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * The listener functions.
	 */
	private readonly _emitter_listeners: Map<String, Listener[]>;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructor:                                                                                              |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a new emitter.
	 */
	public constructor() {
		this._emitter_listeners = new Map();
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
	public addListener(event: string, listener: Listener): void {
		let listeners = this._emitter_listeners.get(event);
		if (listeners == null) this._emitter_listeners.set(event, (listeners = []));
		listeners.push(listener);
	}

	/**
	 * Removes an event listener.
	 *
	 * @param event The event name.
	 * @param listener The listener function.
	 */
	public removeListener(event: string, listener: Listener): void {
		let listeners = this._emitter_listeners.get(event);
		if (listeners == null) return;
		let index = listeners.findIndex(l => l === listener);
		if (index === -1) return;
		listeners.splice(index, 1);
	}

	/**
	 * Emits an event.
	 *
	 * @param event The event name.
	 * @param args The event arguments.
	 */
	public emit(event: string, ...args: any): void {
		let listeners = this._emitter_listeners.get(event);
		if (listeners === undefined) return;

		for (let i = 0, n = listeners.length; i < n; i++) {
			listeners[i](...args);
		}
	}
}

//! --------------------------------------------------------------------------------------------------------------------
export default Emitter;
export {Emitter};
