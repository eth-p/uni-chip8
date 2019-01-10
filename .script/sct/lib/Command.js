// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
// MIT License
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Lib: Command
// An abstract class for implementing a SCT command.
// ---------------------------------------------------------------------------------------------------------------------
'use strict';

// ---------------------------------------------------------------------------------------------------------------------
// Class:
// ---------------------------------------------------------------------------------------------------------------------

/**
 * An abstract class for implementing a SCT command.
 * @type {Command}
 */
module.exports = class Command {

	/**
	 * Gets the command's name.
	 * @returns {String}
	 */
	name() {
		return this.constructor.name;
	}

	/**
	 * Gets the command's description.
	 * @returns {string}
	 */
	description() {
		return '[no description provided]';
	}

	/**
	 * Gets the command's schema.
	 * @returns {*}
	 */
	schema() {
		return {};
	}

	/**
	 * Gets the command's usage string.
	 * @returns {String}
	 */
	usage() {
		let schema = this.schema();
		let buffer = `${this.name()}`;

		for (let [name, descr] of Object.entries(schema).filter(([k, v]) => k !== '_')) {
			buffer += descr.required ? ` --${name}` : ` [--${name}`;
			if (descr.type != null && descr.type !== 'boolean') {
				buffer += descr.required ? `=${descr.value}` : `=${descr.value}]`;
			} else {
				buffer += descr.required ? '' : ']';
			}
		}

		if (schema['_'] != null) {
			let descr = schema['_'];
			buffer += descr.required ? ` ${descr.value}` : ` [${descr.value}`;
			if (descr.many === true) {
				buffer += descr.required ? ` ...` : ` ...]`;
			} else {
				buffer += descr.required ? '' : ']';
			}
		}

		return buffer;
	}

	/**
	 * Runs the command.
	 * @param args {Object} The parsed command arguments.
	 * @returns {number|boolean} The status code.
	 */
	async run(args) {
		throw new Error(`Unimplemented subcommand: ${this.schema().name}`);
	}

};

