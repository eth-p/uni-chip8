// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Ethan Pini <contact@eth-p.dev>
// MIT License
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Lib: CommandUtil
// A static class for common command functions.
// ---------------------------------------------------------------------------------------------------------------------
'use strict';

// Modules.
const CommandError            = require('./CommandError');
const FinderFilterGitModified = require('./FinderFilterGitModified');
const FinderFilterGitStaged   = require('./FinderFilterGitStaged');
const SCT                     = require('./SCT');

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
	 * @param args                {Object}          The minimist parsed arguments.
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
		if (args._.length === 0) {
			return await project.getModules()
				.filter(opts.meta === true ? () => true : m => !m.isMeta());
		}

		// Load user-specified modules.
		let modules = await Promise.all(args._.map(project.getModule.bind(project)));

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
	 * Gets an array of Finder filters.
	 *
	 * @param args                {Object} The minimist parsed arguments.
	 * @param [options]           {Object} The function options.
	 *
	 * @returns {Promise<FinderFilter[]>} A promise for the filters.
	 *
	 * @throws {SCTError} When a filter requires a git repo, but there isn't any repo.
	 */
	static async getFiltersFromArgs(args, options) {
		let project        = await SCT.getProject();
		let git_repository = null;
		let git_index      = null;
		let git_status     = null;

		// Load git if necessary.
		if (args['only-modified'] === true || args['only-staged'] === true) {
			git_repository = await project.getRepository();
			git_index      = await git_repository.refreshIndex();
			git_status     = await git_repository.getStatus();
		}

		// Create filter options.
		let filteropts = {
			repository: git_repository,
			status:     git_status,
			index:      git_index
		};

		// Create filters.
		let filters = [];

		if (args['only-modified']) filters.push(new FinderFilterGitModified(null, filteropts));
		if (args['only-staged'])   filters.push(new FinderFilterGitStaged(null, filteropts));

		return filters;
	}

	/**
	 * Gets the project's git repository.
	 * This will throw an error if it can't find it.
	 *
	 * @returns {Promise<nodegit.Repository>} The repository object.
	 *
	 * @throws {CommandError} When the repository cannot be found.
	 */
	static async getRepository() {
		let repo = await (await SCT.getProject()).getRepository();
		if (repo != null) return repo;

		throw new CommandError('Could not find git repository.', {
			message: 'This command requires a git repository.',
			code: 2
		});

	}

};

