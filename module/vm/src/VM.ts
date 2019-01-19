//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Architecture from './Architecture';
import OpAddress from './OpAddress';
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
	 */
	protected readonly _arch: Architecture<A>;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructor:                                                                                              |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a new virtual machine.
	 * @param arch The architecture of the emulated machine.
	 */
	public constructor(arch: A) {
		this._arch = <Architecture<A>>(<unknown>arch);
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
		this.program_counter = to;
	}

	/**
	 * Resets the virtual machine.
	 * This will reset the virtualized hardware, but not reload the program.
	 */
	public reset(): void {
		this.program_counter = 0;
		(<any>this)._reset();
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
