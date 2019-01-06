#!/usr/bin/env node
// Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
// MIT License
// ---------------------------------------------------------------------------------------------------------------------
// project: Query project information.
// ---------------------------------------------------------------------------------------------------------------------
'use strict';
require('module-alias/register');

// Libraries.
const minimist = require('minimist');
const mm       = require('micromatch');
const path     = require('path');

// Modules.
const Project  = require('@/Project');

// ---------------------------------------------------------------------------------------------------------------------
// Arguments.
// ---------------------------------------------------------------------------------------------------------------------

const ARGS = minimist(process.argv.slice(2), {
	boolean: [
		'list-modules',
		'list-meta-modules',
		'list-module-files',
		'list-module-sources',
		'list-module-tests',
		'test-module-exists',
		'test-module-meta'
	]
});

// ---------------------------------------------------------------------------------------------------------------------
// Arguments.
// ---------------------------------------------------------------------------------------------------------------------

async function listModules(project, ARGS) {
	if (ARGS['list-modules']) {
		project
			.getModules()
			.filter(x => !x.isMeta())
			.map(x => x.getId())
			.forEach(x => process.stdout.write(`${x}\n`));
	}

	if (ARGS['list-meta-modules']) {
		project
			.getModules()
			.filter(x => x.isMeta())
			.map(x => x.getId())
			.forEach(x => process.stdout.write(`${x}\n`));
	}
}

async function listFiles(project, modules, fnsig) {
	(await Promise.all(modules.map(x => (project.getModule(x))[fnsig]()).flat().map(x => x.array())))
		.flat()
		.sort()
		.forEach(x => process.stdout.write(`${x}\n`));
}

// ---------------------------------------------------------------------------------------------------------------------
// Main.
// ---------------------------------------------------------------------------------------------------------------------

(async function() {
	const project = await Project.get();

	switch (true) {
		case ARGS['list-modules']:
		case ARGS['list-meta-modules']:
			await listModules(project, ARGS);
			break;

		case ARGS['test-module-exists']:
			process.exit(ARGS._.map(x => project.getModules().map(y => y.getId()).includes(x)).includes(false) ? 1 : 0);
			break;

		case ARGS['test-module-meta']:
			process.exit(ARGS._.map(x => project.getModule(x)).map(x => x.isMeta()).includes(false) ? 1 : 0);
			break;

		case ARGS['list-module-files']:
			await listFiles(project, ARGS._, 'getFiles');
			break;

		case ARGS['list-module-sources']:
			await listFiles(project, ARGS._, 'getSourceFiles');
			break;

		case ARGS['list-module-tests']:
			await listFiles(project, ARGS._, 'getTestFiles');
			break;

		default:
			console.error('Unknown query.');
			process.exit(255);

	}
})().then(() => {}, (err) => {
	console.error(err);
	process.exit(255);
});
