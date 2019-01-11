// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
// MIT License
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Lib: FinderResult
// A file found by a Finder.
// ---------------------------------------------------------------------------------------------------------------------
'use strict';

// Libraries.
const path = require('path');

// ---------------------------------------------------------------------------------------------------------------------
// Class:
// ---------------------------------------------------------------------------------------------------------------------

/**
 * A file found by a Finder.
 *
 * @see Finder
 * @type {FinderResult}
 */
module.exports = class FinderResult {

	constructor(parent, file) {
		this.file = file;
		this.path = path.join(parent, file);
	}

	toString() {
		return this.file;
	}

};
