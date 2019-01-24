//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Operation from '@chipotle/isa/Operation';
import Uint16 from '@chipotle/types/Uint16';

import Interpreted from './Interpreted';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Intermediate representation of an executable operation.
 */
interface IR<A> {
	execute: Interpreted<A>['execute'];
	operation: Operation;
	operands: Uint16[];
}

// ---------------------------------------------------------------------------------------------------------------------
export default IR;
export {IR};
