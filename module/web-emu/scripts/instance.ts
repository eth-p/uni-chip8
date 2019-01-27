//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
//  Developer notes:
//  @eth-p: This is a singleton class for interacting with the emulator and virtual machine.
// ---------------------------------------------------------------------------------------------------------------------
import VM from '@chipotle/vm/VM';
import Chip from '@chipotle/arch-chip/Chip';
import Emulator from './Emulator';

import settings from './settings';
// ---------------------------------------------------------------------------------------------------------------------
// Variables:
let vm = new VM(new Chip());
let emulator = new Emulator(vm);

// ---------------------------------------------------------------------------------------------------------------------
// Exports:
export {emulator};
export {vm};

(Chipotle => {
	Chipotle.vm = vm;
	Chipotle.emulator = emulator;
	Chipotle.settings = settings;
})((<any>window).Chipotle || ((<any>window).Chipotle = {}));
