//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Context from '@chipotle/vm/VMContext';
import Op from '@chipotle/vm/Op';
import OpCode from '@chipotle/vm/OpCode';
import ChipDisplay from '@chipotle/arch-chip/ChipDisplay';
import OpMask from '@chipotle/vm/OpMask';

import ChipArchitecture from './ChipArchitecture';
import {bitshiftr, and, default as Uint8, xor} from '@chipotle/types/Uint8';
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
				p1: 0x0ff0,
				p2: 0x00f0
			})
		);
	}

	public execute(this: void, context: Context<ChipArchitecture>, p1: OpCode, p2: OpCode): void {
		let x_coord_start: Uint8 = bitshiftr(p1, 4);
		let y_coord_start: Uint8 = and(p1, 0xf);
		let draw_height: Uint8 = p2;

		for (let y_offset: Uint8 = 0; y_offset < draw_height; ++y_offset) {
			let sprite_row: Uint8 = context.memory[context.register_index + y_offset];
			for (let x_offset: Uint8 = 0; x_offset < context.display.SPRITE_WIDTH; ++x_offset) {
				// Automatically wrap around sprite pixels.
				let x: Uint8 = (x_coord_start + x_offset) % context.display.WIDTH;
				let y: Uint8 = (y_coord_start + y_offset) % context.display.HEIGHT;

				// Rendering from sprite MSB to LSB.
				let current_sprite_state: Uint8 = and(
					bitshiftr(sprite_row, context.display.SPRITE_WIDTH - 1 - x_offset),
					0b1
				);
				let original_display_state: Uint8 = context.display.get(x, y) ? 1 : 0;
				let new_display_state: boolean = xor(current_sprite_state, original_display_state) === 1 ? true : false;

				context.display.set(x, y, new_display_state);

				// Collision detection
				if (original_display_state === 1 && new_display_state === false) {
					context.register_flag = 1;
				}
			}
		}
	}
}
