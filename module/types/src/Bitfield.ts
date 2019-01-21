//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import assert from './assert';

import {default as Uint8, BITS as UINT8_BITS} from './Uint8';
import {default as Uint16, BITS as UINT16_BITS} from './Uint16';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * An indexed bitfield representation of an 8 or 16 bit number.
 */
export default class Bitfield {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * The underlying value of the bitfield.
	 */
	protected value: Uint8 | Uint16;

	/**
	 * The length of the bitfield.
	 * This is the number of bits.
	 */
	public readonly length: number;

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
	 * @param value The initial value of the bitfield.
	 * @param width The number of bits to observe.
	 */
	public constructor(value: Uint8 | Uint16, width: number) {
		assert(width === UINT8_BITS || width === UINT16_BITS, "Invalid 'width' for Uint8 or Uint16");
		assert(value >= 0 && value <= 1 << width, `Invalid 'value' for a unsigned ${width}-bit integer`);
		this.value = value;
		this.length = width;

		Object.getPrototypeOf(this).constructor.defineIndices(this);
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a binary string from the bitfield.
	 * @returns A binary string representing the bitfield.
	 */
	public toString(): string {
		return this.toArray()
			.map(bit => (bit ? '1' : '0'))
			.join('');
	}

	/**
	 * Creates a boolean array from the bitfield.
	 * @returns A boolean array.
	 */
	public toArray(): boolean[] {
		return Array.from(this);
	}

	/**
	 * Creates a number from the bitfield.
	 * @returns A number.
	 */
	public toNumber(): number {
		return this.value;
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates an iterator for the bitfield.
	 * @returns An iterator.
	 */
	*[Symbol.iterator](): Iterator<boolean> {
		// tslint:disable-next-line:prefer-for-of
		for (let index = 0; index < this.length; index++) {
			yield this[index];
		}
	}

	/**
	 * Converts the bitfield to a primitive value.
	 * @param hint The type of primitive to convert to.
	 */
	[Symbol.toPrimitive](hint: 'number' | 'string' | 'default'): any {
		switch (hint) {
			case 'number':
				return this.toNumber();
			case 'string':
				return this.toString();
			case 'default':
			default:
				return this.toString();
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
	 *
	 * @throws TypeError When array length is not 8 or 16.
	 */
	public static from(array: boolean[]): Bitfield {
		if (array.length !== 8 && array.length !== 16) {
			throw new TypeError(`Cannot create bitfield from array of length ${array.length}`);
		}

		let bitfield = new Bitfield(0, array.length);
		for (let i = 0; i < array.length; i++) {
			bitfield[i] = array[i];
		}

		return bitfield;
	}

	/**
	 * Defines index getters and setters for the bitfield.
	 * @param bitfield The bitfield.
	 */
	protected static defineIndices(bitfield: Bitfield): void {
		let props: any = {};
		for (let i = 0; i < bitfield.length; i++) {
			let shifted = bitfield.length - 1 - i;
			props[i] = {
				enumerable: true,
				configurable: true,

				get: this.getShifted.bind(bitfield, shifted),
				set: this.setShifted.bind(bitfield, shifted)
			};
		}

		Object.defineProperties(bitfield, props);
	}

	/**
	 * Gets the bit value at a precalculated index.
	 * @param index The precalcuated index.
	 */
	protected static getShifted(this: Bitfield, index: number): boolean {
		return ((this.value >> index) & 1) === 1;
	}

	/**
	 * Sets the bit value at a precalculated index.
	 * @param index The precalculated index.
	 * @param value The value of the bit.
	 */
	protected static setShifted(this: Bitfield, index: number, value: boolean): void {
		if (value) {
			this.value = this.value | (1 << index);
		} else {
			this.value = this.value & (1 << index);
		}
	}
}
