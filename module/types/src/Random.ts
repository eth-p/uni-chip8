//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------

import JsonType from '@chipotle/types/JsonType';

/**
 * A pseudo random number generator.
 */
interface Random {
	/**
	 * Generates a number between `min` and `max`.
	 *
	 * @param min The minimum number, inclusive.
	 * @param max The maximum number, exclusive.
	 *
	 * @returns The generated number.
	 */
	nextInt(min: number, max: number): number;

	/**
	 * Generates a number between `0` and `max.
	 *
	 * @param max The maximum number, exclusive.
	 *
	 * @returns The generated number.
	 */
	nextInt(max: number): number;

	/**
	 * Generates a random floating point number.
	 */
	nextFloat(): number;

	/**
	 * The internal state of the random number generator.
	 * This can be used to save or restore the PRNG.
	 */
	state: JsonType;
}

// ---------------------------------------------------------------------------------------------------------------------
export default Random;
export {Random};
