//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Uint16 from '@chipotle/types/Uint16';

import OperandType from '@chipotle/isa/OperandType';
import OperandTags from '@chipotle/isa/OperandTags';
import Operation from '@chipotle/isa/Operation';

import Chip from './Chip';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * CHIP-8 INSTRUCTION: LD I <con>
 *
 * Sets the index register to <con>.
 *
 * 'annn'
 */
export default class OP_LD_I_CON extends Operation implements Chip.Interpreter {
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

	public execute(this: void, context: Chip.Context, p1: never, p2: Uint16, p3: never): void {
		context.register_index = p2;
	}
}
