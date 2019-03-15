//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Uint16 from '@chipotle/types/Uint16';

import Operation from '@chipotle/isa/Operation';
import OperandType from '@chipotle/isa/OperandType';
import InstructionCache from '@chipotle/isa/InstructionCache';
import Interpreted from '@chipotle/vm/Interpreted';

import Architecture from '../src/Architecture';
import Program from '../src/Program';
import ProgramSource from '../src/ProgramSource';
import VM from '../src/VM';
import VMContext from '../src/VMContext';
import VMInstructionSet from '../src/VMInstructionSet';
// ---------------------------------------------------------------------------------------------------------------------

enum TestStatus {
	NONE,
	CALLED_LOAD,
	CALLED_RESET,
	CALLED_TICK
}

class TestOp extends Operation implements Interpreted<Test> {
	constructor() {
		super('TEST', 0xf000, [
			{
				mask: 0x0fff,
				type: OperandType.CONSTANT
			}
		]);
	}

	public execute(context: VMContext<Test>, operands: Uint16[]): void {
		context.val = operands[0];
	}
}

class TestArbOp extends Operation implements Interpreted<Test> {
	private cb: (ctx: VMContext<Test>) => void;

	constructor(cb: (ctx: VMContext<Test>) => void) {
		super('TEST', 0x000f, [
			{
				mask: 0x0ff0,
				type: OperandType.CONSTANT
			}
		]);

		this.cb = cb;
		this.execute = this.execute.bind(this);
	}

	public execute(context: VMContext<Test>, operands: Uint16[]): void {
		this.cb(context);
	}
}

class Test extends Architecture<Test> {
	public status: TestStatus = TestStatus.NONE;
	public val: number = 0;

	public constructor(arbfn?: (ctx: VMContext<Test>) => void) {
		super(new VMInstructionSet([TestOp, <any>(arbfn ? new TestArbOp(arbfn) : null)].filter(x => x !== null)));
	}

	protected async _load(source: ProgramSource): Promise<Uint8Array | false> {
		this.status = TestStatus.CALLED_LOAD;
		return source;
	}

	protected _reset(): void {
		this.status = TestStatus.CALLED_RESET;
	}

	protected _tick(): void {
		this.status = TestStatus.CALLED_TICK;
	}

	protected _debugOption(option: string, value: any): void {}
}

// ---------------------------------------------------------------------------------------------------------------------
describe('VM', () => {
	it('constructor', () => {
		let testvm = new VM(new Test());
		expect(testvm.isa).toBeInstanceOf(VMInstructionSet);
		expect(testvm.isa.list.length).toStrictEqual(1);
		expect(testvm.program_counter).toStrictEqual(0);
		expect(testvm.program).toBeInstanceOf(Program);
		expect(testvm.speed).toBeGreaterThan(0);
		expect(testvm.tick).toStrictEqual(0);
		expect(testvm.opcache).toBeInstanceOf(InstructionCache);

		// For Architecture
		expect(testvm.val).toStrictEqual(0);
	});

	it('load', async () => {
		let testvm = new VM(new Test());
		let loaded = await testvm.program.load(new Uint8Array([0xf3, 0x69]));

		expect(testvm.program.data).not.toBeNull();
		expect(testvm.program.data![0]).toStrictEqual(0xf3);
		expect(testvm.program.data!.length).toStrictEqual(2);
		expect(testvm.status).toStrictEqual(TestStatus.CALLED_LOAD);
	});

	it('step', async () => {
		let testvm = new VM(new Test());
		let loaded = await testvm.program.load(new Uint8Array([0xf3, 0x69, 0x00, 0x00, 0x00, 0x00]));

		testvm.step();
		expect(testvm.program_counter).toStrictEqual(2);
		expect(testvm.status).toStrictEqual(TestStatus.CALLED_TICK);
		expect(testvm.val).toStrictEqual(0x369);
	});

	it('jump', async () => {
		let testvm = new VM(new Test(ctx => ctx.jump(0x01)));
		let loaded = await testvm.program.load(new Uint8Array([0x0d, 0xef]));

		testvm.step();
		expect(testvm.program_counter).toStrictEqual(1);

		testvm.jump(0x00);
		expect(testvm.program_counter).toStrictEqual(0);
	});

	it('hopForwards', async () => {
		let testvm = new VM(new Test(ctx => ctx.hopForwards(1)));
		let loaded = await testvm.program.load(new Uint8Array([0x0d, 0xef, 0xf0, 0xf0, 0xf0, 0xf0, 0x00]));

		testvm.step();
		expect(testvm.program_counter).toStrictEqual(2);

		testvm.hopForwards(2);
		expect(testvm.program_counter).toStrictEqual(6);
	});

	it('hopBackwards', async () => {
		let testvm = new VM(new Test(ctx => ctx.hopBackwards(1)));
		let loaded = await testvm.program.load(new Uint8Array([0xf0, 0x00, 0x0d, 0xef]));

		testvm.step();
		testvm.step();
		expect(testvm.program_counter).toStrictEqual(0);

		testvm.step();
		testvm.hopBackwards(1);
		expect(testvm.program_counter).toStrictEqual(0);
	});

	it('reset', async () => {
		let testvm = new VM(new Test());
		let loaded = await testvm.program.load(new Uint8Array([0xf0, 0x00, 0x00, 0x00, 0x00]));

		testvm.step();
		testvm.reset();
		expect(testvm.program_counter).toStrictEqual(0);
		expect(testvm.status).toStrictEqual(TestStatus.CALLED_RESET);
	});

	it('await', async () => {
		let called = false;
		let callback = false;
		let testvm = new VM(new Test(() => (called = true)));
		let loaded = await testvm.program.load(new Uint8Array([0x0d, 0xef].concat(new Array(100))));

		testvm.await('test', event => (callback = event === 'test'));
		testvm.step();
		expect(called).toStrictEqual(false);

		for (let i = 0; i < 50; i++) {
			testvm.step();
		}

		expect(called).toStrictEqual(false);
		testvm.emit('test');
		testvm.step();
		expect(callback).toStrictEqual(true);
		expect(called).toStrictEqual(true);
	});
});
