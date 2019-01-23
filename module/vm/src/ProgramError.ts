//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import ErrorChain from '@chipotle/types/ErrorChain';
//! --------------------------------------------------------------------------------------------------------------------

/**
 * An error thrown when something goes wrong with the emulated program.
 */
export default class ProgramError extends ErrorChain {
	// -------------------------------------------------------------------------------------------------------------
	// | Constants:                                                                                                |
	// -------------------------------------------------------------------------------------------------------------

	public static STACK_UNDERFLOW = 'STACK UNDERFLOW';
	public static STACK_OVERFLOW = 'STACK OVERFLOW';
	public static UNKNOWN_OPCODE = 'UNKNOWN OPCODE';
}
