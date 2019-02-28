//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Chip from '@chipotle/chip-arch/Chip';

import VM from '@chipotle/vm/VM';

import Application, {FragmentClass} from '@chipotle/wfw/Application';

import AppSettings from './AppSettings';
import AppState from './AppState';
import Emulator from '../Emulator';

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

	public static emulator: Emulator = new Emulator(new VM(new Chip()));
	public static settings: AppSettings = new AppSettings('emulator');
	public static state: AppState = new AppState();
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
