//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import App from './App';

import DialogController from './controller/DialogController';
import EmulatorController from './controller/EmulatorController';
import EmulatorButtonController from './controller/EmulatorButtonController';
import EmulatorFeedbackController from './controller/EmulatorFeedbackController';
import KeybindController from './controller/KeybindController';
import TriggerController from './controller/TriggerController';
import VisibilityController from './controller/VisibilityController';

import ErrorDialog from './dialog/error/ErrorDialog';
import HeapDialog from './dialog/heap/HeapDialog';
import LoadDialog from './dialog/load/LoadDialog';
import SavestatesDialog from './dialog/savestates/SavestateDialog';
import SettingsDialog from './dialog/settings/SettingsDialog';

import KeypadVisualizer from './visualizer/keypad/KeypadVisualizer';
import ProgramVisualizer from './visualizer/program/ProgramVisualizer';
import RegisterVisualizer from './visualizer/register/RegisterVisualizer';
import ScreenVisualizer from './visualizer/screen/ScreenVisualizer';
import StackVisualizer from './visualizer/stack/StackVisualizer';

// ---------------------------------------------------------------------------------------------------------------------
// Initialize UI:
// ---------------------------------------------------------------------------------------------------------------------
(<any>window).Chipotle = App;

// ---------------------------------------------------------------------------------------------------------------------
// Initialize App:
// ---------------------------------------------------------------------------------------------------------------------
App.settings.suppressListeners('update', true);

App.addListener('ready', () => {
	App.settings.suppressListeners('update', false);
	App.settings.broadcast();

	// Hide the loading screen.
	document.body.classList.remove('no-scroll');
	const loading = document.querySelector('#loading-screen');
	if (loading != null) {
		loading.parentNode!.removeChild(loading);
	}
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
	HeapDialog,
	LoadDialog,
	SavestatesDialog,
	SettingsDialog,

	// Visualizers.
	KeypadVisualizer,
	ProgramVisualizer,
	RegisterVisualizer,
	ScreenVisualizer,
	StackVisualizer
]);
