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
		let bf8 = new Bitfield(8);
		expect(bf8.length).toStrictEqual(8);
		expect(bf8.bits).toStrictEqual(8);

		let bf16 = new Bitfield(16);
		expect(bf16.length).toStrictEqual(16);
		expect(bf16.bits).toStrictEqual(16);
	});

	it('bits', () => {
		let bf8 = new Bitfield(8);
		expect(bf8.bits).toStrictEqual(8);
	});

	it('set[]', () => {
		let bf8 = new Bitfield(8);
		bf8[0] = true;
		bf8[1] = true;
		bf8[5] = true;
		expect(Array.from(bf8)).toEqual([true, true, false, false, false, true, false, false]);
	});

	it('get[]', () => {
		let bf8 = new Bitfield(8);
		bf8[0] = true;
		expect(bf8[0]).toStrictEqual(true);
	});

	it('assign', () => {
		let bf8 = new Bitfield(8);
		bf8.assign(0b11101011);
		expect(Array.from(bf8)).toEqual([true, true, true, false, true, false, true, true]);
	});

	it('from(number, number)', () => {
		let bf8 = Bitfield.from(0b11101011, 8);
		expect(Array.from(bf8)).toEqual([true, true, true, false, true, false, true, true]);
		expect(bf8.bits).toEqual(8);
	});

	it('from(boolean[])', () => {
		let bf8 = Bitfield.from([true, true, true, false, true, false, true, true]);
		expect(Array.from(bf8)).toEqual([true, true, true, false, true, false, true, true]);
		expect(bf8.bits).toEqual(8);
	});

	it('from(Uint8Array)', () => {
		let ui8a = new Uint8Array([0xff, 0xfe, 0x13, 0x01]);

		let bf8 = Bitfield.from(ui8a);
		expect(bf8.bits).toEqual(ui8a.length * 8);
		expect(Array.from(bf8.toTyped())).toEqual(Array.from(ui8a));
	});

	it('toString', () => {
		let bf8 = Bitfield.from(0b11000101, 8);
		let bf16 = Bitfield.from(0b1100010100000001, 16);

		expect(bf8.toString()).toStrictEqual('11000101');
		expect(bf16.toString()).toStrictEqual('11000101 00000001');
	});

	it('toNumber', () => {
		let bf8 = Bitfield.from(0b10001001, 8);
		expect(bf8.toNumber()).toStrictEqual(0b10001001);
	});

	it('toTyped', () => {
		let bf16 = Bitfield.from(0b1100010100000001, 16);
		let bf16a = bf16.toTyped();
		expect(bf16a).toBeInstanceOf(Uint8Array);
		expect(bf16a[0]).toStrictEqual(0b11000101);
		expect(bf16a[1]).toStrictEqual(0b00000001);
	});

	it('[Symbol.iterator]', () => {
		let bf8 = Bitfield.from(0b11000101, 8);
		bf8[8] = false;

		let fsm = [true, true, false, false, false, true, false, true];
		for (let bit of bf8) {
			expect(bit).toStrictEqual(<boolean>fsm.shift());
		}
	});
});
