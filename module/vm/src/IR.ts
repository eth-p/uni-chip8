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
type IR<A> = [Interpreted<A>['execute'] & {op: Operation}, Uint16?, Uint16?, Uint16?];
export default IR;
export {IR};
