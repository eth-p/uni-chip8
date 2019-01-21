//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Context from '@chipotle/vm/VMContext';
import Op from '@chipotle/vm/Op';
import OpCode from '@chipotle/vm/OpCode';
import {bitshiftl} from '@chipotle/types/Uint8';
import OpMask from '@chipotle/vm/OpMask';

import ChipArchitecture from './ChipArchitecture';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * CHIP-8 INSTRUCTION: SHL <reg>
 *
 * Sets the register at <reg> to its value shifted one bit left.
 * Sets Vf to the original most significant bit.
 *
 * '8xye'
 */
export default class OP_SHL_REG extends Op<ChipArchitecture> {
	public constructor() {
		super(
			0x800e,
			'SHL <reg>',
			new OpMask({
				mask: 0xf00f,
				p1: 0x0f00,
				p2: 0x00f0 // FIXME: What is this used for?
			})
		);
	}

	public execute(this: void, context: Context<ChipArchitecture>, p1: OpCode, p2: OpCode, p3: OpCode): void {
		context.register_flag = context.register_data[p1] & 0b10000000;
		context.register_data[p1] = bitshiftl(p1, 1);
	}
}
