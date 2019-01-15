//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Architecture from '../src/Architecture';
import Op from '../src/Op';
import OpCode from '../src/OpCode';
import OpMask from '../src/OpMask';
import Context from '../src/VMContext';

// ---------------------------------------------------------------------------------------------------------------------
const OP_CODE = 0xf300;
const OP_MASK = 0xff00;
const OP_P1 = 0x00f0;
const OP_P2 = 0x000f;
// ---------------------------------------------------------------------------------------------------------------------

abstract class TestArch extends Architecture {}

class TestOp extends Op<TestArch> {
	constructor(callback?) {
		super(
			OP_CODE,
			'NUL',
			new OpMask({
				mask: OP_MASK,
				p1: OP_P1,
				p2: OP_P2
			})
		);

		if (callback) {
			this.execute = callback;
		}
	}

	execute(context: Context<TestArch>, p1: OpCode, p2: OpCode): void {
		// This is overridden in the constructor.
	}
}

// ---------------------------------------------------------------------------------------------------------------------
describe('Op', () => {
	it('constructor', () => {
		let op = new TestOp();
		expect(op.opcode).toStrictEqual(OP_CODE);
		expect(op.asm).toStrictEqual('NUL');
		expect(op.mask.mask).toStrictEqual(OP_MASK);
		expect(op.mask.p1).toStrictEqual(OP_P1);
		expect(op.mask.p2).toStrictEqual(OP_P2);
	});

	it('matches', () => {
		let op = new TestOp();
		expect(op.matches(OP_CODE)).toStrictEqual(true);
		expect(op.matches(OP_CODE | (0xffff & (OP_P1 | OP_P2)))).toStrictEqual(true);
		expect(op.matches(0x0000)).toStrictEqual(false);
	});

	it('decode', () => {
		let op = new TestOp();
		let ir = op.decode(0xf369);

		expect(ir[0]).toStrictEqual(op.execute);
		expect(ir[0].op).toStrictEqual(op);
		expect(ir[1]).toStrictEqual(0x6);
		expect(ir[2]).toStrictEqual(0x9);
	});

	it('execute', () => {
		let op = new TestOp(() => true);
		let ir = op.decode(0xf369);

		expect(ir[0](null, ir[1], ir[2])).toStrictEqual(true);
	});
});
