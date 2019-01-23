//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Uint16 from '@chipotle/types/Uint16';

import InstructionCache from '../src/InstructionCache';
import Operation from '../src/Operation';

// ---------------------------------------------------------------------------------------------------------------------

let TestOp = new Operation('ALPHA', 0xa000, [
	{
		mask: 0x0fff,
		type: 0
	}
]);

// ---------------------------------------------------------------------------------------------------------------------
describe('InstuctionCache', () => {
	it('constructor', () => {
		let opcache = new InstructionCache<Uint16[]>();
	});

	it('put', () => {
		let opcache = new InstructionCache<Uint16[]>();
		let opcode = 0xa000;

		let ir = TestOp.decode(opcode);
		opcache.put(opcode, ir);
	});

	it('get', () => {
		let opcache = new InstructionCache<Uint16[]>();
		let opcode = 0xa000;

		let ir = TestOp.decode(opcode);
		opcache.put(opcode, ir);
		expect(opcache.get(0xa000)).toStrictEqual(ir);
		expect(opcache.get(0x0000)).toStrictEqual(<any>null);
	});

	it('size', () => {
		let opcache = new InstructionCache<Uint16[]>();
		let opcode = 0xa000;

		let ir = TestOp.decode(opcode);
		expect(opcache.size).toStrictEqual(0);
		opcache.put(opcode, ir);
		expect(opcache.size).toStrictEqual(1);
	});

	it('invalidate', () => {
		let opcache = new InstructionCache<Uint16[]>();
		let opcode = 0xa000;

		let ir = TestOp.decode(opcode);
		opcache.put(opcode, ir);
		opcache.invalidate(opcode);
		expect(opcache.get(opcode)).toStrictEqual(<any>null);
	});

	it('invalidateAll', () => {
		let opcache = new InstructionCache<Uint16[]>();
		let opcode = 0xa000;

		let ir = TestOp.decode(opcode);
		opcache.put(opcode, ir);
		opcache.invalidateAll();
		expect(opcache.get(opcode)).toStrictEqual(<any>null);
	});
});
