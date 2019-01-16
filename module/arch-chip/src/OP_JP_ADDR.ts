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
 * CHIP-8 INSTRUCTION: JP <addr>
 *
 * Jump to an address.
 *
 * '1nnn'
 */
export default class OP_JP_ADDR extends Op<ChipArchitecture> {
	public constructor() {
		super(
			0x1000,
			'JP <addr>',
			new OpMask({
				mask: 0xf000,
				p1: 0x0fff,
				p2: 0x0000
			})
		);
	}

	public execute(this: void, context: Context<ChipArchitecture>, p1: OpCode, p2: OpCode): void {
		context.jump(p1);
	}
}
