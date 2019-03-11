//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------

/**
 * A type of all possible HTML element names.
 */
type ElementName<X = never> = string | X;
export default ElementName;
export {ElementName};
