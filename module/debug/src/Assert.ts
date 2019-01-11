// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Team Chipotle
// MIT License
// ---------------------------------------------------------------------------------------------------------------------
import AssertError from './AssertError';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Configurable runtime assertions.
 *
 * When building for release, these assertions will be replaced with empty functions, which should be inlined by
 * the V8 engine.
 */
export default class Assert {
	/**
	 * Assert that some function returns true.
	 *
	 * @param fn The function to call.
	 *
	 * @throws AssertError When the assertion fails.
	 */
	public static assert(fn: () => boolean) {
		if (!fn()) throw new AssertError('Assertion failed.');
	}

	/**
	 * Disables assertions.
	 * Permanently.
	 */
	public static disable() {
		let nullfn = () => {};
		for (let key of Object.keys(Assert)) {
			(Assert as any)[key] = nullfn;
		}
	}
}
