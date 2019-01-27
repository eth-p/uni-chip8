//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
//. Developer Notes:
//. @eth-p: We could use Uint16Array to do the conversions, but it was actually slower in every browser except Chrome.
//. --------------------------------------------------------------------------------------------------------------------
import assert from './assert';
import MathFlag from './MathFlag';
import MathResult from './MathResult';
import Uint8 from '@chipotle/types/Uint8';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * A 16-bit unsigned integer.
 *
 * @see cast
 * @see add
 * @see sub
 * @see and
 * @see or
 * @see bitrev
 * @see bitscanf
 * @see bitscanr
 * @see bitshiftl
 * @see bitshiftlw
 * @see bitshiftr
 * @see bitshiftrw
 */
type Uint16 = number;
export default Uint16;
export {Uint16};

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
 * Casts a JavaScript number to a Uint16.
 * This will drop decimal points and wrap accordingly.
 *
 * @param from The number to cast from.
 */
export function cast(from: number): Uint16 {
	let int = from | 0;
	return int < 0 ? WRAP + (int % WRAP) : int % WRAP;
}

/**
 * Wraps a JavaScript number to a Uint16 with result flag.
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
 * Checks if a Uint16 is within the valid range for its type.
 *
 * @param value The value to check.
 * @returns True if the value is valid.
 */
export function isValid(value: Uint16): boolean {
	return value >= MIN && value <= MAX;
}

/**
 * Adds two Uint16 numbers.
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
 * Subtracts two Uint16 numbers.
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
 * Reverses the bits in a Uint16.
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
	let scan = a;

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
	let scan = a & 0xffff;

	while (index >= 0) {
		if ((scan & 0b1000000000000000) === 0b1000000000000000) return index;

		scan <<= 1;
		index--;
	}

	return 0;
}

/**
 * Bitwise AND two Uint16.
 *
 * @param a The first Uint16.
 * @param b The second Uint16.
 *
 * @returns The Uint16 representing the bits in both parameters.
 */
export function and(a: Uint16, b: Uint16): Uint16 {
	assert(a >= MIN && a <= MAX, "Parameter 'a' is out of range for Uint16");
	assert(b >= MIN && b <= MAX, "Parameter 'b' is out of range for Uint16");

	return a & b;
}

/**
 * Bitwise OR two Uint16.
 *
 * @param a The first Uint16.
 * @param b The second Uint16.
 *
 * @returns The Uint16 representing the bits in either parameter.
 */
export function or(a: Uint16, b: Uint16): Uint16 {
	assert(a >= MIN && a <= MAX, "Parameter 'a' is out of range for Uint16");
	assert(b >= MIN && b <= MAX, "Parameter 'b' is out of range for Uint16");

	return a | b;
}

/**
 * Bitwise XOR two Uint16.
 *
 * @param a The first Uint16.
 * @param b The second Uint16.
 *
 * @returns The Uint16 representing the different bits considering both parameters.
 */
export function xor(a: Uint16, b: Uint16): Uint16 {
	assert(a >= MIN && a <= MAX, "Parameter 'a' is out of range for Uint16");
	assert(b >= MIN && b <= MAX, "Parameter 'b' is out of range for Uint16");

	return a ^ b;
}

/**
 * Shifts the bits in a Uint16 left.
 * This will remove any bits that are shifted outside the range.
 *
 * @param num The Uint16 to shift.
 * @param by The number of bits to shift by.
 *
 * @returns The shifted Uint16.
 */
export function bitshiftl(num: Uint16, by: number): Uint16 {
	assert(num >= MIN && num <= MAX, "Parameter 'num' is out of range for Uint16");
	assert(by < BITS, "Parameter 'by' is out of range for a Uint16");
	assert(by >= 0, "Parameter 'by' is negative, which results in undefined behaviour");

	return (num << by) & 0xffff;
}

/**
 * Shifts the bits in a Uint16 right.
 * This will remove any bits that are shifted outside the range.
 *
 * @param num The Uint16 to shift.
 * @param by The number of bits to shift by.
 *
 * @returns The shifted Uint16.
 */
export function bitshiftr(num: Uint16, by: number): Uint16 {
	assert(num >= MIN && num <= MAX, "Parameter 'num' is out of range for Uint16");
	assert(by < BITS, "Parameter 'by' is out of range for a Uint16");
	assert(by >= 0, "Parameter 'by' is negative, which results in undefined behaviour");

	return (num >> by) & 0xffff;
}

/**
 * Shifts the bits in a Uint16 left and wrap them around to the right.
 *
 * @param num The Uint16 to shift.
 * @param by The number of bits to shift by.
 *
 * @returns The shifted Uint16.
 */
export function bitshiftlw(num: Uint16, by: number): Uint16 {
	assert(num >= MIN && num <= MAX, "Parameter 'num' is out of range for Uint16");
	assert(by < BITS, "Parameter 'by' is out of range for a Uint16");
	assert(by >= 0, "Parameter 'by' is negative, which results in undefined behaviour");

	let shifted = num << by;
	let wrapped = (shifted & 0xffff0000) >> 16;
	return (shifted & 0xffff) | wrapped;
}

/**
 * Shifts the bits in a Uint16 right.
 * This will remove any bits that are shifted outside the range.
 *
 * @param num The Uint16 to shift.
 * @param by The number of bits to shift by.
 *
 * @returns The shifted Uint16.
 *
 * ## Performance:
 *
 * This method has no fast implementation due to the underlying JavaScript engine.
 * It is significantly slower than its Uint8 equivalent.
 */
export function bitshiftrw(num: Uint16, by: number): Uint16 {
	assert(num >= MIN && num <= MAX, "Parameter 'num' is out of range for Uint16");
	assert(by < BITS, "Parameter 'by' is out of range for a Uint16");
	assert(by >= 0, "Parameter 'by' is negative, which results in undefined behaviour");

	// JavaScript bitwise operations are handled as 32-bit signed ints.
	// That proves to be a bit of an issue for the method we used in Uint8 bitshiftrw.
	// We use a different (significantly slower) method instead.

	let bdiff = 16 - by;
	let mask = (0xffff ^ (0xffff >> by)) >> bdiff;
	let wrapped = (num & mask) << bdiff;
	let shifted = num >> by;

	return shifted | wrapped;
}

/**
 * Creates a hex string from a Uint16.
 *
 * @param num The number.
 *
 * @returns A 4-character hex string.
 */
export function toHexString(num: Uint8): string {
	assert(num >= MIN && num <= MAX, "Parameter 'num' is out of range for Uint8");
	return num.toString(16).padStart(4, '0');
}
