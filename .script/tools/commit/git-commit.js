// Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
// MIT License
// ---------------------------------------------------------------------------------------------------------------------
'use strict';

const chalk    = require('chalk');
const fs       = require('fs-extra');
const git      = require('nodegit');
const inquirer = require('inquirer');
const path     = require('path');

// ---------------------------------------------------------------------------------------------------------------------
// Prompt:

/**
 * Prompts and answers related to this script.
 */
class Answers {

	constructor() {
		this._cachefile = path.join(process.cwd(), '.tmp', 'commit.json');
		this._choices = {
			modules: ['docs', 'tools'],
			verbs:   {
				'add':       '[+] Added something.',
				'remove':    '[-] Removed something.',
				'change':    '[~] Changed something.',
				'fix':       '[#] Fixed something.',
				'deorecate': '[~] Deprecated something.'
			}
		}
	}

	async load() {
		try {
			await fs.ensureDir(path.dirname(this._cachefile));
			Object.assign(this, JSON.parse(await fs.readFile(this._cachefile, 'utf-8')));
			return true;
		} catch (ex) {
			return false;
		}
	}

	async save() {
		return fs.writeFile(this._cachefile, JSON.stringify(
			Object.entries(this)
				.filter(x => !x[0].startsWith('_'))
				.reduce((obj, [k, v]) => (obj[k] = v, obj), {})
		));
	}

	clear() {
		for (let prop in this) {
			if (!prop.startsWith('_') && Object.prototype.hasOwnProperty.call(this, prop)) {
				delete this[prop];
			}
		}
	}

	getCommitMessage(text) {
		let messageverb = `${this.verb.charAt(0).toUpperCase() + this.verb.substring(1).toLowerCase()}`;
		let messagestr  = `${text == null ? (this.message.charAt(0).toLowerCase() + this.message.substring(1)) : text}`;
		if (messagestr.endsWith('.')) messagestr = messagestr.substring(0, messagestr.lastIndexOf('.'));

		let message     = `${this.module}: ${messageverb} ${messagestr}`;

		if (this.issues != null) {
			message += ` (${this.issues.map(x => `#${x}`).join(', ')})`;
		}

		return message;
	}

	/**
	 * Ask the user about which module is affected.
	 * @returns {Promise<string>}
	 */
	async askModule() {
		let {answer} = await inquirer.prompt([
			{
				type:     'list',
				name:     'answer',
				message:  'What module does your change affect?',
				default:  this.module,
				choices:  [ ...this._choices.modules, new inquirer.Separator(), 'other...' ]
			}
		]);

		if (answer === 'other...') {
			let {text} = await inquirer.prompt([
				{
					type:     'input',
					name:     'text',
					message:  'What module does your changes affect?',
					validate: (text) => {
						if (!/^[a-z\-]+$/u.test(text)) return "Please enter a valid module name.";
						return true;
					}
				}
			]);

			answer = text;
		}

		this.module = answer;
		await this.save();
		return answer;
	}

	/**
	 * Ask the user which verb best describes the changes made.
	 * @returns {Promise<string>}
	 */
	async askVerb() {
		let {answer} = await inquirer.prompt([
			{
				type:     'list',
				name:     'answer',
				message:  'Which best describes your changes?',
				default:  this.verb,
				choices:  Object.entries(this._choices.verbs).map(([k,v]) => ({name: v, value: k, short: k}))
			}
		]);

		this.verb = answer;
		await this.save();
		return answer;
	}

