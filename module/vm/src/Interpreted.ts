//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Uint16 from '@chipotle/types/Uint16';

import VMContext from './VMContext';

// ---------------------------------------------------------------------------------------------------------------------

/**
 * An interface for operations that can be interpreted.
 */
interface Interpreted<A> {
	/**
	 * Executes the operation.
	 *
	 * @param context The virtual machine context.
	 * @param operands The operand values.
	 */
	execute(this: void, context: VMContext<A>, operands: Uint16[]): void;
}

// ---------------------------------------------------------------------------------------------------------------------

export default Interpreted;
export {Interpreted};
