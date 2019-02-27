//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import assert from '@chipotle/types/assert';

import {Instruction, MAX as INSTRUCTION_MAX, and, bitscanf, bitshiftr, isValid} from './Instruction';
import Operation from './Operation';

// ---------------------------------------------------------------------------------------------------------------------

/**
 * An instruction set and lookup table.
 *
 * This uses a single-depth lookup table to map instructions to operations.
 * The smaller the mask, the higher the priority.
 */
class InstructionSet<I = void> {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * A list of all the operations.
	 */
	public readonly list: Operation[];

	/**
	 * The lookup mask.
	 */
	protected readonly mask: Instruction;

	/**
	 * The number of places to shift the masked opcode.
	 *
	 * ```
	 * (opcode & mask) >> maskshift
	 * ```
	 *
	 * Will return an index for the lookup table.
	 */
	protected readonly maskshift: Instruction;

	/**
	 * The operation lookup table.
	 */
	protected readonly table: Operation[][];

	// -------------------------------------------------------------------------------------------------------------
	// | Constructor:                                                                                              |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Create a new instruction set.
	 *
	 * @param ops The operations in the instruction set.
	 */
	public constructor(ops: Operation[] | OperationClass[]) {
		assert(ops != null, "Parameter 'ops' is null");
		assert(<any>ops instanceof Array, "Parameter 'ops' is invalid");
		assert(
			(<any>ops).findIndex((x: any) => !(x instanceof Operation || x.prototype instanceof Operation)) === -1,
			"Parameter 'ops' is invalid"
		);

		// Get the operation objects.
		this.list = (<(Operation | OperationClass)[]>ops).map(op => (op instanceof Operation ? op : new op()));

		// Get the largest possible mask.
		this.mask = this.list.reduce((a: Instruction, o: Operation) => and(a, o.mask.mask), INSTRUCTION_MAX);
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
			lut.sort((a, b) => b.mask.width - a.mask.width);
		}
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Looks up an operation from an instruction.
	 *
	 * @param instruction The instruction.
	 * @returns The corresponding operation, or null if not found.
	 */
	public lookup(instruction: Instruction): (Operation & I) | null {
		assert(isValid(instruction), "Parameter 'instruction' is out of range for Instruction");

		let index = bitshiftr(and(this.mask, instruction), this.maskshift);
		let lut = this.table[index];
		if (lut == null) return null;

		for (let op of lut) {
			if (op.matches(instruction)) return <Operation & I>op;
		}

		return null;
	}
}

interface OperationClass {
	new (): Operation;
}

// ---------------------------------------------------------------------------------------------------------------------
export default InstructionSet;
export {InstructionSet};
