//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Uint16 from '@chipotle/types/Uint16';

import JIT from '@chipotle/vm/JIT';

import {Operation, Context, Compiled} from './Operation';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * CHIP-8 INSTRUCTION: RET
 *
 * Return from a subroutine.
 *
 * '00ee'
 */
export default class OP_RET extends Operation implements Compiled {
	public constructor() {
		super('RET', 0x00ee, []);
	}

	public execute(this: void, context: Context, operands: Uint16[]): void {
		let return_address: Uint16 = context.stack.pop();
		context.jump(return_address + 2);
	}

	public compile(this: void, operands: Uint16[]) {
		const fn_pop = JIT.REF(JIT.CONTEXT, 'stack', 'pop');
		const fn_jump = JIT.REF(JIT.CONTEXT, 'jump');
		return JIT.compile({
			instructions: [JIT.CALL(fn_jump, `${JIT.CALL(fn_pop)}+2`)]
		});
	}
}
