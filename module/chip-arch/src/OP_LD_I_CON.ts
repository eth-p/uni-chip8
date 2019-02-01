//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Uint16 from '@chipotle/types/Uint16';

import OperandType from '@chipotle/isa/OperandType';
import OperandTags from '@chipotle/isa/OperandTags';

import JIT from '@chipotle/vm/JIT';

import {Operation, Context, Compiled} from './Operation';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * CHIP-8 INSTRUCTION: LD I <con>
 *
 * Sets the index register to <con>.
 *
 * 'annn'
 */
export default class OP_LD_I_CON extends Operation implements Compiled {
	public constructor() {
		super('LD', 0xa000, [
			{
				mask: 0x0000,
				type: OperandType.REGISTER,
				tags: {[OperandTags.IS_EXACT]: 'I'}
			},
			{
				mask: 0x0fff,
				type: OperandType.CONSTANT
			}
		]);
	}

	public execute(this: void, context: Context, operands: Uint16[]): void {
		const p2 = operands[1];
		context.register_index = p2;
	}

	public compile(this: void, operands: Uint16[]) {
		const p1 = JIT.CON(operands[1]);
		const reg_index = JIT.REF(JIT.CONTEXT, 'register_index');
		return JIT.compile({
			instructions: [JIT.ASSIGN(reg_index, p1)]
		});
	}
}
