//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import ProgramSource from './ProgramSource';
import VMContext from './VMContext';
import VMInstructionSet from './VMInstructionSet';
import VMSnapshot from '@chipotle/vm/VMSnapshot';
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
	public readonly isa: VMInstructionSet<A>;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructor:                                                                                              |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a new computer architecture.
	 * @param isa The instruction set of the architecture.
	 */
	protected constructor(isa: VMInstructionSet<A>) {
		this.isa = isa;
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

	/**
	 * Handles a debug option.
	 * This is called when {@link setDebugOption} is called.
	 *
	 * @param option The option key.
	 * @param value The option value.
	 *
	 * @protected
	 */
	protected abstract _debugOption(this: VMContext<A>, option: string, value: any): void;

	// 	/**
	// 	 * Stores the architecture state into a snapshot.
	// 	 * @param snapshot The snapshot to store into.
	// 	 */
	// 	protected abstract _saveSnapshot(this: VMContext<A>, snapshot: VMSnapshot): void;
	//
	// 	/**
	// 	 * Restores the architecture state from a snapshot.
	// 	 * @param snapshot The snapshot to restore from.
	// 	 */
	// 	protected abstract _loadSnapshot(this: VMContext<A>, snapshot: VMSnapshot): void;
}

// ---------------------------------------------------------------------------------------------------------------------

export default Architecture;
export {Architecture};
