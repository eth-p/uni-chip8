//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Operation from '../src/Operation';
import OperandType from '../src/OperandType';
import InstructionSet from '@chipotle/isa/InstructionSet';

// ---------------------------------------------------------------------------------------------------------------------

const TestOpAlpha = new Operation('ALPHA', 0xf000, [
	{
		mask: 0x0fff,
		type: OperandType.CONSTANT
	}
]);

const TestOpBeta = new Operation('BETA', 0xd000, [
	{
		mask: 0x0fff,
		type: OperandType.CONSTANT
	}
]);

const TestOpGamma = new Operation('GAMMA', 0xfe00, [
	{
		mask: 0x01ff,
		type: OperandType.CONSTANT
	}
]);

const TestOpDelta = new Operation('DELTA', 0xd00d, [
	{
		mask: 0x0ff0,
		type: OperandType.CONSTANT
	}
]);

// ---------------------------------------------------------------------------------------------------------------------
describe('InstructionSet', () => {
	it('constructor', () => {
		let set = new InstructionSet([TestOpAlpha, TestOpBeta]);
		expect((<any>set).mask).toStrictEqual(0xf000);
		expect((<any>set).maskshift).toStrictEqual(12);
		expect((<any>set).table[0xd].length).toEqual(1);
		expect((<any>set).table[0xf].length).toEqual(1);

		let set2 = new InstructionSet([TestOpAlpha, TestOpBeta, TestOpGamma, TestOpDelta]);
		expect((<any>set2).mask).toStrictEqual(0xf000);
		expect((<any>set2).maskshift).toStrictEqual(12);
		expect((<any>set2).table[0xf].length).toEqual(2);
	});

	it('lookup', () => {
		let set2 = new InstructionSet([TestOpAlpha, TestOpBeta, TestOpGamma, TestOpDelta]);
		expect((<any>set2).mask).toStrictEqual(0xf000);
		expect((<any>set2).maskshift).toStrictEqual(12);
		expect((<any>set2).table[0xf].length).toEqual(2);
		expect(set2.lookup(0xf000).mnemonic).toStrictEqual('ALPHA');
		expect(set2.lookup(0xf111).mnemonic).toStrictEqual('ALPHA');
		expect(set2.lookup(0xf011).mnemonic).toStrictEqual('ALPHA');
		expect(set2.lookup(0xd001).mnemonic).toStrictEqual('BETA');
		expect(set2.lookup(0xfeed).mnemonic).toStrictEqual('GAMMA');
		expect(set2.lookup(0xdeed).mnemonic).toStrictEqual('DELTA');
	});
});
