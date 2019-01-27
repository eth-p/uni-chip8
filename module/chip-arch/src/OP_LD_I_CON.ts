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
 * CHIP-8 INSTRUCTION: LD I <con>
 *
 * Sets the index register to <con>.
 *
 * 'annn'
 */
export default class OP_LD_I_CON extends Operation {
	public constructor() {
		super('LD', 0xa000, [
			{
				mask: 0x0000,
				type: OperandType.REGISTER,
				tags: {[OperandTags.IS_EXACT]: 'I'}
			},
			{
				mask: 0x0fff,
				type: OperandType.CONSTANT
			}
		]);
	}

	public execute(this: void, context: Context, operands: Uint16[]): void {
		const p2 = operands[1];
		context.register_index = p2;
	}
}
