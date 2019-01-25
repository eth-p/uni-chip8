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
 * CHIP-8 INSTRUCTION: LD B <reg>
 *
 * Load the binary coded decimal representation of the value at <reg>
 * into memory addresses I to I + 2.
 *
 * 'fx33'
 */
export default class OP_LD_B_REG extends Operation {
	public constructor() {
		super('LD', 0xf033, [
			{
				mask: 0x0000,
				type: OperandType.REGISTER,
				tags: {
					[OperandTags.IS_EXACT]: 'B',
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
		let p2: number = operands[1];
		if (context.program.data !== null) {
			for (let offset: number = 0; offset < 3; ++offset) {
				context.program.data[context.register_index + (2 - offset)] = p2 % 10;
				p2 /= 10;
			}
		}
	}
}
