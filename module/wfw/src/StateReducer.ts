//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Optional from '@chipotle/types/Optional';

// ---------------------------------------------------------------------------------------------------------------------
// StateReducer:
// ---------------------------------------------------------------------------------------------------------------------

/**
 * A function that reduces one or more potential state values into a canonical state.
 */
type StateReducer<T, V> = (values: Optional<T>[]) => V;

// ---------------------------------------------------------------------------------------------------------------------
// StateReducer: ANY_TRUE
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Returns true if any value is true.
 *
 * @param values The values to reduce.
 * @returns The reduced value.
 */
export function ANY_TRUE(values: Optional<boolean>[]): boolean {
	if (values.length === 0) return false;
	return values.includes(true);
}

/**
 * Returns true if all values are true.
 *
 * @param values The values to reduce.
 * @returns The reduced value.
 */
export function ALL_TRUE(values: Optional<boolean>[]): boolean {
	if (values.length === 0) return true;
	return !values.includes(false);
}

// ---------------------------------------------------------------------------------------------------------------------
export default StateReducer;
export {StateReducer};
