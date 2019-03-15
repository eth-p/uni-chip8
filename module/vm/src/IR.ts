//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Operation from '@chipotle/isa/Operation';
import Uint16 from '@chipotle/types/Uint16';

import Interpreted from './Interpreted';
// ---------------------------------------------------------------------------------------------------------------------

namespace IR {
	/**
	 * Intermediate representation of an operation.
	 * This is the common ancestor of all IR variations.
	 */
	export interface COMMON<A> {
		operation: Operation;
		operands: Uint16[];
	}
}

/**
 * Intermediate representation of an executable operation.
 */
interface IR<A> extends IR.COMMON<A> {
	execute: Interpreted<A>['execute'];
}

// ---------------------------------------------------------------------------------------------------------------------
export default IR;
export {IR};
