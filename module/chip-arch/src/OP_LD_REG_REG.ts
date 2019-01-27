//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------

import Uint16 from '@chipotle/types/Uint16';

import OperandType from '@chipotle/isa/OperandType';
import OperandTags from '@chipotle/isa/OperandTags';

import {Operation, Context} from './Operation';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * CHIP-8 INSTRUCTION: LD <reg> <reg>
 *
 * Assigns the value of the register denoted by p1, to the register value of p2.
 *
 * '8xy0'
 */
export default class OP_LD_REG_CON extends Operation {
	public constructor() {
		super('LD', 0x8000, [
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

		context.register_data[p1] = context.register_data[p2];
	}
}
