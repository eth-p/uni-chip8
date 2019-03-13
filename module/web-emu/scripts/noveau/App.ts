//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Chip from '@chipotle/chip-arch/Chip';

import VM from '@chipotle/vm/VM';

import Application, {FragmentClass} from '@chipotle/wfw/Application';

import AppSettings from './AppSettings';
import AppState from './AppState';
import AppTriggers from './AppTriggers';

import Emulator from '../Emulator';
import Disassembler from './Disassembler';

// ---------------------------------------------------------------------------------------------------------------------

class AppBase {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	protected emulator: Emulator = AppBase.emulator;
	protected settings: AppSettings = AppBase.settings;
	protected state: AppState = AppBase.state;
	protected triggers: AppTriggers = AppBase.triggers;
	protected disassembler: Disassembler<Chip> = AppBase.disassembler;

	// -------------------------------------------------------------------------------------------------------------
	// | Static:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	public static emulator: Emulator = new Emulator(new VM(new Chip()));
	public static settings: AppSettings = new AppSettings('emulator');
	public static state: AppState = new AppState();
	public static triggers: AppTriggers = new AppTriggers();
	public static disassembler: Disassembler<Chip> = new Disassembler(AppBase.emulator.vm);
}

// ---------------------------------------------------------------------------------------------------------------------

const App = Application<typeof AppBase, AppBase>(AppBase);
namespace App {
	export type Fragment<T> = FragmentClass<AppBase> & T;
}

// ---------------------------------------------------------------------------------------------------------------------
// Initialization:

{
	// Bind settings.
	App.triggers.settings.save.onTrigger(() => App.settings.save());
	App.triggers.settings.undo.onTrigger(() => App.settings.load());
	App.triggers.settings.reset.onTrigger(() => App.settings.reset());

	// Reenable scrolling on load.
	App.addListener('ready', () => {
		document.body.classList.remove('no-scroll');
	});

	// Reset settings if mismatched settings version.
	// This is to account for incompatible changes in the settings schema.
	if (
		!App.settings.settings_versioned ||
		App.settings.settings_version !== App.settings.getEntry('settings_version')!.value
	) {
		App.settings.reset();
		App.settings.save();
	}

	App.settings.settings_versioned = true;
	App.settings.save();
}

// ---------------------------------------------------------------------------------------------------------------------
export default App;
export {App};
