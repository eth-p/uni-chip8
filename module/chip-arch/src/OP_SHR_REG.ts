//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import {bitshiftr} from '@chipotle/types/Uint8';
import Uint16 from '@chipotle/types/Uint16';

import OperandType from '@chipotle/isa/OperandType';
import OperandTags from '@chipotle/isa/OperandTags';

import {Operation, Context} from './Operation';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * CHIP-8 INSTRUCTION: SHR <reg>
 *
 * Sets the register at <reg> to its value shifted one bit right
 * Sets Vf to the original least significant bit.
 *
 * '8xy6'
 */
export default class OP_SHR_REG extends Operation {
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

	public execute(this: void, context: Context, operands: Uint16[]): void {
		const p1 = operands[0];
		const rval = context.register_data[p1];

		context.register_flag = rval & 0b00000001;
		context.register_data[p1] = bitshiftr(rval, 1);
	}
}
