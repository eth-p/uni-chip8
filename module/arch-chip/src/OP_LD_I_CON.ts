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
 * CHIP-8 INSTRUCTION: LD I <con>
 *
 * Sets the index register to <con>.
 *
 * 'annn'
 */
export default class OP_LD_I_CON extends Op<ChipArchitecture> {
	public constructor() {
		super(
			0xa000,
			'LD <reg#dest=I> <con>',
			new OpMask({
				mask: 0xf000,
				p1: 0x0fff
			})
		);
	}

	public execute(this: void, context: Context<ChipArchitecture>, p1: OpCode, p2: OpCode, p3: OpCode): void {
		context.register_index = p1;
	}
}
