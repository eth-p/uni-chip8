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
 * CHIP-8 INSTRUCTION: LF F, <reg>
 *
 * Set the index register to the location of the first byte of the font
 * representing the value stored in <reg>.
 *
 * Defined behaviour only when <reg> stores [0, 0xf].
 *
 * 'fx29'
 */
export default class OP_LD_F_REG extends Operation {
	public constructor() {
		super('LD', 0xf029, [
			{
				mask: 0x0000,
				type: OperandType.REGISTER,
				tags: {
					[OperandTags.IS_DESTINATION]: true,
					[OperandTags.IS_EXACT]: 'F'
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
		context.register_index = p2 * 5;
	}
}
