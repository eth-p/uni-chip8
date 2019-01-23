//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Bitfield from '@chipotle/types/Bitfield';

import ChipDisplay from '../src/ChipDisplay';
import ChipSprite from '../src/ChipSprite';
// ---------------------------------------------------------------------------------------------------------------------
describe('ChipDisplay Constants', () => {
	it('WIDTH', () => {
		expect(ChipDisplay.WIDTH).toStrictEqual(64);
	});

	it('HEIGHT', () => {
		expect(ChipDisplay.HEIGHT).toStrictEqual(32);
	});
});

describe('ChipDisplay', () => {
	it('constructor', () => {
		let cd = new ChipDisplay();
		expect((<any>cd).lineOffset).toStrictEqual(8);
		expect(cd.buffer.length).toStrictEqual(256);
		expect(Array.from(cd.buffer)).toEqual(new Array(256).fill(0, 0, 256));
	});

	it('draw (normal)', () => {
		let cd = new ChipDisplay();
		let sprite = new ChipSprite([0b10000001, 0b11111111]);

		let result = cd.draw(0, 0, sprite);
		let buffer = cd.buffer.slice(0);

		expect(cd.buffer[0]).toEqual(0b10000001);
		expect(cd.buffer[8]).toEqual(0b11111111);
		buffer[0] = buffer[8] = 0;

		expect(buffer).toEqual(new Uint8Array(cd.buffer.length));
		expect(result).toStrictEqual(false);
	});

	it('draw (wrap)', () => {
		let cd = new ChipDisplay();
		let sprite = new ChipSprite([0b10000001, 0b11111111]);

		let result = cd.draw(60, 0, sprite);
		let buffer = cd.buffer.slice(0);

		expect(cd.buffer[0]).toEqual(0b00010000);
		expect(cd.buffer[7]).toEqual(0b00001000);
		expect(cd.buffer[8]).toEqual(0b11110000);
		expect(cd.buffer[15]).toEqual(0b00001111);
		buffer[0] = buffer[7] = buffer[8] = buffer[15] = 0;

		expect(buffer).toEqual(new Uint8Array(cd.buffer.length));
		expect(result).toStrictEqual(false);
	});

	it('draw (collide)', () => {
		let cd = new ChipDisplay();
		let sprite1 = new ChipSprite([0b11110000]);
		let sprite2 = new ChipSprite([0b01100000]);

		let result1 = cd.draw(0, 0, sprite1);
		let result2 = cd.draw(0, 0, sprite2);

		let buffer = cd.buffer.slice(0);

		expect(cd.buffer[0]).toEqual(0b10010000);
		buffer[0] = 0;

		expect(buffer).toEqual(new Uint8Array(cd.buffer.length));
		expect(result1).toStrictEqual(false);
		expect(result2).toStrictEqual(true);
	});

	it('index', () => {
		let cd = new ChipDisplay();

		expect(cd.index(0, 0)).toEqual([0, 0b10000000]);
		expect(cd.index(7, 0)).toEqual([0, 0b00000001]);
		expect(cd.index(5, 0)).toEqual([0, 0b00000100]);
		expect(cd.index(6, 1)).toEqual([8, 0b00000010]);
		expect(cd.index(0, 1)).toEqual([8, 0b10000000]);
	});

	it('set', () => {
		let cd = new ChipDisplay();

		cd.set(5, 0, true);
		expect(cd.buffer[0]).toStrictEqual(0b00000100);

		cd.set(5, 0, false);
		expect(cd.buffer[0]).toStrictEqual(0b00000000);
	});

	it('flip', () => {
		let cd = new ChipDisplay();

		cd.toggle(5, 0);
		expect(cd.buffer[0]).toStrictEqual(0b00000100);

		cd.toggle(5, 0);
		expect(cd.buffer[0]).toStrictEqual(0b00000000);
	});

	it('get', () => {
		let cd = new ChipDisplay();

		cd.buffer[0] = 0b00000100;
		expect(cd.get(5, 0)).toStrictEqual(true);
		expect(cd.get(5, 1)).toStrictEqual(false);
	});

	it('toString', () => {
		let cd = new ChipDisplay();
		let sprite = new ChipSprite([0b11110000]);

		cd.draw(0, 0, sprite);
		expect(cd.toString()).toStrictEqual(
			[
				'.----------------------------------------------------------------.',
				'|****                                                            |',
				'|                                                                |',
				'|                                                                |',
				'|                                                                |',
				'|                                                                |',
				'|                                                                |',
				'|                                                                |',
				'|                                                                |',
				'|                                                                |',
				'|                                                                |',
				'|                                                                |',
				'|                                                                |',
				'|                                                                |',
				'|                                                                |',
				'|                                                                |',
				'|                                                                |',
				'|                                                                |',
				'|                                                                |',
				'|                                                                |',
				'|                                                                |',
				'|                                                                |',
				'|                                                                |',
				'|                                                                |',
				'|                                                                |',
				'|                                                                |',
				'|                                                                |',
				'|                                                                |',
				'|                                                                |',
				'|                                                                |',
				'|                                                                |',
				'|                                                                |',
				'|                                                                |',
				'.----------------------------------------------------------------.'
			].join('\n')
		);
	});
});
