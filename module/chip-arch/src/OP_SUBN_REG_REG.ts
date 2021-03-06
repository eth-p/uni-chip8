//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import {sub} from '@chipotle/types/Uint8';
import Uint16 from '@chipotle/types/Uint16';
import MathFlag from '@chipotle/types/MathFlag';

import OperandTags from '@chipotle/isa/OperandTags';
import OperandType from '@chipotle/isa/OperandType';

import {Operation, Context} from './Operation';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * CHIP-8 INSTRUCTION: SUBN <reg> <reg>
 *
 * Let the first <reg> be equal to p1.
 * Let the second <reg> be equal to p2.
 *
 * Set the register at p1 to be equal to the register at p2 minus the register at p1.
 * V[p1] = V[p2] - V[p1]
 *
 * Set V[0xF] to no borrow during the subtraction
 *
 * '8xy7'
 */
export default class OP_SUBN_REG_REG extends Operation {
	public constructor() {
		super('SUBN', 0x8007, [
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

		let result: [number, MathFlag] = sub(context.register_data[p2], context.register_data[p1]);
		context.register_data[p1] = result[0];
		context.register_flag = result[1] === MathFlag.OK ? 1 : 0;
	}
}
