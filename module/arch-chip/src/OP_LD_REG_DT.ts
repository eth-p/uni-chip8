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
 * CHIP-8 INSTRUCTION: LD <reg> DT
 *
 * Load the value of the delay timer into <reg>
 *
 * 'fx07'
 */
export default class OP_LD_REG_DT extends Operation {
	public constructor() {
		super('LD', 0xf007, [
			{
				mask: 0x0f00,
				type: OperandType.REGISTER,
				tags: {[OperandTags.IS_DESTINATION]: true}
			}
		]);
	}

	public execute(this: void, context: Context, operands: Uint16[]): void {
		const p1 = operands[0];
		context.register_data[p1] = context.register_timer;
	}
}
