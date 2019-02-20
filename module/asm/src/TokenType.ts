//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------

/**
 * The type of a source code token.
 */
enum TokenType {
	/**
	 * A label definition.
	 */
	LABEL,

	/**
	 * A constant parameter.
	 */
	PARAMETER_CONSTANT,

	/**
	 * A register parameter.
	 */
	PARAMETER_REGISTER,

	/**
	 * A label parameter.
	 */
	PARAMETER_LABEL,

	/**
	 * A comment.
	 */
	COMMENT,

	/**
	 * An instruction invocation.
	 */
	INSTRUCTION,

	/**
	 * A compile directive invocation.
	 */
	DIRECTIVE,

	/**
	 * Miscellaneous syntax.
	 */
	SYNTAX,

	/**
	 * Miscellaneous whitespace.
	 */
	WHITESPACE,

	/**
	 * Sprite token.
	 */
	SPRITE,

	/**
	 * Unknown token.
	 */
	UNKNOWN,

	/**
	 * End of line.
	 */
	EOL
}

// ---------------------------------------------------------------------------------------------------------------------
export default TokenType;
export {TokenType};
