//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import {and} from '@chipotle/types/Uint8';
import Uint16 from '@chipotle/types/Uint16';

import Operation from '@chipotle/isa/Operation';
import OperandTags from '@chipotle/isa/OperandTags';
import OperandType from '@chipotle/isa/OperandType';

import Chip from '@chipotle/arch-chip/Chip';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * CHIP-8 INSTRUCTION: AND <reg> <reg>
 *
 * Sets the register at the first <reg> to the bitwise-and of both register values
 *
 * '8xy2'
 */
export default class OP_AND_REG_REG extends Operation implements Chip.Interpreter {
	public constructor() {
		super('AND', 0x8002, [
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
		context.register_data[p1] = and(context.register_data[p1], context.register_data[p2]);
	}
}
