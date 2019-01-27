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
 * CHIP-8 INSTRUCTION: LD <reg> [I]
 *
 * Let <reg> denote the amount of registers to write to = n.
 * Load into main memory from I to I + n, all registers from V0 to <reg>.
 *
 * 'fx65'
 */
export default class OP_LD_MEM_I_REG extends Operation {
	public constructor() {
		super('LD', 0xf065, [
			{
				mask: 0x0f00,
				type: OperandType.REGISTER,
				tags: {[OperandTags.IS_DESTINATION]: true}
			},
			{
				mask: 0x0000,
				type: OperandType.REGISTER,
				tags: {
					[OperandTags.IS_EXACT]: '[I]'
				}
			}
		]);
	}

	public execute(this: void, context: Context, operands: Uint16[]): void {
		const p1 = operands[0];
		if (context.program.data !== null) {
			for (let offset = 0; offset <= p1; ++offset) {
				context.register_data[offset] = context.program.data[context.register_index + offset];
			}
		}
	}
}
