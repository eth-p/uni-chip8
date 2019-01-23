//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Operand from '../src/Operand';
import OperandType from '../src/OperandType';
import Operation from '../src/Operation';
// ---------------------------------------------------------------------------------------------------------------------
describe('Operation', () => {
	it('constructor (string, Instruction, Operand[])', () => {
		let op = new Operation('ADD', 0xf00d, [
			new Operand({
				mask: 0x0ff0,
				type: OperandType.CONSTANT
			})
		]);

		expect(op.mask.mask).toStrictEqual(0xf00f);
		expect(op.operands).toBeInstanceOf(Array);
		expect(op.operands.length).toStrictEqual(1);
		expect(op.operands[0].mask.mask).toStrictEqual(0x0ff0);
		expect(op.mnemonic).toStrictEqual('ADD');
	});

	it('constructor (string, Instruction, OperandCtor[])', () => {
		let op = new Operation('ADD', 0xf00d, [
			{
				mask: 0x0ff0,
				type: OperandType.CONSTANT
			}
		]);

		expect(op.mask.mask).toStrictEqual(0xf00f);
		expect(op.operands).toBeInstanceOf(Array);
		expect(op.operands.length).toStrictEqual(1);
		expect(op.operands[0].mask.mask).toStrictEqual(0x0ff0);
		expect(op.mnemonic).toStrictEqual('ADD');
	});

	it('constructor (string, Instruction, (OperandCtor|Operand)[])', () => {
		let op = new Operation('ADD', 0xf000, [
			{
				mask: 0x0ff0,
				type: OperandType.CONSTANT
			},
			new Operand({
				mask: 0x000f,
				type: OperandType.REGISTER
			})
		]);

		expect(op.mask.mask).toStrictEqual(0xf000);
		expect(op.operands).toBeInstanceOf(Array);
		expect(op.operands.length).toStrictEqual(2);
		expect(op.operands[0].mask.mask).toStrictEqual(0x0ff0);
		expect(op.operands[1].mask.mask).toStrictEqual(0x000f);
		expect(op.mnemonic).toStrictEqual('ADD');
	});

	it('matches', () => {
		let op1 = new Operation('ADD', 0xf00d, [
			{
				mask: 0x0ff0,
				type: OperandType.CONSTANT
			}
		]);

		expect(op1.matches(0xf00d)).toStrictEqual(true);
		expect(op1.matches(0xfadd)).toStrictEqual(true);
		expect(op1.matches(0xd00d)).toStrictEqual(false);
		expect(op1.matches(0xdaad)).toStrictEqual(false);
		expect(op1.matches(0xf001)).toStrictEqual(false);
	});

	it('decode', () => {
		let op1 = new Operation('ADD', 0x2000, [
			{
				mask: 0x0f00,
				type: OperandType.CONSTANT
			},
			{
				mask: 0x00ff,
				type: OperandType.CONSTANT
			}
		]);

		expect(op1.decode(0x2fff)).toEqual([0xf, 0xff]);
		expect(op1.decode(0x2345)).toEqual([0x3, 0x45]);
	});

	it('encode', () => {
		let op1 = new Operation('ADD', 0x2000, [
			{
				mask: 0x0f00,
				type: OperandType.CONSTANT
			},
			{
				mask: 0x00ff,
				type: OperandType.CONSTANT
			}
		]);

		expect(op1.encode([0xf, 0xff])).toStrictEqual(0x2fff);
		expect(op1.encode([0x3, 0x45])).toStrictEqual(0x2345);
	});
});
