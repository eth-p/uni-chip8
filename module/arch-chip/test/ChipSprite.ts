//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Bitfield from '@chipotle/types/Bitfield';

import ChipSprite from '../src/ChipSprite';
// ---------------------------------------------------------------------------------------------------------------------
describe('ChipSprite Constants', () => {
	it('MAX_WIDTH', () => {
		expect(ChipSprite.MAX_WIDTH).toStrictEqual(8);
	});

	it('MAX_HEIGHT', () => {
		expect(ChipSprite.MAX_HEIGHT).toStrictEqual(15);
	});
});

describe('ChipSprite', () => {
	it('constructor', () => {
		let sprite1 = new ChipSprite([0b00001000]);
		expect(sprite1.height).toStrictEqual(1);
		expect(sprite1.buffer).toEqual([0b00001000]);

		let sprite2 = new ChipSprite([0b00001000, 0b10000000]);
		expect(sprite2.height).toStrictEqual(2);
		expect(sprite2.buffer).toEqual([0b00001000, 0b10000000]);

		let sprite3 = new ChipSprite([0b00001000, 0b10000000], 1, 1);
		expect(sprite3.height).toStrictEqual(1);
		expect(sprite3.buffer).toEqual([0b10000000]);

		let sprite4 = new ChipSprite(new Uint8Array([0b00001000, 0b10000000]), 1, 1);
		expect(sprite4.height).toStrictEqual(1);
		expect(sprite4.buffer).toBeInstanceOf(Uint8Array);
	});

	it('toBitfield', () => {
		let sprite = new ChipSprite([0b00001000, 0b10000000]);
		let bitfield = sprite.toBitfield();

		expect(bitfield).toBeInstanceOf(Array);
		expect(bitfield.length).toStrictEqual(2);
		expect(bitfield[0]).toBeInstanceOf(Bitfield);
		expect(bitfield.map(x => x.toString())).toEqual(['00001000', '10000000']);
	});

	it('toString', () => {
		let sprite = new ChipSprite([0b01110000, 0b00100000, 0b00100000]);

		let sprite2 = new ChipSprite([0b01110000, 0b10001000, 0b00100000, 0b00000000, 0b00100000]);

		expect(sprite.toString()).toStrictEqual('XXX\n X \n X ');
		expect(sprite2.toString()).toStrictEqual(' XXX \nX   X\n  X  \n     \n  X  ');
	});
});
