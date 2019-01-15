//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Architecture from './Architecture';
import Op from './Op';
import OpCode from './OpCode';
import VMContext from './VMContext';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * The op execute function with an `op` property on it that refers back to the Op instance.
 */
type OpExecuteFn<T extends Architecture> = ((context: VMContext<T>, p1: OpCode, p2: OpCode) => void) & {op: Op<T>};

/**
 * Intermediate representation of an executable operation.
 */
type IR<T extends Architecture> = [OpExecuteFn<T>, OpCode, OpCode];
export default IR;
