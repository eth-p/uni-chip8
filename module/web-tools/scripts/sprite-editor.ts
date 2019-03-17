//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import dom_ready from '@chipotle/web/dom_ready';
// YOUR CODE HERE

import SpriteRegion from './SpriteRegion';

function render(spriteRegion: SpriteRegion, table: HTMLTableElement) {
	if (table !== null) {
		for (let row = 0; row < table.rows.length; ++row) {
			let tableRow: HTMLTableRowElement = table.rows[row];
			for (let column: number = 0; column < tableRow.cells.length; ++column) {
				let tableData: HTMLTableDataCellElement = tableRow.cells[column];
				if (spriteRegion.getPixel(column, row)) {
					tableData.classList.add('on');
					tableData.classList.remove('off');
				} else {
					tableData.classList.add('off');
					tableData.classList.remove('on');
				}
			}
		}
	}
}

function updateDataOutput(spriteRegion: SpriteRegion, output: HTMLTextAreaElement) {
	if (output !== null) {
		output.value = spriteRegion.getData().toString();
	}
}

function main(): void {
	let region: SpriteRegion = new SpriteRegion();
	let regionTable: HTMLTableElement = <HTMLTableElement>document.querySelector('#region');
	let output: HTMLTextAreaElement = <HTMLTextAreaElement>document.querySelector('#output');

	let shiftUpButton: HTMLButtonElement = <HTMLButtonElement>document.querySelector('#btn-shift-up');
	let shiftDownButton: HTMLButtonElement = <HTMLButtonElement>document.querySelector('#btn-shift-down');
	let shiftLeftButton: HTMLButtonElement = <HTMLButtonElement>document.querySelector('#btn-shift-left');
	let shiftRightButton: HTMLButtonElement = <HTMLButtonElement>document.querySelector('#btn-shift-right');
	let renderAlignButton: HTMLButtonElement = <HTMLButtonElement>document.querySelector('#btn-render-align');
	let clearButton: HTMLButtonElement = <HTMLButtonElement>document.querySelector('#btn-clear');

	render(region, regionTable);
	updateDataOutput(region, output);

	if (shiftUpButton) {
		shiftUpButton.addEventListener('click', ev => {
			region.shiftUp();
			render(region, regionTable);
			updateDataOutput(region, output);
		});
	}

	if (shiftDownButton) {
		shiftDownButton.addEventListener('click', ev => {
			region.shiftDown();
			render(region, regionTable);
			updateDataOutput(region, output);
		});
	}

	if (shiftLeftButton) {
		shiftLeftButton.addEventListener('click', ev => {
			region.shiftLeft();
			render(region, regionTable);
			updateDataOutput(region, output);
		});
	}

	if (shiftRightButton) {
		shiftRightButton.addEventListener('click', ev => {
			region.shiftRight();
			render(region, regionTable);
			updateDataOutput(region, output);
		});
	}

	if (renderAlignButton) {
		renderAlignButton.addEventListener('click', ev => {
			region.renderAlign();
			render(region, regionTable);
			updateDataOutput(region, output);
		});
	}

	if (clearButton) {
		clearButton.addEventListener('click', ev => {
			region.clear();
			render(region, regionTable);
			updateDataOutput(region, output);
		});
	}
	output.readOnly = true;

	regionTable.addEventListener('click', e => {
		if (e.button !== 0) {
			return;
		}
		
		let tableData: HTMLTableDataCellElement = <HTMLTableDataCellElement>e.target;
		let tableRow: HTMLTableRowElement = <HTMLTableRowElement>tableData.closest('tr');

		if (tableRow && tableData) {
			let column: number = tableData.cellIndex;
			let row: number = tableRow.rowIndex;
			let isOn: boolean = tableData.classList.contains('on');

			if (isOn) {
				tableData.classList.add('off');
				tableData.classList.remove('on');
			} else {
				tableData.classList.add('on');
				tableData.classList.remove('off');
			}

			isOn = !isOn;

			region.setPixel(column, row, isOn);
			updateDataOutput(region, output);
		}
	});
}

dom_ready(main);
