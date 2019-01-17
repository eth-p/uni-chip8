//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------

/**
 * An error thrown when something goes wrong with the emulated program.
 */
export default class ProgramError extends Error {
	// -------------------------------------------------------------------------------------------------------------
	// | Constants:                                                                                                |
	// -------------------------------------------------------------------------------------------------------------

	public static STACK_UNDERFLOW = 'STACK UNDERFLOW';
	public static STACK_OVERFLOW = 'STACK OVERFLOW';
	public static UNKNOWN_OPCODE = 'UNKNOWN OPCODE';
}
