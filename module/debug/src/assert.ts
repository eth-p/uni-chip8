// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Team Chipotle
// MIT License
// ---------------------------------------------------------------------------------------------------------------------
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
		let error = new AssertError(message == null ? 'Assertion failed.' : `Assertion failed: ${message}`);

		// Remove irrelevant lines from stack trace.
		// This makes things nice and easy to read when debugging :)
		if (error.stack != null) {
			let lines = error.stack.split('\n');
			lines.splice(1, 2);
			error.stack = lines.join('\n');
		}

		// Throw.
		throw error;
	}
}
