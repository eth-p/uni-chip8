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
 * CHIP-8 INSTRUCTION: LD [I] <reg>
 *
 * Load all registers from V0 up to and including <reg>
 * into main memory starting at address I.
 *
 * 'fx55'
 */
export default class OP_LD_MEM_I_REG extends Operation {
	public constructor() {
		super('LD', 0xf055, [
			{
				mask: 0x0000,
				type: OperandType.REGISTER,
				tags: {
					[OperandTags.IS_EXACT]: '[I]',
					[OperandTags.IS_DESTINATION]: true
				}
			},
			{
				mask: 0x0f00,
				type: OperandType.REGISTER
			}
		]);
	}

	public execute(this: void, context: Context, operands: Uint16[]): void {
		const p2 = operands[1];
		if (context.program.data !== null) {
			for (let offset = 0; offset <= p2; ++offset) {
				context.program.data[context.register_index + offset] = context.register_data[offset];
			}
		}
	}
}
