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
const fs      = require('fs-extra');
const request = require('request-promise');
const path    = require('path');

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
		console.log(error);
	}

	process.exit(1);
}

async function getStats(REPO_OWNER, REPO_NAME, API_TOKEN) {
	try {
		return await request({
			url: `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/stats/contributors`,
			headers: {
				'User-Agent': 'Build Script (eth-p)',
				'Authorization': API_TOKEN == null ? null : `Basic ${(Buffer.from(API_TOKEN)).toString('base64')}`
			}
		});
	} catch (ex) {
		console.error("Failed to get statistics.");
		console.error('Repo:  %s/%s', REPO_OWNER, REPO_NAME);
		console.error('Error: %s', JSON.parse(ex.response.body).message);
		process.exit(1);
	}
}

// ---------------------------------------------------------------------------------------------------------------------
// Main:
// ---------------------------------------------------------------------------------------------------------------------

(async function(argv) {
	const project = await SCT.getProject();
	const dir = project.getTempDirectory();

	const API_TOKEN = process.env['GITHUB_AUTH'];
	const REPO_OWNER = process.env['REPO_OWNER'] || process.env['CIRCLE_PROJECT_USERNAME'];
	const REPO_NAME = process.env['REPO_NAME'] || process.env['CIRCLE_PROJECT_REPONAME'];

	if (REPO_OWNER == null || REPO_NAME == null) {
		console.error("Please set REPO_OWNER and REPO_NAME environment variables.");
		process.exit(2);
	}

	let retries = 4;
	let data = {};
	while ((retries--) > 0) {
		data = await getStats(REPO_OWNER, REPO_NAME, API_TOKEN);
		if (Object.keys(data).length > 0) break;
		await new Promise((resolve) => setTimeout(resolve, 2500));
	}

	if (Object.keys(data).length === 0) {
		console.error("Failed to get statistics.");
		console.error('Repo:  %s/%s', REPO_OWNER, REPO_NAME);
		console.error('Error: GitHub API Returned Empty Response');
		process.exit(1);
	}

	console.log("Fetched information for %d contributors.", JSON.parse(data).length);

	await fs.ensureDir(dir);
	await fs.writeFile(path.join(dir, 'stats.json'), data, 'utf8');
})(process.argv.slice(2)).then(onComplete, onError);
