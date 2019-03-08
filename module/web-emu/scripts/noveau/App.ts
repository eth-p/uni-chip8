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
import AppTriggers from './AppTriggers';

// ---------------------------------------------------------------------------------------------------------------------

class AppBase {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	protected emulator: Emulator = AppBase.emulator;
	protected settings: AppSettings = AppBase.settings;
	protected state: AppState = AppBase.state;
	protected triggers: AppTriggers = AppBase.triggers;

	// -------------------------------------------------------------------------------------------------------------
	// | Static:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	public static emulator: Emulator = new Emulator(new VM(new Chip()));
	public static settings: AppSettings = new AppSettings('emulator');
	public static state: AppState = new AppState();
	public static triggers: AppTriggers = new AppTriggers();
}

// ---------------------------------------------------------------------------------------------------------------------

const App = Application<typeof AppBase, AppBase>(AppBase);
namespace App {
	export type Fragment<T> = FragmentClass<AppBase> & T;
}

// ---------------------------------------------------------------------------------------------------------------------
export default App;
export {App};
