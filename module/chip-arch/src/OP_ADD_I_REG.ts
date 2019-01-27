//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Uint16 from '@chipotle/types/Uint16';

import OperandType from '@chipotle/isa/OperandType';
import OperandTags from '@chipotle/isa/OperandTags';

import {Context, Operation} from './Operation';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * CHIP-8 INSTRUCTION: ADD I <reg>
 *
 * Set the index register to itself plus the value at <reg>.
 *
 * 'fx1e'
 */
export default class OP_ADD_I_REG extends Operation {
	public constructor() {
		super('ADD', 0xf01e, [
			{
				mask: 0x0000,
				type: OperandType.REGISTER,
				tags: {
					[OperandTags.IS_EXACT]: 'I',
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
		context.register_index += p2;
	}
}
