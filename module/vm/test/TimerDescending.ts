//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import TimerDescending from '../src/TimerDescending';
// ---------------------------------------------------------------------------------------------------------------------

describe('TimerDescending', () => {
	it('constructor', () => {
		let timer = new TimerDescending(10, 1);
		expect((<any>timer).value).toEqual(0);
		expect((<any>timer).error).toEqual(0);
		expect((<any>timer).ratio).toEqual(0.1);

		let timer2 = new TimerDescending(1, 10);
		expect((<any>timer2).ratio).toEqual(10);
	});

	it('update (from 1)', () => {
		let timer = new TimerDescending(10, 1);
		timer.value = 1;

		for (let i = 0.9; i >= 0; i -= 0.1) {
			timer.update();
			expect(timer.value).toEqual(0);
			expect((<any>timer).error).toBeCloseTo(i, Number.EPSILON);
		}

		timer.update();
		timer.update();
		expect(timer.value).toEqual(0);
		expect((<any>timer).error).toBeCloseTo(0, Number.EPSILON);
	});

	it('update (from -1)', () => {
		let timer = new TimerDescending(10, 1);
		timer.value = -1;

		for (let i = 0; i < 10; i++) {
			expect(timer.value).toEqual(-1);
			expect((<any>timer).error).toBeCloseTo(-(i / 10), Number.EPSILON);
			timer.update();
		}

		expect(timer.value).toEqual(-2);
		expect((<any>timer).error).toBeCloseTo(0, Number.EPSILON);
	});
});
