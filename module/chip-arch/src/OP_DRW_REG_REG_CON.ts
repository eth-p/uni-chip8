//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Uint16 from '@chipotle/types/Uint16';

import OperandType from '@chipotle/isa/OperandType';

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
}
