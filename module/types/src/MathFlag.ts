//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------

/**
 * Flags to indicate the result of math operations.
 */
enum MathFlag {
	/**
	 * The operation completed without any issues.
	 */
	OK = 0,

	/**
	 * The operation caused an overflow.
	 */
	OVERFLOW = 1
}

// ---------------------------------------------------------------------------------------------------------------------
export default MathFlag;
export {MathFlag};
