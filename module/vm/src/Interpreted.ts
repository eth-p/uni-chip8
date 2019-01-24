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
	 * @param operands The operand values.
	 */
	execute(this: void, context: VMContext<A>, operands: Uint16[]): void;

	// TODO: [Reverse-Debugging] reverse(ir: IR, trace: TraceFrame)
	// TODO: [Reverse-Debugging] trace(ir: IR)
}

// ---------------------------------------------------------------------------------------------------------------------

export default Interpreted;
export {Interpreted};
