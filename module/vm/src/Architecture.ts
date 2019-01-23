//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import InstructionSet from '@chipotle/isa/InstructionSet';

import Interpreted from './/Interpreted';
import ProgramSource from './ProgramSource';
import VMContext from './VMContext';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * A computer architecture.
 * This class represents the available components and instruction set of a specific computer.
 */
abstract class Architecture<A> {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * The instruction set.
	 */
	public readonly ISA: InstructionSet<Interpreted<A>>;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructor:                                                                                              |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a new computer architecture.
	 * @param isa The instruction set of the architecture.
	 */
	protected constructor(isa: InstructionSet<Interpreted<A>>) {
		this.ISA = isa;
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Loads a program from a program source.
	 *
	 * @returns The loaded program, or false if there's no way to load the program.
	 * @protected
	 */
	protected abstract async _load(source: ProgramSource): Promise<Uint8Array | false>;

	/**
	 * Hard resets the architecture hardware.
	 * This method should be used to reinitialize hardware.
	 *
	 * @protected
	 */
	protected abstract _reset(this: VMContext<A>): void;

	/**
	 * Ticks down any timers.
	 * This should be independent of the *actual* clock speed.
	 *
	 * @protected
	 */
	protected abstract _tick(this: VMContext<A>): void;
}

// ---------------------------------------------------------------------------------------------------------------------

export default Architecture;
export {Architecture};
