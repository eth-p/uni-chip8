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
 * @see bitrev
 * @see bitscanf
 * @see bitscanr
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

/**
 * The number of bits used to store a Uint16.
 */
export const BITS = 16;

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
	assert(a >= MIN && a <= MAX, "Parameter 'a' is out of range for Uint16");
	assert(b >= MIN && b <= MAX, "Parameter 'b' is out of range for Uint16");

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
	assert(a >= MIN && a <= MAX, "Parameter 'a' is out of range for Uint16");
	assert(b >= MIN && b <= MAX, "Parameter 'b' is out of range for Uint16");

	return wrap(<number>a - <number>b);
}

/**
 * Reverse the bits in a Uint16.
 *
 * @param a The Uint16 to reverse.
 * @returns The reversed Uint16.
 *
 * ## Source:
 *
 * Algorithm from "Reverse an N-bit quantity in parallel in 5 * lg(N) operations"
 * at https://graphics.stanford.edu/~seander/bithacks.html#BitReverseObvious.
 */
export function bitrev(a: Uint16) {
	assert(a >= MIN && a <= MAX, "Parameter 'a' is out of range for Uint16");

	a = ((a >> 1) & 0b0101010101010101) | ((a & 0b0101010101010101) << 1); // Swap every 2 bits.
	a = ((a >> 2) & 0b0011001100110011) | ((a & 0b0011001100110011) << 2); // Swap every 4 bits.
	a = ((a >> 4) & 0b0000111100001111) | ((a & 0b0000111100001111) << 4); // Swap every 8 bits.
	a = ((a >> 8) & 0b0000000011111111) | ((a & 0b0000000011111111) << 8); // Swap every 16 bits.
	return a;
}

/**
 * Performs a bitscan for the least-significant bit (i.e. rightmost).
 *
 * @param a The Uint16 to scan.
 * @returns The index of the least-significant bit.
 *
 * ## Undefined Behaviour:
 *
 * If provided a Uint16 with a value of zero, this function will return zero.
 * This is the same result as if the least-significant bit was set.
 *
 * ## Performance:
 *
 * This is performed in software, and runs in O(n) time.
 * Do not call this repeatedly if caching can be used.
 */
export function bitscanf(a: Uint16): number {
	assert(a !== 0, "Parameter 'a' is zero, which results in undefined behaviour");
	assert(a >= MIN && a <= MAX, "Parameter 'a' is out of range for Uint16");

	let index = 0;
	let scan  = a;

	while (index <= 15) {
		if ((scan & 1) === 1) return index;

		scan >>= 1;
		index++;
	}

	return 0;
}

/**
 * Performs a bitscan for the most-significant bit (i.e. leftmost).
 *
 * @param a The Uint16 to scan.
 * @returns The index of the most-significant bit.
 *
 * ## Undefined Behaviour:
 *
 * If provided a Uint16 with a value of zero, this function will return zero.
 * This is the same result as if the least-significant bit was set.
 *
 * ## Performance:
 *
 * This is performed in software, and runs in O(n) time.
 * Do not call this repeatedly if caching can be used.
 */
export function bitscanr(a: Uint16) {
	assert(a !== 0, "Parameter 'a' is zero, which results in undefined behaviour");
	assert(a >= MIN && a <= MAX, "Parameter 'a' is out of range for Uint16");

	let index = 15;
	let scan  = a & 0xFFFF;

	while (index >= 0) {
		if ((scan & 0b1000000000000000) === 0b1000000000000000) return index;

		scan <<= 1;
		index--;
	}

	return 0;
}
