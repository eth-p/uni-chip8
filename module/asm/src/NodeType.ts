//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------

/**
 * The type of an Abstract Syntax Tree node.
 */
enum NodeType {
	LABEL,
	ASSERT,
	DEFINE,
	ROOT,
	DIRECTIVE_ENTRY,
	DIRECTIVE_SYNTAX,
	DIRECTIVE_GETTER,
	CODEGEN_MACRO,
	CODEGEN_IF,
	CODEGEN_IF_ELSE,
	CODEGEN_REPEAT,
	INSTRUCTION,
	EXPRESSION,
	PARAMETER,
	SPRITE
}

// ---------------------------------------------------------------------------------------------------------------------
export default NodeType;
export {NodeType};
