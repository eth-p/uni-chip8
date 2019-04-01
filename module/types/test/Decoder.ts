//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Decoder from '../src/Decoder';
import Encoder from '../src/Encoder';
// ---------------------------------------------------------------------------------------------------------------------
describe('Decoder', () => {
	it('string', () => {
		let buffer = new Uint8Array(Decoder.string(String.fromCharCode(0, 1, 255)));
		expect(buffer.length).toStrictEqual(3);
		expect(buffer[0]).toStrictEqual(0);
		expect(buffer[1]).toStrictEqual(1);
		expect(buffer[2]).toStrictEqual(255);
	});

	it('base64', () => {
		let str = Decoder.base64('aGVsbG8gd29ybGQ=');
		expect(str).toStrictEqual('hello world');
	});

	it('Consistency', () => {
		let buffer = new Uint8Array(256);
		for (let i = 0; i <= 255; i++) buffer[i] = i;

		let encoded = Encoder.string(buffer);
		let decoded = new Uint8Array(Decoder.string(encoded));
		expect(decoded).toEqual(buffer);
	});
});
