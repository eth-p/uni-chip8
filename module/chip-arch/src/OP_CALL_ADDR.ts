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
 * CHIP-8 INSTRUCTION: CALL <addr>
 *
 * Call a subroutine at <addr>.
 *
 * '2nnn'
 */
export default class OP_CALL_ADDR extends Operation implements Compiled {
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

	public compile(this: void, operands: Uint16[]) {
		const p1 = JIT.CON(operands[0]);
		const pc = JIT.REF(JIT.CONTEXT, 'program_counter');
		const fn_push = JIT.REF(JIT.CONTEXT, 'stack', 'push');
		const fn_jump = JIT.REF(JIT.CONTEXT, 'jump');
		return JIT.compile({
			instructions: [JIT.CALL(fn_push, pc), JIT.CALL(fn_jump, p1)]
		});
	}
}
