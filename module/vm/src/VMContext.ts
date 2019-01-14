// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Team Chipotle
// MIT License
// ---------------------------------------------------------------------------------------------------------------------
import Architecture from './Architecture';
import VM from './VM';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * An instance of a VM.
 * This exists as an intersection between the VM class and the hardware of the provided architecture.
 */
export type Context<A extends Architecture> = VM<A> & A;
export default Context;
