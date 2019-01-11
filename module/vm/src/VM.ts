// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Team Chipotle
// MIT License
// ---------------------------------------------------------------------------------------------------------------------
import VMRegisters from "./VMRegisters";
// ---------------------------------------------------------------------------------------------------------------------

/**
 * A software representation of CHIP-8 hardware.
 */
export default class VM {

	// -------------------------------------------------------------------------------------------------------------
	// | Constants:                                                                                                |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * The maximum amount of memory available to the CHIP-8.
	 */
	public static readonly MEMORY_MAX = 4096;

	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Virtual machine memory.
	 * Stores 4096 bytes.
	 */
	public memory: Uint8Array;

	/**
	 * Virtual machine registers.
	 */
	public register: VMRegisters;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructor:                                                                                              |
	// -------------------------------------------------------------------------------------------------------------

	public constructor() {
		this.memory = new Uint8Array(VM.MEMORY_MAX);
		this.register = new VMRegisters();
	}

}