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
 * CHIP-8 INSTRUCTION: ADD <reg> <con>
 *
 * Adds the value of p2 to the register denoted by p1.
 * Does not alter the carry flag (?)
 *
 * '7xkk'
 */
export default class OP_SYS extends Op<ChipArchitecture> {
	public constructor() {
		super(
			0x7000,
			'ADD <reg> <con>',
			new OpMask({
				mask: 0xf000,
				p1: 0x0f00,
				p2: 0x00ff
			})
		);
	}

	public execute(this: void, context: Context<ChipArchitecture>, p1: OpCode, p2: OpCode): void {
		context.register_data[p1] = add(context.register_data[p1], p2)[0];
	}
}
