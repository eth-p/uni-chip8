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

	private spriteData: boolean[];

	constructor() {
		this.spriteData = new Array<boolean>(SpriteRegion.COLUMNS * SpriteRegion.ROWS);
		this.spriteData.fill(false);
	}

	/**
	 * Set the pixel at a coordinate.
	 *
	 * @param column The column to set.
	 * @param row The row to set.
	 * @param state The state the pixel will take.
	 */
	setPixel(column: number, row: number, state: boolean): void {
		this.spriteData[SpriteRegion.convertCoordinateToIndex(column, row)] = state;
	}

	/**
	 * Get the pixel at a coordinate.
	 *
	 * @param column The column to search.
	 * @param row The row to search.
	 */
	getPixel(column: number, row: number): boolean {
		return this.spriteData[SpriteRegion.convertCoordinateToIndex(column, row)];
	}

	/**
	 * Get the sprite data at a row.
	 *
	 * @param row The row to access.
	 */
	getRow(row: number): number {
		let accumulator: number = 0;
		for (let column: number = 0; column < SpriteRegion.COLUMNS; ++column) {
			let pixelState: boolean = this.getPixel(column, row);
			let allowAccumulate = pixelState ? 1 : 0;
			accumulator += allowAccumulate * Math.pow(2, SpriteRegion.COLUMNS - 1 - column);
		}
		return accumulator;
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

	/**
	 * Convert a coordinate into a one-dimensional index.
	 *
	 * @param column The column to convert.
	 * @param row The row to convert.
	 */
	private static convertCoordinateToIndex(column: number, row: number): number {
		return row * SpriteRegion.COLUMNS + column;
	}
}
