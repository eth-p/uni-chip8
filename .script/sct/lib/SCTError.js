// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Ethan Pini <contact@eth-p.dev>
// MIT License
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Lib: SCT
// An error that can be presented directly to the user.
// ---------------------------------------------------------------------------------------------------------------------
'use strict';

// Modules.
const CommandError = require('./CommandError');

// ---------------------------------------------------------------------------------------------------------------------
// Class:
// ---------------------------------------------------------------------------------------------------------------------

/**
 * An error that can be presented directly to the user.
 * This is the internal type used by the non-user-facing library functions.
 *
 * @type {SCTError}
 */
module.exports = class SCTError extends CommandError {
};
