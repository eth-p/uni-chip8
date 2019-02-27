//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import State from './State';
import StateProviderFn from './StateProviderFn';

// ---------------------------------------------------------------------------------------------------------------------
// StateProvider:
// ---------------------------------------------------------------------------------------------------------------------

/**
 * A class that creates StateProviderFn<T> functions that listen to a property change on the provider.
 *
 * ## Example
 *
 *     let prov = new StateProvider<boolean>(false);
 *     state.addProvider(prov);
 *
 *     prov.value = true; // Updates the State<boolean> object.
 *
 */
class StateProvider<T> {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	private _value: T;
	private _states: State<T, unknown>[];

	// -------------------------------------------------------------------------------------------------------------
	// | Constructors:                                                                                             |
	// -------------------------------------------------------------------------------------------------------------

	public constructor(value: T) {
		this._value = value;
		this._states = [];
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Accessors:                                                                                                |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * The provider value.
	 * Setting this will refresh all associated states.
	 */
	get value() {
		return this._value;
	}

	set value(value: T) {
		if (value === this._value) return;

		this._value = value;
		this._states.forEach(s => s.refresh());
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a provider function for a given State<T> object.
	 *
	 * @param state The state.
	 * @returns The provider function.
	 */
	public fn(state: State<T, unknown>): StateProviderFn<T> {
		this._states.push(state);

		// Add listener to unbind automatically.
		let provider = () => this._value;
		let listener: any;
		state.addListener(
			'remove provider',
			(listener = (prov: StateProviderFn<T>) => {
				if (prov === provider) {
					state.removeListener('remove provider', listener);
					this._states = this._states.filter(s => s !== state);
				}
			})
		);

		// Return provider function.
		return provider;
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default StateProvider;
export {StateProvider};
