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
	it('dxyn', async () => {
		let vm = await createVM([0xd001]);

		if (vm.program.data != null && vm.display != null) {
			let sprite_location: number = 0x500;
			let sprite_coordinate: number = 0x1;
			vm.program.data[sprite_location] = 0x80; // Single dot
			vm.register_index = sprite_location;
			vm.register_data[0] = sprite_coordinate;

			// Test single dot
			vm.step();
			for (let y: number = 0; y < vm.display.HEIGHT; ++y) {
				for (let x: number = 0; x < vm.display.WIDTH; ++x) {
					let expected_state: boolean = x === sprite_coordinate && y === sprite_coordinate;
					expect(vm.display.get(x, y)).toStrictEqual(expected_state);
				}
			}

			vm.jump(0x200);

			// Test dot undraw
			vm.step();
			expect(vm.register_flag).toStrictEqual(1);
			for (let y: number = 0; y < vm.display.HEIGHT; ++y) {
				for (let x: number = 0; x < vm.display.WIDTH; ++x) {
					let expected_state: boolean = false;
					expect(vm.display.get(x, y)).toStrictEqual(expected_state);
				}
			}
		}
	});
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
	it('fx18', async () => {
		let vm = await createVM([0xf018]);
		let target: number = randomNumber(0xff);
		vm.register_data[0] = target;
		vm.step();
		expect(vm.register_sound).toStrictEqual(target);
	});
	it('fx1e', async () => {
		let vm = await createVM([0xf01e]);
		let target = randomNumber(0xff);
		vm.register_data[0] = target;
		vm.register_index = 0x0;
		vm.step();
		expect(vm.register_index).toStrictEqual(target);
	});
	it('fx29', async () => {});
	it('fx33', async () => {
		let vm = await createVM([0xf033]);
		if (vm.program.data != null) {
			let num: number = randomNumber(0xff);
			let i_location = 0x500;
			vm.register_data[0] = num;
			vm.register_index = i_location;
			vm.step();
			expect(vm.program.data[i_location]).toStrictEqual(Math.floor(num / 100));
			expect(vm.program.data[i_location + 1]).toStrictEqual(Math.floor(num / 10) % 10);
			expect(vm.program.data[i_location + 2]).toStrictEqual(num % 10);
		}
	});
	it('fx55', async () => {
		let nums: number[] = new Array<number>();
		for (let i = 0; i < 16; ++i) {
			nums.push(randomNumber(0xff));
		}

		let vm = await createVM([0xff55]);
		let index_location = 0x500;
		vm.register_index = index_location;
		for (let i = 0; i < 16; ++i) {
			vm.register_data[i] = nums[i];
		}

		if (vm.program.data != null) {
			vm.step();

			for (let i = 0; i < 16; ++i) {
				expect(vm.program.data[index_location + i]).toStrictEqual(nums[i]);
			}
		}
	});
	it('fx65', async () => {
		let nums: number[] = new Array<number>();
		for (let i = 0; i < 16; ++i) {
			nums.push(randomNumber(0xff));
		}

		let vm = await createVM([0xff65]);
		let index_location = 0x500;
		vm.register_index = index_location;

		if (vm.program.data != null) {
			for (let i = 0; i < 16; ++i) {
				vm.program.data[index_location + i] = nums[i];
			}

			vm.step();

			for (let i = 0; i < 16; ++i) {
				expect(vm.register_data[i]).toStrictEqual(nums[i]);
			}
		}
	});
});
