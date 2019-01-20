//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import IndexRegister from '../src/IndexRegister';

// ---------------------------------------------------------------------------------------------------------------------

describe('IndexRegister', () => {
	it('set and get', () => {
		let Index: IndexRegister = new IndexRegister();
		Index.value = 0x500;
		expect(Index.value).toEqual(0x500);
	});

	it('default constructor', () => {
		let Index: IndexRegister = new IndexRegister();
		expect(Index.value).toEqual(0);
	});
});
