//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import {Settings, Setting} from '@chipotle/web/Settings';
import vm from './Emulator';

// ---------------------------------------------------------------------------------------------------------------------
class EmulatorSettings extends Settings {
	@Setting(500, {validator: speed => speed >= 1 && speed <= 1500})
	public cpu_speed?: number;

	@Setting(true)
	public show_keypad?: boolean;

	@Setting(false)
	public show_registers?: boolean;

	@Setting(false)
	public show_disassembler?: boolean;

	@Setting(false)
	public show_stack?: boolean;

	@Setting(false)
	public enable_debugger?: boolean;

	@Setting(true)
	public display_frameless?: boolean;

	@Setting(true)
	public display_scaling?: boolean;

	@Setting('#ffffff', {validator: color => /^#[0-9A-F]{6}$/i.test(color)})
	public screen_foreground?: string;

	@Setting('#000000', {validator: color => /^#[0-9A-F]{6}$/i.test(color)})
	public screen_background?: string;

	@Setting('X')
	public keybind_key_0?: string;

	@Setting('1')
	public keybind_key_1?: string;

	@Setting('2')
	public keybind_key_2?: string;

	@Setting('3')
	public keybind_key_3?: string;

	@Setting('Q')
	public keybind_key_4?: string;

	@Setting('W')
	public keybind_key_5?: string;

	@Setting('E')
	public keybind_key_6?: string;

	@Setting('A')
	public keybind_key_7?: string;

	@Setting('S')
	public keybind_key_8?: string;

	@Setting('D')
	public keybind_key_9?: string;

	@Setting('Z')
	public keybind_key_A?: string;

	@Setting('C')
	public keybind_key_B?: string;

	@Setting('4')
	public keybind_key_C?: string;

	@Setting('R')
	public keybind_key_D?: string;

	@Setting('F')
	public keybind_key_E?: string;

	@Setting('V')
	public keybind_key_F?: string;

	@Setting(' ')
	public keybind_control_turbo?: string;

	@Setting('P')
	public keybind_control_pause?: string;

	@Setting(',')
	public keybind_control_step_prev?: string;

	@Setting('.')
	public keybind_control_step_next?: string;
}

// ---------------------------------------------------------------------------------------------------------------------
// Exports:
const settings = new EmulatorSettings('emulator');
export default settings;
export {settings};
((<any>window).Chipotle || ((<any>window).Chipotle = {})).settings = vm;
