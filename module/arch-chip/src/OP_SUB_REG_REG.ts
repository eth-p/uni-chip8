//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import {sub} from '@chipotle/types/Uint8';

import Context from '@chipotle/vm/VMContext';
import Op from '@chipotle/vm/Op';
import OpCode from '@chipotle/vm/OpCode';
import OpMask from '@chipotle/vm/OpMask';

import ChipArchitecture from './ChipArchitecture';
import MathFlag from '@chipotle/types/MathFlag';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * CHIP-8 INSTRUCTION: SUB <reg> <reg>
 *
 * Sets the register at the first <reg> to the subtraction of the second register from the first register.
 * Sets Vf to no borrow.
 *
 * '8xy5'
 */
export default class OP_SUB_REG_REG extends Op<ChipArchitecture> {
	public constructor() {
		super(
			0x8005,
			'SUB <reg> <reg>',
			new OpMask({
				mask: 0xf00f,
				p1: 0x0f00,
				p2: 0x00f0
			})
		);
	}

	public execute(this: void, context: Context<ChipArchitecture>, p1: OpCode, p2: OpCode): void {
		// VF should be set to not borrow
		// Please validate this
		let result: [number, MathFlag] = sub(p1, p2);
		context.register_data[p1] = result[0];
		context.register_data[0xf] = result[1] === MathFlag.OK ? 1 : 0;
	}
}
