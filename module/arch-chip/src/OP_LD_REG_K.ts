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
 * CHIP-8 INSTRUCTION: LD <reg> K
 *
 * Stall the program until a key is pressed.
 * Store the key hex code into the register at <reg>.
 *
 * 'fx0a'
 */
export default class OP_LD_REG_K extends Operation {
	public constructor() {
		super('LD', 0xf00a, [
			{
				mask: 0x0f00,
				type: OperandType.REGISTER,
				tags: {[OperandTags.IS_DESTINATION]: true}
			},
			{
				mask: 0x0000,
				type: OperandType.REGISTER,
				tags: {
					[OperandTags.IS_EXACT]: 'K'
				}
			}
		]);
	}

	public execute(this: void, context: Context, operands: Uint16[]): void {
		// TODO: Requires keyboard access through context
		if (false) {
			context.hopBackwards(1);
		}
	}
}
