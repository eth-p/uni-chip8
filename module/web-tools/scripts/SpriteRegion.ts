//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------

/**
 * Sprite Region class to provide sprite row codes.
 */
export default class SpriteRegion {
	public static readonly COLUMNS = 8;
	public static readonly ROWS = 15;

	private data: number[];

	constructor() {
		this.data = new Array<number>(SpriteRegion.ROWS);
		this.data.fill(0);
	}

	/**
	 * Set the pixel at a coordinate.
	 *
	 * @param column The column to set.
	 * @param row The row to set.
	 * @param state The state the pixel will take.
	 */
	setPixel(column: number, row: number, state: boolean): void {
		if (state) {
			this.data[row] |= 1 << (7 - column);
		} else {
			this.data[row] &= ~(1 << (7 - column));
		}
	}

	/**
	 * Get the pixel at a coordinate.
	 *
	 * @param column The column to search.
	 * @param row The row to search.
	 */
	getPixel(column: number, row: number): boolean {
		return ((this.data[row] >> (7 - column)) & 1) === 1 ? true : false;
	}

	/**
	 * Get the sprite data at a row.
	 *
	 * @param row The row to access.
	 */
	getRow(row: number): number {
		return this.data[row];
	}

	/**
	 * Get the sprite data.
	 */
	getData(): number[] {
		let data: number[] = new Array<number>();
		for (let row = 0; row < SpriteRegion.ROWS; ++row) {
			data.push(this.getRow(row));
		}
		return data;
	}

	shiftLeft(): void {
		this.horizontalShift(-1);
	}

	shiftRight(): void {
		this.horizontalShift(1);
	}

	shiftUp(): void {
		this.verticalShift(-1);
	}

	shiftDown(): void {
		this.verticalShift(1);
	}

	private horizontalShift(amount: number): void {
		if (amount === 0) {
			return;
		}

		for (let row: number = 0; row < SpriteRegion.ROWS; ++row) {
			if (amount > 0) {
				this.data[row] >>= amount;
			} else {
				this.data[row] <<= Math.abs(amount);
			}
		}
	}

	private verticalShift(amount: number): void {
		if (amount === 0) {
			return;
		}

		if (amount > 0) {
			// Shift down (+row)
			for (let row: number = SpriteRegion.ROWS - 1; row - amount >= 0; --row) {
				this.data[row] = this.data[row - amount];
			}
			for (let row: number = amount - 1; row >= 0; --row) {
				this.data[row] = 0;
			}
		} else {

			amount = Math.abs(amount);

			// Shift up (-row)
			for (let row: number = 0; row + amount < SpriteRegion.ROWS; ++row) {
				this.data[row] = this.data[row + amount];
			}
			for (let row: number = SpriteRegion.ROWS - amount; row < SpriteRegion.ROWS; ++row) {
				this.data[row] = 0;
			}
		}
	}
}
