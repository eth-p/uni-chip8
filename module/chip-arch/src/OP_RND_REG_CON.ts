//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Uint16 from '@chipotle/types/Uint16';
import {MAX as UINT8_MAX} from '@chipotle/types/Uint8';

import OperandType from '@chipotle/isa/OperandType';
import OperandTags from '@chipotle/isa/OperandTags';

import {Operation, Context} from './Operation';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * CHIP-8 INSTRUCTION: SHL <reg> <con>
 *
 * Sets the register at <reg> to a random number [0, 255], then masks it with <con>.
 *
 * 'cxkk'
 */
export default class OP_RND_REG_CON extends Operation {
	public constructor() {
		super('RND', 0xc000, [
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

		// Software enforce the boundaries
		context.register_data[p1] = (context.random.nextInt(0, 0xff) & p2) | 0;
	}
}
