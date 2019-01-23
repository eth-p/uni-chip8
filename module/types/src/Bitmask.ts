//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import assert from './assert';

import Bitfield from './Bitfield';
import {default as Uint, bitscanf, bitscanr, bitshiftl, bitshiftr, MIN, MAX, BITS} from './Uint16';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * A bitwise mask.
 * Only supports up to 16 bits.
 */
class Bitmask {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * The bitmask.
	 */
	public readonly mask: Uint;

	/**
	 * The bitmask for the shifted value.
	 */
	public readonly vmask: Uint;

	/**
	 * The index of the least-significant (rightmost) bit in the mask.
	 */
	public readonly lsb: Uint;

	/**
	 * The index of the most-significant (leftmost) bit in the mask.
	 */
	public readonly msb: Uint;

	/**
	 * The width of the bitmask.
	 * This is the the difference between the MSB and LSB.
	 */
	public readonly width: Uint;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructor:                                                                                              |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a new bitmask.
	 *
	 * @param mask The mask.
	 */
	public constructor(mask: Uint) {
		assert(mask >= MIN && mask <= MAX, "Parameter 'mask' is out of range");

		this.mask = mask;
		this.lsb = mask === 0 ? 0 : bitscanf(mask);
		this.msb = mask === 0 ? 0 : bitscanr(mask);
		this.width = mask === 0 ? 0 : this.msb - this.lsb + 1;
		this.vmask = bitshiftr(mask, this.lsb);

		assert(this.width >= 0, 'Bitmask width is negative?');
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Extracts and shifts the masked value from a number.
	 * This will shift the extracted value to align the LSB.
	 *
	 * @param from The number to extract from.
	 * @returns The extracted value.
	 */
	public extract(from: Uint): Uint {
		return this.mask === 0 ? 0 : bitshiftr(from & this.mask, this.lsb);
	}

	/**
	 * Emplaces a masked value into a number.
	 * This will automatically shift the value to align.
	 *
	 * @param value The value to emplace.
	 * @param to The number.
	 */
	public emplace(value: Uint, to: Uint): Uint {
		assert((value & ~this.vmask) === 0, "Parameter 'value' contains non-masked bits");
		return this.mask === 0 ? to : (to & ~this.mask) | bitshiftl(value, this.lsb);
	}

	/**
	 * Checks if the bitmask overlaps any values/bitmasks.
	 *
	 * @param value The value(s) to check.
	 * @returns True if overlapping.
	 */
	public overlaps(value: Uint | Bitmask | Uint[] | Bitmask[] | (Bitmask | Uint)[]): boolean {
		let values = value instanceof Array ? value : [value];

		for (let value of values) {
			if (value instanceof Bitmask) {
				if ((this.mask & value.mask) > 0) return true;
			} else {
				if ((this.mask & value) > 0) return true;
			}
		}

		return false;
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Casting:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a string from the bitmask.
	 * @returns A string representing the bitmask.
	 */
	public toString(): string {
		return this.mask.toString();
	}

	/**
	 * Creates a number from the bitmask.
	 * @returns A number representing the bitmask.
	 */
	public toNumber(): number {
		return this.mask;
	}

	/**
	 * Creates a bitfield from the bitmask.
	 *
	 * @returns A corresponding bitfield.
	 */
	public toBitfield(): Bitfield {
		return Bitfield.from(this.mask, BITS);
	}

	/**
	 * Creates a primitive type.
	 * This is a JS engine hook.
	 *
	 * @param hint The primitive type to covert to.
	 * @override
	 */
	public [Symbol.toPrimitive](hint: string): Exclude<any, undefined | null> {
		switch (hint) {
			case 'number':
				return this.mask;

			case 'string':
			case 'default':
			default:
				return this.toString();
		}
	}
}

//! --------------------------------------------------------------------------------------------------------------------
export default Bitmask;
export {Bitmask};
