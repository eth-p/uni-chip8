//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import assert from '@chipotle/types/assert';

import Bitfield from '@chipotle/types/Bitfield';
import {default as Uint8, bitscanf, bitscanr, BITS, MIN, MAX} from '@chipotle/types/Uint8';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Chip-8 sprite.
 *
 * ```
 * 01101110 => | SS PPP |
 * 01001110 => | S  PPP |
 * 11001000 => |SS  P   |
 * ```
 */
export default class ChipSprite {
	// -------------------------------------------------------------------------------------------------------------
	// | Constants:                                                                                                |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * The width of a sprite.
	 */
	public static readonly MAX_WIDTH = 8;
	public readonly MAX_WIDTH: number = (<any>this.constructor).MAX_WIDTH;

	/**
	 * The maximum height of a sprite.
	 * See http://devernay.free.fr/hacks/chip8/C8TECH10.HTM#2.4
	 */
	public static readonly MAX_HEIGHT = 15;
	public readonly MAX_HEIGHT: number = (<any>this.constructor).MAX_HEIGHT;

	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * The sprite data.
	 */
	public buffer: Uint8[] | Uint8Array;

	/**
	 * The sprite width.
	 */
	public width: number;

	/**
	 * The sprite height.
	 */
	public height: number;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructor:                                                                                              |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a new sprite.
	 *
	 * If `offset` and `height` are provided, it will take a slice of the `sprite` variable.
	 *
	 * @param sprite The sprite data.
	 * @param offset The offset starting index of the sprite.
	 * @param height The sprite height.
	 */
	public constructor(sprite: Uint8[] | Uint8Array, offset?: number, height?: number) {
		if (offset === undefined || height === undefined) {
			this.buffer = sprite;
		} else {
			this.buffer = sprite.slice(offset, offset + height);
		}

		this.width = 8;
		this.height = this.buffer.length;

		assert(this.buffer.length <= this.MAX_HEIGHT, 'Invalid sprite buffer');
		assert(
			Array.from(this.buffer)
				.map(x => x >= MIN && x <= MAX)
				.find(x => !x) === undefined,
			'Invalid sprite buffer contents'
		);
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a string representation of the sprite.
	 * This should be used primarily for debugging purposes.
	 *
	 * @returns A nicely-formatted representation of the sprite.
	 */
	public toString(): string {
		let buffer = Array.from(this.buffer);

		let leftOffset = 7 - Math.max(...buffer.map(x => (x === 0 ? Number.MIN_SAFE_INTEGER : bitscanr(x))));
		let rightOffset = 7 - Math.min(...buffer.map(x => (x === 0 ? Number.MAX_SAFE_INTEGER : bitscanf(x))));

		return buffer
			.map(x => Bitfield.from(x, BITS))
			.map(x => x.slice(leftOffset, rightOffset + 1))
			.map(x => x.map(y => (y ? 'X' : ' ')).join(''))
			.join('\n');
	}

	/**
	 * Creates a bitfield that represents the sprite.
	 * @returns A large variable-length bitfield.
	 */
	public toBitfield(): Bitfield {
		let typed = this.buffer instanceof Uint8Array ? this.buffer : new Uint8Array(this.buffer);
		return Bitfield.from(typed);
	}
}
