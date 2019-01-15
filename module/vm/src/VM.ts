//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import OpAddress from './OpAddress';
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
		this.program_counter = to;
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
