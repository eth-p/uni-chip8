//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import AssemblerContext from './AssemblerContext';
import NodeType from './NodeType';
import Token from './Token';
import Visitor from './Visitor';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * An Abstract Syntax Tree node.
 * This is the base class for all nodes.
 */
abstract class Node {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * The node type.
	 */
	public type: NodeType;

	/**
	 * The node's children, if applicable.
	 */
	public children: Node[] | null;

	/**
	 * The node's parent, if applicable.
	 */
	public parent: Node | null;

	/**
	 * The indices of source code tokens that created this node.
	 */
	public source: number[];

	/**
	 * The assembler context.
	 */
	protected context: AssemblerContext;

	/**
	 * The unique node ID.
	 */
	protected id: number;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructor:                                                                                              |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a new node.
	 *
	 * @param type The node type.
	 * @param parent The parent node.
	 */
	protected constructor(type: NodeType, parent: AssemblerContext | Node) {
		this.type = type;
		this.children = null;
		this.source = [];

		if (parent instanceof Node) {
			this.parent = parent;
			this.context = parent.context;
		} else {
			this.parent = null;
			this.context = parent;
		}

		this.id = this.context.generateIdentifier();
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Visitor:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Visits this node.
	 * If the visitor returns a different node, this will be replaced with said node.
	 *
	 * @param visitor The visitor function.
	 */
	public visit(visitor: Visitor<Node>): Node {
		// tslint:disable-next-line:no-this-assignment
		let self: Node = this;

		if (this.parent !== null) {
			let index = this.parent.children!.findIndex(node => node.id === this.id);
			let result = visitor(this, this.context);

			if (result.id !== this.id) {
				result.uptag(true);
				self = this.parent.children![index] = result;
			}
		}

		return self;
	}

	/**
	 * Visits this node's older siblings in reverse order.
	 * If the visitor returns a different node, the sibling will be replaced with said node.
	 *
	 * ## Example:
	 * ```
	 *     [a][b][c][this][d][e]
	 *     Visits: c -> b -> a
	 * ```
	 *
	 * @param visitor The visitor function.
	 */
	public visitNextSiblings(visitor: Visitor<Node>): Node {
		if (this.parent === null) {
			return this;
		}

		let needsUptag = false;
		let index = this.parent.children!.findIndex(node => node.id === this.id);

		for (let i = index - 1; i >= 0; i--) {
			let sibling = this.parent.children![i];
			let result = visitor(sibling, sibling.context);
			if (result.id !== sibling.id) {
				this.parent.children![i] = result;
				needsUptag = true;
				result.uptag(false);
			}
		}

		if (needsUptag) {
			this.uptag(true);
		}

		return this;
	}
	/**
	 * Visits this node's younger siblings in forwards order.
	 * If the visitor returns a different node, the sibling will be replaced with said node.
	 *
	 * ## Example:
	 * ```
	 *     [a][b][c][this][d][e]
	 *     Visits: d -> e
	 * ```
	 *
	 * @param visitor The visitor function.
	 */
	public visitPreviousSiblings(visitor: Visitor<Node>): Node {
		if (this.parent === null) {
			return this;
		}

		let needsUptag = false;
		let index = this.parent.children!.findIndex(node => node.id === this.id);

		for (let i = index + 1; i < this.parent.children!.length; i++) {
			let sibling = this.parent.children![i];
			let result = visitor(sibling, sibling.context);
			if (result.id !== sibling.id) {
				this.parent.children![i] = result;
				needsUptag = true;
				result.uptag(false);
			}
		}

		if (needsUptag) {
			this.uptag(true);
		}

		return this;
	}

	/**
	 * Visits this node's children.
	 * If the visitor returns a different node, the child will be replaced with said node.
	 *
	 * @param visitor The visitor function.
	 */
	public visitChildren(visitor: Visitor<Node>): Node {
		if (!this.hasChildren()) return this;

		let needsUptag = false;
		for (let i = 0; i < this.children!.length; i++) {
			let child = this.children![i];
			let result = visitor(child, child.context);
			if (result.id !== child.id) {
				this.children![i] = result;
				needsUptag = true;
				result.uptag(false);
			}
		}

		if (needsUptag) {
			this.uptag(true);
		}

		return this;
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Clones the node.
	 * @returns A new, unique node tree.
	 */
	public abstract clone<T extends Node>(): T;

	/**
	 * Merges this node's tags with another tag.
	 * @param into The node to merge the tags into.
	 */
	protected abstract mtag(into: Node): void;

	/**
	 * Merges this node's tags with its parent tag.
	 * @param recurse If true, this will keep recursing until the root node is reached.
	 */
	public uptag(recurse: boolean): void {
		if (this.parent === null) return;

		if (recurse) {
			this.uptag(true);
		} else {
			this.mtag(this.parent);
		}
	}

	/**
	 * Checks if the node has children.
	 * @returns True if the node supports children, and has at least one child.
	 */
	public hasChildren(): boolean {
		return this.children !== null && this.children.length > 0;
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Casting:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a string from the node.
	 * @returns A string which represents the node and its children.
	 */
	public toString(): string {
		return `${this.constructor.name}[]`;
	}

	/**
	 * Creates a tree from the node.
	 * @returns A string which represents the node and its children.
	 */
	public toStringTree(): string {
		let buffer = '';

		if (this.children != null) {
			for (let child of this.children) {
				buffer += child.toStringTree();
			}
		}

		return `${this.toString()}\n${buffer
			.split('\n')
			.map(x => `|- ${x}`)
			.join('\n')}`;
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default Node;
export {Node};
