// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Team Chipotle
// MIT License
// ---------------------------------------------------------------------------------------------------------------------
import assert = require('@chipotle/debug/assert');
import Uint8 from '@chipotle/types/Uint8';
import Uint16 from '@chipotle/types/Uint16';
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

	// -------------------------------------------------------------------------------------------------------------
	// | Getters:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Flag register.
	 * Equivalent to the `0xF` data register.
	 */
	public get flag(): Uint8 {
		return this.data[0x0f];
	}

	/**
	 * Gets a register value.
	 * @param location The register location to fetch.
	 */
	public getRegister(location: Uint8) {
		return this.data[location];
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Setters:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Sets the flag register.
	 * @param value The value to set.
	 */
	public set flag(value: Uint8) {
		assert(value >= 0x00 && value <= 0xff);
		this.data[0x0f] = value;
	}

	/**
	 * Sets a register value.
	 * @param location The register location to set.
	 * @param value The value to apply to the register
	 */
	public setRegister(location: Uint8, value: Uint8): void {
		assert(value >= 0x00 && value <= 0xff);
		this.data[location] = value;
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Constructor:                                                                                              |
	// -------------------------------------------------------------------------------------------------------------

	public constructor() {
		this.data = new Uint8Array(0xf);
	}
}
