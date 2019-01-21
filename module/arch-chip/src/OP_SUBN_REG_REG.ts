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
 * CHIP-8 INSTRUCTION: SUBN <reg> <reg>
 *
 * Let the first <reg> be equal to p1.
 * Let the second <reg> be equal to p2.
 *
 * Set the register at p1 to be equal to the register at p2 minus the register at p1.
 * V[p1] = V[p2] - V[p1]
 *
 * Set V[0xF] to no borrow during the subtraction
 *
 * '8xy7'
 */
export default class OP_SUBN_REG_REG extends Op<ChipArchitecture> {
	public constructor() {
		super(
			0x8007,
			'SUBN <reg#> <reg>',
			new OpMask({
				mask: 0xf00f,
				p1: 0x0f00,
				p2: 0x00f0
			})
		);
	}

	public execute(this: void, context: Context<ChipArchitecture>, p1: OpCode, p2: OpCode, p3: OpCode): void {
		let result: [number, MathFlag] = sub(p2, p1);
		context.register_data[p1] = result[0];
		context.register_flag = result[1] === MathFlag.OK ? 1 : 0;
	}
}
