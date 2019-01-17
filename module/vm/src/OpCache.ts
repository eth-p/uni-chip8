//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import IR from './IR';
import OpCode from './OpCode';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * A cache for decoded instructions.
 */
export default class OpCache<A> {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	protected map: Map<OpCode, IR<A>>;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructor:                                                                                              |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Create a opcode cache.
	 */
	public constructor() {
		this.map = new Map();
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Getters:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * The number of cached opcodes.
	 */
	public get size() {
		return this.map.size;
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Gets the cached IR for an opcode.
	 *
	 * @param opcode The opcode.
	 * @returns The cached IR, or null if not found.
	 */
	public get(opcode: OpCode): IR<A> | null {
		let entry = this.map.get(opcode);
		if (entry === undefined) return null;
		return entry;
	}

	/**
	 * Adds an IR to the cache.
	 *
	 * @param opcode The opcode.
	 * @param ir The IR of the opcode.
	 */
	public put(opcode: OpCode, ir: IR<A>): void {
		this.map.set(opcode, ir);
	}

	/**
	 * Invalidates a cached opcode.
	 * @param opcode The opcode.
	 */
	public invalidate(opcode: OpCode): void {
		this.map.delete(opcode);
	}

	/**
	 * Invalidates all cached opcodes.
	 */
	public invalidateAll(): void {
		this.map.clear();
	}
}
