// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
// MIT License
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Lib: TaskLoggerPretty
// A human-readable logger for build tasks.
// ---------------------------------------------------------------------------------------------------------------------
'use strict';

// Libraries.
const chalk = require('chalk');

// Modules.
const TaskLogger = require('./TaskLogger');

// ---------------------------------------------------------------------------------------------------------------------
// Class:
// ---------------------------------------------------------------------------------------------------------------------

/**
 * A human-readable logger for build tasks.
 *
 * @type {TaskLoggerPretty}
 */
module.exports = class TaskLoggerPretty extends TaskLogger {

	/**
	 * @override
	 */
	_write(str) {
		console.log(str);
	}

	/**
	 * @override
	 */
	_format(task, level, date, message) {
		return `[${date}] ${level} [${task}] ${message}`;
	}

	/**
	 * @override
	 */
	_formatDate(date) {
		let h = date.getHours().toString().padStart(2, '0');
		let m = date.getMinutes().toString().padStart(2, '0');
		let s = date.getSeconds().toString().padStart(2, '0');
		return chalk.grey(`${h}:${m}:${s}`);
	}

	/**
	 * @override
	 */
	_formatLevel(level) {
		let formatted = level.toUpperCase().padEnd(5);
		switch (level.toLowerCase()) {
			case 'error': formatted = chalk.red(formatted);    break;
			case 'warn':  formatted = chalk.yellow(formatted); break;
			case 'task':  formatted = chalk.green(formatted);  break;
		}
		return formatted;
	}

	/**
	 * @override
	 */
	_formatTask(task) {
		return chalk.magenta(task.fqid);
	}

	/**
	 * @override
	 */
	_formatMessage(message) {
		return message;
	}

	/**
	 * @override
	 */
	_formatError(error) {
		let stack = error.stack.split("\n");
		if (stack.length > 0) {
			stack = stack.map(line => `| ${line}`);
		}

		return stack.join("\n");
	}

};

