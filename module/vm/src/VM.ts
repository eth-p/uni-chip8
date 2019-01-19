//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import assert from '@chipotle/types/assert';

import Architecture from './Architecture';
import {default as OpAddress, isValid} from './OpAddress';
import OpCache from './OpCache';
import OpTable from './OpTable';
import Program from './Program';
import VMContext from './VMContext';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Hello, world!
 */
export class VMBase<A> {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * The executable program.
	 */
	public program: Program<A> | null;

	/**
	 * The program counter.
	 * This should not be directly manipulated.
	 *
	 * @internal
	 */
	public program_counter: OpAddress;

	/**
	 * An ascending counter for the number of cycles executed.
	 */
	public tick: number;

	/**
	 * The instruction lookup table.
	 */
	public optable: OpTable<A>;

	/**
	 * The instruction cache.
	 */
	public opcache: OpCache<A>;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructor:                                                                                              |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a new virtual machine.
	 * @param arch The architecture of the emulated machine.
	 */
	public constructor(arch: A) {
		this.program = new Program((<any>arch)._load.bind(this));
		this.program_counter = 0;
		this.tick = 0;
		this.opcache = new OpCache<A>();
		this.optable = new OpTable<A>((<Architecture<A>>(<unknown>arch)).ISA, this.opcache);

		// Copy descriptors from the architecture.
		Object.defineProperties(this, Object.getOwnPropertyDescriptors(arch));
		Object.defineProperties(
			this,
			Object.entries(Object.getOwnPropertyDescriptors(Object.getPrototypeOf(arch)))
				.filter(([prop]) => prop !== '_load')
				.reduce((a, [prop, descr]) => (a[prop] = descr), <any>{})
		);
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Jump to an address in the program.
	 * @param to The address to jump to.
	 */
	public jump(to: OpAddress): void {
		assert(to > 0, "Parameter 'to' is out of bounds for program (under)");
		assert(to < this.program!.data!.length, "Parameter 'to' is out of bounds for program (over)");
		assert(isValid(to), "Parameter 'to' is out of range for OpAddress");
		this.program_counter = to;
	}

	/**
	 * Jumps forwards to a relative address in the program.
	 * @param by The number of instructions to jump.
	 */
	public jumpForwards(by: OpAddress): void {
		assert(isValid(by), "Parameter 'by' is out of range for OpAddress");
		this.jump(this.program_counter + by);
	}

	/**
	 * Jumps backwards to a relative address in the program.
	 * @param by The number of instructions to jump.
	 */
	public jumpBackwards(by: OpAddress): void {
		assert(isValid(by), "Parameter 'by' is out of range for OpAddress");
		this.jump(this.program_counter - by);
	}
}

// ---------------------------------------------------------------------------------------------------------------------
// Developer Notes:
// @eth-p: Everything past here is essentially really fancy type overloading.
//         In TypeScript, you can't directly change the return type of a constructor and generic mixins aren't allowed.
//         To solve this, we use declaration merging and define an overloaded constructor.
// ---------------------------------------------------------------------------------------------------------------------

/**
 * A representation of the {@link VMBase VM} class's static members.
 * If you need to add a static method to VM, you need to define it here as well.
 */
interface VMClass {
	new <A>(): VMContext<A>;
}

const VM: VMClass = <any>VMBase;
interface VM<A> extends VMBase<A> {}
export default VM;
