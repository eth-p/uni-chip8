// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
// MIT License
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Lib: _init
// Initialize a command line script.
// This supports hooking require for fast loading, and enabling `module-alias`.
// ---------------------------------------------------------------------------------------------------------------------
'use strict';

// Libraries.
const Module = require('module');
const laxy   = require('laxy');
const path   = require('path');

// ---------------------------------------------------------------------------------------------------------------------
// Class:
// ---------------------------------------------------------------------------------------------------------------------

module.exports = (options) => {
	let opts = Object.assign({
		alias: true,
		lazy: true,
		shim: true
	}, options);

	// Handle: alias
	if (opts.alias) {
		require('module-alias/register');
	}

	// Handle: lazy
	if (opts.lazy) {
		try {
			const original = Module.createRequireFromPath;

			Module.createRequireFromPath = (...args) => {
				console.log(args);
				return laxy(original(...args));
			};

			let selfpath = `"${__filename.replace(/([\\"'])/g, "\\$1")}"`
			Module.wrapper[0] += `try { (function(m) { if (m.hookRequire) require = m.hookRequire(require, __filename) })(require(${selfpath})); } finally {}`;

		} catch (ex) {
			console.error('Warning: Unable to hook require for lazy loading.');
			console.error('         Performance may suffer as a result.');
		}
	}

	// Handle: shim
	if (opts.shim) {
		require('array.prototype.flat').shim();
		require('string.prototype.padend').shim();
		require('string.prototype.padstart').shim();
	}
};

module.exports.hookPaths = [path.dirname(__dirname)];

module.exports.hookRequire = (require, source) => {
	if (!module.exports.hookPaths.find(p => source.startsWith(p))) {
		return require;
	}

	return laxy(require);
};

