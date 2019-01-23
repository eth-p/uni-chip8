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
 * CHIP-8 INSTRUCTION: LD <reg> <reg>
 *
 * Assigns the value of the register denoted by p1, to the register value of p2.
 *
 * '8xy0'
 */
export default class OP_LD_REG_CON extends Chip.Operation {
	public constructor() {
		super('LD', 0x8000, [
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
		context.register_data[p1] = context.register_data[p2];
	}
}
