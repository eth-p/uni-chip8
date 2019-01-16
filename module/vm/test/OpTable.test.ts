//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Architecture from '../src/Architecture';
import Op from '../src/Op';
import OpCache from '../src/OpCache';
import OpCode from '../src/OpCode';
import OpMask from '../src/OpMask';
import OpTable from '../src/OpTable';
import Context from '../src/VMContext';

// ---------------------------------------------------------------------------------------------------------------------

abstract class TestArch extends Architecture<TestArch> {}

class TestOpAlpha extends Op<TestArch> {
	constructor() {
		super(
			0xa000,
			'ALPHA',
			new OpMask({
				mask: 0xf000,
				p1: 0x0000,
				p2: 0x0000
			})
		);
	}

	execute(context: Context<TestArch>, p1: OpCode, p2: OpCode): void {}
}

class TestOpBeta extends Op<TestArch> {
	constructor() {
		super(
			0xb000,
			'BETA',
			new OpMask({
				mask: 0xf000,
				p1: 0x0000,
				p2: 0x0000
			})
		);
	}

	execute(context: Context<TestArch>, p1: OpCode, p2: OpCode): void {}
}

class TestOpGamma extends Op<TestArch> {
	constructor() {
		super(
			0xd900,
			'GAMMA',
			new OpMask({
				mask: 0xff00,
				p1: 0x00f0,
				p2: 0x000f
			})
		);
	}

	execute(context: Context<TestArch>, p1: OpCode, p2: OpCode): void {}
}

class TestOpDelta extends Op<TestArch> {
	constructor() {
		super(
			0xd000,
			'GAMMA',
			new OpMask({
				mask: 0xf000,
				p1: 0x0000,
				p2: 0x0000
			})
		);
	}

	execute(context: Context<TestArch>, p1: OpCode, p2: OpCode): void {}
}

// ---------------------------------------------------------------------------------------------------------------------
describe('OpTable', () => {
	it('constructor', () => {
		let optable1 = new OpTable([TestOpAlpha, TestOpBeta, TestOpGamma]);
		expect(optable1.mask).toEqual(0xf000);
		expect(optable1.maskshift).toEqual(12);
		expect((<any>optable1).table[0xa].length).toEqual(1);
		expect((<any>optable1).table[0xb].length).toEqual(1);
		expect((<any>optable1).table[0xd].length).toEqual(1);

		let optable2 = new OpTable([TestOpGamma]);
		expect(optable2.mask).toEqual(0xff00);
		expect(optable2.maskshift).toEqual(8);
	});

	it('lookup', () => {
		let optable1 = new OpTable([TestOpAlpha, TestOpBeta, TestOpDelta, TestOpGamma]);
		expect(optable1.lookup(0xa000).opcode).toEqual(0xa000);
		expect(optable1.lookup(0xaf01).opcode).toEqual(0xa000);
		expect(optable1.lookup(0xb000).opcode).toEqual(0xb000);
		expect(optable1.lookup(0xbf01).opcode).toEqual(0xb000);
		expect(optable1.lookup(0xd901).opcode).toEqual(0xd900);
		expect(optable1.lookup(0xd800).opcode).toEqual(0xd000);
		expect(() => optable1.lookup(0xf001)).toThrow();
	});

	it('decode', () => {
		let optable1 = new OpTable([TestOpAlpha]);
		let opcode = 0xa000;
		let ir = optable1.lookup(opcode).decode(opcode);
		expect(optable1.decode(opcode)).toEqual(ir);
	});

	it('decode (with cache)', () => {
		let optable1 = new OpTable([TestOpAlpha], new OpCache<TestArch>());
		let opcode = 0xa000;
		expect(optable1.decode(opcode)).toStrictEqual(optable1.decode(opcode));
	});
});
