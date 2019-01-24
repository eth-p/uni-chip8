//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import {xor} from '@chipotle/types/Uint8';
import Uint16 from '@chipotle/types/Uint16';

import OperandTags from '@chipotle/isa/OperandTags';
import OperandType from '@chipotle/isa/OperandType';

import {Operation, Context} from './Operation';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * CHIP-8 INSTRUCTION: XOR <reg> <reg>
 *
 * Sets the register at the first <reg> to the bitwise-xor of both register values
 *
 * '8xy3'
 */
export default class OP_XOR_REG_REG extends Operation {
	public constructor() {
		super('XOR', 0x8003, [
			{
				mask: 0x0f00,
				type: OperandType.REGISTER,
				tags: {[OperandTags.IS_DESTINATION]: true}
			},
			{
				mask: 0x00f0,
				type: OperandType.REGISTER
			}
		]);
	}

	public execute(this: void, context: Context, operands: Uint16[]): void {
		const p1 = operands[0];
		const p2 = operands[1];

		context.register_data[p1] = xor(context.register_data[p1], context.register_data[p2]);
	}
}
