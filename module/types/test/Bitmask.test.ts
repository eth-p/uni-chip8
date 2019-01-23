//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Bitfield from '../src/Bitfield';
import Bitmask from '../src/Bitmask';
// ---------------------------------------------------------------------------------------------------------------------
describe('Bitmask', () => {
	it('constructor', () => {
		let bm = new Bitmask(0b10000001);
		expect(bm.mask).toStrictEqual(0b10000001);
		expect(bm.lsb).toStrictEqual(0);
		expect(bm.msb).toStrictEqual(7);
		expect(bm.width).toStrictEqual(8);

		let bm2 = new Bitmask(0b01000010);
		expect(bm2.mask).toStrictEqual(0b01000010);
		expect(bm2.lsb).toStrictEqual(1);
		expect(bm2.msb).toStrictEqual(6);
		expect(bm2.width).toStrictEqual(6);

		let bm3 = new Bitmask(0b1000000001000010);
		expect(bm3.mask).toStrictEqual(0b1000000001000010);
		expect(bm3.lsb).toStrictEqual(1);
		expect(bm3.msb).toStrictEqual(15);
		expect(bm3.width).toStrictEqual(15);
	});

	it('extract', () => {
		let bm = new Bitmask(0b00110000);
		expect(bm.extract(0xff)).toStrictEqual(0b11);

		let bm2 = new Bitmask(0b11010000);
		expect(bm2.extract(0xff)).toStrictEqual(0b1101);
	});

	it('emplace', () => {
		let bm = new Bitmask(0b00110000);
		expect(bm.emplace(0b10, 0x00)).toStrictEqual(0b00100000);
		expect(bm.emplace(0b01, 0x00)).toStrictEqual(0b00010000);
		expect(bm.emplace(0b11, 0x01)).toStrictEqual(0b00110001);
		expect(bm.emplace(0x00, 0xff)).toStrictEqual(0b11001111);

		let bm2 = new Bitmask(0xf0);
		expect(bm2.emplace(0x00, 0xff)).toStrictEqual(0x0f);
		expect(bm2.emplace(0x0f, 0x00)).toStrictEqual(0xf0);
		expect(() => bm2.emplace(0xf0, 0x00)).toThrow();
	});

	it('overlaps', () => {
		let bm = new Bitmask(0b00110000);
		let bmoT = new Bitmask(0b00100000);
		let bmoF = new Bitmask(0b01000000);

		expect(bm.overlaps(bmoT)).toStrictEqual(true);
		expect(bm.overlaps([bmoT, bmoT])).toStrictEqual(true);
		expect(bm.overlaps([bmoF, bmoT, bmoF])).toStrictEqual(true);
		expect(bm.overlaps([bmoF, 0xff])).toStrictEqual(true);
		expect(bm.overlaps(0xff)).toStrictEqual(true);

		expect(bm.overlaps(bmoF)).toStrictEqual(false);
		expect(bm.overlaps([bmoF, bmoF])).toStrictEqual(false);
		expect(bm.overlaps([bmoF, 0x00])).toStrictEqual(false);
		expect(bm.overlaps(0x00)).toStrictEqual(false);
	});

	it('toString', () => {
		let bm = new Bitmask(0b00110000);
		expect(bm.toString()).toStrictEqual('48');
	});

	it('toNumber', () => {
		let bm = new Bitmask(0b00110000);
		expect(bm.toNumber()).toStrictEqual(48);
	});

	it('toBitfield', () => {
		let bm = new Bitmask(0b00110000);
		let bf = bm.toBitfield();
		expect(bf).toBeInstanceOf(Bitfield);
		expect(Array.from(bf)).toEqual([
			false,
			false,
			false,
			false,
			false,
			false,
			false,
			false,
			false,
			false,
			true,
			true,
			false,
			false,
			false,
			false
		]);
	});

	it('[Symbol.toPrimitive] (Number)', () => {
		let bm = new Bitmask(0b00110000);
		expect(+bm).toStrictEqual(48);
	});

	it('[Symbol.toPrimitive] (String)', () => {
		let bm = new Bitmask(0b00110000);
		expect(`${bm}`).toStrictEqual('48');
	});

	it('[Symbol.toPrimitive] (Default)', () => {
		let bm = new Bitmask(0b00110000);
		expect(bm + '').toStrictEqual('48');
	});
});
