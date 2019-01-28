//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
// import VM from '@chipotle/vm/VM';
import VM from '../../vm/src/VM';

import Chip from '../src/Chip';

//! --------------------------------------------------------------------------------------------------------------------
/**
 * Creates a CHIP-8 virtual machine for testing.
 */
function createVM(): VM<Chip> {
	return new VM(new Chip());
}

describe('Operation Codes', () => {
	let x: VM<Chip> = createVM();
	// x.

	it('00e0', () => {
		// CLS
	});
	it('00ee', () => {
		// RET
	});
	it('0nnn', () => {
		// SYS addr
	});
	it('1nnn', () => {
		// JP addr
	});
	it('2nnn', () => {
		// CALL addr
	});
	it('3xkk', () => {});
	it('4xkk', () => {});
	it('5xy0', () => {});
	it('6xkk', () => {});
	it('7xkk', () => {});
	it('8xy0', () => {});
	it('8xy1', () => {});
	it('8xy2', () => {});
	it('8xy3', () => {});
	it('8xy4', () => {});
	it('8xy5', () => {});
	it('8xy6', () => {});
	it('8xy7', () => {});
	it('8xye', () => {});
	it('9xy0', () => {});
	it('annn', () => {});
	it('bnnn', () => {});
	it('cxkk', () => {});
	it('dxyn', () => {});
	it('ex9e', () => {});
	it('exa1', () => {});
	it('fx07', () => {});
	it('fx0a', () => {});
	it('fx15', () => {});
	it('fx18', () => {});
	it('fx1e', () => {});
	it('fx29', () => {});
	it('fx33', () => {});
	it('fx55', () => {});
	it('fx65', () => {});
});
