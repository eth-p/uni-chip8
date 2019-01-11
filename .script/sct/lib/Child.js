// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
// MIT License
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Lib: Child
// A class for invoking external commands or programs.
// ---------------------------------------------------------------------------------------------------------------------
'use strict';

// Libraries.
const chalk        = require('chalk');
const childprocess = require('child_process');

// Modules.
const SCTError                = require('./SCTError');
const SCT                     = require('./SCT');

// ---------------------------------------------------------------------------------------------------------------------
// Class:
// ---------------------------------------------------------------------------------------------------------------------

/**
 * A class for invoking external commands or programs.
 * @type {Child}
 */
module.exports = class Child {

	/**
	 * Creates a new child process.
	 *
	 * @param command {String}   The program name or path.
	 * @param args    {String[]} The program arguments.
	 * @param options {*}        The options. This is passed to {@link child_process.spawn}
	 */
	constructor(command, args, options) {
		let stdio = (options != null && options.stdio != null) ? options.stdio : ['inherit', 'frame', 'frame'];
		this._printed = false;
		this._command = command;
		this._args    = args instanceof Array ? args : [];

		// Show?
		if (options != null && options.show === true) {
			this._printCommand();
		}

		// Create process and promise.
		this._proc = childprocess.spawn(command, args, {
			... options,
			stdio: stdio.map(t => t === 'frame' ? 'pipe' : t)
		});

		this._promise = new Promise((resolve, reject) => {
			this._proc.on('error', (...args) => reject(args));
			this._proc.on('exit', (code, signal) => {
				if (code !== 0) {
					reject(code === null ? signal : code);
				} else {
					resolve(code);
				}
			})
		});

		// Bind promise functions.
		for (let prop of Object.getOwnPropertyNames(Promise.prototype).filter(p => p !== 'constructor')) {
			if (typeof(this._promise[prop]) === 'function') {
				this[prop] = this._promise[prop].bind(this._promise);
			}
		}

		// Bind process functions.
		for (let prop of [
			Object.getOwnPropertyNames(this._proc),
			Object.getOwnPropertyNames(this._proc.constructor.prototype)
		].flat().filter(p => !p.startsWith('_')).filter(p => p !== 'constructor')) {
			if (typeof(this._proc[prop]) === 'function') {
				this[prop] = this._proc[prop].bind(this._proc);
			} else {
				Object.defineProperty(this, prop, {
					get: () => this._proc[prop],
					set: (v) => this._proc[prop] = v,
					enumerable: true
				});
			}
		}

		// Wrap outputs.
		if (stdio[1] === 'frame') this._wrapOutput('stdout');
		if (stdio[2] === 'frame') this._wrapOutput('stderr');
	}

	/**
	 * Prints the command that spawned the process.
	 * @private
	 */
	_printCommand() {
		this._printed = true;
		console.log(chalk.magenta(`$ ${this._command}`) + ' ' + chalk.cyan(this._args.join(' ')));
	}

	/**
	 * Prints a line that was output by the process.
	 *
	 * @param fd   {string} The file descriptor name.
	 * @param line {string} The line text.
	 * @private
	 */
	_printLine(fd, line) {
		console.log(chalk[fd === 'stderr' ? 'red' : 'yellow']('| ') + line);
	}

	/**
	 * Frames output from one of the child's file descriptors.
	 * @param fd   {string} The file descriptor name.
	 * @private
	 */
	_wrapOutput(fd) {
		let buffer = '';

		this._proc[fd].on('data', str => {
			if (!this._printed) this._printCommand();

			let lines = (buffer + str).split("\n");
			for (let i = 0; i < (lines.length - 1); i++) {
				this._printLine(fd, lines[i]);
			}

			buffer = lines[lines.length - 1];
		});

		this._proc[fd].on('end', () => {
			if (buffer.length > 0) this._printLine(fd, buffer);
		});
	}

};

