//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import dom_ready from '@chipotle/web/dom_ready';
import app_ready from '@chipotle/web/app_ready';

import './ui-controls';
import './ui-error';
import './ui-settings';
import './ui-screen';
import './ui-load';
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
