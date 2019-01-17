//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Architecture from '../src/Architecture';
import Program from '../src/Program';
import ProgramSource from '../src/ProgramSource';
// ---------------------------------------------------------------------------------------------------------------------

abstract class TestArch extends Architecture<TestArch> {
	public async _load(source: ProgramSource) {
		return <Uint8Array>source;
	}
}

// ---------------------------------------------------------------------------------------------------------------------

describe('Program', () => {
	it('constructor', () => {
		let prog = new Program(TestArch.prototype._load);
	});

	it('load', async () => {
		let prog = new Program(TestArch.prototype._load);
		let data = new Uint8Array([1, 3, 5, 9]);
		await prog.load(data);
		expect(Array.from(prog.data!)).toEqual([1, 3, 5, 9]);
	});
});
