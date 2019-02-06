//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Token from './Token';
import TokenType from './TokenType';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * A regex-based source code lexer.
 * This splits up source code into assembly tokens.
 */
export default class Lexer {
	// -------------------------------------------------------------------------------------------------------------
	// | Constants: Matchers                                                                                       |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * The pattern matcher for a token.
	 */
	public static readonly MATCHER = new RegExp(
		/* Matcher Start  */
		'^(?:' +
			/*
			 * Match: Comment
			 */
			'(?:;.*$)|' +
			/*
			 * Match: Whitespace
			 */
			'(?:[ \\t]+)|' +
			/*
			 * Match: Sprite
			 */
			'(?:\\|[ \\t]*[^; \\t]*)|' +
			/*
			 * Match: Parameter (AT&T Syntax)
			 */
			'(?:[$%][\\w\\d]+)|' +
			/*
			 * Match: Word
			 */
			'(?:[\\w\\d]+)|' +
			/*
			 * Match: Syntax Character
			 */
			'(?:[^\\w\\d])|' +
			/* Matcher End */
			')'
	);

	public readonly MATCHER: RegExp = (<any>this.constructor).MATCHER;

	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * The line at current position of the lexer.
	 */
	protected caretLine: number;

	/**
	 * The column at the current position of the lexer.
	 */
	protected caretColumn: number;

	/**
	 * The assembly source code.
	 */
	protected lines: string[];

	/**
	 * The line being tokenized.
	 * This will be trimmed as the line is tokenized.
	 */
	protected current: string;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructor:                                                                                              |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a new lexer.
	 *
	 * @param source The assembly source code.
	 */
	public constructor(source: string) {
		this.lines = source.split('\n');
		this.current = this.lines[0];
		this.caretLine = 0;
		this.caretColumn = 0;
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Finds and returns all tokens.
	 *
	 * @returns All the tokens in the source code.
	 */
	toArray(): Token[] {
		this.reset();
		let tokens = [];

		while (this.hasNext()) {
			tokens.push(this.next());
		}

		return tokens;
	}

	/**
	 * Resets the lexer to the beginning of the file.
	 */
	reset(): void {
		this.current = this.lines[0];
		this.caretColumn = 0;
		this.caretLine = 0;
	}

	/**
	 * Gets the next token in the file.
	 * @returns The token.
	 */
	next(): Token {
		let token;

		// EOL.
		if (this.current.length === 0) {
			token = new Token(TokenType.EOL, '\n', this.caretLine, this.caretColumn);
			this.caretColumn = 0;
			this.caretLine++;
			this.current = this.lines[this.caretLine];
			return token;
		}

		// Match.
		let match = this.MATCHER.exec(this.current);
		if (match !== null) {
			token = new Token(
				TokenType.UNKNOWN,
				this.current.substring(0, match[0].length),
				this.caretLine,
				this.caretColumn
			);
			this.current = this.current.substring(match[0].length);
			this.caretColumn += match[0].length;
			return token;
		}

		// No match?
		token = new Token(TokenType.UNKNOWN, this.current.charAt(0), this.caretLine, this.caretColumn);
		this.current = this.current.substring(1);
		this.caretColumn++;
		return token;
	}

	/**
	 * Checks if there are any tokens left.
	 * @returns True if there are still tokens left.
	 */
	hasNext(): boolean {
		return this.caretLine < this.lines.length;
	}

	/**
	 * Gets the line at current position of the lexer.
	 * @returns The current line.
	 */
	getLine(): number {
		return this.caretLine;
	}

	/**
	 * Gets the column at current position of the lexer.
	 * @returns The current column.
	 */
	getColumn(): number {
		return this.caretColumn;
	}
}
