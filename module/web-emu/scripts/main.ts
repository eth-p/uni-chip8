//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import App from './noveau/App';

import DialogController from './noveau/controller/DialogController';
import EmulatorController from './noveau/controller/EmulatorController';
import KeybindController from './noveau/controller/KeybindController';
import PlayPauseController from './noveau/controller/PlayPauseController';
import TriggerController from './noveau/controller/TriggerController';
import VisibilityController from './noveau/controller/VisibilityController';

import ErrorDialogController from './noveau/dialog/error/ErrorDialogController';
import LoadDialogController from './noveau/dialog/load/LoadDialogController';
import SettingsDialogController from './noveau/dialog/settings/SettingsDialogController';

App.depends([
	// Application controllers.
	KeybindController,
	EmulatorController,
	TriggerController,
	PlayPauseController,
	DialogController,
	VisibilityController,

	// Dialog controllers.
	ErrorDialogController,
	LoadDialogController,
	SettingsDialogController
]);

// ---------------------------------------------------------------------------------------------------------------------
// Initialize UI:
// ---------------------------------------------------------------------------------------------------------------------
(<any>window).Chipotle = App;

// ---------------------------------------------------------------------------------------------------------------------
// Initialize App:
// ---------------------------------------------------------------------------------------------------------------------
App.emulator = emulator;
App.settings.suppressListeners('update', true);
App.addListener('ready', () => {
	console.log('READY!');
	App.settings.suppressListeners('update', false);
	App.settings.broadcast();
});

// OLD CODE
import dom_ready from '@chipotle/web/dom_ready';
import app_ready from '@chipotle/web/app_ready';

import './ui-controls';
// import './ui-settings';
import './ui-screen';
import './ui-savestates';
import './ui-registers';
import './ui-stack';
import './ui-disassembler';
import './ui-keypad';
import './keybind';
import './feedback';

import {emulator} from './instance';
import {settings} from './settings';
// ---------------------------------------------------------------------------------------------------------------------
// Event Listeners:
// ---------------------------------------------------------------------------------------------------------------------
let userPause = false;
document.addEventListener('visibilitychange', () => {
	if (document.hidden) {
		userPause = emulator.isPaused();
		emulator.pause();
	} else {
		if (!userPause) emulator.resume();
		userPause = false;
	}
});

settings.addListener('update', (setting, value) => {
	switch (setting) {
		case 'cpu_speed':
			emulator.setFrequency(value);
			break;

		default:
			break;
	}
});

emulator.addListener('snapshot', (id, snapshot) => {
	(<any>settings)[`savestate_${id}`] = {
		screenshot: null, // TODO: Real screenshots
		snapshot: snapshot,
		date: new Date().toUTCString(),
		unset: false
	};
});

// ---------------------------------------------------------------------------------------------------------------------
// Finish Load:
// ---------------------------------------------------------------------------------------------------------------------
dom_ready(() => {
	settings.broadcast();
	app_ready.done();
});
