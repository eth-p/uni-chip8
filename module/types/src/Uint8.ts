// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Team Chipotle
// MIT License
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Developer Notes:
// @eth-p: We could use Uint8Array to do the conversions, but it was actually slower in every browser except Chrome.
// ---------------------------------------------------------------------------------------------------------------------
import assert = require('@chipotle/debug/assert');
import MathFlag from './MathFlag';
import MathResult from './MathResult';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * An 8-bit unsigned integer.
 *
 * @see cast
 * @see add
 * @see sub
 * @see bitrev
 */
type Uint8 = number;
export default Uint8;

// ---------------------------------------------------------------------------------------------------------------------
// | Constants:                                                                                                        |
// ---------------------------------------------------------------------------------------------------------------------

/**
 * The constant to use when wrapping Uint8 numbers.
 */
export const WRAP = 0x100;

/**
 * The maximum value of a Uint8.
 */
export const MAX = 0xff;

/**
 * The minimum value of a Uint8.
 */
export const MIN = 0x00;

// ---------------------------------------------------------------------------------------------------------------------
// | Functions:                                                                                                        |
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Cast a JavaScript number to a Uint8.
 * This will drop decimal points and wrap accordingly.
 *
 * @param from The number to cast from.
 */
export function cast(from: number): Uint8 {
	let int = from | 0;
	return int < 0 ? WRAP + (int % WRAP) : int % WRAP;
}

/**
 * Wrap a JavaScript number to a Uint8 with result flag.
 *
 * @param value The number to wrap.
 * @returns The result.
 */
export function wrap(value: number): MathResult<Uint8> {
	return value < 0
		? [WRAP + (value % WRAP), MathFlag.OVERFLOW]
		: [value % WRAP, value > MAX ? MathFlag.OVERFLOW : MathFlag.OK];
}

/**
 * Add two Uint8 numbers.
 *
 * @param a The first summand.
 * @param b The second summand.
 *
 * @returns The sum.
 */
export function add(a: Uint8, b: Uint8): MathResult<Uint8> {
	assert(a >= MIN && a <= MAX);
	assert(b >= MIN && b <= MAX);

	return wrap(<number>a + <number>b);
}

/**
 * Subtract two Uint8 numbers.
 *
 * @param a The minuend.
 * @param b The subtrahend.
 *
 * @returns The difference.
 */
export function sub(a: Uint8, b: Uint8): MathResult<Uint8> {
	assert(a >= MIN && a <= MAX);
	assert(b >= MIN && b <= MAX);

	return wrap(<number>a - <number>b);
}

/**
 * Reverse the bits in a Uint8.
 *
 * @param a The Uint8 to reverse.
 * @returns The reversed Uint8.
 *
 * ## Source:
 *
 * Algorithm from "Reverse an N-bit quantity in parallel in 5 * lg(N) operations"
 * at https://graphics.stanford.edu/~seander/bithacks.html#BitReverseObvious.
 */
export function bitrev(a: Uint8) {
	assert(a >= MIN && a <= MAX);

	a = ((a >> 1) & 0b01010101) | ((a & 0b01010101) << 1); // Swap every 2 bits.
	a = ((a >> 2) & 0b00110011) | ((a & 0b00110011) << 2); // Swap every 4 bits.
	a = ((a >> 4) & 0b00001111) | ((a & 0b00001111) << 4); // Swap every 8 bits.
	return a;
}
