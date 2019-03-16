//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------

/**
 * An error thrown when something goes wrong with the virtual machine.
 */
export default class VMError extends Error {
	// -------------------------------------------------------------------------------------------------------------
	// | Constants:                                                                                                |
	// -------------------------------------------------------------------------------------------------------------

	public static SNAPSHOT_VERS_MISMATCH = 'SNAPSHOT VERSION MISMATCH';
	public static SNAPSHOT_ARCH_MISMATCH = 'SNAPSHOT ARCHITECTURE MISMATCH';
	public static SNAPSHOT_INVALID = 'SNAPSHOT INVALID';
}
