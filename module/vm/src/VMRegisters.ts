// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Team Chipotle
// MIT License
// ---------------------------------------------------------------------------------------------------------------------
import Assert from "@debug/Assert";

import { Uint16, Uint8 } from "./VMTypes";
// ---------------------------------------------------------------------------------------------------------------------

/**
 * CHIP-8 hardware registers.
 */
export default class VMRegisters {

	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * General purpose data registers.
	 * Contains 16 registers, each holding an unsigned 8-bit integer.
	 *
	 * Represented using characters [0-F].
	 * The VF register is also used as a flag register.
	 */
	public data: Uint8Array;

	/**
	 * Address register.
	 * Holds
	 */
	public address: Uint16;

	// -------------------------------------------------------------------------------------------------------------
	// | Getters:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Flag register.
	 * Equivalent to the `0xF` data register.
	 */
	public get flag(): Uint8 {
		return this.data[0x0F];
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Setters:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Sets the flag register.
	 * @param value The value to set.
	 */
	public set flag(value: Uint8) {
		Assert.assert(() => value >= 0x00 && value <= 0xFF);
		this.data[0x0F] = value;
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Constructor:                                                                                              |
	// -------------------------------------------------------------------------------------------------------------

	public constructor() {
		this.data = new Uint8Array(16);
		this.address = 0;
	}

}