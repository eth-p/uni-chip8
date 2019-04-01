//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import MathFlag from './MathFlag';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * A JSON-serializable type.
 */
type JsonType = {[key: string]: JsonType} | number | string | boolean | null | JsonArray;

// tslint:disable:array-type
type JsonArray = Array<any> | {[key: number]: JsonType};

// ---------------------------------------------------------------------------------------------------------------------
export default JsonType;
export {JsonType};
