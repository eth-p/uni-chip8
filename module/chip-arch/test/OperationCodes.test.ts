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
async function createVM(ops: number[]) {
	let prog = new Uint8Array(ops.length * 2);
	let vm = new VM(new Chip());

	for (let i = 0; i < ops.length; i++) {
		prog[2 * i + 0] = (ops[i] >> 8) & 0xff;
		prog[2 * i + 1] = (ops[i] >> 0) & 0xff;
	}

	await vm.program.load(prog);
	vm.reset();
	return vm;
}

function randomNumber(ceiling: number): number {
	return Math.floor(Math.random() * ceiling);
}

describe('Operation Codes', () => {
	it('00e0', async () => {
		// CLS
		let vm = await createVM([0x00e0]);
		for (let y = 0; y < vm.display.HEIGHT; ++y) {
			for (let x = 0; x < vm.display.WIDTH; ++x) {
				let state: boolean = randomNumber(100) % 2 === 0;
				vm.display.set(x, y, state);
			}
		}
		vm.step();
		for (let y = 0; y < vm.display.HEIGHT; ++y) {
			for (let x = 0; x < vm.display.WIDTH; ++x) {
				expect(vm.display.get(x, y)).toStrictEqual(false);
			}
		}
	});
	it('00ee', async () => {
		// RET
	});
	it('0nnn', async () => {
		// SYS addr
		// Do literally nothing
		let vm = await createVM([0x0000]);
		vm.step();

		// Make sure nothing changed
		for (let i: number = 0; i <= 0xf; ++i) {
			expect(vm.register_data[i]).toStrictEqual(0);
		}
		for (let y = 0; y < vm.display.HEIGHT; ++y) {
			for (let x = 0; x < vm.display.WIDTH; ++x) {
				expect(vm.display.get(x, y)).toStrictEqual(false);
			}
		}
		expect(vm.stack.inspect.length).toStrictEqual(0);
		expect(vm.program_counter).toStrictEqual(0x202);
	});
	it('1nnn', async () => {
		// JP addr
		let x = await createVM([0x1204, 0x0000, 0x0000]);
		x.step();

		// Skip 0x202
		expect(x.program_counter).toStrictEqual(0x204);
	});
	it('2nnn', async () => {
		// CALL addr
		let program: number[] = [0x2204, 0x0000, 0x0000];
		let vm = await createVM(program);
		vm.step();
		expect(vm.program_counter).toStrictEqual(0x204);
		expect(vm.stack.inspect().length).toStrictEqual(1);
		expect(vm.stack.top()).toStrictEqual(0x200);
	});
	it('3xkk', async () => {
		// SE <reg> <con>
		let vm = await createVM([0x30aa, 0x1206, 0x0000, 0x0000]);

		// Test TRUE
		vm.register_data[0] = 0xaa;
		vm.step();
		expect(vm.program_counter).toStrictEqual(0x204);

		// Test FALSE
		vm.register_data[0] = 0xab;
		vm.jump(0x200);
		vm.step();
		expect(vm.program_counter).toStrictEqual(0x202);
	});
	it('4xkk', async () => {
		// SNE <reg> <con>
		let vm = await createVM([0x40aa, 0x1206, 0x0000, 0x0000]);

		// Test TRUE
		vm.register_data[0] = 0xaa;
		vm.step();
		expect(vm.program_counter).toStrictEqual(0x202);

		// Test FALSE
		vm.register_data[0] = 0xab;
		vm.jump(0x200);
		vm.step();
		expect(vm.program_counter).toStrictEqual(0x204);
	});
	it('5xy0', async () => {
		// SE <reg> <reg>
		let vm = await createVM([0x5010, 0x1206, 0x0000, 0x0000]);
		vm.register_data[0] = 0xaa;
		vm.register_data[1] = 0xaa;
		vm.step();

		// Test TRUE
		expect(vm.program_counter).toStrictEqual(0x204);

		// Test FALSE
		vm.register_data[0] = 0xab;
		vm.jump(0x200);
		vm.step();
		expect(vm.program_counter).toStrictEqual(0x202);
	});
	it('6xkk', async () => {
		// LD <reg> <con>
		let vm = await createVM([0x6aaa]);
		vm.step();
		expect(vm.register_data[0xa]).toStrictEqual(0xaa);
	});
	it('7xkk', async () => {
		// ADD <reg> <con>
		let vm = await createVM([0x7001]);
		vm.register_data[0] = 0xf0;
		vm.step();
		expect(vm.register_data[0]).toStrictEqual(0xf1);
	});
	it('8xy0', async () => {
		// LD <reg> <reg>
		let vm = await createVM([0x8ab0]);
		let target = randomNumber(0xff);
		vm.register_data[0xa] = 0;
		vm.register_data[0xb] = target;
		vm.step();
		expect(vm.register_data[0xa]).toStrictEqual(target);
	});
	it('8xy1', async () => {
		// OR <reg> <reg>
		let vm = await createVM([0x8ab1]);
		let x = randomNumber(0xff);
		let y = randomNumber(0xff);
		let target = x | y;
		vm.register_data[0xa] = x;
		vm.register_data[0xb] = y;
		vm.step();
		expect(vm.register_data[0xa]).toStrictEqual(target);
		expect(vm.register_data[0xb]).toStrictEqual(y);
	});
	it('8xy2', async () => {
		// AND <reg> <reg>
		let vm = await createVM([0x8ab2]);
		let x = randomNumber(0xff);
		let y = randomNumber(0xff);
		let target = x & y;
		vm.register_data[0xa] = x;
		vm.register_data[0xb] = y;
		vm.step();
		expect(vm.register_data[0xa]).toStrictEqual(target);
		expect(vm.register_data[0xb]).toStrictEqual(y);
	});
	it('8xy3', async () => {
		// XOR <reg> <reg>
		let vm = await createVM([0x8ab3]);
		let x = randomNumber(0xff);
		let y = randomNumber(0xff);
		let target = x ^ y;
		vm.register_data[0xa] = x;
		vm.register_data[0xb] = y;
		vm.step();
		expect(vm.register_data[0xa]).toStrictEqual(target);
		expect(vm.register_data[0xb]).toStrictEqual(y);
	});
	it('8xy4', async () => {
		// ADD <reg> <reg>
		let vm = await createVM([0x8ab4, 0x8cb4]);
		vm.register_data[0xa] = 0xa;
		vm.register_data[0xb] = 1;
		vm.register_data[0xc] = 0xff;

		// Test 1: Check add
		vm.step();
		expect(vm.register_data[0xa]).toStrictEqual(0xb);
		expect(vm.register_data[0xb]).toStrictEqual(1);
		expect(vm.register_data[0xf]).toStrictEqual(0);

		// Test 2: Check carry
		vm.step();
		expect(vm.register_data[0xf]).toStrictEqual(1);
		expect(vm.register_data[0xb]).toStrictEqual(1);
	});
	it('8xy5', async () => {
		// SUB <reg> <reg>
		let vm = await createVM([0x8035, 0x8135, 0x8235]);
		vm.register_data[0] = 0x9;
		vm.register_data[1] = 0xa;
		vm.register_data[0x2] = 0xb;
		vm.register_data[0x3] = 0xa;
		// Test 1: Check Vx < Vy
		vm.step();
		expect(vm.register_flag).toStrictEqual(0);

		// Test 2: Check Vx == Vy
		vm.step();
		expect(vm.register_data[1]).toStrictEqual(0);
		expect(vm.register_flag).toStrictEqual(1);

		// Test 3: Check Vx > Vy
		vm.step();
		expect(vm.register_data[0x2]).toStrictEqual(1);
		expect(vm.register_flag).toStrictEqual(1);
	});
	it('8xy6', async () => {
		// SHR <reg>
		let vm = await createVM([0x8006, 0x8106]);
		vm.register_data[0] = 0x2;
		vm.register_data[1] = 0x4;
		vm.step();
		vm.step();
		expect(vm.register_data[0]).toStrictEqual(1);
		expect(vm.register_data[1]).toStrictEqual(0x2);
	});
	it('8xy7', async () => {
		// SUBN <reg> <reg>
		let vm = await createVM([0x8017, 0x8217]);
		vm.register_data[0] = 0x9;
		vm.register_data[1] = 0xa;
		vm.register_data[0x2] = 0xb;

		vm.step();
		expect(vm.register_data[0]).toStrictEqual(1);
		expect(vm.register_flag).toStrictEqual(1);

		vm.step();
		expect(vm.register_flag).toStrictEqual(0);
	});
	it('8xye', async () => {
		// SHL <reg>
		let vm = await createVM([0x810e, 0x800e]);
		vm.register_data[0] = 0x81;
		vm.register_data[1] = 0x2;

		// Test shift left
		vm.step();
		expect(vm.register_data[1]).toStrictEqual(0x4);
		expect(vm.register_flag).toStrictEqual(0);

		// Test MSB preserve
		vm.step();
		expect(vm.register_data[0]).toStrictEqual(0x2);
		expect(vm.register_flag).toStrictEqual(1);
	});
	it('9xy0', async () => {
		// SNE <reg> <reg>

		// Test TRUE
		let vm = await createVM([0x9010, 0x1206, 0x0000, 0x0000]);
		vm.register_data[0] = 1;
		vm.register_data[1] = 2;
		vm.step();
		expect(vm.program_counter).toStrictEqual(0x204);

		// Test FALSE
		vm.jump(0x200);
		vm.register_data[0] = 2;
		vm.step();
		vm.step();
		expect(vm.program_counter).toStrictEqual(0x206);
	});
	it('annn', async () => {
		// LD I <addr>
		let vm = await createVM([0xacba]);
		vm.step();
		expect(vm.register_index).toStrictEqual(0xcba);
	});
	it('bnnn', async () => {
		// JP V0, <addr>
		let vm = await createVM([0xba00]);
		for (let n: number = 0; n < 0x100; ++n) {
			vm.register_data[0] = n;
			vm.step();
			expect(vm.program_counter).toStrictEqual(0xa00 + n);
			vm.jump(0x200);
		}
	});
	it('cxkk', async () => {
		// RND <reg> <con>
		// Test that masking works
		let vm = await createVM([0xc000, 0x0000]);

		for (let mask = 0; mask <= 0xff; ++mask) {
			if (vm.program.data !== null) {
				vm.program.data[0x200] = 0xc0;
				vm.program.data[0x201] = mask;
				vm.step();
				expect(vm.register_data[0] & ~mask).toStrictEqual(0);
				vm.jump(0x200);
			}
		}
	});
	it('dxyn', async () => {});
	it('ex9e', async () => {});
	it('exa1', async () => {});
	it('fx07', async () => {
		// LD <reg> DT
		let vm = await createVM([0xf007]);
		vm.register_timer = randomNumber(0xff);
		vm.step();
		expect(vm.register_data[0]).toStrictEqual(vm.register_timer);
	});
	it('fx0a', async () => {});
	it('fx15', async () => {
		// LD DT <reg>
		let vm = await createVM([0xf015]);
		vm.register_data[0] = randomNumber(0xff);
		vm.step();
		expect(vm.register_timer).toStrictEqual(vm.register_data[0]);
	});
	it('fx18', async () => {});
	it('fx1e', async () => {});
	it('fx29', async () => {});
	it('fx33', async () => {});
	it('fx55', async () => {});
	it('fx65', async () => {});
});
