//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Architecture from '../src/Architecture';
import Op from '../src/Op';
import OpCode from '../src/OpCode';
import OpMask from '../src/OpMask';
import OpCache from '../src/OpCache';
import Context from '../src/VMContext';

// ---------------------------------------------------------------------------------------------------------------------

abstract class TestArch extends Architecture<TestArch> {}

class TestOp extends Op<TestArch> {
	static OPCODE = 0xa000;

	constructor() {
		super(
			TestOp.OPCODE,
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

// ---------------------------------------------------------------------------------------------------------------------
describe('OpCache', () => {
	it('constructor', () => {
		let opcache = new OpCache<TestArch>();
	});

	it('put', () => {
		let opcache = new OpCache<TestArch>();
		let op = new TestOp();
		let ir = op.decode(TestOp.OPCODE);
		opcache.put(TestOp.OPCODE, ir);
	});

	it('get', () => {
		let opcache = new OpCache<TestArch>();
		let op = new TestOp();
		let ir = op.decode(TestOp.OPCODE);
		opcache.put(TestOp.OPCODE, ir);
		expect(opcache.get(TestOp.OPCODE)).toStrictEqual(ir);
		expect(opcache.get(0x0000)).toStrictEqual(<any>null);
	});

	it('invalidate', () => {
		let opcache = new OpCache<TestArch>();
		let op = new TestOp();
		let ir = op.decode(TestOp.OPCODE);
		opcache.put(TestOp.OPCODE, ir);
		opcache.invalidate(TestOp.OPCODE);
		expect(opcache.get(TestOp.OPCODE)).toStrictEqual(<any>null);
	});

	it('invalidateAll', () => {
		let opcache = new OpCache<TestArch>();
		let op = new TestOp();
		let ir = op.decode(TestOp.OPCODE);
		opcache.put(TestOp.OPCODE, ir);
		opcache.invalidateAll();
		expect(opcache.get(TestOp.OPCODE)).toStrictEqual(<any>null);
	});
});
