//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Context from '@chipotle/vm/VMContext';
import Op from '@chipotle/vm/Op';
import OpCode from '@chipotle/vm/OpCode';
import {bitshiftr} from '@chipotle/types/Uint8';
import OpMask from '@chipotle/vm/OpMask';

import ChipArchitecture from './ChipArchitecture';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * CHIP-8 INSTRUCTION: SHR <reg>
 *
 * Sets the register at <reg> to its value shifted one bit right
 * Sets Vf to the original least significant bit.
 *
 * '8xy6'
 */
export default class OP_SHR_REG extends Op<ChipArchitecture> {
	public constructor() {
		super(
			0x8006,
			'SHR <reg>',
			new OpMask({
				mask: 0xf00f,
				p1: 0x0f00,
				p2: 0x00f0
			})
		);
	}

	public execute(this: void, context: Context<ChipArchitecture>, p1: OpCode, p2: OpCode): void {
		context.register_flag = context.register_data[p1] & 0b00000001;
		context.register_data[p1] = bitshiftr(p1, 1);
	}
}
