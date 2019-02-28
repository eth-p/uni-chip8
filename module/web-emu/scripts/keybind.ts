//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import assert from '@chipotle/types/assert';

import Savestate from './Savestate';
import settings from './settings';
import {emulator} from './instance';

// ---------------------------------------------------------------------------------------------------------------------
// Variables:
let keybindsEnabled: boolean = true;

// ---------------------------------------------------------------------------------------------------------------------
// Exports:
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Sets whether or not keybinds are enabled.
 * @param enabled True if keybinds are enabled.
 */
export function setEnabled(enabled: boolean): void {
	keybindsEnabled = enabled;
}
