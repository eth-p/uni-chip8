//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Instruction from './Instruction';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * A cache for decoded instructions.
 */
class InstructionCache<A> {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	protected map: Map<Instruction, A>;

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
	 * Gets the cached value for an instruction.
	 *
	 * @param instruction The instruction.
	 * @returns The cached value, or null if not found.
	 */
	public get(instruction: Instruction): A | null {
		let entry = this.map.get(instruction);
		if (entry === undefined) return null;
		return entry;
	}

	/**
	 * Sets a cached value to the cache.
	 *
	 * @param instruction The instruction.
	 * @param value The value to cache.
	 */
	public put(instruction: Instruction, value: A): void {
		this.map.set(instruction, value);
	}

	/**
	 * Invalidates a cached instruction.
	 * @param instruction The instruction.
	 */
	public invalidate(instruction: Instruction): void {
		this.map.delete(instruction);
	}

	/**
	 * Invalidates all cached instructions.
	 */
	public invalidateAll(): void {
		this.map.clear();
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default InstructionCache;
export {InstructionCache};
