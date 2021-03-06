//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import IntTimer from '../src/IntTimer';
// ---------------------------------------------------------------------------------------------------------------------

describe('Timer', () => {
	it('constructor', () => {
		let timer = new IntTimer(10, 1);
		expect((<any>timer).value).toEqual(0);
		expect((<any>timer).error).toEqual(0);
		expect((<any>timer).ratio).toEqual(0.1);

		let timer2 = new IntTimer(1, 10);
		expect((<any>timer2).ratio).toEqual(10);
	});

	it('ascend (from 1)', () => {
		let timer = new IntTimer(10, 1);
		timer.value = 1;

		for (let i = 0; i < 0.9; i += 0.1) {
			expect(timer.value).toEqual(1);
			expect((<any>timer).error).toBeCloseTo(i, Number.EPSILON);
			timer.ascend();
		}

		expect(timer.value).toEqual(2);
		expect((<any>timer).error).toBeCloseTo(0, Number.EPSILON);
	});

	it('ascend (from -1)', () => {
		let timer = new IntTimer(10, 1);
		timer.value = -1;

		for (let i = 0; i < 9; i++) {
			timer.ascend();
			expect(timer.value).toEqual(0);
			expect((<any>timer).error).toBeCloseTo(-(1 - i / 10), Number.EPSILON);
		}

		timer.ascend();
		timer.ascend();
		expect(timer.value).toEqual(0);
		expect((<any>timer).error).toBeCloseTo(0, Number.EPSILON);
	});

	it('descend (from 1)', () => {
		let timer = new IntTimer(10, 1);
		timer.value = 1;

		for (let i = 0.9; i >= 0; i -= 0.1) {
			timer.descend();
			expect(timer.value).toEqual(0);
			expect((<any>timer).error).toBeCloseTo(i, Number.EPSILON);
		}

		timer.descend();
		timer.descend();
		expect(timer.value).toEqual(0);
		expect((<any>timer).error).toBeCloseTo(0, Number.EPSILON);
	});

	it('descend (from -1)', () => {
		let timer = new IntTimer(10, 1);
		timer.value = -1;

		for (let i = 0; i < 10; i++) {
			expect(timer.value).toEqual(-1);
			expect((<any>timer).error).toBeCloseTo(-(i / 10), Number.EPSILON);
			timer.descend();
		}

		expect(timer.value).toEqual(-2);
		expect((<any>timer).error).toBeCloseTo(0, Number.EPSILON);
	});

	it('ascend + descend', () => {
		let timer = new IntTimer(10, 1);
		let exp = timer.value;

		// Try one.
		timer.ascend();
		timer.descend();
		expect(timer.value).toBeCloseTo(exp, Number.EPSILON);

		// Try many.
		for (let i = 0; i < 100000; i++) timer.ascend();
		for (let i = 0; i < 100000; i++) timer.descend();
		expect(timer.value).toBeCloseTo(exp, Number.EPSILON);
	});

	it('adjust', () => {
		let timer = new IntTimer(10, 1);

		// Try one.
		for (let i = 0; i < 10; i++) timer.ascend();
		timer.adjust(100, 1);
		for (let i = 0; i < 100; i++) timer.descend();

		expect(timer.value).toBeCloseTo(0, Number.EPSILON);
	});

	it('snapshot + restore', () => {
		let timer = new IntTimer(10, 1);
		let copy = new IntTimer(10, 1);

		timer.ascend();

		copy.restore(timer.snapshot());
		expect(timer).toEqual(copy);
	});
});
