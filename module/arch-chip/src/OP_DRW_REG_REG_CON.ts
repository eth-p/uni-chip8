//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Context from '@chipotle/vm/VMContext';
import Op from '@chipotle/vm/Op';
import OpCode from '@chipotle/vm/OpCode';
import OpMask from '@chipotle/vm/OpMask';

import ChipArchitecture from './ChipArchitecture';
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
export default class OP_DRW_REG_REG_CON extends Op<ChipArchitecture> {
	public constructor() {
		super(
			0xd000,
			'DRW <reg> <reg> <con>',
			new OpMask({
				mask: 0xf000,
				p1: 0x0f00,
				p2: 0x00f0,
				p3: 0x000f
			})
		);
	}

	public execute(this: void, context: Context<ChipArchitecture>, p1: OpCode, p2: OpCode, p3: OpCode): void {
		let collide = context.display.draw(p1, p2, new ChipSprite(context.program!.data!, context.register_index, p3));
		if (collide) {
			context.register_flag = 1;
		}
	}
}
