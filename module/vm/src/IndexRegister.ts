//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Uint16 from '@chipotle/types/Uint16';
import assert from '@chipotle/types/assert';

/**
 * The index register, known as "I" in various CHIP-8 documentations.
 * Formally, this index is typically only 12 bits wide,
 * since a CHIP-8 address is in the interval [0, 4095].
 */
export default class IndexRegister {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Index register value
	 */
	private _value: Uint16;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructor:                                                                                              |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates an index register instance.
	 */
	public constructor() {
		this._value = 0;
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 *
	 * @param updatedValue The updated index register value.
	 */
	public set value(updatedValue: Uint16) {
		assert(
			updatedValue >= 0x0 && updatedValue < 0x1000,
			'Parameter address is out of bounds. (Must be in [0, 4095])'
		);
		this._value = updatedValue;
	}

	/**
	 * @returns The current index register value.
	 */
	public get value(): Uint16 {
		return this._value;
	}
}
