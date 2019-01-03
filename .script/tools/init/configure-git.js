// Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
// MIT License
// ---------------------------------------------------------------------------------------------------------------------
'use strict';

const chalk    = require('chalk');
const git      = require('nodegit');
const inquirer = require('inquirer');

// ---------------------------------------------------------------------------------------------------------------------
// Main:

async function main() {
	const repo_path = await git.Repository.discover('.', 0, '/');
	const repo      = await git.Repository.open(repo_path);
	const config    = await repo.config();

	console.log("Let's configure git.");
	const answers = await inquirer.prompt([
		{
			type:     'input',
			name:     'user_name',
			message:  'What is your full name?',
			default:  await config.getStringBuf('user.name'),
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
			default:  await config.getStringBuf('user.email'),
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

	// Cleanup.
	repo.free();
}

// ---------------------------------------------------------------------------------------------------------------------
// Entry:

main(Array.from(process.argv).slice(1)).then(()=>{}, (error) => {
	console.error(chalk.red('sct-init: failed to configure git.'));
	console.error('');
	console.error(error);
	process.exit(1);
});
