//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import {add} from '@chipotle/types/Uint8';
import MathFlag from '@chipotle/types/MathFlag';
import Uint16 from '@chipotle/types/Uint16';

import Operation from '@chipotle/isa/Operation';
import OperandType from '@chipotle/isa/OperandType';
import OperandTags from '@chipotle/isa/OperandTags';

import Chip from '@chipotle/arch-chip/Chip';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * CHIP-8 INSTRUCTION: ADD <reg> <reg>
 *
 * Sets the register at the first <reg> to the sum of both values at both registers.
 * Sets Vf if a carry occurs.
 *
 * '8xy4'
 */
export default class OP_ADD_REG_REG extends Operation implements Chip.Interpreter {
	public constructor() {
		super('ADD', 0x8004, [
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
		let result: [number, MathFlag] = add(p1, p2);
		context.register_data[p1] = result[0];
		context.register_flag = result[1] === MathFlag.OVERFLOW ? 1 : 0;
		let x = p3 + 2;
	}
}
