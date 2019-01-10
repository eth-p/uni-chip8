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

		if (options == null) {
			this.cliMessage = message;
			this.cliExit    = 254;
		} else {
			this.cliMessage = options.message;
			this.cliExit    = options.exit == null ? 1 : options.exit;
		}
	}

};

