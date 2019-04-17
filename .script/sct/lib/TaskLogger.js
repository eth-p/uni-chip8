// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Ethan Pini <contact@eth-p.dev>
// MIT License
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Lib: TaskLogger
// A logger for build tasks.
// ---------------------------------------------------------------------------------------------------------------------
'use strict';

// ---------------------------------------------------------------------------------------------------------------------
// Class:
// ---------------------------------------------------------------------------------------------------------------------

/**
 * A logger for build tasks.
 *
 * @type {TaskLogger}
 */
module.exports = class TaskLogger {

	/**
	 * Creates a new task logger.
	 *
	 * @param task {Task} The task being logged.
	 */
	constructor(task) {
		this._task = task;
	}

	/**
	 * Log an INFO message.
	 * This is meant to log information.
	 *
	 * @param message {String|Error} The message to log.
	 */
	info(message) {
		return this.log('info', new Date(), message);
	}

	/**
	 * Log a file message.
	 * This is meant to verbosely log files.
	 *
	 * @param message {String|Error} The message to log.
	 */
	file(message) {
		return this.log('file', new Date(), message);
	}

	/**
	 * Log a WARN message.
	 * This is meant to log non-fatal warnings.
	 *
	 * @param message {String|Error} The message to log.
	 */
	warning(message) {
		return this.log('warn', new Date(), message);
	}

	/**
	 * Log an ERROR message.
	 * This is meant to log fatal errors.
	 *
	 * @param message {String|Error} The message to log.
	 */
	error(message) {
		return this.log('error', new Date(), message);
	}

	/**
	 * Log a TASK message.
	 * This is meant meta messages.
	 *
	 * @param message {String|Error} The message to log.
	 */
	task(message) {
		return this.log('task', new Date(), message);
	}

	/**
	 * Log a message.
	 *
	 * @param level   {String}       The log level.
	 * @param date    {Date}         The log timestamp.
	 * @param message {String|Error} The log message.
	 */
	log(level, date, message) {
		let fmtdMessage = message instanceof Error ? this._formatError(message) : this._formatMessage(message);
		let fmtdTask    = this._formatTask(this._task);
		let fmtdDate    = this._formatDate(date);
		let fmtdLevel   = this._formatLevel(level);
		this._write(this._format(fmtdTask, fmtdLevel, fmtdDate, fmtdMessage));
	}

	/**
	 * Write the formatted message.
	 *
	 * @param str {String} The message to write.
	 * @protected
	 */
	_write(str) {
		process.stdout.write(`${str}\n`);
	}

	/**
	 * Format a log message.
	 *
	 * @param task     {String} The task.
	 * @param level    {String} The level.
	 * @param date     {String} The date.
	 * @param message  {String} The message.
	 *
	 * @protected
	 */
	_format(task, level, date, message) {
		return `${task} | ${date} | ${level} |> ${message}`;
	}

	/**
	 * Format a log message date.
	 *
	 * @param date {Date} The date to format.
	 * @returns {String} The formatted date.
	 *
	 * @protected
	 */
	_formatDate(date) {
		return date.toUTCString();
	}

	/**
	 * Format a log message level.
	 *
	 * @param level {Date} The level to format.
	 * @returns {String} The formatted level.
	 *
	 * @protected
	 */
	_formatLevel(level) {
		return level.toUpperCase();
	}

	/**
	 * Format a log message task.
	 *
	 * @param task {Task} The task to format.
	 * @returns {String} The formatted task.
	 *
	 * @protected
	 */
	_formatTask(task) {
		return task.fqid;
	}

	/**
	 * Format a log message string.
	 *
	 * @param message {String} The string to format.
	 * @returns {String} The formatted string.
	 *
	 * @protected
	 */
	_formatMessage(message) {
		return message;
	}

	/**
	 * Format a log message error.
	 *
	 * @param error {Error} The error to format.
	 * @returns {String} The formatted error.
	 *
	 * @protected
	 */
	_formatError(error) {
		let stack = error.stack.split("\n");
		if (stack.length > 0) {
			stack = stack.map(line => `    ${line}`);
			stack.unshift("<<<END");
			stack.push("END");
		}

		return stack.join("\n");
	}

};

