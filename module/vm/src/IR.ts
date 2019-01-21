//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Op from './Op';
import OpCode from './OpCode';
import VMContext from './VMContext';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * The op execute function with an `op` property on it that refers back to the Op instance.
 */
type OpExecuteFn<A> = ((context: VMContext<A>, p1: OpCode, p2: OpCode, p3: OpCode) => void) & {op: Op<A>};

/**
 * Intermediate representation of an executable operation.
 */
type IR<A> = [OpExecuteFn<A>, OpCode, OpCode, OpCode];
export default IR;
