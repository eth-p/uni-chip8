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
// ---------------------------------------------------------------------------------------------------------------------

/**
 * CHIP-8 INSTRUCTION: SE <reg> <reg>
 *
 * Skips the next instruction if the register at <reg> is equal to the register at <reg>
 *
 * '5xy0'
 */
export default class OP_SE_REG_REG extends Op<ChipArchitecture> {
	public constructor() {
		super(
			0x5000,
			'SE <reg> <reg>',
			new OpMask({
				mask: 0xf00f,
				p1: 0x0f00,
				p2: 0x00f0
			})
		);
	}

	public execute(this: void, context: Context<ChipArchitecture>, p1: OpCode, p2: OpCode): void {
		if (context.register_data[p1] === context.register_data[p2]) {
			context.program_counter += 2;
		}
	}
}
