//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import TimerAscending from '../src/TimerAscending';
// ---------------------------------------------------------------------------------------------------------------------

describe('TimerAscending', () => {
	it('constructor', () => {
		let timer = new TimerAscending(10, 1);
		expect((<any>timer).value).toEqual(0);
		expect((<any>timer).error).toEqual(0);
		expect((<any>timer).ratio).toEqual(0.1);

		let timer2 = new TimerAscending(1, 10);
		expect((<any>timer2).ratio).toEqual(10);
	});

	it('update (from 1)', () => {
		let timer = new TimerAscending(10, 1);
		timer.value = 1;

		for (let i = 0; i < 0.9; i += 0.1) {
			expect(timer.value).toEqual(1);
			expect((<any>timer).error).toBeCloseTo(i, Number.EPSILON);
			timer.update();
		}

		console.log(timer);
		expect(timer.value).toEqual(2);
		expect((<any>timer).error).toBeCloseTo(0, Number.EPSILON);
	});

	it('update (from -1)', () => {
		let timer = new TimerAscending(10, 1);
		timer.value = -1;

		for (let i = 0; i < 9; i++) {
			timer.update();
			expect(timer.value).toEqual(0);
			expect((<any>timer).error).toBeCloseTo(-(1 - i / 10), Number.EPSILON);
		}

		timer.update();
		timer.update();
		expect(timer.value).toEqual(0);
		expect((<any>timer).error).toBeCloseTo(0, Number.EPSILON);
	});
});
