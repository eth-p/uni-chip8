//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import ErrorChain from '../src/ErrorChain';
// ---------------------------------------------------------------------------------------------------------------------
describe('ErrorChain', () => {
	it('constructor (string)', () => {
		let err = new ErrorChain('test');
		expect(err.message).toStrictEqual('test');
		expect(err.displayName).toStrictEqual('ErrorChain');
		expect(err.name).toStrictEqual('ErrorChain');
		expect(err.cause).toBeUndefined();
	});

	it('constructor (string, Error)', () => {
		let cause = new Error('Bad');
		let err = new ErrorChain('test', cause);
		expect(err.message).toStrictEqual('test');
		expect(err.displayName).toStrictEqual('ErrorChain');
		expect(err.name).toStrictEqual('ErrorChain');
		expect(err.cause).toStrictEqual(cause);
	});

	it('shave (Chrome)', () => {
		let err = new ErrorChain('test');
		err.stack = 'Error\n    at test():16:5\n    at another():8:72';
		expect(err.shave(1).stack).toStrictEqual('Error\n    at another():8:72');
	});

	it('shave (Firefox)', () => {
		let err = new ErrorChain('test');
		err.stack = 'trace@file:///C:/example.html:9:19\nanother@xyz.js:20:33';
		expect(err.shave(1).stack).toStrictEqual('another@xyz.js:20:33');
	});
});
