//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import {sub} from '@chipotle/types/Uint8';
import Uint16 from '@chipotle/types/Uint16';
import MathFlag from '@chipotle/types/MathFlag';

import OperandType from '@chipotle/isa/OperandType';
import OperandTags from '@chipotle/isa/OperandTags';
import Operation from '@chipotle/isa/Operation';

import Chip from './Chip';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * CHIP-8 INSTRUCTION: SUB <reg> <reg>
 *
 * Sets the register at the first <reg> to the subtraction of the second register from the first register.
 * Sets Vf to no borrow.
 *
 * '8xy5'
 */
export default class OP_SUB_REG_REG extends Operation implements Chip.Interpreter {
	public constructor() {
		super('SUB', 0x8005, [
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

	public execute(this: void, context: Chip.Context, p1: Uint16, p2: Uint16, p3: never): void {
		let result: [number, MathFlag] = sub(p1, p2);
		context.register_data[p1] = result[0];
		context.register_flag = result[1] === MathFlag.OK ? 1 : 0;
	}
}
