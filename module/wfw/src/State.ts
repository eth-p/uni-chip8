//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Emitter from '@chipotle/types/Emitter';
import Optional from '@chipotle/types/Optional';

import StateProvider from './StateProvider';
import StateProviderFn from './StateProviderFn';
import StateReducer from './StateReducer';

// ---------------------------------------------------------------------------------------------------------------------
// State:
// ---------------------------------------------------------------------------------------------------------------------

/**
 * An object representing some unique aspect of the application state.
 * This takes one or more providers, and reduces their values down into a single, canonical state object.
 *
 * Events:
 * - `change`  -- Called when the canonical value changes.
 * - `refresh` -- Called when a provider value changes.
 */
class State<T, C = any> extends Emitter<'change' | 'refresh' | 'add provider' | 'remove provider'> {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	protected providers: StateProviderFn<T>[];
	protected reducer: StateReducer<T, C>;
	protected state: Optional<T>[];
	protected reduced: Optional<C>;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructor:                                                                                              |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a new State object.
	 */
	public constructor(reducer: StateReducer<T, C>) {
		super();
		this.providers = [];
		this.state = [];
		this.reduced = undefined;
		this.reducer = reducer;
		this.refresh();
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Getters:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * The state values.
	 */
	public get values(): Optional<T>[] {
		return this.state.slice(0);
	}

	/**
	 * The reduced state value.
	 */
	public get value(): Optional<C> {
		return this.reduced;
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Refreshes the cached values for the state.
	 */
	public refresh(): void {
		this.state = this.providers.map(provider => provider());
		this.reduced = this.reducer(this.state);
		this.emit('refresh');
		this.emit('change');
	}

	/**
	 * Adds a state provider.
	 *
	 * @param provider The provider function.
	 */
	public addProvider(provider: StateProviderFn<T> | StateProvider<T>): void {
		this.providers.push(provider instanceof StateProvider ? provider.fn(this) : provider);
		this.emit('add provider', provider);
	}

	/**
	 * Removes a state provider.
	 *
	 * @param provider The provider function.
	 */
	public removeProvider(provider: StateProviderFn<T>): void {
		let index = this.providers.findIndex(p => p === provider);
		if (index === -1) return;
		this.providers.splice(index, 1);
		this.emit('remove provider', provider);
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default State;
export {State};
