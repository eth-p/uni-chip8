#!/usr/bin/env node
// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
// MIT License
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// SCT Build: Build the project.
// This tool will build the project.
// ---------------------------------------------------------------------------------------------------------------------
'use strict';

// Libraries.
const http_server = require('http-server/lib/http-server');

// Modules.
const Command = require('@sct').Command;
const SCT = require('@sct');

// Commands.
const CommandBuild = require('./sct-build');

// ---------------------------------------------------------------------------------------------------------------------
// Class:
// ---------------------------------------------------------------------------------------------------------------------

module.exports = class CommandDev extends Command {

	name() {
		return 'sct dev';
	}

	description() {
		return 'Watched building and local hosting.';
	}

	schema() {
		return {
			'port': {
				type: 'number',
				default: 8080,
				validator: port => port >= 1024 && port <= 0xFFFF,
				description: 'The local HTTP server.',
				alias: '-p'
			},
		}
	}

	async run(args) {
		// Host HTTP server.
		http_server.createServer({
			root: (await SCT.getProject()).getBuildDirectory(),
			cache: 0
		}).listen(args.port, '127.0.0.1', (srv) => {
			console.log(`Started a webserver at 127.0.0.1:${args.port}.`);
		});

		// Start building.
		let build = new CommandBuild();
		await build.run({
			_: [],
			'keep:asserts': true,
			'keep:comments': true,
			'verbose': true,
			'sourcemaps': true,
			'minify': false,
			'watch': true
		});
	}

};
