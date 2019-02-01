//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Uint16 from '@chipotle/types/Uint16';

import OperandType from '@chipotle/isa/OperandType';

import JIT from '@chipotle/vm/JIT';

import {Operation, Context, Compiled} from './Operation';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * CHIP-8 INSTRUCTION: JP <addr>
 *
 * Jump to an address.
 *
 * '1nnn'
 */
export default class OP_JP_ADDR extends Operation implements Compiled {
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

	public compile(this: void, operands: Uint16[]) {
		const p1 = JIT.CON(operands[0]);
		const fn_jump = JIT.REF(JIT.CONTEXT, 'jump');
		return JIT.compile({
			instructions: [JIT.CALL(fn_jump, p1)]
		});
	}
}
