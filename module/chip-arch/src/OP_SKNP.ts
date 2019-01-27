//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Uint16 from '@chipotle/types/Uint16';

import OperandType from '@chipotle/isa/OperandType';

import {Operation, Context} from './Operation';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * CHIP-8 INSTRUCTION: SKNP <reg>
 *
 * If the key with value equal to the value at <reg> is not pressed,
 * skip the next instruction.
 *
 * 'exa1'
 */
export default class OP_SKNP extends Operation {
	public constructor() {
		super('SKNP', 0xe0a1, [
			{
				mask: 0x0f00,
				type: OperandType.REGISTER
			}
		]);
	}

	public execute(this: void, context: Context, operands: Uint16[]): void {
		const p1 = operands[0];
		if (!context.keyboard.keys[p1]) {
			context.hopForwards(1);
		}
	}
}
