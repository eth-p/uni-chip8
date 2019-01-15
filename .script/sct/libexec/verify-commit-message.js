#!/usr/bin/env node
// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
// MIT License
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// SCT Libexec: verify-commit-message.js
// This will ensure that the commit message follows project guidelines.
// ---------------------------------------------------------------------------------------------------------------------
'use strict';
require('module-alias/register');

// Libraries.
const fs = require('fs-extra');

// Modules.
const SCT = require('@sct');

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
		console.log('Failed to commit changes.');
		console.log();
		console.log(error);
	}

	process.exit(1);
}

async function verify(line, modules) {
	let ALLOWED_MODULES = ['*'].concat(modules.map(m => m.getId()));
	let ALLOWED_VERBS   = ['Update', 'Add', 'Remove', 'Refactor', 'Change', 'Rename', 'Move', 'Fix', 'Reformat', 'Replace'];

	// Ignore if it's a merge commit.
	if (line.startsWith('Merge ')) return;

	// Parse.
	let index       = line.indexOf(':');
	let index2      = line.indexOf(' ', index + 2);

	if (/ {2,}/.test(line))                           throw "Commit message has a double-space.";
	if (line.substring(index + 1, index + 2) !== ' ') throw "Commit message needs a space between the module and verb.";

	let msgModule  = line.substring(0, index).trim();
	let msgVerb    = line.substring(index + 1, index2).trim();
	let msgChanges = line.substring(index2 + 1).trim();

	if (index2 === -1 || msgModule === '' || msgVerb === '' || msgChanges === '' || !/^\*|([a-z0-9\-]+)$/.test(msgModule)) {
		throw "Commit message must be in the format of:\n[Module]: [Verb] [Changes]";
	}

	// Verify module.
	if (msgModule !== msgModule.toLowerCase()) throw 'Commit message [module] must be lowercase.';
	if (!ALLOWED_MODULES.includes(msgModule))  throw 'Commit message [module] is not a project module.';

	// Verify verb.
	if (!/^[A-Z][a-z]+$/.test(msgVerb))        throw 'Commit message [verb] must start with an uppercase character.';
	if (!ALLOWED_VERBS.includes(msgVerb))      throw `Commit message [verb] '${msgVerb}' is not allowed.`;

	// Verify changes.
	if (msgChanges.endsWith('.'))              throw 'Commit message [changes] cannot end with punctuation.';

	// Verify length.
	if (line.trim().length > 72)               throw 'First line of commit message cannot exceed 72 characters.';
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

	let summaryLine = lines.findIndex(l => !l.startsWith('#') && l.trim().length !== 0);

	// Verify.
	await verify(lines[summaryLine], modules);

	// Clean up.
	lines[summaryLine] = lines[summaryLine].trim();

	// All good.
	await fs.writeFile(file, lines.join("\n"), {encoding: 'utf8'});
	return 0;
})(process.argv.slice(2)).then(onComplete, onError);
