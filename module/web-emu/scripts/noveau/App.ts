//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import {ALL_TRUE, ANY_TRUE} from '@chipotle/wfw/StateReducer';
import Application, {FragmentClass} from '@chipotle/wfw/Application';
import State from '@chipotle/wfw/State';

import AppSettings from './AppSettings';

// ---------------------------------------------------------------------------------------------------------------------

class AppBase {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	protected settings: AppSettings = AppBase.settings;
	protected state: AppState = AppBase.state;

	// -------------------------------------------------------------------------------------------------------------
	// | Static:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	public static settings: AppSettings = new AppSettings('emulator');
	public static state: AppState = {
		emulator: {
			paused: new State<boolean>(ANY_TRUE),
			keybind: new State<boolean>(ALL_TRUE)
		}
	};
}

interface AppState {
	emulator: {
		paused: State<boolean>;
		keybind: State<boolean>;
	};
}

// ---------------------------------------------------------------------------------------------------------------------

const App = Application<typeof AppBase, AppBase>(AppBase);
namespace App {
	export type Fragment<T> = FragmentClass<AppBase> & T;
}

// ---------------------------------------------------------------------------------------------------------------------
// Exports:
export default App;
export {App};
export {AppState};
