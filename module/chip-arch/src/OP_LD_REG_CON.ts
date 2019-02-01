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
 * CHIP-8 INSTRUCTION: LD <reg> <con>
 *
 * Sets the value at register <reg> to <con>
 *
 * '6xkk'
 */
export default class OP_LD_REG_CON extends Operation implements Compiled {
	public constructor() {
		super('LD', 0x6000, [
			{
				mask: 0x0f00,
				type: OperandType.REGISTER,
				tags: {[OperandTags.IS_DESTINATION]: true}
			},
			{
				mask: 0x00ff,
				type: OperandType.CONSTANT
			}
		]);
	}

	public execute(this: void, context: Context, operands: Uint16[]): void {
		const p1 = operands[0];
		const p2 = operands[1];

		context.register_data[p1] = p2;
	}

	public compile(this: void, operands: Uint16[]) {
		const p1 = JIT.REF(JIT.CONTEXT, 'register_data', operands[0]);
		const p2 = JIT.CON(operands[1]);

		return JIT.compile({
			instructions: [JIT.ASSIGN(p1, p2)]
		});
	}
}
