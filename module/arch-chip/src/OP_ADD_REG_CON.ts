//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import {add} from '@chipotle/types/Uint8';
import Uint16 from '@chipotle/types/Uint16';

import OperandTags from '@chipotle/isa/OperandTags';
import OperandType from '@chipotle/isa/OperandType';

import {Operation, Context} from '@chipotle/arch-chip/Operation';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * CHIP-8 INSTRUCTION: ADD <reg> <con>
 *
 * Adds the value of p2 to the register denoted by p1.
 * Does not alter the carry flag.
 *
 * '7xkk'
 */
export default class OP_ADD_REG_CON extends Operation {
	public constructor() {
		super('ADD', 0x7000, [
			{
				mask: 0x0f00,
				type: OperandType.REGISTER,
				tags: {[OperandTags.IS_DESTINATION]: true}
			},
			{
				mask: 0x00ff,
				type: OperandType.CONSTANT
			}
		]);
	}

	public execute(this: void, context: Context, operands: Uint16[]): void {
		const p1 = operands[0];
		const p2 = operands[1];

		context.register_data[p1] = add(context.register_data[p1], p2)[0];
	}
}
