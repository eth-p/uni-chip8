// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
// MIT License
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Lib: FinderFilterGitStaged
// A transform stream to remove files that haven't been staged.
// ---------------------------------------------------------------------------------------------------------------------
'use strict';

// Modules.
const FinderFilterGit = require('./FinderFilterGit');

// ---------------------------------------------------------------------------------------------------------------------
// Class:
// ---------------------------------------------------------------------------------------------------------------------

/**
 * A transform stream to remove files that haven't been staged.
 * @type {FilterFinderGitStaged}
 */
module.exports = class FinderFilterGitModified extends FinderFilterGit {

	async _filter(entry) {
		if (entry.status == null) return false;
		return (entry.status.inIndex() > 0);
	}

};
