//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import MathFlag from '../src/MathFlag';
import * as Uint16 from '../src/Uint16';
// ---------------------------------------------------------------------------------------------------------------------
describe('Constants', () => {
	it('MIN', () => expect(Uint16.MIN).toStrictEqual(0x0000));
	it('MAX', () => expect(Uint16.MAX).toStrictEqual(0xffff));
	it('WRAP', () => expect(Uint16.WRAP).toStrictEqual(Uint16.MAX + 1));
	it('BITS', () => expect(Uint16.BITS).toStrictEqual(16));
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

	it('bitscanf', () => {
		expect(Uint16.bitscanf(0b1000000000000000)).toEqual(15);
		expect(Uint16.bitscanf(0b0000001000000000)).toEqual(9);
		expect(Uint16.bitscanf(0b0000000000000001)).toEqual(0);
		expect(Uint16.bitscanf(0b1000000000000100)).toEqual(2);
	});

	it('bitscanr', () => {
		expect(Uint16.bitscanr(0b1000000000000000)).toEqual(15);
		expect(Uint16.bitscanr(0b0000001000000000)).toEqual(9);
		expect(Uint16.bitscanr(0b0000000000000001)).toEqual(0);
		expect(Uint16.bitscanr(0b1000000000000100)).toEqual(15);
	});

	it('and', () => {
		expect(Uint16.and(0xffff, 0x0000)).toEqual(0x0000);
		expect(Uint16.and(0xffff, 0x0ff0)).toEqual(0x0ff0);
		expect(Uint16.and(0x0000, 0xffff)).toEqual(0x0000);
		expect(Uint16.and(0x0000, 0x0000)).toEqual(0x0000);
		expect(Uint16.and(0xffff, 0xffff)).toEqual(0xffff);
	});

	it('or', () => {
		expect(Uint16.or(0x0ff0, 0x0000)).toEqual(0x0ff0);
		expect(Uint16.or(0x0f00, 0x0000)).toEqual(0x0f00);
		expect(Uint16.or(0x00f0, 0x0f00)).toEqual(0x0ff0);
		expect(Uint16.or(0x0f00, 0x0ff0)).toEqual(0x0ff0);
		expect(Uint16.or(0x0ff0, 0x0ff0)).toEqual(0x0ff0);
	});

	it('xor', () => {
		expect(Uint16.xor(0xff, 0x00)).toEqual(0xff);
		expect(Uint16.xor(0xf0, 0x0f)).toEqual(0xff);
		expect(Uint16.xor(0xbe, 0xef)).toEqual(0x51);
		expect(Uint16.xor(0xca, 0x11)).toEqual(0xdb);
		expect(Uint16.xor(0xdead, 0xbeef)).toEqual(0x6042);
		expect(Uint16.xor(0xfeed, 0xc0de)).toEqual(0x3e33);
	});

	it('bitshiftl', () => {
		expect(Uint16.bitshiftl(0xffff, 1)).toEqual(0xfffe);
		expect(Uint16.bitshiftl(0x0001, 1)).toEqual(0x0002);
		expect(Uint16.bitshiftl(0x0101, 1)).toEqual(0x0202);
	});

	it('bitshiftr', () => {
		expect(Uint16.bitshiftr(0xffff, 1)).toEqual(0x7fff);
		expect(Uint16.bitshiftr(0x0001, 1)).toEqual(0x0000);
		expect(Uint16.bitshiftr(0x1010, 1)).toEqual(0x0808);
	});

	it('bitshiftlw', () => {
		expect(Uint16.bitshiftlw(0x0001, 1)).toEqual(0x0002);
		expect(Uint16.bitshiftlw(0x0101, 1)).toEqual(0x0202);
		expect(Uint16.bitshiftlw(0xffff, 1)).toEqual(0xffff);
		expect(Uint16.bitshiftlw(0x8000, 1)).toEqual(0x0001);
		expect(Uint16.bitshiftlw(0x1000, 15)).toEqual(0x0800);
	});

	it('bitshiftrw', () => {
		expect(Uint16.bitshiftrw(0x0001, 1)).toEqual(0x8000);
		expect(Uint16.bitshiftrw(0xffff, 1)).toEqual(0xffff);
		expect(Uint16.bitshiftrw(0x8000, 1)).toEqual(0x4000);
	});

	it('isValid', () => {
		expect(Uint16.isValid(Uint16.MAX)).toEqual(true);
		expect(Uint16.isValid(Uint16.MIN)).toEqual(true);
		expect(Uint16.isValid(Uint16.MAX + 1)).toEqual(false);
		expect(Uint16.isValid(Uint16.MIN - 1)).toEqual(false);
	});
});
