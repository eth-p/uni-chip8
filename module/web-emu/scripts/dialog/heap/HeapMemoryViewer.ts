//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import {toHexString} from '@chipotle/types/Uint16';
import {toHexString as toHexString8} from '@chipotle/types/Uint8';

import Program from '@chipotle/vm/Program';

// ---------------------------------------------------------------------------------------------------------------------

/**
 * The class for viewing the program heap.
 */
class HeapMemoryViewer {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	protected program: Program<unknown>;
	protected content: HTMLElement;
	protected cells: HTMLElement[];

	// -------------------------------------------------------------------------------------------------------------
	// | Constructors:                                                                                             |
	// -------------------------------------------------------------------------------------------------------------

	public constructor(content: HTMLElement, program: Program<unknown>) {
		this.cells = [];
		this.content = content;
		this.program = program;
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Generates the memory viewer cells.
	 * This is a very slow operation.
	 */
	public generate(): void {
		// Clear out old cells.
		while (this.content.firstChild != null) this.content.removeChild(this.content.firstChild);
		this.cells = [];

		if (this.program.data == null) return;

		// Generate new cells.
		let row = null;
		const end = this.program.data.length;
		for (let byte = 0; byte < end; byte++) {
			// Generate new row.
			if (byte % 16 === 0) {
				row = document.createElement('div');
				row.classList.add('memory-row');
				this.content.appendChild(row);

				const rowIndex = document.createElement('div');
				rowIndex.textContent = toHexString(Math.floor(byte / 0x10) * 0x10);
				row.appendChild(rowIndex);
			}

			// Generate new cell and add to row.
			const element = document.createElement('div');
			element.textContent = '??';
			row!.appendChild(element);
			this.cells.push(element);
		}
	}

	/**
	 * Refreshes the memory viewer.
	 * This is a very slow operation.
	 */
	public refresh(): void {
		if (this.program.data == null) return;

		const end = this.program.data.length;
		const data = this.program.data;
		for (let byte = 0; byte < end; byte++) {
			const cell = this.cells[byte];
			const value = data[byte];

			cell.textContent = toHexString8(value);
			cell.classList[value === 0 ? 'add' : 'remove']('zero');
		}
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default HeapMemoryViewer;
export {HeapMemoryViewer};
