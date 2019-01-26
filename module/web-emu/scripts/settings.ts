//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import {Settings, Setting} from '@chipotle/web/Settings';
// ---------------------------------------------------------------------------------------------------------------------
class EmulatorSettings extends Settings {
	@Setting(500)
	public cpu_speed?: number;

	@Setting(true)
	public show_keypad?: boolean;

	@Setting(false)
	public show_registers?: boolean;

	@Setting(false)
	public show_disassembler?: boolean;

	@Setting(false)
	public enable_debugger?: boolean;

	@Setting('#ffffff')
	public screen_foreground?: string;

	@Setting('#000000')
	public screen_background?: string;
}
// ---------------------------------------------------------------------------------------------------------------------
const settings = new EmulatorSettings('emulator');
export default settings;
