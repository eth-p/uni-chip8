//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Uint16 from '@chipotle/types/Uint16';

import OperandType from '@chipotle/isa/OperandType';

import {Operation, Context} from './Operation';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * CHIP-8 INSTRUCTION: SNE <reg> <con>
 *
 * Skips the next instruction if the register at <reg> is not equal to <con>
 *
 * '4xkk'
 */
export default class OP_SNE_REG_CON extends Operation {
	public constructor() {
		super('SNE', 0x4000, [
			{
				mask: 0x0f00,
				type: OperandType.REGISTER
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

		if (context.register_data[p1] !== p2) {
			context.hopForwards(2);
		}
	}
}
