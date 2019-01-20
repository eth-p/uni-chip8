//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import assert from '@chipotle/types/assert';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Chip-8 display.
 *
 * 64x32 pixels.
 */
export default class ChipDisplay {
	// -------------------------------------------------------------------------------------------------------------
	// | Constants:                                                                                                |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 *  The width of the display.
	 */
	public readonly WIDTH = 64;

	/**
	 * The height of the display.
	 */
	public readonly HEIGHT = 32;

	/**
	 * The maximum width of a sprite.
	 */
	public readonly SPRITE_WIDTH = 8;

	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * The screen buffer.
	 * An indexed array of booleans which represent the on-off state of pixels on the display.
	 */
	public buffer: boolean[];

	// -------------------------------------------------------------------------------------------------------------
	// | Constructor:                                                                                              |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a new ChipDisplay.
	 */
	public constructor() {
		this.buffer = Array.from({length: this.WIDTH * this.HEIGHT}, () => false);
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Converts a coordinate pair to an index.
	 *
	 * CHIP-8 Display
	 * __________________________
	 * |* (0, 0)                |
	 * |                        |
	 * |                        |
	 * |                        |
	 * |              (63, 31) *|
	 *
	 * @param x The x coordinate.
	 * @param y The y coordinate.
	 * @returns The associated index.
	 */
	public index(x: number, y: number): number {
		assert(x >= 0 && x < this.WIDTH, "Parameter 'x' is out of range for ChipDisplay");
		assert(y >= 0 && y < this.HEIGHT, "Parameter 'y' is out of range for ChipDisplay");

		return y * this.WIDTH + x;
	}

	/**
	 * Sets a pixel on the display.
	 *
	 * @param x The x coordinate of the pixel.
	 * @param y The y coordinate of the pixel.
	 * @param value The state to set the pixel to.
	 */
	public set(x: number, y: number, value: boolean): void {
		this.buffer[this.index(x, y)] = value;
	}

	/**
	 * Gets a pixel on the display.
	 *
	 * @param x The x coordinate of the pixel.
	 * @param y The y coordinate of the pixel.
	 * @returns The state to set the pixel to.
	 */
	public get(x: number, y: number): boolean {
		return this.buffer[this.index(x, y)];
	}

	/**
	 * Clears the display.
	 */
	public clear(): void {
		this.buffer.fill(false, 0, this.WIDTH * this.HEIGHT - 1);
	}
}
