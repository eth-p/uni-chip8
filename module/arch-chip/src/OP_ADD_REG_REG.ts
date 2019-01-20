//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import {add} from '@chipotle/types/Uint8';

import Context from '@chipotle/vm/VMContext';
import Op from '@chipotle/vm/Op';
import OpCode from '@chipotle/vm/OpCode';
import OpMask from '@chipotle/vm/OpMask';

import ChipArchitecture from './ChipArchitecture';
import MathFlag from '@chipotle/types/MathFlag';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * CHIP-8 INSTRUCTION: ADD <reg> <reg>
 *
 * Sets the register at the first <reg> to the sum of both values at both registers.
 * Sets Vf if a carry occurs.
 *
 * '8xy4'
 */
export default class OP_ADD_REG_REG extends Op<ChipArchitecture> {
	public constructor() {
		super(
			0x8004,
			'ADD <reg> <reg>',
			new OpMask({
				mask: 0xf00f,
				p1: 0x0f00,
				p2: 0x00f0
			})
		);
	}

	public execute(this: void, context: Context<ChipArchitecture>, p1: OpCode, p2: OpCode): void {
		let result: [number, MathFlag] = add(p1, p2);
		context.register_data[p1] = result[0];
		context.register_flag = result[1] === MathFlag.OVERFLOW ? 1 : 0;
	}
}
