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
 *
 * @type {Command}
 * @abstract
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
		let usage = `${this.name()}`;
		let buffer = '';

		function append(text) {
			let llStart  = usage.lastIndexOf("\n");
			let llLength = usage.length;

			if (llStart !== -1) {
				llLength = usage.substring(llStart).length;
			}

			if (llLength + text.length > 80) {
				usage += `\n    ${text}`;
			} else {
				usage += text;
			}
		}

		for (let [name, descr] of Object.entries(schema).filter(([k, v]) => k !== '_')) {
			buffer = descr.required ? ` --${name}` : ` [--${name}`;
			if (descr.type != null && descr.type !== 'boolean') {
				let value = descr.value;
				if (descr.match != null) {
					value = (descr.match instanceof Array)
						? descr.match.map(v => `"${v}"`).join('|')
						: descr.match;
				}

				buffer += descr.required ? `=${descr.value}` : `=${value}]`;
			} else {
				buffer += descr.required ? '' : ']';
			}

			append(buffer);
		}

		if (schema['_'] != null) {
			let descr = schema['_'];
			buffer = descr.required ? ` ${descr.value}` : ` [${descr.value}`;
			if (descr.many === true) {
				buffer += descr.required ? ` ...` : ` ...]`;
			} else {
				buffer += descr.required ? '' : ']';
			}

			append(buffer);
		}

		return usage;
	}

	/**
	 * Runs the command.
	 *
	 * @param args {Object} The parsed command arguments.
	 * @returns {Promise<Number|Boolean>} The status code.
	 *
	 * @abstract
	 */
	async run(args) {
		throw new Error(`Unimplemented subcommand: ${this.schema().name}`);
	}

};

