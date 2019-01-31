//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Uint16 from '@chipotle/types/Uint16';

import JITOperation from './JITOperation';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * An interface for operations that can be JIT compiled.
 */
interface OpCompiled<A> {
	/**
	 * Compiles the instruction.
	 * This is an extremely slow method, and should be used sparingly.
	 *
	 * @param operands The operand values.
	 */
	compile(this: void, operands: Uint16[]): JITOperation<A>;
}

// ---------------------------------------------------------------------------------------------------------------------

export default OpCompiled;
export {OpCompiled};
