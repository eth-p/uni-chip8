#!/usr/bin/env node
// Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
// MIT License
// ---------------------------------------------------------------------------------------------------------------------
'use strict';
require('module-alias/register');

// Libraries.
const fs       = require('fs-extra');
const minimist = require('minimist');
const mm       = require('micromatch');
const path     = require('path');

// Modules.
const Project  = require('@/Project');

// ---------------------------------------------------------------------------------------------------------------------
// Arguments.
// ---------------------------------------------------------------------------------------------------------------------

const ARGS = minimist(process.argv.slice(2), {
	boolean: ['--help']
});

// ---------------------------------------------------------------------------------------------------------------------
// Main.
// ---------------------------------------------------------------------------------------------------------------------

(async function() {
	let tsfmt = process.argv.slice();

	if (ARGS._.length === 0 && !ARGS.help) {
		let project  = await Project.get();
		let matcher  = mm.matcher('**/*.{ts,tsx}')

		let files = [];
		let waits = [];
		for (let mod of project.getModules()) {
			for (let finder of mod.getFiles()) {
				waits.push(finder.promise());

				finder.on('data', (file) => {
					if (matcher(file)) {
						files.push(path.join(mod.getDirectory(), file));
					}
				});

				finder.start();
			}
		}

		await Promise.all(waits);
		tsfmt = tsfmt.concat(files);
	}

	process.argv = tsfmt;
})().then((project) => {
	require('typescript-formatter/lib/cli');
}, (err) => {
	throw err;
});
