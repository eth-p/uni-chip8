//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Uint16 from '@chipotle/types/Uint16';

import OperandType from '@chipotle/isa/OperandType';

import Chip from './Chip';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * CHIP-8 INSTRUCTION: SYS
 *
 * Jump to an address.
 * This is ignored on modern interpreters.
 *
 * '0nnn'
 */
export default class OP_SYS_ADDR extends Chip.Operation {
	public constructor() {
		super('SYS', 0x0000, [
			{
				mask: 0x0fff,
				type: OperandType.ROM_ADDRESS
			}
		]);
	}

	public execute(this: void, context: Chip.Context, p1: Uint16, p2: never, p3: never): void {
		// Intentional NO-OP.
	}
}
