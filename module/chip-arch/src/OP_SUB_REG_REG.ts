//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import {sub} from '@chipotle/types/Uint8';
import Uint16 from '@chipotle/types/Uint16';
import MathFlag from '@chipotle/types/MathFlag';

import OperandType from '@chipotle/isa/OperandType';
import OperandTags from '@chipotle/isa/OperandTags';

import JIT from '@chipotle/vm/JIT';

import {Operation, Context, Compiled} from './Operation';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * CHIP-8 INSTRUCTION: SUB <reg> <reg>
 *
 * Sets the register at the first <reg> to the subtraction of the second register from the first register.
 * Sets Vf to no borrow.
 *
 * '8xy5'
 */
export default class OP_SUB_REG_REG extends Operation implements Compiled {
	public constructor() {
		super('SUB', 0x8005, [
			{
				mask: 0x0f00,
				type: OperandType.REGISTER,
				tags: {[OperandTags.IS_DESTINATION]: true}
			},
			{
				mask: 0x00f0,
				type: OperandType.REGISTER
			}
		]);
	}

	public execute(this: void, context: Context, operands: Uint16[]): void {
		const p1 = operands[0];
		const p2 = operands[1];

		let result: [number, MathFlag] = sub(context.register_data[p1], context.register_data[p2]);
		context.register_data[p1] = result[0];
		context.register_flag = result[1] === MathFlag.OK ? 1 : 0;
	}

	public compile(this: void, operands: Uint16[]) {
		const p1 = JIT.REF(JIT.CONTEXT, 'register_data', operands[0]);
		const p2 = JIT.REF(JIT.CONTEXT, 'register_data', operands[1]);
		const reg_flag = JIT.REF(JIT.CONTEXT, 'register_flag');

		const fn_sub = JIT.LIB('sub');

		return JIT.compile({
			lib: {sub},
			locals: ['result'],
			instructions: [
				JIT.ASSIGN('result', JIT.CALL(fn_sub, p1, p2)),
				JIT.ASSIGN(p1, JIT.REF('result', 0)),
				JIT.ASSIGN(reg_flag, `result === ${MathFlag.OK} ? 1 : 0`)
			]
		});
	}
}
