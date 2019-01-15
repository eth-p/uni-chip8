//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Architecture from '@chipotle/vm/Architecture';
import ISA from '@chipotle/vm/ISA';
import Op from '@chipotle/vm/Op';
// ---------------------------------------------------------------------------------------------------------------------
import OP_SYS from './OP_SYS';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * CHIP-8 INSTRUCTION: SYS
 *
 * Jump to an address.
 * This is ignored on modern interpreters.
 *
 * '0nnn'
 */
export default class ChipArchitecture extends Architecture {
	public static readonly ISA: ISA<ChipArchitecture> = [OP_SYS];

	constructor() {
		super(ChipArchitecture.ISA);
	}
}
