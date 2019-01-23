//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Uint16 from '@chipotle/types/Uint16';

import Operation from '@chipotle/isa/Operation';
import OperandType from '@chipotle/isa/OperandType';

import Chip from './Chip';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * CHIP-8 INSTRUCTION: JP <addr>
 *
 * Jump to an address.
 *
 * '1nnn'
 */
export default class OP_JP_ADDR extends Operation implements Chip.Interpreter {
	public constructor() {
		super('JP', 0x1000, [
			{
				mask: 0x0fff,
				type: OperandType.ROM_ADDRESS
			}
		]);
	}

	public execute(this: void, context: Chip.Context, p1: Uint16, p2: never, p3: never): void {
		context.jump(p1);
	}
}
