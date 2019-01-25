//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Uint16 from '@chipotle/types/Uint16';

import OperandType from '@chipotle/isa/OperandType';

import {Operation, Context} from './Operation';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * CHIP-8 INSTRUCTION: LD ST <reg>
 *
 * Load the value at <reg> into the sound timer.
 *
 * 'fx18'
 */
export default class OP_LD_ST_REG extends Operation {
	public constructor() {
		super('LD', 0xf018, [
			{
				mask: 0x0f00,
				type: OperandType.REGISTER
			}
		]);
	}

	public execute(this: void, context: Context, operands: Uint16[]): void {
		const p1 = operands[0];
		context.register_sound = p1;
	}
}
