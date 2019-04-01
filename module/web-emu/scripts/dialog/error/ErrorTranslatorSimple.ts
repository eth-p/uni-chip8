//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import ProgramError from '@chipotle/vm/ProgramError';
import VMError from '@chipotle/vm/VMError';

import ErrorMessage from './ErrorMessage';
import ErrorTranslator from './ErrorTranslator';

// ---------------------------------------------------------------------------------------------------------------------

/**
 * A class that translates error messages to something human friendly.
 */
class ErrorTranslatorSimple extends ErrorTranslator {
	public getProgramMessage(error: ProgramError) {
		return {
			message: 'An unexpected error has occurred with the program.',
			troubleshooting: 'Try resetting the program.'
		};
	}

	public getSystemMessage(error: VMError): ErrorMessage {
		return {
			message: 'An unexpected error has occurred with the virtual machine.',
			troubleshooting: 'Try resetting the program.'
		};
	}

	public getGenericMessage(error: Error): ErrorMessage {
		return {
			message: 'An unexpected error has occurred.',
			troubleshooting: 'Try reloading the page.'
		};
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default ErrorTranslatorSimple;
export {ErrorTranslatorSimple};
