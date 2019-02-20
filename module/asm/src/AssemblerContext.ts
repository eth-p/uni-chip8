//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Token from './Token';

import RootNode from './node/RootNode';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * The context and working environment of the assembler.
 */
abstract class AssemblerContext {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * The root node of the AST.
	 */
	public root: RootNode;

	/**
	 * The name of the assembly file.
	 */
	public readonly filename: string;

	/**
	 * The source tokens of the assembly file.
	 */
	protected tokens: Token[];

	/**
	 * A map of symbols.
	 * A symbol is a named node.
	 *
	 * This can contain parameter definitions, macros, or labelled nodes.
	 */
	protected symbols: Map<string, Node>;

	/**
	 * An incrementing ID.
	 */
	protected idNumber: number;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructor:                                                                                              |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a new assembler context.
	 *
	 * @param filename The assembly file name.
	 * @param tokens The assembly file tokens.
	 */
	protected constructor(filename: string, tokens: Token[]) {
		this.idNumber = 0;
		this.symbols = new Map();
		this.tokens = tokens;
		this.filename = filename;
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Generates a unique ID for a node.
	 */
	public generateIdentifier(): number {
		return this.idNumber++;
	}

	/**
	 * Gets a symbol in the context.
	 *
	 * @param name The symbol name.
	 *
	 * @returns The symbol node, or null if not found.
	 */
	public getSymbol(name: string): Node | null {
		return this.symbols.get(name) || null;
	}

	/**
	 * Sets a symbol in the context.
	 *
	 * @param name The symbol name.
	 * @param value The symbol node.
	 */
	public setSymbol(name: string, value: Node): void {
		this.symbols.set(name, value);
	}

	/**
	 * Gets a source code token from the context.
	 *
	 * @param index The index of the token.
	 *
	 * @returns The token, or null if not found.
	 */
	public getToken(index: number): Token | null {
		return this.tokens[index] || null;
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default AssemblerContext;
export {AssemblerContext};
