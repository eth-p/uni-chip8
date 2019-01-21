//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import {or} from '@chipotle/types/Uint8';

import Context from '@chipotle/vm/VMContext';
import Op from '@chipotle/vm/Op';
import OpCode from '@chipotle/vm/OpCode';
import OpMask from '@chipotle/vm/OpMask';

import ChipArchitecture from './ChipArchitecture';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * CHIP-8 INSTRUCTION: OR <reg> <reg>
 *
 * Sets the register at the first <reg> to the bitwise-or of both register values
 *
 * '8xy1'
 */
export default class OP_OR_REG_REG extends Op<ChipArchitecture> {
	public constructor() {
		super(
			0x8001,
			'OR <reg#dest> <reg>',
			new OpMask({
				mask: 0xf00f,
				p1: 0x0f00,
				p2: 0x00f0
			})
		);
	}

	public execute(this: void, context: Context<ChipArchitecture>, p1: OpCode, p2: OpCode, p3: OpCode): void {
		context.register_data[p1] = or(context.register_data[p1], context.register_data[p2]);
	}
}
