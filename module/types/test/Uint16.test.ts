// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Team Chipotle
// MIT License
// ---------------------------------------------------------------------------------------------------------------------
import MathFlag from '../src/MathFlag';
import * as Uint16 from '../src/Uint16';
// ---------------------------------------------------------------------------------------------------------------------
describe('Constants', () => {
	it('MIN', () => expect(Uint16.MIN).toStrictEqual(0x0000));
	it('MAX', () => expect(Uint16.MAX).toStrictEqual(0xffff));
	it('WRAP', () => expect(Uint16.WRAP).toStrictEqual(Uint16.MAX + 1));
});

describe('Operations', () => {
	it('cast', () => {
		let nums = [-1, -100000, 128, -500, 0, 200000];
		let real = new Uint16Array(1);

		for (let num of nums) {
			real[0] = num;
			expect(Uint16.cast(num)).toStrictEqual(real[0]);
		}
	});

	it('wrap', () => {
		expect(Uint16.wrap(0)).toEqual([0x00, MathFlag.OK]);
		expect(Uint16.wrap(0xffff)).toEqual([0xffff, MathFlag.OK]);
		expect(Uint16.wrap(-1)).toEqual([0xffff, MathFlag.OVERFLOW]);
		expect(Uint16.wrap(0x10000)).toEqual([0x0000, MathFlag.OVERFLOW]);
	});

	it('add', () => {
		expect(Uint16.add(1, 3)).toEqual([0x04, MathFlag.OK]);
		expect(Uint16.add(1, 0xffff)).toEqual([0x0000, MathFlag.OVERFLOW]);
		expect(Uint16.add(0xffff, 2)).toEqual([0x0001, MathFlag.OVERFLOW]);
	});

	it('sub', () => {
		expect(Uint16.sub(1, 2)).toEqual([0xffff, MathFlag.OVERFLOW]);
		expect(Uint16.sub(0xffff, 1)).toEqual([0xfffe, MathFlag.OK]);
		expect(Uint16.sub(10, 5)).toEqual([0x05, MathFlag.OK]);
	});

	it('bitrev', () => {
		expect(Uint16.bitrev(0b0000000000000000)).toEqual(0b0000000000000000);
		expect(Uint16.bitrev(0b1000000000000000)).toEqual(0b0000000000000001);
		expect(Uint16.bitrev(0b0100000000000000)).toEqual(0b0000000000000010);
		expect(Uint16.bitrev(0b0010000000000000)).toEqual(0b0000000000000100);
		expect(Uint16.bitrev(0b0001000000000000)).toEqual(0b0000000000001000);
		expect(Uint16.bitrev(0b0000100000000000)).toEqual(0b0000000000010000);
		expect(Uint16.bitrev(0b0000010000000000)).toEqual(0b0000000000100000);
		expect(Uint16.bitrev(0b0000001000000000)).toEqual(0b0000000001000000);
		expect(Uint16.bitrev(0b0000000100000000)).toEqual(0b0000000010000000);
		expect(Uint16.bitrev(0b0000000010000000)).toEqual(0b0000000100000000);
		expect(Uint16.bitrev(0b1000000100000000)).toEqual(0b0000000010000001);
		expect(Uint16.bitrev(0b1000000110000001)).toEqual(0b1000000110000001);
	});
});
