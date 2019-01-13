// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Team Chipotle
// MIT License
// ---------------------------------------------------------------------------------------------------------------------
import MathFlag from '../src/MathFlag';
import * as Uint8 from '../src/Uint8';
// ---------------------------------------------------------------------------------------------------------------------
describe('Constants', () => {
	it('MIN', () => expect(Uint8.MIN).toStrictEqual(0x00));
	it('MAX', () => expect(Uint8.MAX).toStrictEqual(0xff));
	it('WRAP', () => expect(Uint8.WRAP).toStrictEqual(Uint8.MAX + 1));
});

describe('Operations', () => {
	it('cast', () => {
		let nums = [-1, 600, 128, -500, 0, 256];
		let real = new Uint8Array(1);

		for (let num of nums) {
			real[0] = num;
			expect(Uint8.cast(num)).toStrictEqual(real[0]);
		}
	});

	it('wrap', () => {
		expect(Uint8.wrap(0)).toEqual([0x00, MathFlag.OK]);
		expect(Uint8.wrap(255)).toEqual([0xff, MathFlag.OK]);
		expect(Uint8.wrap(-1)).toEqual([0xff, MathFlag.OVERFLOW]);
		expect(Uint8.wrap(256)).toEqual([0x00, MathFlag.OVERFLOW]);
	});

	it('add', () => {
		expect(Uint8.add(1, 3)).toEqual([0x04, MathFlag.OK]);
		expect(Uint8.add(1, 255)).toEqual([0x00, MathFlag.OVERFLOW]);
		expect(Uint8.add(255, 2)).toEqual([0x01, MathFlag.OVERFLOW]);
	});

	it('sub', () => {
		expect(Uint8.sub(1, 3)).toEqual([0xfe, MathFlag.OVERFLOW]);
		expect(Uint8.sub(255, 1)).toEqual([0xfe, MathFlag.OK]);
		expect(Uint8.sub(10, 5)).toEqual([0x05, MathFlag.OK]);
	});

	it('bitrev', () => {
		expect(Uint8.bitrev(0b00000000)).toEqual(0b00000000);
		expect(Uint8.bitrev(0b10000000)).toEqual(0b00000001);
		expect(Uint8.bitrev(0b01000000)).toEqual(0b00000010);
		expect(Uint8.bitrev(0b00100000)).toEqual(0b00000100);
		expect(Uint8.bitrev(0b00010000)).toEqual(0b00001000);
		expect(Uint8.bitrev(0b00001000)).toEqual(0b00010000);
		expect(Uint8.bitrev(0b10010000)).toEqual(0b00001001);
		expect(Uint8.bitrev(0b10011001)).toEqual(0b10011001);
	});
});
