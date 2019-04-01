//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Encoder from '../src/Encoder';
// ---------------------------------------------------------------------------------------------------------------------
describe('Decoder', () => {
	it('string', () => {
		let string = Encoder.string(new Uint8Array([0, 1, 255]));
		expect(string.length).toStrictEqual(3);
		expect(string.charCodeAt(0)).toStrictEqual(0);
		expect(string.charCodeAt(1)).toStrictEqual(1);
		expect(string.charCodeAt(2)).toStrictEqual(255);
	});

	it('base64', () => {
		let b64 = Encoder.base64('hello world');
		expect(b64).toStrictEqual('aGVsbG8gd29ybGQ=');
	});
});
