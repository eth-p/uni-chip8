//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import assert from '@chipotle/debug/assert';

import {default as OpCode, bitscanf, bitscanr, and, bitshiftr, MIN, MAX} from './OpCode';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * A series of bitmasks which describe an instruction and its parameters.
 */
export default class OpMask {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * The bitmask for the instruction constant.
	 * This is used when matching opcodes to instructions.
	 *
	 * ## Example:
	 *
	 * `0xFF00` will match the first 8 bits of the opcode.
	 * The executing opcode will be run through a bitwise AND of the mask and compared to the
	 * {@link Op#opcode instruction constant} to determine if it's a match.
	 */
	readonly mask: OpCode;

	/**
	 * The bitmask for the first instruction parameter.
	 * This is used to extract a the first parameter from an opcode.
	 *
	 * ## Example:
	 *
	 * `0x00F0` will extract bits 8 through 11 and calculate their bitshifted value.
	 */
	readonly p1: OpCode;

	/**
	 * The bitmask for the second instruction parameter.
	 * This is used to extract a the second parameter from an opcode.
	 *
	 * ## Example:
	 *
	 * `0x000F` will extract bits 12 through 15 and calculate their bitshifted value.
	 */
	readonly p2: OpCode;

	// -------------------------------------------------------------------------------------------------------------
	// | Fields: Precomputed Values                                                                                |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * The difference between the LSB and MSB of {@link #mask}.
	 * This is used when determining the match order in an {@link OpTable}.
	 */
	readonly priority: OpCode;

	/**
	 * The index of the first non-zero least-significant-bit in {@link #mask}.
	 */
	readonly maskLSB: OpCode;

	/**
	 * The index of the first non-zero most-significant-bit in {@link #mask}.
	 */
	readonly maskMSB: OpCode;

	/**
	 * The index of the first non-zero least-significant-bit in {@link #p1}.
	 */
	readonly p1LSB: OpCode;

	/**
	 * The index of the first non-zero most-significant-bit in {@link #p2}.
	 */
	readonly p1MSB: OpCode;

	/**
	 * The index of the first non-zero most-significant-bit in {@link #p1}.
	 */
	readonly p2LSB: OpCode;

	/**
	 * The index of the first non-zero most-significant-bit in {@link #p2}.
	 */
	readonly p2MSB: OpCode;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructor:                                                                                              |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a new opmask.
	 *
	 * @param masks The OpMask parameters.
	 */
	constructor(masks: OpMaskCtor) {
		this.mask = masks.mask;
		this.p1 = masks.p1;
		this.p2 = masks.p2;

		// Precompute values.
		this.maskLSB = bitscanf(this.mask);
		this.maskMSB = bitscanr(this.mask);
		this.p1LSB = bitscanf(this.p1);
		this.p1MSB = bitscanr(this.p1);
		this.p2LSB = bitscanf(this.p2);
		this.p2MSB = bitscanr(this.p2);
		this.priority = this.maskMSB - this.maskLSB;

		// Assertions.
		assert(this.mask >= MIN && this.mask <= MAX, 'OpMask mask is out of range for OpCode');
		assert(this.p1 >= MIN && this.p1 <= MAX, 'OpMask p1 is out of range for OpCode');
		assert(this.p2 >= MIN && this.p2 <= MAX, 'OpMask p2 is out of range for OpCode');
		assert(this.priority > 0, 'OpMask priority is negative');
		assert(this.p1 > this.p2, 'OpMask p2 comes before OpMask p1');
		assert((this.mask & this.p1) === 0, 'OpMask mask and p1 overlap');
		assert((this.mask & this.p2) === 0, 'OpMask mask and p2 overlap');
		assert((this.p1 & this.p2) === 0, 'OpMask p1 and p2 overlap');
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Decodes the first parameter from an opcode.
	 * This will bitshift the parameter to align its LSB (e.g. 0bxx00 -> 0b00xx).
	 *
	 * @param opcode The opcode to decode.
	 * @returns The decoded parameter.
	 */
	public decodeParameter1(opcode: OpCode): OpCode {
		return bitshiftr(and(opcode, this.p1), this.p1LSB);
	}

	/**
	 * Decodes the second parameter from an opcode.
	 * This will bitshift the parameter to align its LSB (e.g. 0bxx00 -> 0b00xx).
	 *
	 * @param opcode The opcode to decode.
	 * @returns The decoded parameter.
	 */
	public decodeParameter2(opcode: OpCode): OpCode {
		return bitshiftr(and(opcode, this.p2), this.p2LSB);
	}
}

/**
 * The options for the OpMask constructor.
 * The fields used here are identical to the ones in {@link OpMask}.
 *
 * @see OpMask
 */
interface OpMaskCtor {
	/**
	 * @see OpMask#mask
	 */
	readonly mask: OpCode;

	/**
	 * @see OpMask#p1
	 */
	readonly p1: OpCode;

	/**
	 * @see OpMask#p2
	 */
	readonly p2: OpCode;
}
