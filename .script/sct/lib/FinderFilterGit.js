// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Ethan Pini <contact@eth-p.dev>
// MIT License
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Lib: FinderFilterGit
// An abstract transform stream that filters based on repository status.
// ---------------------------------------------------------------------------------------------------------------------
'use strict';

// Libraries.
const path = require('path');

// Modules.
const FinderFilter = require('./FinderFilter');
const SCTError     = require('./SCTError');

// ---------------------------------------------------------------------------------------------------------------------
// Class:
// ---------------------------------------------------------------------------------------------------------------------

/**
 * An abstract transform stream that filters based on repository status.
 *
 * @type {FinderFilterGit}
 * @abstract
 */
module.exports = class FinderFilterGit extends FinderFilter {

	/**
	 * Creates a new git finder filter.
	 *
	 * @param repository       {nodegit.Repository} The git repository object.
	 * @param [options]        {Object}             The stream options.
	 * @param [options.filter] {Function}           The filter function.
	 */
	constructor(repository, options) {
		super({objectMode: true}, options);
		let repo = repository != null ? repository : (options != null ? options.repository : null);

		if (repo === null) {
			throw new SCTError('No repository provided.', {
				message: 'This feature requires a git repository.',
				exit: 2
			});
		}

		this._repository = repo;
		this._directory  = repo.workdir();
		this._status     = (options != null && options.status != null) ? options.status : repo.getStatus();
		this._statusMap  = null;
		this._index      = (options != null && options.index != null)  ? options.index  : repo.index();
	}

	/**
	 * @override
	 */
	async _asyncTransform(data, encoding) {
		if (data == null) return data;

		let file   = path.relative(this._directory, data.path);
		let status = await this._getStatusForFile(file);
		let index  = await this._getIndexForFile(file);

		return (await this._filter({
			path: file,
			status: status,
			index: index
		}) ? data : null);
	}

	/**
	 * Gets the git status for a file.
	 *
	 * @param file The file, relative to the repo workdir.
	 *
	 * @returns {Promise<undefined|git.StatusFile>}
	 * @private
	 */
	async _getStatusForFile(file) {
		if (this._statusMap !== null) return this._statusMap[file];

		let map = [];
		for (let status of await this._status) {
			map[status.path()] = status;
		}

		this._statusMap = map;
		return map[file];
	}

	/**
	 * Gets the git index entry for a file.
	 *
	 * @param file The file, relative to the repo workdir.
	 *
	 * @returns {Promise<undefined|git.IndexEntry>}
	 * @private
	 */
	async _getIndexForFile(file) {
		return await (await this._index).getByPath(file);
	}

	/**
	 * Called to determine if a file should be kept.
	 *
	 * @param entry {nodegit.IndexEntry};
	 *
	 * @returns {Promise<Boolean>}
	 *
	 * @override
	 * @abstract
	 * @protected
	 */
	async _filter(entry) {
		throw new Error('Unimplemented _filter');
	}

};
