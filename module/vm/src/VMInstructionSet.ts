//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import InstructionSet from '@chipotle/isa/InstructionSet';

import Interpreted from './Interpreted';

// ---------------------------------------------------------------------------------------------------------------------

/**
 * An instruction set that can be interpreted by the VM.
 */
class VMInstructionSet<A> extends InstructionSet<Interpreted<A>> {}
export default VMInstructionSet;
export {VMInstructionSet};
