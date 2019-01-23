//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Uint16 from '@chipotle/types/Uint16';

import OperandType from '@chipotle/isa/OperandType';

import Chip from './Chip';
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
export default class OP_DRW_REG_REG_CON extends Chip.Operation {
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

	public execute(this: void, context: Chip.Context, p1: Uint16, p2: Uint16, p3: Uint16): void {
		let collide = context.display.draw(p1, p2, new ChipSprite(context.program!.data!, context.register_index, p3));
		context.register_flag = collide === true ? 1 : 0;
	}
}
