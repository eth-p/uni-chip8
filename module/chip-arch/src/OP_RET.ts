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
 * CHIP-8 INSTRUCTION: RET
 *
 * Return from a subroutine.
 *
 * '00ee'
 */
export default class OP_RET extends Operation {
	public constructor() {
		super('RET', 0x00ee, []);
	}

	public execute(this: void, context: Context, operands: Uint16[]): void {
		let return_address: Uint16 = context.stack.pop();
		context.jump(return_address + 2);
	}
}
