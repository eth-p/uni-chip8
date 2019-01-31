//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import assert from '@chipotle/types/assert';
import Emitter from '@chipotle/types/Emitter';

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
export default class ChipDisplay extends Emitter {
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
	 * The display buffer.
	 * Each bit of the bytes in this buffer represents a pixel.
	 */
	protected displayBuffer: Uint8Array;

	/**
	 * The draw buffer.
	 * This is what drawing calls will write to.
	 */
	protected drawBuffer: Uint8Array;

	/**
	 * Whether or not the swap buffers are enabled.
	 */
	protected doubleBuffered: boolean;

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
		super();
		this.lineOffset = Math.floor(this.WIDTH / UINT8_BITS) | 0;
		this.drawBuffer = new Uint8Array(this.lineOffset * this.HEIGHT);
		this.drawBuffer.fill(0, 0, this.drawBuffer.length);
		this.displayBuffer = this.drawBuffer;
		this.doubleBuffered = false;
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Gets the offset between two lines in the screen buffer.
	 * @returns The line offset.
	 */
	public getLineOffset(): number {
		return this.lineOffset;
	}

	/**
	 * Enables or disables screen buffering.
	 * Screen buffering forces draw calls to be made on a separate buffer.
	 * When {@link transfer} is called, the draw buffer will be copied to the display buffer for rendering.
	 *
	 * @param enabled Whether or not buffering is enabled.
	 */
	public setBuffered(enabled: boolean): void {
		if (!this.doubleBuffered && enabled) {
			this.displayBuffer = new Uint8Array(this.drawBuffer.length);
			this.transfer();
		} else {
			this.displayBuffer = this.drawBuffer;
		}

		this.doubleBuffered = enabled;
	}

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
	 * Transfers the draw buffer to the display buffer.
	 */
	public transfer() {
		if (this.doubleBuffered === false) return;
		this.displayBuffer.set(this.drawBuffer);
	}

	/**
	 * Gets the display buffer.
	 * @returns The display buffer.
	 */
	public getBuffer(): Uint8Array {
		return this.displayBuffer;
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

		this.drawBuffer[index] = ((this.drawBuffer[index] | mask) ^ mask) | (value ? mask : 0);
		this.emit('draw');
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

		this.drawBuffer[index] ^= mask;
		this.emit('draw');
	}

	/**
	 * Gets a pixel on the display buffer.
	 *
	 * @param x The x coordinate of the pixel.
	 * @param y The y coordinate of the pixel.
	 * @returns The state to set the pixel to.
	 */
	public get(x: number, y: number): boolean {
		let tuple = this.index(x, y);

		let index = tuple[0];
		let mask = tuple[1];

		return (this.displayBuffer[index] & mask) > 0;
	}

	/**
	 * Clears the draw buffer.
	 */
	public clear(): void {
		this.drawBuffer.fill(0, 0, this.drawBuffer.length);
		this.emit('draw');
		this.emit('clear');
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
			let byteLo = this.drawBuffer[offsetXLo + offset];
			let byteHi = this.drawBuffer[offsetXHi + offset];

			let byte = (byteLo << 8) | byteHi;
			let data = sprite.buffer[line] << shift;

			if (!flag) flag = (data & byte & (0xffff << shift)) > 0;
			byte ^= data;

			this.drawBuffer[offsetXLo + offset] = (byte >> 8) & 0xff;
			this.drawBuffer[offsetXHi + offset] = (byte >> 0) & 0xff;
		}

		this.emit('draw');
		return flag;
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods: Casting                                                                                          |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a string representation of the display buffer.
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
				Bitfield.from(this.displayBuffer.slice(start, start + this.lineOffset))
					.toString()
					.replace(/ /g, '')
					.replace(/0/g, ' ')
					.replace(/1/g, '*')
			);
		}

		return `${border}\n${lines.map(x => `|${x}|`).join('\n')}\n${border}`;
	}
}
