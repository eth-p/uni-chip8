#!/usr/bin/env node
// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
// MIT License
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// SCT Init: Initialize the project.
// This tool will initialize the project and configure the repo.
// ---------------------------------------------------------------------------------------------------------------------
'use strict';

// Libraries.
const chalk    = require('chalk');
const inquirer = require('inquirer');

// Modules.
const Child        = require('@sct').Child;
const Command      = require('@sct').Command;
const GitUtil      = require('@sct').GitUtil;
const SCT          = require('@sct');

// ---------------------------------------------------------------------------------------------------------------------
// Class:
// ---------------------------------------------------------------------------------------------------------------------

module.exports = class CommandTest extends Command {

	name() {
		return 'sct init';
	}

	description() {
		return 'Initialize the project.';
	}

	schema() {
		return {
			'install': {
				type: 'boolean',
				default: true,
				description: 'Initialize software.'
			},
			'configure': {
				type: 'boolean',
				default: true,
				description: 'Configure software.'
			}
		}
	}

	async run(args) {
		let repo = await (await (SCT.getProject())).getRepository();

		if (repo == null) {
			console.error(chalk.red('Could not find git repository.'));
			console.error(chalk.red('Some features will be missing.'));
			return 2;
		}


		await this._runRepoInstall(args, repo);
		await this._runRepoConfig(args, repo);
	}

	async _runRepoInstall(args, repo) {
		console.log(chalk.yellow("Initializing repository..."));

		if (args['install']) await new Child('git', ['lfs', 'install'], {show: true, stdio: [null, null, 'frame']});
		if (args['install']) await new Child('git', ['submodule', 'update', '--init', '--recursive'], {show: true, stdio: [null, 'frame', 'frame']});
		// if (!args['install']) await _installGitHooks(repo.path());
	}

	async _runRepoConfig(args, repo) {
		console.log(chalk.yellow("Configuring repository..."));
		if (!args['configure']) {
			return;
		}

		const config  = await repo.config();
		const answers = await inquirer.prompt([
			{
				type:     'input',
				name:     'user_name',
				message:  'What is your full name?',
				default:  await GitUtil.getUserName(repo),
				validate: (input) => {
					if (input.split(" ").length < 2) return "Please enter both your first and last names.";
					if (!/^\p{Upper}\p{Lower}+ \p{Upper}\p{Lower}+$/u.test(input)) return "Please use proper casing.";
					return true;
				}
			},
			{
				type:     'input',
				name:     'user_email',
				message:  'What is your email?',
				default:  await GitUtil.getUserEmail(repo),
				validate: (input) => {
					if (!/^[A-Za-z0-9._+\-]+@[a-z0-9\-]+\.[a-z0-9\-]+$/u.test(input)) return "Please enter a valid email.";
					return true;
				}
			},
			{
				type:     'confirm',
				name:     'user_email_public',
				message:  'Do you want your email to be displayed?',
				default:  true
			}
		]);

		// Apply config.
		await config.setString('user.name', answers.user_name);
		await config.setString('user.email', answers.user_email_public ? answers.user_email : 'hidden');
	}


};
