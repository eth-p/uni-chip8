//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Uint16 from '@chipotle/types/Uint16';

import OperandType from '@chipotle/isa/OperandType';

import {Operation, Context} from './Operation';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * CHIP-8 INSTRUCTION: CALL <addr>
 *
 * Call a subroutine at <addr>.
 *
 * '2nnn'
 */
export default class OP_CALL_ADDR extends Operation {
	public constructor() {
		super('CALL', 0x2000, [
			{
				mask: 0x0fff,
				type: OperandType.RAM_ADDRESS
			}
		]);
	}

	public execute(this: void, context: Context, operands: Uint16[]): void {
		const p1 = operands[0];
		context.stack.push(context.program_counter);
		context.jump(p1);
	}
}
