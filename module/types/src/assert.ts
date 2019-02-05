//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import AssertError from './AssertError';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Asserts that a statement is true.
 *
 * @param result  The assertion statement.
 * @param message The assertion message.
 */
export default function assert(result: boolean, message?: string): void | never {
	if (!result) {
		throw new AssertError(message == null ? 'Assertion failed.' : `Assertion failed: ${message}`).shave(1);
	}
}
