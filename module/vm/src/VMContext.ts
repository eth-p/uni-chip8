//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import VM from './VM';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * An instance of a VM.
 * This exists as an intersection between the VM class and the hardware of the provided architecture.
 */
export type Context<A> = VM<A> & A;
export default Context;
