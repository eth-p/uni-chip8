//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import dom_ready from '@chipotle/web/dom_ready';
// YOUR CODE HERE

import SpriteRegion from './SpriteRegion';

function main(): void {
	let region: SpriteRegion = new SpriteRegion();
	let regionTable: HTMLTableElement = <HTMLTableElement>document.querySelector('#region');
	let output: HTMLTextAreaElement = <HTMLTextAreaElement>document.querySelector('#output');

	output.readOnly = true;

	regionTable.addEventListener('click', e => {
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
			if (output !== null) {
				output.value = region.getData().toString();
			}
		}
	});
}

dom_ready(main);