	/**
	 * Ask the user if the change is related to an issue.
	 * @returns {Promise<string>}
	 */
	async askIssues() {
		let {answer} = await inquirer.prompt([
			{
				type:     'confirm',
				name:     'answer',
				message:  'Are these changes related to a GitHub issue?',
				default:  this.issues != null,
			}
		]);

		if (!answer) {
			this.issues = null;
			await this.save();
			return answer;
		}

		answer = (await inquirer.prompt([
			{
				type:     'input',
				name:     'answer',
				message:  'What issues?',
				default:  (this.issues != null ? this.issues.map(x => `#${x}`).join(', ') : ''),
				validate: (text) => {
					if (!/^(?: *#(\d+) *,?)+$/.test(text)) return 'Please list issues as: #1, #2, #3'
					return true;
				}
			}
		])).answer;

		// Read matches.
		this.issues = [];
		let regex = / *#(\d+) *,?/g;
		let match = null;
		while (match = regex.exec(answer)) {
			this.issues.push(parseInt(match[1]));
		}

		this.issues.sort((x, y) => x - y);
		await this.save();
		return answer;
	}

	/**
	 * Ask the user for the commit message.
	 * @returns {Promise<string>}
	 */
	async askMessage() {
		let {answer} = await inquirer.prompt([
			{
				type:     'input',
				name:     'answer',
				message:  `What did you ${this.verb}?`,
				default:  this.message,
				validate: (text) => {
					if (text.length === 0) return 'Message is empty.';
					if (this.getCommitMessage(text).split("\n")[0].length > 80) return 'Message is too long.';
					return true;
				}
			}
		]);

		this.message = answer;
		await this.save();
		return answer;
	}

}

// ---------------------------------------------------------------------------------------------------------------------
// Main:

async function main() {
	const repo_path   = await git.Repository.discover('.', 0, '/');
	const repo        = await git.Repository.open(repo_path);
	const config      = await repo.config();
	const index       = await repo.refreshIndex();

	// Get status.
	let status = await repo.getStatus();
	if (status.length === 0) {
		console.log('Nothing has changed since the last commit.');
		return 0;
	}

	// Get answers.
	let answers = new Answers();
	await answers.load();
	await answers.askModule();
	await answers.askVerb();
	await answers.askIssues();
	await answers.askMessage();

	// Get info.
	let name    = await config.getStringBuf('user.name');
	let email   = await config.getStringBuf('user.email');
	let message = answers.getCommitMessage();

	// Notify about things.
	console.log("\nHere are the changes...");
	for (let file of status) {
		if (file.isNew()) {
			console.log(chalk.green('Added    ') + file.path());
		} else if (file.isDeleted()) {
			console.log(chalk.red('Deleted  ') + file.path());
		} else {
			console.log(chalk.blue('Modified ') + file.path());
		}
	}

	console.log("\nHere is the commit message...");
	console.log(chalk.yellow(`Author: ${name} <${email}>`));
	console.log(`${chalk.yellow('|')} ` + message.split("\n").join(`\n${chalk.yellow('|')} `));
	console.log("");

	// Final changes.
	let answers2 = await inquirer.prompt([
		{
			type:    'confirm',
			name:    'confirm',
			message: 'Is this ok?',
			default: true
		},
		{
			type:    'editor',
			name:    'message',
			message: 'What commit message would you like?',
			default:  message,
			when:    (ans) => !ans.confirm
		}
	]);

	if (answers2.message != null) message = answers2.message;

	// Add files and commit.
	await Promise.all([].concat(
		status.filter(x => !x.isDeleted()).map(x => index.addByPath(x.path())),
		status.filter(x => x.isDeleted()).map(x => index.removeByPath(x.path()))
	));
	await index.write();
	let oid    = await index.writeTree();
	let parent = await repo.getCommit(await git.Reference.nameToId(repo, 'HEAD'));
	let author = git.Signature.now(name, email);
	await repo.createCommit('HEAD', author, author, message, oid, [parent]);


	// Cleanup.
	await answers.clear();
	await answers.save();
	repo.free();
}

// ---------------------------------------------------------------------------------------------------------------------
// Entry:

main(Array.from(process.argv).slice(1)).then(()=>{}, (error) => {
	console.error(chalk.red('sct-commit: failed to commit changes.'));
	console.error('');
	console.error(error);
	process.exit(1);
});
