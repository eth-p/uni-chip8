//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Operand from '../src/Operand';
import OperandMask from '../src/OperandMask';
import OperandType from '../src/OperandType';
// ---------------------------------------------------------------------------------------------------------------------
describe('Operand', () => {
	it('constructor (Instruction, OperandType)', () => {
		let op = new Operand(0xf0, OperandType.CONSTANT);
		expect(op.mask.mask).toStrictEqual(0xf0);
		expect(op.type).toStrictEqual(OperandType.CONSTANT);
		expect(op.tags).toBeNull();
	});

	it('constructor (OperandMask, OperandType)', () => {
		let op = new Operand(new OperandMask(0xf0), OperandType.CONSTANT);
		expect(op.mask.mask).toStrictEqual(0xf0);
		expect(op.type).toStrictEqual(OperandType.CONSTANT);
		expect(op.tags).toBeNull();
	});

	it('constructor (OperandMask, OperandType, {})', () => {
		let op = new Operand(new OperandMask(0xf0), OperandType.CONSTANT, {a: 'b', c: 'd'});
		expect(op.mask.mask).toStrictEqual(0xf0);
		expect(op.type).toStrictEqual(OperandType.CONSTANT);
		expect(op.tags).not.toBeNull();
		expect(Array.from(op.tags!.entries())).toEqual([['a', 'b'], ['c', 'd']]);
	});

	it('constructor (OperandMask, OperandType, Map)', () => {
		let op = new Operand(new OperandMask(0xf0), OperandType.CONSTANT, new Map([['a', 'b'], ['c', 'd']]));
		expect(op.mask.mask).toStrictEqual(0xf0);
		expect(op.type).toStrictEqual(OperandType.CONSTANT);
		expect(op.tags).not.toBeNull();
		expect(Array.from(op.tags!.entries())).toEqual([['a', 'b'], ['c', 'd']]);
	});

	it('constructor (OperandCtor)', () => {
		let op = new Operand({
			mask: 0xf0,
			type: OperandType.CONSTANT,
			tags: {a: 'b', c: 'd'}
		});

		expect(op.mask.mask).toStrictEqual(0xf0);
		expect(op.type).toStrictEqual(OperandType.CONSTANT);
		expect(op.tags).not.toBeNull();
		expect(Array.from(op.tags!.entries())).toEqual([['a', 'b'], ['c', 'd']]);
	});

	it('decode', () => {
		let op = new Operand(0xf0, OperandType.REGISTER);
		expect(op.decode(0xff)).toStrictEqual(0x0f);
		expect(op.decode(0x0f)).toStrictEqual(0x00);
	});

	it('encode', () => {
		let op = new Operand(0xf0, OperandType.REGISTER);
		expect(op.encode(0xff)).toStrictEqual(0xf0);
		expect(op.encode(0x01)).toStrictEqual(0x10);
	});
});
