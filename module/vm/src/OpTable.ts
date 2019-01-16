//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import assert from '@chipotle/types/assert';

import ISA from './ISA';
import Op from './Op';
import {default as OpCode, MAX as OPCODE_MAX, and, isValid, bitshiftr, bitscanf} from './OpCode';
import ProgramError from './ProgramError';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * A lookup table for instructions.
 */
export default class OpTable<A> {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * The lookup table.
	 */
	protected readonly table: Op<A>[][];

	/**
	 * The op table.
	 */
	public readonly list: Op<A>[];

	/**
	 * The lookup mask.
	 */
	public readonly mask: OpCode;

	/**
	 * The number of places to shift the lookup mask.
	 */
	public readonly maskshift: OpCode;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructor:                                                                                              |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Create a new instruction lookup table.
	 * @param isa The instruction set.
	 */
	public constructor(isa: ISA<A>) {
		assert(isa != null, "Parameter 'isa' is null");
		assert(isa instanceof Array, "Parameter 'isa' is invalid");

		// Get the instructions objects.
		this.list = isa.map(op => new op());

		// Get the largest possible mask.
		this.mask = this.list.reduce((a: OpCode, o: Op<A>) => and(a, o.mask.mask), OPCODE_MAX);
		this.maskshift = bitscanf(this.mask);

		// Generate a lookup table.
		this.table = [];
		for (let op of this.list) {
			let index = bitshiftr(and(op.opcode, this.mask), this.maskshift);
			let lut = this.table[index];
			if (lut == null) {
				lut = this.table[index] = [];
			}

			lut.push(op);
		}

		// Sort lookup table by specificity.
		for (let lut of this.table) {
			if (lut == null) continue;
			lut.sort((a, b) => b.mask.priority - a.mask.priority);
		}
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Look up an instruction from an opcode.
	 *
	 * @param opcode The opcode.
	 * @returns The instruction.
	 *
	 * @throws ProgramError When no matching instruction was found.
	 */
	public lookup(opcode: OpCode): Op<A> {
		assert(isValid(opcode), "Parameter 'opcode' is out of range for OpCode");

		let index = bitshiftr(and(this.mask, opcode), this.maskshift);
		let lut = this.table[index];
		if (lut == null) throw new ProgramError(ProgramError.UNKNOWN_OPCODE);

		for (let op of lut) {
			if (op.matches(opcode)) return op;
		}
		throw new ProgramError(ProgramError.UNKNOWN_OPCODE);
	}
}
