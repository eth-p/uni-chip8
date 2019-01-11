// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
// MIT License
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Lib: CommandError
// An error that can be presented directly to the user.
// ---------------------------------------------------------------------------------------------------------------------
'use strict';

// ---------------------------------------------------------------------------------------------------------------------
// Class:
// ---------------------------------------------------------------------------------------------------------------------

/**
 * An error that can be presented directly to the user.
 * @type {CommandError}
 */
module.exports = class CommandError extends Error {

	/**
	 * Creates a new error.
	 *
	 * @param message {String} The error message.
	 * @param options {Object} The additional error options.
	 */
	constructor(message, options) {
		super(message);

		this.cliMessage = message;
		this.cliExit    = 254;
		this.details    = null;
		this.cause      = null;

		if (options != null) {
			if (options.message != null) this.cliMessage = options.message + (options.details != null? `\n${options.details}` : '');
			if (options.details != null) this.details    = options.details;
			if (options.exit    != null) this.cliExit    = options.exit;

			if (options.cause   != null) {
				this.stack += `\nCaused by: ` + options.cause.stack;
			}
		}
	}

};

