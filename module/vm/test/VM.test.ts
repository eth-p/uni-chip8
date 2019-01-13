// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Team Chipotle
// MIT License
// ---------------------------------------------------------------------------------------------------------------------
import VM from '../src/VM';
import Uint8 from '../../types/src/Uint8';
import Uint16 from '../../types/src/Uint16';

describe('VM', () => {
	it('Load and fetch opcodes', () => {
		let test_vm: VM = new VM();
		let test_opcodes: Array<Uint8> = new Array<Uint8>();

		for (let opcode: Uint16 = 0; opcode < 1000; ++opcode) {
			test_opcodes.push(opcode);
		}

		for (let i: number = 0; i < test_opcodes.length; ++i) {
			test_vm.loadOpcode(0x200 + 2 * i, test_opcodes[i]);
		}

		for (let i: number = 0; i < test_opcodes.length; ++i) {
			expect(test_vm.fetchOpcode(0x200 + 2 * i)).toEqual(test_opcodes[i]);
		}
	});
});
