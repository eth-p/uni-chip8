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
 * CHIP-8 INSTRUCTION: SNE <reg> <con>
 *
 * Skips the next instruction if the register at <reg> is not equal to <con>
 *
 * '4xkk'
 */
export default class OP_SNE_REG_CON extends Op<ChipArchitecture> {
	public constructor() {
		super(
			0x4000,
			'SNE <reg> <con>',
			new OpMask({
				mask: 0xf000,
				p1: 0x0f00,
				p2: 0x00ff
			})
		);
	}

	public execute(this: void, context: Context<ChipArchitecture>, p1: OpCode, p2: OpCode): void {
		if (context.register_data[p1] !== p2) {
			context.hopForwards(2);
		}
	}
}
