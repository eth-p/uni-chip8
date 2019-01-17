//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import assert from '@chipotle/types/assert';

import IR from './IR';
import ISA from './ISA';
import Op from './Op';
import OpCache from './OpCache';
import {default as OpCode, MAX as OPCODE_MAX, and, isValid, bitshiftr, bitscanf} from './OpCode';
import ProgramError from './ProgramError';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * A lookup table for instructions.
 *
 * This uses a single-depth lookup table to map opcodes to instructions.
 * The smaller the mask of an instruction, the higher priority it will be.
 */
export default class OpTable<A> {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * A list of all the instructions.
	 */
	public readonly list: Op<A>[];

	/**
	 * The lookup mask.
	 */
	public readonly mask: OpCode;

	/**
	 * The number of places to shift the masked opcode.
	 *
	 * ```
	 * (opcode & mask) >> maskshift
	 * ```
	 *
	 * Will return an index for the lookup table.
	 */
	public readonly maskshift: OpCode;

	/**
	 * The instruction lookup table.
	 */
	protected readonly table: Op<A>[][];

	/**
	 * The op cache.
	 */
	protected readonly cache: OpCache<A> | null;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructor:                                                                                              |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Create a new instruction lookup table.
	 *
	 * @param isa The instruction set.
	 * @param cache The instruction cache, if one is to be used.
	 */
	public constructor(isa: ISA<A>, cache?: OpCache<A>) {
		assert(isa != null, "Parameter 'isa' is null");
		assert(isa instanceof Array, "Parameter 'isa' is invalid");

		// Set the lookup function to use the cache or no-cache version.
		this.cache = cache == null ? null : cache;
		this.decode = cache == null ? this._decode : this._decodeWithCache;

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
	 * Looks up an instruction from an opcode.
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

	/**
	 * Decodes an instruction from an opcode.
	 *
	 * @param opcode The opcode.
	 * @returns The IR of the instruction.
	 *
	 * @throws ProgramError When no matching instruction was found.
	 */
	public decode: (opcode: OpCode) => IR<A>;

	// -------------------------------------------------------------------------------------------------------------
	// | Methods: Decode                                                                                           |
	// -------------------------------------------------------------------------------------------------------------

	public _decode(opcode: OpCode): IR<A> {
		let op = this.lookup(opcode);
		return op.decode(opcode);
	}

	public _decodeWithCache(opcode: OpCode): IR<A> {
		let ir = this.cache!.get(opcode);

		if (ir === null) {
			ir = this._decode(opcode);
			this.cache!.put(opcode, ir);
		}

		return ir;
	}
}
