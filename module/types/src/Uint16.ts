// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Team Chipotle
// MIT License
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Developer Notes:
// @eth-p: We could use Uint16Array to do the conversions, but it was actually slower in every browser except Chrome.
// ---------------------------------------------------------------------------------------------------------------------
import assert = require('@chipotle/debug/assert');

import MathFlag from './MathFlag';
import MathResult from './MathResult';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * A 16-bit unsigned integer.
 *
 * @see cast
 * @see add
 * @see sub
 */
type Uint16 = number;
export default Uint16;

// ---------------------------------------------------------------------------------------------------------------------
// | Constants:                                                                                                        |
// ---------------------------------------------------------------------------------------------------------------------

/**
 * The constant to use when wrapping Uint16 numbers.
 */
export const WRAP = 0x10000;

/**
 * The maximum value of a Uint16.
 */
export const MAX = 0xffff;

/**
 * The minimum value of a Uint16.
 */
export const MIN = 0x0000;

// ---------------------------------------------------------------------------------------------------------------------
// | Functions:                                                                                                        |
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Cast a JavaScript number to a Uint16.
 * This will drop decimal points and wrap accordingly.
 *
 * @param from The number to cast from.
 */
export function cast(from: number): Uint16 {
	let int = from | 0;
	return int < 0 ? WRAP + (int % WRAP) : int % WRAP;
}

/**
 * Wrap a JavaScript number to a Uint16 with result flag.
 *
 * @param value The number to wrap.
 * @returns The result.
 */
export function wrap(value: number): MathResult<Uint16> {
	return value < 0
		? [WRAP + (value % WRAP), MathFlag.OVERFLOW]
		: [value % WRAP, value > MAX ? MathFlag.OVERFLOW : MathFlag.OK];
}

/**
 * Add two Uint16 numbers.
 *
 * @param a The first summand.
 * @param b The second summand.
 *
 * @returns The sum.
 */
export function add(a: Uint16, b: Uint16): MathResult<Uint16> {
	assert(a >= MIN && a <= MAX);
	assert(b >= MIN && b <= MAX);

	return wrap(<number>a + <number>b);
}

/**
 * Subtract two Uint16 numbers.
 *
 * @param a The minuend.
 * @param b The subtrahend.
 *
 * @returns The difference.
 */
export function sub(a: Uint16, b: Uint16): MathResult<Uint16> {
	return wrap(<number>a - <number>b);
}
