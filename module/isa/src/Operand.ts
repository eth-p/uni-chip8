//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import assert from '@chipotle/types/assert';

import OperandMask from './OperandMask';
import OperandType from './OperandType';
import {Instruction, isValid} from './Instruction';

// ---------------------------------------------------------------------------------------------------------------------

/**
 * A specification for an instruction operand.
 * An operand is a parameter for an operation.
 *
 * This provides the information needed to decode an instruction into an operand.
 */
class Operand {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * The operand mask.
	 */
	public readonly mask: OperandMask;

	/**
	 * The operand type.
	 */
	public readonly type: OperandType;

	/**
	 * Any special tags applied to the operand.
	 */
	public readonly tags: Map<any, any> | null;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructors:                                                                                              |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a new operand.
	 *
	 * @param mask The operand mask.
	 * @param type The operand type.
	 * @param tags The operand tags.
	 */
	constructor(mask: OperandMask | number, type: OperandType, tags?: Map<any, any> | {[key: string]: any});

	/**
	 * Creates a new operand.
	 *
	 * @param options The operand options.
	 */
	constructor(options: OperandCtor);

	constructor(
		maskOrOptions: OperandMask | number | OperandCtor,
		type?: OperandType,
		tags?: Map<any, any> | {[key: string]: any}
	) {
		let _mask;
		let _type;
		let _tags;

		if (typeof maskOrOptions === 'number' || maskOrOptions instanceof OperandMask) {
			_mask = maskOrOptions!;
			_type = type!;
			_tags = tags;
		} else {
			_mask = maskOrOptions.mask;
			_type = maskOrOptions.type;
			_tags = maskOrOptions.tags;
		}

		assert(_mask != null, "Parameter 'mask' is null");
		assert(!(_mask instanceof OperandMask) || _mask.mask >= 0, "Parameter 'mask' is invalid");
		assert(_mask instanceof OperandMask || (isValid(_mask) && _mask >= 0), "Parameter 'mask' is invalid");
		assert(_type != null, "Parameter 'type' is null");
		assert(_type >= 0, "Parameter 'type' is invalid");

		this.mask = _mask instanceof OperandMask ? _mask : new OperandMask(_mask);
		this.type = _type;
		this.tags = _tags == null ? null : _tags instanceof Map ? _tags : new Map(Object.entries(_tags));
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Decodes the operand.
	 * This will automatically perform bit-shifting.
	 *
	 * @param instruction The instruction to decode.
	 * @returns The decoded operand.
	 */
	public decode(instruction: Instruction): Instruction {
		return this.mask.extract(instruction);
	}

	/**
	 * Encodes the operand.
	 * This will automatically perform bit-shifting.
	 *
	 * @returns The encoded operand.
	 */
	public encode(value: Instruction): Instruction {
		return this.mask.emplace(value & this.mask.vmask, 0);
	}
}

/**
 * The options for the Operand constructor.
 */
interface OperandCtor {
	/**
	 * The operand mask.
	 * This is used to encode and decode the operand.
	 */
	mask: OperandMask | number;

	/**
	 * The operand type.
	 * This is used for assembling and disassembling.
	 */
	type: OperandType;

	/**
	 * The operand tag.
	 * This is an optional map that specifies optional flags or data.
	 */
	tags?: Map<any, any> | {[key: string]: any};
}

// ---------------------------------------------------------------------------------------------------------------------

export default Operand;
export {Operand};
export {OperandCtor};
