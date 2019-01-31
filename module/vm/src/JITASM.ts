//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------

/**
 * JIT compiler assembler values.
 */
namespace JITASM {
	export type Code = string;
	export type CodeRef = string;
	export type CodeCon = string;

	export interface Program {
		/**
		 * Local declarations.
		 */
		locals?: string[];

		/**
		 * Values to provide to the JIT function.
		 */
		lib?: Function[] | {[key: string]: Function};

		/**
		 * JIT instructions.
		 */
		instructions: Code[];
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default JITASM;
export {JITASM};
