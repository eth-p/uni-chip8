//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Uint16 from '@chipotle/types/Uint16';

import OperandTags from '@chipotle/isa/OperandTags';
import OperandType from '@chipotle/isa/OperandType';
import Operation from '@chipotle/isa/Operation';

import Chip from './Chip';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * CHIP-8 INSTRUCTION: JP V0 <con>
 *
 * Jumps the program counter to nnn offset by the value at v0.
 *
 * 'bnnn'
 */
export default class OP_JP_ADDR_CON extends Operation implements Chip.Interpreter {
	public constructor() {
		super('JP', 0x1000, [
			{
				mask: 0x0000,
				type: OperandType.REGISTER,
				tags: {[OperandTags.IS_EXACT]: 'V0'}
			},
			{
				mask: 0x0fff,
				type: OperandType.ROM_ADDRESS
			}
		]);
	}

	public execute(this: void, context: Chip.Context, p1: never, p2: Uint16, p3: never): void {
		context.jump(p2 + context.register_data[0x0]);
	}
}
