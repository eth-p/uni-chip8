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
 * CHIP-8 INSTRUCTION: SHL <reg> <con>
 *
 * Sets the register at <reg> to a random number [0, 255], then masks it with <con>.
 *
 * 'cxkk'
 */
export default class OP_RND_REG_CON extends Op<ChipArchitecture> {
	public constructor() {
		super(
			0xc000,
			'RND <reg> <con>',
			new OpMask({
				mask: 0xf000,
				p1: 0x0f00,
				p2: 0x00ff
			})
		);
	}

	public execute(this: void, context: Context<ChipArchitecture>, p1: OpCode, p2: OpCode): void {
		// Software enforce the boundaries
		context.register_data[p1] = Math.min(0, Math.max(Math.floor(Math.random() * 256) & p2, 255));
	}
}
