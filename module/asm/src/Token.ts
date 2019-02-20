//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import TokenType from './TokenType';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * A source code token.
 * These are created from tokenizing source code.
 */
class Token {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * The token type.
	 * This should be determined by the parser.
	 */
	public type: TokenType;

	/**
	 * The line number of where this token occurred.
	 */
	public readonly line: number;

	/**
	 * The starting column of where this token occurred.
	 */
	public readonly column: number;

	/**
	 * The token text.
	 */
	public readonly text: string;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructor:                                                                                              |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a new source code token.
	 *
	 * @param type The token type.
	 * @param text The token text.
	 * @param line The line number.
	 * @param column The column number.
	 */
	public constructor(type: TokenType, text: string, line: number, column: number) {
		this.type = type;
		this.text = text;
		this.line = line;
		this.column = column;
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Casting:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a string from the token.
	 * @returns The token text.
	 */
	public toString(): string {
		return this.text;
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default Token;
export {Token};
