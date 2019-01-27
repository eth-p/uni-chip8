//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import {or} from '@chipotle/types/Uint8';
import Uint16 from '@chipotle/types/Uint16';

import OperandType from '@chipotle/isa/OperandType';
import OperandTags from '@chipotle/isa/OperandTags';

import {Operation, Context} from './Operation';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * CHIP-8 INSTRUCTION: OR <reg> <reg>
 *
 * Sets the register at the first <reg> to the bitwise-or of both register values
 *
 * '8xy1'
 */
export default class OP_OR_REG_REG extends Operation {
	public constructor() {
		super('OR', 0x8001, [
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

		context.register_data[p1] = or(context.register_data[p1], context.register_data[p2]);
	}
}
