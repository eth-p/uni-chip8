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
 * An that allows for something to be triggered arbitrarily.
 *
 * Events:
 * - `trigger`  -- Called when something should be triggered.
 */
class Trigger extends Emitter<'trigger'> {
	// -------------------------------------------------------------------------------------------------------------
	// Methods:
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Triggers something.
	 * @param args The arguments to pass.
	 */
	public trigger(...args: any[]): void {
		this.emit('trigger', ...args);
	}

	/**
	 * Adds a listener for the trigger event.
	 * @param fn The listener function.
	 */
	public onTrigger(fn: () => void): void {
		this.addListener('trigger', fn);
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default Trigger;
export {Trigger};
