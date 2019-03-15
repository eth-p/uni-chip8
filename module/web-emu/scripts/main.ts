//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import App from './noveau/App';

import DialogController from './noveau/controller/DialogController';
import EmulatorController from './noveau/controller/EmulatorController';
import EmulatorButtonController from './noveau/controller/EmulatorButtonController';
import EmulatorFeedbackController from './noveau/controller/EmulatorFeedbackController';
import KeybindController from './noveau/controller/KeybindController';
import TriggerController from './noveau/controller/TriggerController';
import VisibilityController from './noveau/controller/VisibilityController';

import ErrorDialog from './noveau/dialog/error/ErrorDialog';
import LoadDialog from './noveau/dialog/load/LoadDialog';
import SettingsDialog from './noveau/dialog/settings/SettingsDialog';

import KeypadVisualizer from './noveau/visualizer/keypad/KeypadVisualizer';
import ProgramVisualizer from './noveau/visualizer/program/ProgramVisualizer';
import ScreenVisualizer from './noveau/visualizer/screen/ScreenVisualizer';
import StackVisualizer from './noveau/visualizer/stack/StackVisualizer';

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

App.depends([
	// Application controllers.
	KeybindController,
	EmulatorController,
	TriggerController,
	EmulatorButtonController,
	EmulatorFeedbackController,
	DialogController,
	VisibilityController,

	// Dialog controllers.
	ErrorDialog,
	LoadDialog,
	SettingsDialog,

	// Visualizers.
	KeypadVisualizer,
	ProgramVisualizer,
	ScreenVisualizer,
	StackVisualizer
]);

// OLD CODE
import dom_ready from '@chipotle/web/dom_ready';
import app_ready from '@chipotle/web/app_ready';

import './ui-registers';

import {emulator} from './instance';
import {settings} from './settings';
// ---------------------------------------------------------------------------------------------------------------------
// Event Listeners:
// ---------------------------------------------------------------------------------------------------------------------
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
