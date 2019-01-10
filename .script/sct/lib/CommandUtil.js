// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
// MIT License
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Lib: CommandUtil
// A static class for common command functions.
// ---------------------------------------------------------------------------------------------------------------------
'use strict';

// Modules.
const CommandError = require('./CommandError');
const SCT          = require('./SCT');

// ---------------------------------------------------------------------------------------------------------------------
// Class:
// ---------------------------------------------------------------------------------------------------------------------

/**
 * An abstract class for implementing a SCT command.
 * @type {CommandUtil}
 */
module.exports = class CommandUtil {

	/**
	 * Gets an array of modules from a command's arguments.
	 *
	 * @param args {String[]} The argument array.
	 * @param [options]           {Object}          The function options.
	 * @param [options.meta]      {Boolean}         Allow meta-modules?
	 * @param [options.metaError] {String|Function} The error message to show when a meta-module is loaded.
	 * @returns {Promise<Module[]>} A promise for the loaded arguments.
	 *
	 * @throws {SCTError}     When the module couldn't be loaded.
	 * @throws {CommandError} When a meta-module is loaded, but is not allowed.
	 */
	static async getModulesFromArgs(args, options) {
		let opts = Object.assign({meta: false}, options);
		let project = await SCT.getProject();

		// Load all modules.
		// This is used when no arguments are provided.
		if (args.length === 0) {
			return await project.getModules()
				.filter(opts.meta === true ? () => true : m => !m.isMeta());
		}

		// Load user-specified modules.
		let modules = await Promise.all(args.map(project.getModule.bind(project)));

		// Deny meta-modules.
		if (options.meta === false) {
			let metas = modules.filter(x => x.isMeta());
			if (metas.length > 0) {
				let message = `'${metas[0].getId()}' is a meta-module, and cannot be used.`;

				if (options.metaError) {
					message = typeof(options.metaError) === 'function'
						? options.metaError(metas[0].getId())
						: options.metaError;
				}

				throw new CommandError('Encountered meta-module when {meta:false}.', {
					message: message
				});
			}
		}

		// Return.
		return modules;
	}

	/**
	 * Returns a promise that resolves when a stream ends or errors.
	 *
	 * @param stream {Stream} The stream.
	 * @returns {Promise<void>} The promise.
	 */
	static ending(stream) {
		return new Promise((resolve, reject) => {
			stream.on('error', reject);
			stream.on('finish', resolve);
		});
	}

};

