//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import {toHexString as u16_toHexString} from '@chipotle/types/Uint16';
import {Instruction} from '@chipotle/isa/Instruction';

import UIAnimator from '@chipotle/web/UIAnimator';
import dom_ready from '@chipotle/web/dom_ready';

import settings from './settings';
import {emulator, vm} from './instance';
import Operation from '@chipotle/isa/Operation';
import OperandTags from '@chipotle/isa/OperandTags';
import OperandType from '@chipotle/isa/OperandType';
// ---------------------------------------------------------------------------------------------------------------------
// Constants:
// ---------------------------------------------------------------------------------------------------------------------
const DISASSEMBLE_OPS_BEFORE = 4;
const DISASSEMBLE_OPS_AFTER = 8;
// ---------------------------------------------------------------------------------------------------------------------
// Variables:
// ---------------------------------------------------------------------------------------------------------------------
let animator: UIAnimator<any>;
let element: HTMLElement;

let display_ops_addresses: HTMLElement[];
let display_ops_asm: HTMLElement[];
let cache: Map<Instruction, string>;

// ---------------------------------------------------------------------------------------------------------------------
// Exports:
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Refreshes the component display.
 * This should be called during requestAnimationFrame.
 */
export function refresh() {
	if (!settings.show_disassembler) return;

	let start = vm.program_counter - DISASSEMBLE_OPS_BEFORE * 2;
	let max = DISASSEMBLE_OPS_BEFORE + 1 + DISASSEMBLE_OPS_AFTER;
	let eof = vm.program.data == null ? 0 : vm.program.data.length;

	for (let i = 0; i < max; i++) {
		let addr = start + i * 2;
		let display_address = display_ops_addresses[i];
		let display_asm = display_ops_asm[i];

		// Not a real address.
		if (addr < 0 || addr >= eof) {
			display_address.textContent = '----';
			display_asm.textContent = '';
			continue;
		}

		// A real address.
		display_address.textContent = u16_toHexString(addr);
		display_asm.textContent = getInstructionASM(vm.program.fetch(addr));
	}
}

/**
 * Hides the component.
 */
export function hide(): void {
	setVisible(true);
}

/**
 * Shows the component.
 */
export function show(): void {
	setVisible(false);
}

/**
 * Sets the visibility of the component.
 * @param visible True if the component should be visible.
 */
export function setVisible(visible: boolean): void {
	if (element == null) {
		setTimeout(() => setVisible(visible), 10);
		return;
	}

	if (visible) {
		animator.setCriteria('visible', true);
		element.classList.remove('hide');
	} else {
		animator.setCriteria('visible', false);
		element.classList.add('hide');
	}
}

// ---------------------------------------------------------------------------------------------------------------------
// Functions:
// ---------------------------------------------------------------------------------------------------------------------

type IR = {
	operation: Operation;
	operands: Instruction[];
};

/**
 * Gets the assembly representation of an instruction.
 * Invalid opcodes are denoted by `.data [ABCD]`.
 *
 * @param instruction The instruction code.
 *
 * @returns The assembly representation.
 */
function getInstructionASM(instruction: Instruction): string {
	let cached = cache.get(instruction);
	if (cached != null) return cached;

	let ir = vm.decode(instruction);
	let asm = disassembleInstruction(instruction, ir);
	cache.set(instruction, asm);
	return asm;
}

/**
 * Disassembles an instruction into assembly code.
 *
 * @param instruction The instruction code.
 * @param ir The instruction IR.
 *
 * @returns The assembly representation.
 */
function disassembleInstruction(instruction: Instruction, ir: IR | undefined): string {
	if (ir === undefined) {
		return `.data ${u16_toHexString(instruction)}`;
	}

	let operands = ir.operation.operands;
	let operandValues = ir.operands;
	let asmops = new Array(operands.length);

	for (let i = 0, n = operands.length; i < n; i++) {
		let operand = operands[i];
		let asm: string | null = operand.tags != null ? operand.tags.get(OperandTags.IS_EXACT) : null;

		if (asm == null) {
			switch (operand.type) {
				case OperandType.REGISTER: {
					asm = `V${operandValues[i].toString(16).toUpperCase()}`;
					break;
				}

				case OperandType.CONSTANT: {
					asm = `${operandValues[i]}`;
					break;
				}

				case OperandType.ROM_ADDRESS:
				case OperandType.RAM_ADDRESS: {
					asm = `${u16_toHexString(operandValues[i])}h`;
					break;
				}

				default:
					throw new Error('UNIMPLEMENTED OPERAND TYPE DISASSEMBLER');
			}
		}

		asmops[i] = asm;
	}

	return `${ir.operation.mnemonic} ${asmops.join(', ')}`;
}

// ---------------------------------------------------------------------------------------------------------------------
// Setup:
// ---------------------------------------------------------------------------------------------------------------------
dom_ready(() => {
	element = <HTMLElement>document.querySelector('#emulator-disassembler')!;
	display_ops_asm = [];
	display_ops_addresses = [];
	cache = new Map();

	// Create display elements.
	let container = <HTMLElement>element.querySelector('.program-visualizer');
	let template = <HTMLElement>element.querySelector('.program-op.template');
	for (let i = 0, n = DISASSEMBLE_OPS_BEFORE + 1 + DISASSEMBLE_OPS_AFTER; i < n; i++) {
		let copy = <HTMLElement>template.cloneNode(true);
		copy.classList.remove('template');
		if (i === DISASSEMBLE_OPS_BEFORE) copy.classList.add('current');

		// Set text.
		let addr = <HTMLElement>copy.querySelector('.program-op-index');
		let display = <HTMLElement>copy.querySelector('.program-op-value');
		addr.textContent = '----';
		display.textContent = '';

		// Add display.
		display_ops_addresses.push(addr);
		display_ops_asm.push(display);
		container.appendChild(copy);
	}

	// Setup animator.
	animator = new UIAnimator(refresh, {visible: false, debugging: false, running: false});
	animator.resume();
});

settings.addListener('update', (setting, value) => {
	if (setting === 'show_disassembler') {
		setVisible(value);
		return;
	}

	if (setting === 'enable_debugger') {
		animator.setCriteria('debugging', value);
	}
});

emulator.addListener('load', () => {
	cache.clear();
});

emulator.addListener('step', () => {
	animator.run();
});

emulator.addListener('reset', () => {
	animator.run();
});

emulator.addListener('pause', () => {
	animator.setCriteria('running', false);
});

emulator.addListener('resume', () => {
	animator.setCriteria('running', true);
});
