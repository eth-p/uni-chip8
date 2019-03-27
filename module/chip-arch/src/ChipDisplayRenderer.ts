//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import ChipDisplay from './ChipDisplay';
import assert from '@chipotle/types/assert';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * A renderer for the CHIP-8 display.
 * This expects an API similar to the HTML canvas 2D rendering context.
 */
class ChipDisplayRenderer {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * The display object.
	 */
	protected readonly display: ChipDisplay;

	/**
	 * The foreground color.
	 */
	protected foreground: string;

	/**
	 * The background color.
	 */
	protected background: string;

	/**
	 * The deflicker amount.
	 * This calculates the transparency value to use for CRT simulation.
	 *
	 * (1 - n) * 0xFF
	 */
	protected deflicker: number;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructor:                                                                                              |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a new display renderer.
	 */
	public constructor(display: ChipDisplay) {
		this.display = display;
		this.foreground = '#ffffff';
		this.background = '#000000';
		this.deflicker = 0;
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Sets the foreground color of the renderer.
	 * @param color The foreground color.
	 */
	public setForeground(color: string): void {
		this.foreground = color;
	}

	/**
	 * Sets the background color of the renderer.
	 * @param color The background color.
	 */
	public setBackground(color: string): void {
		this.background = color;
	}

	/**
	 * Sets the deflicker value.
	 * @param value The deflicker value.
	 */
	public setDeflicker(value: number): void {
		assert(value >= 0 && value <= 1, 'Deflicker value must be between 0 and 1.');
		this.deflicker = value;
	}

	/**
	 * Gets the foreground color of the renderer.
	 * @returns The foreground color.
	 */
	public getForeground(): string {
		return this.foreground;
	}

	/**
	 * Gets the background color of the renderer.
	 * @returns The background color.
	 */
	public getBackground(): string {
		return this.background;
	}

	/**
	 * Gets the deflicker value.
	 * @returns The deflicker value.
	 */
	public getDeflicker(): number {
		return this.deflicker;
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods: Rendering                                                                                        |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Renders the display onto a context.
	 *
	 * @param context The rendering context.
	 * @param width The width of the context.
	 * @param height The height of the context.
	 * @param scaling If true, performs scaling.
	 * @param filled If true, fills in the entire background.
	 */
	public render(context: CanvasRenderingContext2D, width: number, height: number, scaling: boolean, filled: boolean) {
		const foreground = this.getForeground();
		const background = this.getBackground();
		const buffer = this.display.getBuffer();

		// Determine the scaling
		const virtualWidth = this.display.WIDTH;
		const virtualHeight = this.display.HEIGHT;
		const scale = Math.min(
			Math.floor(Math.min(width / virtualWidth, height / virtualHeight)),
			scaling ? Infinity : 2
		);

		// Determine the offsets.
		const top = Math.floor((height - scale * virtualHeight) / 2);
		const left = Math.floor((width - scale * virtualWidth) / 2);

		// Fill background.
		context.globalAlpha = Math.max(0.05, 1 - this.deflicker);
		context.fillStyle = background;
		if (filled) {
			context.fillRect(0, 0, width, height);
		} else {
			context.fillRect(left, top, virtualWidth * scale, virtualHeight * scale);
		}

		// Draw foreground.
		context.globalAlpha = 1;
		context.fillStyle = foreground;
		let index = 0;
		for (let y = 0; y < virtualHeight; y++) {
			let consecutiveX = 0;
			let consecutiveW = 0;

			// Draw in horizontal clusters.
			for (let x8 = 0; x8 < virtualWidth; x8 += 8, index++) {
				let on8 = buffer[index];
				for (let xbit = 0; xbit < 8; xbit++) {
					let on = ((on8 >> (7 - xbit)) & 1) > 0;

					// Draw cluster.
					if (!on) {
						if (consecutiveW !== 0) {
							const drawLeft = left + consecutiveX * scale;
							const drawTop = top + y * scale;
							context.fillRect(drawLeft, drawTop, consecutiveW * scale, scale);
							consecutiveW = 0;
						}

						continue;
					}

					// Add to cluster.
					if (consecutiveW === 0) {
						consecutiveX = x8 + xbit;
						consecutiveW++;
					} else {
						consecutiveW++;
					}
				}
			}

			// Draw cluster.
			if (consecutiveW !== 0) {
				const drawLeft = left + consecutiveX * scale;
				const drawTop = top + y * scale;
				context.fillRect(drawLeft, drawTop, consecutiveW * scale, scale);
				consecutiveW = 0;
			}
		}
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default ChipDisplayRenderer;
export {ChipDisplayRenderer};
