//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import dom_ready from '@chipotle/web/dom_ready';

import './ui-settings';
import './ui-registers';
import {emulator} from './instance';
import {settings} from './settings';
// ---------------------------------------------------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------------------------------------------------
// Finish Load:
// ---------------------------------------------------------------------------------------------------------------------
dom_ready(() => {
	settings.broadcast();
});
