//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import {bitshiftl} from '@chipotle/types/Uint8';
import Uint16 from '@chipotle/types/Uint16';

import OperandType from '@chipotle/isa/OperandType';
import OperandTags from '@chipotle/isa/OperandTags';
import Operation from '@chipotle/isa/Operation';

import Chip from './Chip';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * CHIP-8 INSTRUCTION: SHL <reg>
 *
 * Sets the register at <reg> to its value shifted one bit left.
 * Sets Vf to the original most significant bit.
 *
 * '8xye'
 */
export default class OP_SHL_REG extends Operation implements Chip.Interpreter {
	public constructor() {
		super('SHL', 0x800e, [
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
		context.register_flag = context.register_data[p1] & 0b10000000;
		context.register_data[p1] = bitshiftl(p1, 1);
	}
}
