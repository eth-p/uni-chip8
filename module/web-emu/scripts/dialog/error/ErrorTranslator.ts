//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import ProgramError from '@chipotle/vm/ProgramError';
import VMError from '@chipotle/vm/VMError';

import ErrorMessage from './ErrorMessage';

// ---------------------------------------------------------------------------------------------------------------------

/**
 * A class that translates error messages to something human friendly.
 */
class ErrorTranslator {
	/**
	 * Gets an error message from an Error.
	 *
	 * @param error The error object.
	 * @returns The friendly error message.
	 */
	public getMessage(error: Error): ErrorMessage {
		if (error instanceof ProgramError) {
			return this.getProgramMessage(error);
		} else if (error instanceof VMError) {
			return this.getSystemMessage(error);
		} else {
			return this.getGenericMessage(error);
		}
	}

	/**
	 * Gets a program error message.
	 * This is used for errors caused by faulty program ROMs.
	 *
	 * @param error The error object.
	 * @returns The friendly error message.
	 */
	public getProgramMessage(error: ProgramError) {
		switch (error.message) {
			case ProgramError.PROGRAM_OVERRUN:
				return {
					message: 'The program counter reached the end of the CHIP-8 memory space.',
					troubleshooting: 'This is a program developer error.'
				};

			case ProgramError.STACK_OVERFLOW:
				return {
					message: 'The program stack overflowed.',
					troubleshooting: 'This is likely a program developer error.'
				};

			case ProgramError.STACK_UNDERFLOW:
				return {
					message: 'The program stack underflowed.',
					troubleshooting: 'This is a program developer error.'
				};

			case ProgramError.UNKNOWN_OPCODE:
				return {
					message: 'The program attempted to execute an unknown instruction.',
					troubleshooting: 'This is likely a program developer error.'
				};

			case ProgramError.ROM_TOO_LARGE:
				return {
					message: 'The program ROM is too large to fit inside the CHIP-8 memory space.',
					troubleshooting: 'Are you sure you uploaded a ROM?'
				};

			default:
				return {
					message: 'An unexpected error has occurred with the program.',
					troubleshooting: 'Try resetting the program.',
					trace: error.stack
				};
		}
	}

	/**
	 * Gets a virtual machine error message.
	 * This is used for errors caused by the virtual machine.
	 *
	 * @param error The error object.
	 * @returns The friendly error message.
	 */
	public getSystemMessage(error: VMError): ErrorMessage {
		return {
			message: 'An unexpected error has occurred with the virtual machine.',
			troubleshooting: 'Try resetting the program.',
			trace: error.stack
		};
	}

	/**
	 * Gets a generic error message.
	 * This is used for unexpected errors.
	 *
	 * @param error The error object.
	 * @returns The friendly error message.
	 */
	public getGenericMessage(error: Error): ErrorMessage {
		return {
			message: 'An unexpected error has occurred.',
			troubleshooting: 'Try reloading the page.',
			trace: error.stack
		};
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default ErrorTranslator;
export {ErrorTranslator};
