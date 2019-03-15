//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import assert from '@chipotle/types/assert';

import {Instruction, MAX, and, isValid} from './Instruction';
import {Operand, OperandCtor} from './Operand';
import OperationMask from './OperationMask';

// ---------------------------------------------------------------------------------------------------------------------

/**
 * A specification for an operation.
 * An operation as a basic action that takes parameters.
 *
 * This provides the information needed to decode an instruction into an operation.
 */
class Operation {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * The opcode.
	 * This is used to determine the operation associated with an instruction.
	 */
	public readonly opcode: Instruction;

	/**
	 * The opcode mnemonic.
	 */
	public readonly mnemonic: string;

	/**
	 * The opcode mask.
	 */
	public readonly mask: OperationMask;

	/**
	 * The operands.
	 */
	public readonly operands: Operand[];

	// -------------------------------------------------------------------------------------------------------------
	// | Constructor:                                                                                              |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a new operation.
	 *
	 * @param mnemonic The mnemonic.
	 * @param opcode The opcode.
	 * @param operands The operands.
	 */
	constructor(mnemonic: string, opcode: Instruction, operands: (Operand | OperandCtor)[]);

	/**
	 * Creates a new operation.
	 *
	 * @param options The operation options.
	 */
	constructor(options: OperationCtor);

	constructor(mnemonicOrOptions: string | OperationCtor, opcode?: Instruction, operands?: (Operand | OperandCtor)[]) {
		let _mnemonic;
		let _opcode;
		let _operands;

		if (typeof mnemonicOrOptions === 'string') {
			_mnemonic = mnemonicOrOptions;
			_opcode = opcode!;
			_operands = operands!;
		} else {
			_mnemonic = mnemonicOrOptions.mnemonic;
			_opcode = mnemonicOrOptions.opcode;
			_operands = mnemonicOrOptions.operands;
		}

		assert(_mnemonic != null, "Parameter 'mnemonic' is null");
		assert(/^[A-Z]+$/.test(_mnemonic), "Parameter 'mnemonic' is invalid");
		assert(_opcode != null, "Parameter 'opcode' is null");
		assert(_operands != null, "Parameter 'operands' is null");
		assert(isValid(_opcode), "Parameter 'opcode' is out of range for Instruction");

		this.opcode = _opcode;
		this.operands = _operands.map(o => (o instanceof Operand ? o : new Operand(o)));
		this.mnemonic = _mnemonic;
		this.mask = new OperationMask(this.operands.reduce((a, o: Operand) => a ^ o.mask.toNumber(), MAX));

		assert(this.mask.mask > 0, 'Operands consume all bits in instruction');
		assert((this.opcode & ~this.mask.mask) === 0, 'Opcode overlaps operands');
		assert(
			(() => {
				let orr = this.operands.reduce((a, c) => a | c.mask.mask, 0);
				let xor = this.operands.reduce((a, c) => a ^ c.mask.mask, 0);
				return orr === xor;
			})(),
			'One or more operands overlap'
		);
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Checks to see if an instruction matches this specification's opcode.
	 *
	 * @param instruction The instruction to check.
	 * @returns True if the instruction opcode is for this specification.
	 */
	public matches(instruction: Instruction): boolean {
		return and(this.mask.mask, instruction) === this.opcode;
	}

	/**
	 * Decodes the instruction operands.
	 *
	 * @param instruction The instruction to decode.
	 * @returns The decoded operands.
	 */
	public decode(instruction: Instruction): Instruction[] {
		return this.operands.map(o => o.decode(instruction));
	}

	/**
	 * Encodes an instruction with the opcode and operands.
	 *
	 * @param values The operand values.
	 * @returns The encoded instruction.
	 */
	public encode(values: Instruction[]): Instruction {
		assert(values.length === this.operands.length, "Parameter 'value' count differs from operand count");
		return this.operands.reduce((a, o, i) => o.mask.emplace(values[i] & o.mask.vmask, a), this.opcode);
	}
}

/**
 * The options for the Operation constructor.
 */
interface OperationCtor {
	/**
	 * The operation mnemonic.
	 * This is an assembly string that matches `^[A-Z]+$`.
	 *
	 * ## Example
	 * ```
	 * ADD
	 * ```
	 */
	mnemonic: string;

	/**
	 * The operation opcode.
	 * This is used to determine the operation associated with an instruction.
	 */
	opcode: Instruction;

	/**
	 * The operands.
	 * These are used to build the operation's opcode mask.
	 */
	operands: (Operand | OperandCtor)[];
}

// ---------------------------------------------------------------------------------------------------------------------
export default Operation;
export {Operation};
export {OperationCtor};
