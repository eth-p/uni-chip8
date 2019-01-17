#!/usr/bin/env node
// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
// MIT License
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// SCT Libexec: verify-commit-message.js
// This will ensure that the commit message follows project guidelines.
// ---------------------------------------------------------------------------------------------------------------------
'use strict';
require('../lib/_init')();

// Libraries.
const fs = require('fs-extra');

// Modules.
const Finder     = require('@sct').Finder;
const SCT        = require('@sct');
const StreamUtil = require('@sct').StreamUtil;

// ---------------------------------------------------------------------------------------------------------------------
// Functions:
// ---------------------------------------------------------------------------------------------------------------------

function onComplete(result) {
	process.exit(typeof result === 'number' ? result : 0);
}

function onError(error) {
	if (error instanceof Error) {
		console.error(error);
	} else {
		console.log(error);
	}

	process.exit(1);
}

// ---------------------------------------------------------------------------------------------------------------------
// Main:
// ---------------------------------------------------------------------------------------------------------------------

(async function(argv) {
	let project = await SCT.getProject();
	let modules = await project.getModules();

	let file    = argv[0];
	let message = await fs.readFile(file, 'utf8');
	let lines   = message.split("\n");

	// Determine summary line.
	let summaryLine = lines.findIndex(l => !l.startsWith('#') && l.trim().length !== 0);
	if (summaryLine === -1) {
		summaryLine = lines.findIndex(l => !l.startsWith('#'));
		if (summaryLine === -1) summaryLine = 0;

		lines.splice(lines, summaryLine, '');
	}

	if (lines[summaryLine].length !== 0) return 0;

	// Determine module changed.
	let status  = await (await project.getRepository()).getStatus();
	let changed = null;
	for (let module of modules) {
		let changes = await module.hasChanges(status);
		if (changes) {
			if (changed != null) {
				changed = null;
				break;
			}

			changed = module.getId();
		}
	}

	// Create commit template.
	lines[summaryLine] = `${changed == null ? '[module]' : changed}: [verb] [changes]`;

	// All good.
	await fs.writeFile(file, lines.join("\n"), {encoding: 'utf8'});
	return 0;
})(process.argv.slice(2)).then(onComplete, onError);
