//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Uint16 from '@chipotle/types/Uint16';

import OperandType from '@chipotle/isa/OperandType';

import {Operation, Context} from './Operation';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * CHIP-8 INSTRUCTION: JP <addr>
 *
 * Jump to an address.
 *
 * '1nnn'
 */
export default class OP_JP_ADDR extends Operation {
	public constructor() {
		super('JP', 0x1000, [
			{
				mask: 0x0fff,
				type: OperandType.ROM_ADDRESS
			}
		]);
	}

	public execute(this: void, context: Context, operands: Uint16[]): void {
		context.jump(operands[0]);
	}
}
