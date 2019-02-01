//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Uint16 from '@chipotle/types/Uint16';
import MathFlag from '@chipotle/types/MathFlag';

import OperandType from '@chipotle/isa/OperandType';

import JIT from '@chipotle/vm/JIT';

import {Operation, Context} from './Operation';
import ChipSprite from './ChipSprite';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * CHIP-8 INSTRUCTION: DRW <reg> <reg> <con>
 *
 * Let the value at the first <reg> = x
 * Let the value at the second <reg> = y
 * Let <con> = The number of rows of the sprite to draw
 *
 * Draw a sprite loaded at the index register 8 bits wide and <con> bits tall
 * from x, y.
 *
 * 'dxyn'
 */
export default class OP_DRW_REG_REG_CON extends Operation {
	public constructor() {
		super('DRW', 0xd000, [
			{
				mask: 0x0f00,
				type: OperandType.REGISTER
			},
			{
				mask: 0x00f0,
				type: OperandType.REGISTER
			},
			{
				mask: 0x000f,
				type: OperandType.CONSTANT
			}
		]);
	}

	public execute(this: void, context: Context, operands: Uint16[]): void {
		const p1 = operands[0];
		const p2 = operands[1];
		const p3 = operands[2];

		let collide = context.display.draw(
			context.register_data[p1],
			context.register_data[p2],
			new ChipSprite(context.program!.data!, context.register_index, p3)
		);

		context.register_flag = collide === true ? 1 : 0;
	}

	public compile(this: void, operands: Uint16[]) {
		const p1 = JIT.REF(JIT.CONTEXT, 'register_data', operands[0]);
		const p2 = JIT.REF(JIT.CONTEXT, 'register_data', operands[1]);
		const p3 = JIT.CON(operands[2]);
		const reg_flag = JIT.REF(JIT.CONTEXT, 'register_flag');
		const reg_index = JIT.REF(JIT.CONTEXT, 'register_index');
		const prog_data = JIT.REF(JIT.CONTEXT, 'program', 'data');
		const fn_draw = JIT.REF(JIT.CONTEXT, 'display', 'draw');
		const fn_ChipSprite = JIT.LIB('ChipSprite');

		return JIT.compile({
			lib: {ChipSprite},
			locals: ['collide'],
			instructions: [
				JIT.ASSIGN(
					'collide',
					JIT.CALL(fn_draw, p1, p2, JIT.CONSTRUCT(fn_ChipSprite, prog_data, reg_index, p3))
				),
				JIT.ASSIGN(reg_flag, 'collide === true ? 1 : 0')
			]
		});
	}
}
