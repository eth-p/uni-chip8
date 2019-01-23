//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------

/**
 * The type of an instruction operand.
 */
enum OperandType {
	/**
	 * A constant value.
	 */
	CONSTANT = 1 << 0,

	/**
	 * A reference to a register.
	 */
	REGISTER = 1 << 1,

	/**
	 * A reference to a program address.
	 */
	ROM_ADDRESS = 1 << 2,

	/**
	 * A reference to a memory address.
	 */
	RAM_ADDRESS = 1 << 3
}

// ---------------------------------------------------------------------------------------------------------------------

export {OperandType};
export default OperandType;
