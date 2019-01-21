//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import assert from './assert';

import Uint8 from './Uint8';
import Uint16 from './Uint16';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * A variable-length indexed bitfield.
 */
export default class Bitfield extends Array {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * The number of bits in the bitfield.
	 */
	public readonly bits: number;

	// -------------------------------------------------------------------------------------------------------------
	// | Fields: Array-Like                                                                                        |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * An index in the bitfield.
	 */
	[key: number]: boolean;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructor:                                                                                              |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a new bitfield.
	 *
	 * @param bits The number of bits.
	 */
	public constructor(bits: number) {
		super(bits);
		this.bits = this.length;

		if (typeof bits === 'number') {
			assert(bits >= 0, "Parameter 'bits' must be greater than zero");
			this.fill(false, 0, this.bits);
		}
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Assign this bitfield to a specific number value.
	 *
	 * @param number The number.
	 * @throws TypeError When the bitfield is too large to accept a number.
	 */
	public assign(number: number): void {
		if (this.bits < 0 || this.bits > 32) {
			throw new TypeError(`Cannot assign a ${this.bits}-bit bitfield from a number.`);
		}

		for (let i = this.bits - 1; i >= 0; i--) {
			this[this.bits - 1 - i] = (number & (1 << i)) > 0;
		}
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Casting:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a binary string from the bitfield.
	 * Every eighth place is separated by a space.
	 *
	 * ```
	 * 00000000 11111111
	 * 00000000 1
	 * ```
	 *
	 * @returns A binary string representing the bitfield.
	 */
	public toString(): string {
		let buffer = '';

		for (let i = 0; i < this.bits; i++) {
			if (i % 8 === 0 && i !== 0) {
				buffer += ` ${this[i] ? '1' : '0'}`;
			} else {
				buffer += this[i] ? '1' : '0';
			}
		}

		return buffer;
	}

	/**
	 * Creates a number from the bitfield.
	 *
	 * @returns An 8-bit unsigned integer.
	 * @throws TypeError When working with bitfields larger
	 */
	public toNumber(): number {
		if (this.bits < 0 || this.bits > 32) {
			throw new TypeError(`Cannot convert a ${this.bits}-bit bitfield to a number.`);
		}

		let number = 0;
		for (let i = 0; i < this.bits; i++) {
			number = (number << 1) | (this[i] ? 1 : 0);
		}

		return number;
	}

	/**
	 * Creates a typed array from the bitfield.
	 * @returns A Uint8Array array.
	 */
	public toTyped(): Uint8Array {
		let typed = new Uint8Array(Math.ceil(this.bits / 8) | 0);

		for (let index = 0; index < typed.length; index++) {
			let bitIndex = index * 8;
			typed[index] =
				(this[bitIndex + 0] ? 0b10000000 : 0) |
				(this[bitIndex + 1] ? 0b01000000 : 0) |
				(this[bitIndex + 2] ? 0b00100000 : 0) |
				(this[bitIndex + 3] ? 0b00010000 : 0) |
				(this[bitIndex + 4] ? 0b00001000 : 0) |
				(this[bitIndex + 5] ? 0b00000100 : 0) |
				(this[bitIndex + 6] ? 0b00000010 : 0) |
				(this[bitIndex + 7] ? 0b00000001 : 0);
		}

		return typed;
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Special:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	*[Symbol.iterator](): IterableIterator<boolean> {
		for (let i = 0; i < this.bits; i++) {
			yield this[i];
		}
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Static:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a bitfield from a boolean array.
	 *
	 * @param array The boolean array.
	 * @returns The corresponding bitfield.
	 */
	public static from(array: boolean[]): Bitfield;

	/**
	 * Creates a bitfield from a number.
	 *
	 * @param number The number.
	 * @param bits The number of bits to use.
	 * @returns The corresponding bitfield.
	 */
	public static from(number: number, bits: number): Bitfield;

	public static from(from: boolean[] | number, param?: number): Bitfield {
		let bitfield;

		if (from instanceof Array) {
			bitfield = new Bitfield(from.length);
			bitfield.splice(0, from.length, ...from);
		} else if (typeof from === 'number' && typeof param === 'number') {
			assert(param! > 0 && param! <= 32, "Parameter 'bits' is invalid");

			bitfield = new Bitfield(param);
			bitfield.assign(from);
		} else {
			throw new TypeError('Unknown overload');
		}

		return bitfield;
	}
}
