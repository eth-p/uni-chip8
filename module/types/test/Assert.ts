//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import assert from '../src/assert';
import AssertError from '../src/AssertError';
// ---------------------------------------------------------------------------------------------------------------------
describe('assert', () => {
	it('assert (boolean)', () => {
		expect(() => assert(false)).toThrowError(AssertError);
	});

	it('assert (boolean, string)', () => {
		expect(() => assert(false, 'hi')).toThrowError('hi');
	});
});
