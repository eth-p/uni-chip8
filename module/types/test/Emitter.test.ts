//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Emitter from '../src/Emitter';
// ---------------------------------------------------------------------------------------------------------------------
describe('Emitter', () => {
	it('constructor', () => {
		let emitter = new Emitter();
	});

	it('addListener', () => {
		let emitter = new Emitter();
		emitter.addListener('test', () => {});
	});

	it('removeListener', () => {
		let fail = false;
		let emitter = new Emitter();
		let listener = () => (fail = true);

		emitter.addListener('test', listener);
		emitter.removeListener('test', listener);
		emitter.emit('test');

		expect(fail).toStrictEqual(false);
	});

	it('emit', () => {
		let fail = true;
		let toofew = true;
		let toomany = false;
		let emitter = new Emitter();

		emitter.addListener('test', () => (fail = false));
		emitter.addListener('test', () => (toofew = false));
		emitter.addListener('test2', () => (toomany = true));
		emitter.emit('test');

		expect(fail).toStrictEqual(false);
		expect(toofew).toStrictEqual(false);
		expect(toomany).toStrictEqual(false);
	});
});
