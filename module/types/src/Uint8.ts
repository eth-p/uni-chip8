//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
//. Developer Notes:
//. @eth-p: We could use Uint8Array to do the conversions, but it was actually slower in every browser except Chrome.
//. --------------------------------------------------------------------------------------------------------------------
import assert from './assert';
import MathFlag from './MathFlag';
import MathResult from './MathResult';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * An 8-bit unsigned integer.
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

/**
 * The number of bits used to store a Uint8.
 */
export const BITS = 8;

// ---------------------------------------------------------------------------------------------------------------------
// | Functions:                                                                                                        |
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Casts a JavaScript number to a Uint8.
 * This will drop decimal points and wrap accordingly.
 *
 * @param from The number to cast from.
 */
export function cast(from: number): Uint8 {
	let int = from | 0;
	return int < 0 ? WRAP + (int % WRAP) : int % WRAP;
}

/**
 * Wraps a JavaScript number to a Uint8 with result flag.
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
 * Checks if a Uint8 is within the valid range for its type.
 *
 * @param value The value to check.
 * @returns True if the value is valid.
 */
export function isValid(value: Uint8): boolean {
	return value >= MIN && value <= MAX;
}

/**
 * Adds two Uint8 numbers.
 *
 * @param a The first summand.
 * @param b The second summand.
 *
 * @returns The sum.
 */
export function add(a: Uint8, b: Uint8): MathResult<Uint8> {
	assert(a >= MIN && a <= MAX, "Parameter 'a' is out of range for Uint8");
	assert(b >= MIN && b <= MAX, "Parameter 'b' is out of range for Uint8");

	return wrap(<number>a + <number>b);
}

/**
 * Subtracts two Uint8 numbers.
 *
 * @param a The minuend.
 * @param b The subtrahend.
 *
 * @returns The difference.
 */
export function sub(a: Uint8, b: Uint8): MathResult<Uint8> {
	assert(a >= MIN && a <= MAX, "Parameter 'a' is out of range for Uint8");
	assert(b >= MIN && b <= MAX, "Parameter 'b' is out of range for Uint8");

	return wrap(<number>a - <number>b);
}

/**
 * Reverses the bits in a Uint8.
 *
 * @param a The Uint8 to reverse.
 * @returns The reversed Uint8.
 *
 * ## Source:
 *
 * Algorithm from "Reverse an N-bit quantity in parallel in 5 * lg(N) operations"
 * at https://graphics.stanford.edu/~seander/bithacks.html#BitReverseObvious.
 */
export function bitrev(a: Uint8): Uint8 {
	assert(a >= MIN && a <= MAX, "Parameter 'a' is out of range for Uint8");

	a = ((a >> 1) & 0b01010101) | ((a & 0b01010101) << 1); // Swap every 2 bits.
	a = ((a >> 2) & 0b00110011) | ((a & 0b00110011) << 2); // Swap every 4 bits.
	a = ((a >> 4) & 0b00001111) | ((a & 0b00001111) << 4); // Swap every 8 bits.
	return a;
}

/**
 * Performs a bitscan for the least-significant bit (i.e. rightmost).
 *
 * @param a The Uint8 to scan.
 * @returns The index of the least-significant bit.
 *
 * ## Undefined Behaviour:
 *
 * If provided a Uint8 with a value of zero, this function will return zero.
 * This is the same result as if the least-significant bit was set.
 *
 * ## Performance:
 *
 * This is performed in software, and runs in O(n) time.
 * Do not call this repeatedly if caching can be used.
 */
export function bitscanf(a: Uint8): number {
	assert(a !== 0, "Parameter 'a' is zero, which results in undefined behaviour");
	assert(a >= MIN && a <= MAX, "Parameter 'a' is out of range for Uint8");

	let index = 0;
	let scan = a;

	while (index <= 7) {
		if ((scan & 1) === 1) return index;

		scan >>= 1;
		index++;
	}

	return 0;
}

/**
 * Performs a bitscan for the most-significant bit (i.e. leftmost).
 *
 * @param a The Uint8 to scan.
 * @returns The index of the most-significant bit.
 *
 * ## Undefined Behaviour:
 *
 * If provided a Uint8 with a value of zero, this function will return zero.
 * This is the same result as if the least-significant bit was set.
 *
 * ## Performance:
 *
 * This is performed in software, and runs in O(n) time.
 * Do not call this repeatedly if caching can be used.
 */
