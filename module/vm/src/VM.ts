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
	 * The clock speed of the virtual machine CPU.
	 */
	public speed: number;

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

	/**
	 * The VM's architecture.
	 * @internal
	 */
	protected readonly _VM_arch: Architecture<A>;

	/**
	 * A boolean which tells whether or not the virtual machine is currently executing an instruction.
	 * @internal
	 */
	protected _VM_executing: boolean;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructor:                                                                                              |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a new virtual machine.
	 * @param arch The architecture of the emulated machine.
	 */
	public constructor(arch: A) {
		this._VM_arch = <Architecture<A>>(<unknown>arch);
		this._VM_executing = false;
		this.program = new Program((<any>arch)._load.bind(this));
		this.program_counter = 0;
		this.tick = 0;
		this.speed = 1;
		this.opcache = new OpCache<A>();
		this.optable = new OpTable<A>((<Architecture<A>>(<unknown>arch)).ISA, this.opcache);

		// Copy descriptors from the architecture.
		let inherit = {
			...Object.getOwnPropertyDescriptors(arch),
			...Object.getOwnPropertyDescriptors(Object.getPrototypeOf(arch))
		};

		for (let [prop, descriptor] of Object.entries(inherit)) {
			if (prop.startsWith('_') || prop.toUpperCase() === prop) descriptor.enumerable = false;
		}

		Object.defineProperties(this, inherit);
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
  
  /*
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

	/**
	 * Resets the virtual machine.
	 * This will reset the virtualized hardware, but not reload the program.
	 */
	public reset(): void {
		this.program_counter = 0;
		this._VM_executing = false;
		(<any>this)._reset();
	}

	/**
	 * Executes an instruction and decrements timers.
	 */
	public step(): void {
		assert(!this._VM_executing, 'The VM is already executing an instruction');
		assert(this.program !== null, 'There is no program loaded');

		this._VM_executing = true;

		// Fetch and decode the opcode.
		let opcode = this.program!.fetch(this.program_counter);
		let ir = this.optable.decode(opcode);

		// Increment the timers.
		(<any>this)._tick();

		// Execute the opcode.
		ir[0](<VMContext<A>>(<unknown>this), ir[1], ir[2]);

		// Increment the program counter.
		this.program_counter += 2;

		// Return.
		this._VM_executing = false;
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
