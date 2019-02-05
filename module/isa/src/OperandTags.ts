//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Common operand tags.
 */
enum OperandTags {
	/**
	 * The operand is a destination.
	 * This is used by the assembler to determine the operand order between Intel and AT&T syntax.
	 *
	 * Corresponds to a boolean.
	 */
	IS_DESTINATION,

	/**
	 * The operand is unsed.
	 * This is used by the assembler to determine if an operand should be ignored.
	 *
	 * Corresponds to a boolean.
	 */
	IS_UNUSED,

	/**
	 * The operand requires an exact assembly value.
	 *
	 * Corresponds to the expected value token.
	 */
	IS_EXACT
}

// ---------------------------------------------------------------------------------------------------------------------

export {OperandTags};
export default OperandTags;
