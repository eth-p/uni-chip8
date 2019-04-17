// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Ethan Pini <contact@eth-p.dev>
// MIT License
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Lib: GitUtil
// A static class for common nodegit functions.
// ---------------------------------------------------------------------------------------------------------------------
'use strict';

// Libraries.
const git = require('nodegit');

// Modules.
const SCTError = require('./SCTError');

// ---------------------------------------------------------------------------------------------------------------------
// Class:
// ---------------------------------------------------------------------------------------------------------------------

/**
 * A static class for common nodegit functions.
 * @type {StreamUtil}
 */
module.exports = class GitUtil {

	/**
	 * Gets a branch.
	 *
	 * @param repo   {git.Repository} The repository.
	 * @param branch {String}         The branch name.
	 *
	 * @returns {Promise<git.Reference>} The branch reference.
	 */
	static async getBranch(repo, branch) {
		try {
			return await repo.getBranch(branch);
		} catch (ex) {
			throw new SCTError(`Could not get branch: ${branch}`, {
				message: `'${branch}' is not a branch.`,
				cause: ex
			})
		}
	}

	/**
	 * Gets an array of local branches.
	 *
	 * @param repo {git.Repository}        The repository.
	 * @returns {Promise<git.Reference[]>} The branch references.
	 */
	static async getLocalBranches(repo) {
		let references = await repo.getReferences(git.Reference.TYPE.OID);
		let matching   = [];

		for (let reference of references) {
			if (reference.isBranch()) {
				matching.push(reference);
			}
		}

		return matching;
	}

	/**
	 * Gets an array of remote branches.
	 *
	 * @param repo {git.Repository}        The repository.
	 * @returns {Promise<git.Reference[]>} The branch references.
	 */
	static async getRemoteBranches(repo) {
		let references = await repo.getReferences(git.Reference.TYPE.OID);
		let matching   = [];

		for (let reference of references) {
			if (reference.isRemote()) {
				matching.push(reference);
			}
		}

		return matching;
	}

	/**
	 * Gets the git config database.
	 *
	 * @param repo {git.Repository}   The repository.
	 * @returns {Promise<git.Config>} The config database.
	 */
	static async getConfig(repo) {
		if (this._cacheConfig != null) return this._cacheConfig;

		let config = await repo.config();

		this._cacheConfig = config;
		return config;
	}

	/**
	 * Gets the user's name.
	 *
	 * @param repo {git.Repository}    The repository.
	 * @returns {Promise<String|null>} The user name, or null if unset.
	 */
	static async getUserName(repo) {
		let config = await this.getConfig(repo);

		try {
			return await config.getStringBuf('user.name');
		} catch (ex) {
			return null;
		}
	}

	/**
	 * Gets the user's email.
	 *
	 * @param repo {git.Repository}    The repository.
	 * @returns {Promise<String|null>} The user email, or null if unset.
	 */
	static async getUserEmail(repo) {
		let config = await this.getConfig(repo);

		try {
			return await config.getStringBuf('user.email');
		} catch (ex) {
			return null;
		}
	}

	/**
	 * Get an array of remotes.
	 *
	 * @param repo {git.Repository}     The repository.
	 * @returns {Promise<git.Remote[]>} The remotes.
	 */
	static async getRemotes(repo) {
		if (this._cacheRemotes != null) return this._cacheRemotes;

		let remoteNames = await repo.getRemotes();
		let remotes     = await Promise.all(remoteNames.map(n => repo.getRemote(n)));

		this._cacheRemotes = remotes;
		return remotes;
	}

	/**
	 * Gets the current branch.
	 *
	 * @param repo {git.Repository}     The repository.
	 * @returns {Promise<git.Branch[]>} The current branch.
	 */
	static async getCurrentBranch(repo) {
		return await repo.getCurrentBranch();
	}

	/**
	 * Gets tracking information for the current branch.
	 * This will return the name of the remote and branches.
	 *
	 * @param branch {git.Branch} The current branch.
	 *
	 * @returns {Promise<{suggestedRemote: null, suggestedBranches: null, remote: null, branches: null}>}
	 */
	static async getBranchTracking(branch) {
		let config   = await this.getConfig(branch.owner());
		let repo     = branch.owner();
		let name     = branch.shorthand();
		let fullName = branch.name();
		let tracking = {
			remote: null,
			branch: null,
			suggestedRemote: null,
			suggestedBranch: null
		};

		// Remote.
		try {
			let remoteName = tracking.remote = await config.getStringBuf(`branch.${name}.remote`);
			let merge      = await config.getStringBuf(`branch.${name}.merge`);

			let remote       = await repo.getRemote(remoteName);
			let refspecCount = remote.refspecCount();
			for (let i = 0; i < refspecCount; i++) {
				let refspec = remote.getRefspec(i);
				if (refspec.srcMatches(merge)) {
					let shorthand = merge.substring(refspec.src().indexOf('*'));

					tracking.branch = {
						refspec: refspec,
						name: refspec.dst().replace('*', shorthand),
						shorthand: shorthand
					};

					break;
				}
			}
		} catch (ex) {
		}

		// Suggestions.
		{
			let remotes = await repo.getRemotes();
			tracking.suggestedRemote = remotes.includes('origin') ? 'origin' : remotes[0];

			let suggestedRemote = await repo.getRemote(tracking.suggestedRemote);
			let refspecCount = suggestedRemote.refspecCount();
			for (let i = 0; i < refspecCount; i++) {
				let refspec = suggestedRemote.getRefspec(i);
				if (refspec.srcMatches(fullName)) {
					let shorthand = fullName.substring(refspec.src().indexOf('*'));

					tracking.suggestedBranch = {
						refspec: refspec,
						name: refspec.dst().replace('*', shorthand),
						shorthand: shorthand
					};

					break;
				}
			}
		}

		// Return.
		return tracking;
	}

	/**
	 * Discard all cached objects.
	 * @private
	 */
	static free() {
		if (this._cacheRemotes != null) this._cacheRemotes.forEach((o) => o.free());

		this._cacheRemotes = null;
		this._cacheConfig  = null;
	}

};

