//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import assert from '@chipotle/types/assert';

import OpAddress from './OpAddress';
import ProgramError from './ProgramError';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * A program's call stack.
 */
export default class ProgramStack {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * The stack.
	 */
	protected stack: OpAddress[];

	/**
	 * The maximum size of the stack.
	 */
	public readonly MAX: number;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructor:                                                                                              |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Initializes the call stack.
	 *
	 * @param max The maximum size of the stack.
	 */
	public constructor(max: number) {
		assert(max > 0, "Parameter 'max' is less than 1");

		this.stack = [];
		this.MAX = max;
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Push an address to the call stack.
	 * @param address The address to push.
	 */
	push(address: OpAddress): void {
		if (this.stack.length === this.MAX) throw new ProgramError(ProgramError.STACK_OVERFLOW);
		this.stack.push(address);
	}

	/**
	 * Pops an address from the call stack.
	 * @throws ProgramError When the stack is empty.
	 */
	pop(): OpAddress {
		if (this.stack.length === 0) throw new ProgramError(ProgramError.STACK_UNDERFLOW);
		return <OpAddress>this.stack.pop();
	}

	/**
	 * Clears the call stack.
	 * THIS SHOULD ONLY BE USED FOR RESETTING THE PROGRAM!
	 */
	clear(): void {
		this.stack = [];
	}

	/**
	 * Returns an exact as-is copy of the program stack.
	 * @returns The program stack.
	 */
	inspect(): OpAddress[] {
		return this.stack.slice(0);
	}
}
