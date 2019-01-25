//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Uint16 from '@chipotle/types/Uint16';

import OperandType from '@chipotle/isa/OperandType';
import OperandTags from '@chipotle/isa/OperandTags';

import {Operation, Context} from './Operation';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * CHIP-8 INSTRUCTION: CLS
 *
 * Clear the display.
 *
 * '00e0'
 */
export default class OP_CLS extends Operation {
	public constructor() {
		super('CLS', 0x00e0, []);
	}

	public execute(this: void, context: Context, operands: Uint16[]): void {
		context.display.clear();
	}
}
