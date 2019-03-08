//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------

/**
 * A class that represents a human friendly error message.
 */
interface ErrorMessage {
	message: string;
	troubleshooting: string;
	trace?: string;
}

// ---------------------------------------------------------------------------------------------------------------------
export default ErrorMessage;
export {ErrorMessage};
