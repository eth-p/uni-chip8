//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import AssemblerContext from '../AssemblerContext';
import AssemblerError from '../AssemblerError';
import Node from '../Node';
import NodeType from '../NodeType';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * An Abstract Syntax Tree node.
 * This is the base class for all nodes.
 */
class RootNode extends Node {}

// ---------------------------------------------------------------------------------------------------------------------
export default RootNode;
export {RootNode};
