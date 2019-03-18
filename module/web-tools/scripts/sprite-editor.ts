//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import dom_ready from '@chipotle/web/dom_ready';

import SpriteRegion from './SpriteRegion';
import {OutputType, OutputState} from './OutputState';
//! --------------------------------------------------------------------------------------------------------------------

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

function updateDataOutput(spriteRegion: SpriteRegion, output: HTMLTextAreaElement, outputType: OutputState) {
	if (spriteRegion !== null && output !== null) {
		if (outputType.state === OutputType.Unknown) {
			return;
		}

		let rows: number[] = spriteRegion.getData();
		let outputString: string = '';
		let prefix: string = '';
		let base: number = 10;

		switch (outputType.state) {
			case OutputType.Hexadecimal:
				prefix = '0x';
				base = 16;
				break;
			case OutputType.Binary:
				prefix = '0b';
				base = 2;
				break;
			default:
				break;
		}

		if (!outputType.enablePrefix) {
			prefix = '';
		}

		for (let i: number = 0; i < rows.length; ++i) {
			outputString += `${prefix}${rows[i].toString(base)}`;
			if (i < rows.length - 1) {
				outputString += ', ';
			}
		}

		output.value = outputString;
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

	let setHexOut: HTMLInputElement = <HTMLInputElement>document.querySelector('#set-hex-out');
	let setDecOut: HTMLInputElement = <HTMLInputElement>document.querySelector('#set-dec-out');
	let setBinOut: HTMLInputElement = <HTMLInputElement>document.querySelector('#set-bin-out');
	let enablePrefix: HTMLInputElement = <HTMLInputElement>document.querySelector('#enable-prefix');

	let outputState: OutputState = new OutputState();
	outputState.enablePrefix = enablePrefix!.checked;
	outputState.state = OutputType.Hexadecimal;

	render(region, regionTable);
	updateDataOutput(region, output, outputState);

	if (setHexOut) {
		setHexOut.addEventListener('change', ev => {
			if (setHexOut.checked) {
				outputState.state = OutputType.Hexadecimal;
				updateDataOutput(region, output, outputState);
			}
		});
	}

	if (setDecOut) {
		setDecOut.addEventListener('change', ev => {
			if (setDecOut.checked) {
				outputState.state = OutputType.Decimal;
				updateDataOutput(region, output, outputState);
			}
		});
	}

	if (setBinOut) {
		setBinOut.addEventListener('change', ev => {
			if (setBinOut.checked) {
				outputState.state = OutputType.Binary;
				updateDataOutput(region, output, outputState);
			}
		});
	}

	if (enablePrefix) {
		enablePrefix.addEventListener('change', ev => {
			outputState.enablePrefix = enablePrefix.checked;
			updateDataOutput(region, output, outputState);
		});
	}

	if (shiftUpButton) {
		shiftUpButton.addEventListener('click', ev => {
			region.shiftUp();
			render(region, regionTable);
			updateDataOutput(region, output, outputState);
		});
	}

	if (shiftDownButton) {
		shiftDownButton.addEventListener('click', ev => {
			region.shiftDown();
			render(region, regionTable);
			updateDataOutput(region, output, outputState);
		});
	}

	if (shiftLeftButton) {
		shiftLeftButton.addEventListener('click', ev => {
			region.shiftLeft();
			render(region, regionTable);
			updateDataOutput(region, output, outputState);
		});
	}

	if (shiftRightButton) {
		shiftRightButton.addEventListener('click', ev => {
			region.shiftRight();
			render(region, regionTable);
			updateDataOutput(region, output, outputState);
		});
	}

	if (renderAlignButton) {
		renderAlignButton.addEventListener('click', ev => {
			region.align();
			render(region, regionTable);
			updateDataOutput(region, output, outputState);
		});
	}

	if (clearButton) {
		clearButton.addEventListener('click', ev => {
			region.clear();
			render(region, regionTable);
			updateDataOutput(region, output, outputState);
		});
	}

	regionTable.addEventListener('click', e => {
		if (e.button !== 0 || e.target == null) {
			return;
		}

		let target = <HTMLElement>e.target!;
		if (target.parentNode != null && target.parentNode.nodeName === 'TD') {
			target = <HTMLTableCellElement>target.parentNode;
		}

		let tableData: HTMLTableDataCellElement = <HTMLTableDataCellElement>target;
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
			updateDataOutput(region, output, outputState);
		}
	});
}

dom_ready(main);