export function bitscanr(a: Uint8) {
	assert(a !== 0, "Parameter 'a' is zero, which results in undefined behaviour");
	assert(a >= MIN && a <= MAX, "Parameter 'a' is out of range for Uint8");

	let index = 7;
	let scan = a & 0xff;

	while (index >= 0) {
		if ((scan & 0b10000000) === 0b10000000) return index;

		scan <<= 1;
		index--;
	}

	return 0;
}

/**
 * Bitwise AND two Uint8.
 *
 * @param a The first Uint8.
 * @param b The second Uint8.
 *
 * @returns The Uint8 representing the bits in both parameters.
 */
export function and(a: Uint8, b: Uint8): Uint8 {
	assert(a >= MIN && a <= MAX, "Parameter 'a' is out of range for Uint8");
	assert(b >= MIN && b <= MAX, "Parameter 'b' is out of range for Uint8");

	return a & b;
}

/**
 * Bitwise OR two Uint8.
 *
 * @param a The first Uint8.
 * @param b The second Uint8.
 *
 * @returns The Uint8 representing the bits in either parameter.
 */
export function or(a: Uint8, b: Uint8): Uint8 {
	assert(a >= MIN && a <= MAX, "Parameter 'a' is out of range for Uint8");
	assert(b >= MIN && b <= MAX, "Parameter 'b' is out of range for Uint8");

	return a | b;
}

/**
 * Shifts the bits in a Uint8 left.
 * This will remove any bits that are shifted outside the range.
 *
 * @param num The Uint8 to shift.
 * @param by The number of bits to shift by.
 *
 * @returns The shifted Uint8.
 */
export function bitshiftl(num: Uint8, by: number): Uint8 {
	assert(num >= MIN && num <= MAX, "Parameter 'num' is out of range for Uint8");
	assert(by < BITS, "Parameter 'by' is out of range for a Uint8");
	assert(by >= 0, "Parameter 'by' is negative, which results in undefined behaviour");

	return (num << by) & 0xff;
}

/**
 * Shifts the bits in a Uint8 right.
 * This will remove any bits that are shifted outside the range.
 *
 * @param num The Uint8 to shift.
 * @param by The number of bits to shift by.
 *
 * @returns The shifted Uint8.
 */
export function bitshiftr(num: Uint8, by: number): Uint8 {
	assert(num >= MIN && num <= MAX, "Parameter 'num' is out of range for Uint8");
	assert(by < BITS, "Parameter 'by' is out of range for a Uint8");
	assert(by >= 0, "Parameter 'by' is negative, which results in undefined behaviour");

	return (num >> by) & 0xff;
}

/**
 * Shifts the bits in a Uint8 left and wrap them around to the right.
 *
 * @param num The Uint8 to shift.
 * @param by The number of bits to shift by.
 *
 * @returns The shifted Uint8.
 */
export function bitshiftlw(num: Uint8, by: number): Uint8 {
	assert(num >= MIN && num <= MAX, "Parameter 'num' is out of range for Uint8");
	assert(by < BITS, "Parameter 'by' is out of range for a Uint8");
	assert(by >= 0, "Parameter 'by' is negative, which results in undefined behaviour");

	let shifted = num << by;
	let wrapped = (shifted & 0xff00) >> 8;
	return (shifted & 0xff) | wrapped;
}

/**
 * Shifts the bits in a Uint8 right.
 * This will remove any bits that are shifted outside the range.
 *
 * @param num The Uint8 to shift.
 * @param by The number of bits to shift by.
 *
 * @returns The shifted Uint8.
 */
export function bitshiftrw(num: Uint8, by: number): Uint8 {
	assert(num >= MIN && num <= MAX, "Parameter 'num' is out of range for Uint8");
	assert(by < BITS, "Parameter 'by' is out of range for a Uint8");
	assert(by >= 0, "Parameter 'by' is negative, which results in undefined behaviour");

	let shifted = (num << 8) >> by;
	let wrapped = shifted & 0x00ff;
	return (shifted >> 8) | wrapped;
}
