//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import assert from '@chipotle/types/assert';

import ProgramAddress from './ProgramAddress';
import ProgramError from './ProgramError';
import JsonType from '@chipotle/types/JsonType';
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
	protected stack: Uint16Array;

	/**
	 * The stack pointer.
	 */
	protected pointer: number;

	/**
	 * The maximum size of the stack.
	 */
	protected readonly MAX: number;

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

		this.stack = new Uint16Array(max);
		this.pointer = -1;
		this.MAX = max;
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Push an address to the call stack.
	 * @param address The address to push.
	 */
	push(address: ProgramAddress): void {
		if (this.pointer === this.MAX - 1) throw new ProgramError(ProgramError.STACK_OVERFLOW);
		this.stack[++this.pointer] = address;
	}

	/**
	 * Pops an address from the call stack.
	 * @throws ProgramError When the stack is empty.
	 */
	pop(): ProgramAddress {
		if (this.pointer === -1) throw new ProgramError(ProgramError.STACK_UNDERFLOW);
		return this.stack[this.pointer--];
	}

	/**
	 * Get the top address on the call stack.
	 * @throws ProgramError When the stack is empty.
	 * @returns Top address from the call stack.
	 */
	top(): ProgramAddress {
		if (this.stack.length === 0) throw new ProgramError(ProgramError.STACK_UNDERFLOW);
		return this.stack[this.pointer];
	}

	/**
	 * Clears the call stack.
	 * THIS SHOULD ONLY BE USED FOR RESETTING THE PROGRAM!
	 */
	clear(): void {
		this.stack.fill(0);
		this.pointer = 0;
	}

	/**
	 * Returns a trimmed copy of the program stack.
	 * @returns The program stack up until and including the pointer.
	 */
	inspect(): ProgramAddress[] {
		return Array.from(this.stack).slice(0, this.pointer + 1);
	}

	/**
	 * Returns an exact as-is copy of the program stack.
	 * @returns The program stack.
	 */
	inspectRaw(): ProgramAddress[] {
		return Array.from(this.stack);
	}

	/**
	 * Gets the stack pointer.
	 */
	getPointer(): number {
		return this.pointer;
	}

	/**
	 * Gets the stack capacity.
	 */
	getCapacity(): number {
		return this.MAX;
	}

	/**
	 * Creates a JSON-compatible snapshot of the stack.
	 * @returns A snapshot of the stack.
	 */
	public snapshot(): JsonType {
		return {
			stack: this.inspect(),
			pointer: this.pointer,
			max: this.MAX
		};
	}

	/**
	 * Restores a snapshot of the stack.
	 * @param snapshot The JSON-compatible snapshot.
	 */
	public restore(snapshot: any) {
		(<any>this).MAX = snapshot.max;
		this.pointer = snapshot.pointer;
		this.stack = new Uint16Array(snapshot.max);
		this.stack.set(snapshot.stack);
	}
}
