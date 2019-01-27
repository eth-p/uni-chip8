//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Uint16 from '@chipotle/types/Uint16';

import OperandType from '@chipotle/isa/OperandType';

import {Operation, Context} from './Operation';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * CHIP-8 INSTRUCTION: SKP <reg>
 *
 * If the key with value equal to the value at <reg> is pressed,
 * skip the next instruction.
 *
 * 'ex9e'
 */
export default class OP_SKP extends Operation {
	public constructor() {
		super('SKP', 0xe09e, [
			{
				mask: 0x0f00,
				type: OperandType.REGISTER
			}
		]);
	}

	public execute(this: void, context: Context, operands: Uint16[]): void {
		const p1 = operands[0];
		if (context.keyboard.keys[context.register_data[p1]]) {
			context.hopForwards(1);
		}
	}
}
