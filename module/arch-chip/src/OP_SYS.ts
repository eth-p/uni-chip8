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
 * CHIP-8 INSTRUCTION: SYS
 *
 * Jump to an address.
 * This is ignored on modern interpreters.
 *
 * '0nnn'
 */
export default class OP_SYS extends Op<ChipArchitecture> {
	constructor() {
		super(
			0x0000,
			'SYS <addr>',
			new OpMask({
				mask: 0xf000,
				p1: 0x0fff,
				p2: 0x0000
			})
		);
	}

	execute(context: Context<ChipArchitecture>, p1: OpCode, p2: OpCode): void {
		// Intentional NO-OP.
	}
}
