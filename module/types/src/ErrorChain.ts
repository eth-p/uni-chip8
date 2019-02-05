//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------

/**
 * A chained error.
 */
export default class ErrorChain extends Error {
	// -------------------------------------------------------------------------------------------------------------
	// | Constants:                                                                                                |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * A regular expression for the stack property on Firefox.
	 */
	public static readonly STACK_FIREFOX = /^([^@]*)@(.+):(\d*)(?::(\d*))$/;

	/**
	 * A regular expression for the stack property on Chrome.
	 * FIXME: When `[as default]` is in the stack trace.
	 */
	public static readonly STACK_CHROME = /^(?:\t| +)at (?:([^ ]+) \()?([^:]*):(\d*)(?::(\d*))?/;

	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * The line number of the error, if it can be determined.
	 */
	lineNumber: number | undefined;

	/**
	 * The file name of the error, if it can be determined.
	 */
	fileName: string | undefined;

	/**
	 * The name of the error.
	 */
	displayName: string;

	/**
	 * The cause of the error.
	 */
	cause: Error | ErrorChain | undefined;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructors:                                                                                             |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a new error.
	 *
	 * @param message The error message.
	 * @param fileName The file name.
	 * @param lineNumber The line number.
	 */
	constructor(message: string, fileName?: string, lineNumber?: number);

	/**
	 * Creates a new error with a cause.
	 *
	 * @param message The error message.
	 * @param cause The cause of the error.
	 * @param fileName The file name.
	 * @param lineNumber The line number.
	 */
	constructor(message: string, cause: Error | ErrorChain, fileName?: string, lineNumber?: number);

	constructor(
		message: string,
		causeOrFileName?: Error | ErrorChain | string,
		fileNameOrLineNumber?: string | number,
		lineNumber?: number
	) {
		let _cause: Error | ErrorChain | undefined;
		let _message = message;
		let _fileName;
		let _lineNumber;

		// Overloading.
		if (causeOrFileName instanceof Error) {
			_cause = causeOrFileName!;
			_fileName = <string | undefined>fileNameOrLineNumber;
			_lineNumber = <number | undefined>lineNumber;
		} else {
			_fileName = <string | undefined>causeOrFileName;
			_lineNumber = <number | undefined>fileNameOrLineNumber;
		}

		// Super call.
		super(_message);

		// Set properties.
		this.fileName = _fileName == null ? ErrorChain._extractFile(<any>this) : _fileName;
		this.lineNumber = _lineNumber == null ? ErrorChain._extractLine(this) : _lineNumber;
		this.name = this.constructor.name;
		this.cause = _cause;
		this.displayName = (<any>this.constructor).displayName || this.constructor.name;

		// Append stack.
		if (_cause != null && this.stack != null) {
			this.stack = ErrorChain._extendStack(this, _cause);
		}
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Attempts to shave off a number of stack trace frames.
	 *
	 * @param frames The number of frames to shave off.
	 * @returns The shaved stack trace, or the original stack if not possible.
	 */
	public shave(frames: number): this {
		if (this.stack == null) return this;
		let lines = this.stack.split('\n', 3);

		if (ErrorChain.STACK_FIREFOX.test(lines[0])) {
			this.stack = this.stack
				.split('\n')
				.slice(frames)
				.join('\n');
			return this;
		}

		if (ErrorChain.STACK_CHROME.test(lines[1])) {
			let split = this.stack.split('\n');
			split.splice(1, frames);
			this.stack = split.join('\n');
			return this;
		}

		return this;
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Static:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Extracts the line number from an error stack.
	 * @param error The error object.
	 * @returns The line number, or undefined if it could not be determined.
	 */
	protected static _extractLine(error: Error): number | undefined {
		if (error.stack == null) return undefined;
		if ((<any>error).lineNumber != null) return (<any>error).lineNumber;

		let lines = error.stack.split('\n', 3);
		let matched;

		if ((matched = ErrorChain.STACK_FIREFOX.exec(lines[0])) != null) {
			return parseInt(matched[3]);
		}

		if ((matched = ErrorChain.STACK_CHROME.exec(lines[1])) != null) {
			return parseInt(matched[3]);
		}

		return undefined;
	}

	/**
	 * Extracts the file name from an error stack.
	 * @param error The error object.
	 * @returns The file name, or undefined if it could not be determined.
	 */
	protected static _extractFile(error: Error): string | undefined {
		if (error.stack == null) return undefined;
		if ((<any>error).fileName != null) return (<any>error).fileName;

		let lines = error.stack.split('\n', 3);
		let matched;

		if ((matched = ErrorChain.STACK_FIREFOX.exec(lines[0])) != null) {
			return matched[2];
		}

		if ((matched = ErrorChain.STACK_CHROME.exec(lines[1])) != null) {
			return matched[3];
		}

		return undefined;
	}

	/**
	 * Extends the stack of an error with a "caused by" message.
	 *
	 * @param error The error object.
	 * @param cause The cause error.
	 *
	 * @returns The new stack.
	 */
	protected static _extendStack(error: Error, cause: Error): string | undefined {
		if (error.stack == null || cause.stack == null) return undefined;
		if ((<any>error).fileName != null) return (<any>error).fileName;

		let lines = error.stack.split('\n', 3);

		if (ErrorChain.STACK_CHROME.test(lines[1])) {
			return `${error.stack}\nCaused by: ${cause.stack}}`;
		}

		return `${error.stack}\n\n[Caused by]\n${cause.toString()}\n${cause.stack}`;
	}
}
