// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Ethan Pini <contact@eth-p.dev>
// MIT License
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Lib: Command
// An abstract class for implementing a SCT command.
// ---------------------------------------------------------------------------------------------------------------------
'use strict';

// Libraries.
const minimist = require('minimist');

// Modules.
const CommandError = require('./CommandError');

// ---------------------------------------------------------------------------------------------------------------------
// Class:
// ---------------------------------------------------------------------------------------------------------------------

/**
 * A static class for running Commands.
 *
 * @type {CommandRunner}
 * @static
 */
module.exports = class CommandRunner {

	/**
	 * Creates a function which will parse command arguments.
	 *
	 * @param schema {Object} The argument schematics.
	 * @returns {function} The parsing function.
	 */
	static createArgumentParser(schema) {
		return (argv) => {
			return minimist(argv, {
				'--': true,

				string: Object.entries(schema)
					.filter(([k, v]) => v.type === 'string' || v.type === 'number')
					.map(e => e[0]),

				boolean: ['plumbing'].concat(Object.entries(schema)
					.filter(([k, v]) => v.type === 'boolean' || v.type == null)
					.map(e => e[0])),

				default: Object.entries(schema)
					.filter(([k, v]) => v.default !== undefined)
					.map(([k, v]) => [k, v.default])
					.map(([k, v]) => [k, typeof(v) === 'function' ? null : v])
					.reduce((obj, [k, v]) => ({...obj, [k]: v}), {}),

				alias: Object.entries(schema)
					.filter(([k, v]) => v.alias !== undefined)
					.map(([k, v]) => [k, v.alias])
					.map(([k, v]) => [k, v instanceof Array ? v : [v]])
					.map(([k, v]) => v.map(a => [a, k]))
					.flat(1)
					.reduce((obj, [k, v]) => ({...obj, [k]: v}), {}),

				unknown: (arg) => {
					if (arg.startsWith('--')) {
						let option = arg.substring(2).split('=')[0];
						throw new CommandError(`Unknown command option: ${option}`, {
							message: `unknown option -- '${option}'`
						});
					}
				}
			});
		};
	}

	/**
	 * Creates a function which will validate command arguments.
	 *
	 * @param schema {Object} The argument schematics.
	 * @returns {function} The validation function.
	 */
	static createArgumentValidator(schema) {
		return (args) => {

			function fail(option) {
				throw new CommandError(`Invalid command option: ${option}`, {
					message: `invalid option -- '${option}'`
				});
			}

			function setValue(option, description, value) {
				args[option] = value;
				if (description.alias != null) {
					for (let alias of [description.alias].flat()) {
						args[alias] = value;
					}
				}
			}

			// Validate.
			validation: for (let [name, description] of Object.entries(schema)) {
				let value = args[name];
				switch (description.type) {

					case 'boolean': {
						if (value === null && description.default === null) continue;
						if (typeof (value) === 'boolean') continue;
						if (typeof (value) === 'string') {
							if (value.toLowerCase() === 'true') {
								setValue(name, description, true);
							} else if (value.toLowerCase() === 'false') {
								setValue(name, description, false);
							} else {
								return fail(name);
							}
						}

						break;
					}

					case 'string': {
						if (value === null && description.default === null) continue;

						if (description.match != null) {
							for (let match of description.match) {
								if (match instanceof RegExp && match.test(value)) continue validation;
								if (value === match) continue validation;
							}

							return fail(name);
						}

						break;
					}

				}
			}

			// Defaults.
			for (let [name, description] of Object.entries(schema)) {
				let value = args[name];

				if (typeof(description.default) === 'function' && value === null) {
					setValue(name, description, description.default(args));
				}
			}
		};
	}

};

