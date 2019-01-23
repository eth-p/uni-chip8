//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import {bitshiftr} from '@chipotle/types/Uint8';
import Uint16 from '@chipotle/types/Uint16';

import OperandType from '@chipotle/isa/OperandType';
import OperandTags from '@chipotle/isa/OperandTags';
import Operation from '@chipotle/isa/Operation';

import Chip from './Chip';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * CHIP-8 INSTRUCTION: SHR <reg>
 *
 * Sets the register at <reg> to its value shifted one bit right
 * Sets Vf to the original least significant bit.
 *
 * '8xy6'
 */
export default class OP_SHR_REG extends Operation implements Chip.Interpreter {
	public constructor() {
		super('SHR', 0x8006, [
			{
				mask: 0x0f00,
				type: OperandType.REGISTER,
				tags: {[OperandTags.IS_DESTINATION]: true}
			},
			{
				// FIXME: What is this used for?
				mask: 0x00f0,
				type: OperandType.REGISTER,
				tags: {[OperandTags.IS_UNUSED]: true}
			}
		]);
	}

	public execute(this: void, context: Chip.Context, p1: Uint16, p2: Uint16, p3: never): void {
		context.register_flag = context.register_data[p1] & 0b00000001;
		context.register_data[p1] = bitshiftr(p1, 1);
	}
}
