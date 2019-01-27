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
 * CHIP-8 INSTRUCTION: LD ST <reg>
 *
 * Load the value at <reg> into the sound timer.
 *
 * 'fx18'
 */
export default class OP_LD_ST_REG extends Operation {
	public constructor() {
		super('LD', 0xf018, [
			{
				mask: 0x0000,
				type: OperandType.REGISTER,
				tags: {
					[OperandTags.IS_EXACT]: 'ST',
					[OperandTags.IS_DESTINATION]: true
				}
			},
			{
				mask: 0x0f00,
				type: OperandType.REGISTER
			}
		]);
	}

	public execute(this: void, context: Context, operands: Uint16[]): void {
		const p2 = operands[1];
		context.register_sound = context.register_data[p2];
	}
}
