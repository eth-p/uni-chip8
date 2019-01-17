//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Architecture from './Architecture';
import Op from './Op';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * An instruction set architecture.
 * This is essentially just an array of Op class constructors.
 */
type ISA<A> = {new (): Op<A>}[];
export default ISA;
