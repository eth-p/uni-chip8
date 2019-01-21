//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import assert from '@chipotle/types/assert';

import Bitfield from '@chipotle/types/Bitfield';
import {BITS as UINT8_BITS} from '@chipotle/types/Uint8';

import ChipSprite from './ChipSprite';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Chip-8 display.
 *
 * ```
 * __________________________
 * |* (0, 0)                |
 * |                        |
 * |                        |
 * |                        |
 * |              (63, 31) *|
 * --------------------------
 * ```
 *
 * 64x32 pixels.
 */
export default class ChipDisplay {
	// -------------------------------------------------------------------------------------------------------------
	// | Constants:                                                                                                |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * The width of the display.
	 */
	public static readonly WIDTH = 64;
	public readonly WIDTH: number = (<any>this.constructor).WIDTH;

	/**
	 * The height of the display.
	 */
	public static readonly HEIGHT = 32;
	public readonly HEIGHT: number = (<any>this.constructor).HEIGHT;

	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * The screen buffer.
	 * Each bit of the bytes in this buffer represents a pixel.
	 */
	public buffer: Uint8Array;

	/**
	 * The offset between two lines in the screen buffer.
	 */
	protected lineOffset: number;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructor:                                                                                              |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a new display.
	 */
	public constructor() {
		this.lineOffset = Math.floor(this.WIDTH / UINT8_BITS) | 0;
		this.buffer = new Uint8Array(this.lineOffset * this.HEIGHT);
		this.buffer.fill(0, 0, this.buffer.length);
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Gets an index tuple for a coordinate pair.
	 *
	 * @param x The x coordinate of the pixel.
	 * @param y The y coordinate of the pixel.
	 *
	 * @returns An array, where [0] is the index of the buffer, and [1] is the bitmask to check.
	 */
	public index(x: number, y: number): [number, number] {
		return [y * this.lineOffset + ((x / UINT8_BITS) | 0), 0b10000000 >> x % UINT8_BITS];
	}

	/**
	 * Sets a pixel on the display.
	 *
	 * @param x The x coordinate of the pixel.
	 * @param y The y coordinate of the pixel.
	 * @param value The state to set the pixel to.
	 */
	public set(x: number, y: number, value: boolean): void {
		let tuple = this.index(x, y);

		let index = tuple[0];
		let mask = tuple[1];

		this.buffer[index] = ((this.buffer[index] | mask) ^ mask) | (value ? mask : 0);
	}

	/**
	 * Toggles a pixel on the display.
	 *
	 * @param x The x coordinate of the pixel.
	 * @param y The y coordinate of the pixel.
	 */
	public toggle(x: number, y: number): void {
		let tuple = this.index(x, y);

		let index = tuple[0];
		let mask = tuple[1];

		this.buffer[index] ^= mask;
	}

	/**
	 * Gets a pixel on the display.
	 *
	 * @param x The x coordinate of the pixel.
	 * @param y The y coordinate of the pixel.
	 * @returns The state to set the pixel to.
	 */
	public get(x: number, y: number): boolean {
		let tuple = this.index(x, y);

		let index = tuple[0];
		let mask = tuple[1];

		return (this.buffer[index] & mask) > 0;
	}

	/**
	 * Clears the display.
	 */
	public clear(): void {
		this.buffer.fill(0, 0, this.buffer.length);
	}

	/**
	 * Draws a sprite to the display.
	 * Any overlapping pixels are inverted.
	 *
	 * @param x The x coordinate of the sprite.
	 * @param y The y coordinate of the sprite.
	 * @param sprite The sprite to draw.
	 *
	 * @returns True if any pixels were inverted.
	 */
	public draw(x: number, y: number, sprite: ChipSprite): boolean {
		assert(x >= 0 && x <= this.WIDTH, "Parameter 'x' is invalid");
		assert(y >= 0 && y <= this.HEIGHT, "Parameter 'y' is invalid");

		// Developer notes:
		// @eth-p: This is a bunch of bitwise hackery.
		//         In essence, this grabs two 8-bit numbers from the buffer, converts them to a 16-bit number,
		//         and XORs them with a 16-bit (shifted) sprite line. It then maps the 16-bit result back into the
		//         buffer.

		let shift = 8 - (x % UINT8_BITS);

		let offsetY = y * this.lineOffset;
		let offsetXLo = ((x / UINT8_BITS) | 0) % this.lineOffset;
		let offsetXHi = (((x / UINT8_BITS) | 0) + 1) % this.lineOffset;
		let flag = false;

		for (let line = 0; line < sprite.height; line++) {
			let offset = offsetY + line * this.lineOffset;
			let byteLo = this.buffer[offsetXLo + offset];
			let byteHi = this.buffer[offsetXHi + offset];

			let byte = (byteLo << 8) | byteHi;
			let data = sprite.buffer[line] << shift;

			if (!flag) flag = (data & byte & (0xffff << shift)) > 0;
			byte ^= data;

			this.buffer[offsetXLo + offset] = (byte >> 8) & 0xff;
			this.buffer[offsetXHi + offset] = (byte >> 0) & 0xff;
		}

		return flag;
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods: Casting                                                                                          |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a string representation of the display.
	 * This should be used primarily for debugging purposes.
	 *
	 * @returns A nicely-formatted representation of the display.
	 */
	public toString(): string {
		let border = `.${'-'.repeat(this.WIDTH)}.`;
		let lines = [];

		for (let i = 0; i < this.HEIGHT; i++) {
			let start = i * this.lineOffset;
			lines.push(
				Bitfield.from(this.buffer.slice(start, start + this.lineOffset))
					.toString()
					.replace(/ /g, '')
					.replace(/0/g, ' ')
					.replace(/1/g, '*')
			);
		}

		return `${border}\n${lines.map(x => `|${x}|`).join('\n')}\n${border}`;
	}
}
