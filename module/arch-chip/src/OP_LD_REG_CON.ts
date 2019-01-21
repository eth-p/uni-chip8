//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Context from '@chipotle/vm/VMContext';
import Op from '@chipotle/vm/Op';
import OpCode from '@chipotle/vm/OpCode';
import OpMask from '@chipotle/vm/OpMask';

import ChipArchitecture from './ChipArchitecture';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * CHIP-8 INSTRUCTION: LD <reg> <con>
 *
 * Sets the value at register <reg> to <con>
 *
 * '6xkk'
 */
export default class OP_LD_REG_CON extends Op<ChipArchitecture> {
	public constructor() {
		super(
			0x6000,
			'LD <reg#dest> <con>',
			new OpMask({
				mask: 0xf000,
				p1: 0x0f00,
				p2: 0x00ff
			})
		);
	}

	public execute(this: void, context: Context<ChipArchitecture>, p1: OpCode, p2: OpCode, p3: OpCode): void {
		context.register_data[p1] = p2;
	}
}
