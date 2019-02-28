//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import {ALL_TRUE, ANY_TRUE} from '@chipotle/wfw/StateReducer';
import Application, {FragmentClass} from '@chipotle/wfw/Application';
import State from '@chipotle/wfw/State';

import AppSettings from './AppSettings';
import Emulator from '../Emulator';
import StateProvider from '@chipotle/wfw/StateProvider';

// ---------------------------------------------------------------------------------------------------------------------

class AppBase {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	protected emulator: Emulator = AppBase.emulator;
	protected settings: AppSettings = AppBase.settings;
	protected state: AppState = AppBase.state;

	// -------------------------------------------------------------------------------------------------------------
	// | Static:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	public static emulator: Emulator = <any>null /* FIXME: Remove when refactoring noveau -> default */;
	public static settings: AppSettings = new AppSettings('emulator');
	public static state: AppState = {
		user: {
			pause: new StateProvider(false)
		},
		emulator: {
			paused: new State<boolean>(ANY_TRUE),
			keybind: new State<boolean>(ALL_TRUE)
		}
	};
}

interface AppState {
	user: {
		pause: StateProvider<boolean>;
	};
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

App.state.emulator.paused.addProvider(App.state.user.pause);

// ---------------------------------------------------------------------------------------------------------------------
// Exports:
export default App;
export {App};
export {AppState};
