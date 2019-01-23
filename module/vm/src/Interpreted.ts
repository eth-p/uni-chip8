//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Optional from '@chipotle/types/Optional';
import Uint16 from '@chipotle/types/Uint16';

import VMContext from './VMContext';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * An interface for instructions that can be interpreted.
 */
interface Interpreted<A> {
	/**
	 * Executes the instruction.
	 *
	 * @param context The virtual machine context.
	 * @param p1 The first operand value.
	 * @param p2 The second operand value.
	 * @param p3 The third operand value.
	 */
	execute(this: void, context: VMContext<A>, p1: Optional<Uint16>, p2: Optional<Uint16>, p3: Optional<Uint16>): void;

	// TODO: [Reverse-Debugging] reverse(ir: IR, trace: TraceFrame)
	// TODO: [Reverse-Debugging] trace(ir: IR)
}

// ---------------------------------------------------------------------------------------------------------------------

export default Interpreted;
export {Interpreted};
