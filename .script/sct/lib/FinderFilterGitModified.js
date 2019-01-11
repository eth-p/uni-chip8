// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
// MIT License
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Lib: FinderFilterGitModified
// A transform stream to remove files that haven't been modified since the last git commit.
// ---------------------------------------------------------------------------------------------------------------------
'use strict';

// Modules.
const FinderFilterGit = require('./FinderFilterGit');

// ---------------------------------------------------------------------------------------------------------------------
// Class:
// ---------------------------------------------------------------------------------------------------------------------

/**
 * A transform stream to remove files that haven't been modified since the last git commit.
 * @type {FilterFinderGitModified}
 */
module.exports = class FinderFilterGitModified extends FinderFilterGit {

	async _filter(entry) {
		if (entry.status == null) return false;
		return (entry.status.isModified() > 0) || (entry.status.isNew() > 0);
	}

};
