//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Uint16 from '@chipotle/types/Uint16';

import OperandType from '@chipotle/isa/OperandType';
import OperandTags from '@chipotle/isa/OperandTags';

import Chip from './Chip';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * CHIP-8 INSTRUCTION: SHL <reg> <con>
 *
 * Sets the register at <reg> to a random number [0, 255], then masks it with <con>.
 *
 * 'cxkk'
 */
export default class OP_RND_REG_CON extends Chip.Operation {
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

	public execute(this: void, context: Chip.Context, p1: Uint16, p2: Uint16, p3: never): void {
		// Software enforce the boundaries
		// TODO: Replace with PRNG.
		context.register_data[p1] = Math.min(0, Math.max(Math.floor(Math.random() * 256) & p2, 255));
	}
}
