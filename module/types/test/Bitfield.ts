//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Bitfield from '../src/Bitfield';
import * as Uint8 from '../src/Uint8';
import * as Uint16 from '../src/Uint16';
// ---------------------------------------------------------------------------------------------------------------------
describe('Bitfield', () => {
	it('constructor', () => {
		let bf8 = new Bitfield(0b10001001, Uint8.BITS);
		expect((<any>bf8).value).toStrictEqual(0b10001001);
		expect(bf8.length).toStrictEqual(Uint8.BITS);

		let bf16 = new Bitfield(0b1000100100010001, Uint16.BITS);
		expect((<any>bf16).value).toStrictEqual(0b1000100100010001);
		expect(bf16.length).toStrictEqual(Uint16.BITS);
	});

	it('toArray', () => {
		let bf8 = new Bitfield(0b10001001, Uint8.BITS);
		expect(bf8.toArray()).toEqual([true, false, false, false, true, false, false, true]);
	});

	it('toNumber', () => {
		let bf8 = new Bitfield(0b10001001, Uint8.BITS);
		expect(bf8.toNumber()).toStrictEqual(0b10001001);
	});

	it('toString', () => {
		let bf8 = new Bitfield(0b10001001, Uint8.BITS);
		expect(bf8.toString()).toStrictEqual('10001001');
	});

	it('[Symbol.iterator]', () => {
		let bf8 = new Bitfield(0b10001001, Uint8.BITS);
		let fsm = [true, false, false, false, true, false, false, true];
		for (let bit of bf8) {
			expect(bit).toStrictEqual(<boolean>fsm.shift());
		}
	});

	it('[Symbol.toPrimitive]', () => {
		let bf8 = new Bitfield(0b10001001, Uint8.BITS);
		expect(`${bf8}`).toStrictEqual('10001001');
		expect(bf8 + '').toStrictEqual('10001001');
		expect(+bf8).toStrictEqual(0b10001001);
	});
});
