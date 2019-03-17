//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import {Settings, Setting} from '@chipotle/wfw/Settings';

import Savestate from './Savestate';

// ---------------------------------------------------------------------------------------------------------------------

class AppSettings extends Settings<keyof AppSettings> {
	@Setting(null)
	public settings_version!: number | null;

	// -------------------------------------------------------------------------------------------------------------
	// | General Settings:                                                                                         |
	// -------------------------------------------------------------------------------------------------------------

	@Setting(500, {validator: speed => speed >= 1 && speed <= 10000})
	public cpu_speed!: number;

	@Setting(false)
	public enable_advanced_settings!: boolean;

	// -------------------------------------------------------------------------------------------------------------
	// | Sound Settings:                                                                                           |
	// -------------------------------------------------------------------------------------------------------------

	@Setting(true)
	public enable_feedback_sound!: boolean;

	@Setting(false)
	public enable_feedback_vibrate!: boolean;

	@Setting(440, {validator: hz => hz >= 200 && hz <= 1000})
	public sound_frequency!: number;

	@Setting(15, {validator: volume => volume >= 0 && volume <= 100})
	public sound_volume!: number;

	// -------------------------------------------------------------------------------------------------------------
	// | Controls Settings:                                                                                        |
	// -------------------------------------------------------------------------------------------------------------

	@Setting(true)
	public show_keypad!: boolean;

	// -------------------------------------------------------------------------------------------------------------
	// | Debugger Settings:                                                                                        |
	// -------------------------------------------------------------------------------------------------------------

	@Setting(false)
	public show_registers!: boolean;

	@Setting(false)
	public show_disassembler!: boolean;

	@Setting(4, {validator: num => num >= 0 && num < 16})
	public disassemble_prev_count!: number;

	@Setting(8, {validator: num => num >= 0 && num < 16})
	public disassemble_next_count!: number;

	@Setting(false)
	public show_stack!: boolean;

	@Setting(false)
	public enable_debugger!: boolean;

	@Setting(false)
	public debug_disable_timer!: boolean;

	// -------------------------------------------------------------------------------------------------------------
	// | Graphics Settings:                                                                                        |
	// -------------------------------------------------------------------------------------------------------------

	@Setting(true)
	public display_frameless!: boolean;

	@Setting(true)
	public display_scaling!: boolean;

	@Setting('#ffffff', {validator: color => /^#[0-9A-F]{6}$/i.test(color)})
	public screen_foreground!: string;

	@Setting('#000000', {validator: color => /^#[0-9A-F]{6}$/i.test(color)})
	public screen_background!: string;

	// -------------------------------------------------------------------------------------------------------------
	// | Keybinds Settings:                                                                                        |
	// -------------------------------------------------------------------------------------------------------------

	@Setting('x')
	public keybind_key_0!: string;

	@Setting('1')
	public keybind_key_1!: string;

	@Setting('2')
	public keybind_key_2!: string;

	@Setting('3')
	public keybind_key_3!: string;

	@Setting('q')
	public keybind_key_4!: string;

	@Setting('w')
	public keybind_key_5!: string;

	@Setting('e')
	public keybind_key_6!: string;

	@Setting('a')
	public keybind_key_7!: string;

	@Setting('s')
	public keybind_key_8!: string;

	@Setting('d')
	public keybind_key_9!: string;

	@Setting('z')
	public keybind_key_A!: string;

	@Setting('c')
	public keybind_key_B!: string;

	@Setting('4')
	public keybind_key_C!: string;

	@Setting('r')
	public keybind_key_D!: string;

	@Setting('f')
	public keybind_key_E!: string;

	@Setting('v')
	public keybind_key_F!: string;

	@Setting(' ')
	public keybind_control_turbo!: string;

	@Setting('p')
	public keybind_control_pause!: string;

	@Setting('=')
	public keybind_control_quicksave!: string;

	@Setting('-')
	public keybind_control_quickload!: string;

	@Setting(',')
	public keybind_control_step_prev!: string;

	@Setting('.')
	public keybind_control_step_next!: string;

	// -------------------------------------------------------------------------------------------------------------
	// | Savestates:                                                                                               |
	// -------------------------------------------------------------------------------------------------------------

	@Setting(null)
	public savestate_quickslot!: Savestate | null;

	@Setting(null)
	public savestate_1!: Savestate | null;

	@Setting(null)
	public savestate_2!: Savestate | null;

	@Setting(null)
	public savestate_3!: Savestate | null;

	@Setting(null)
	public savestate_4!: Savestate | null;

	@Setting(null)
	public savestate_5!: Savestate | null;

	@Setting(null)
	public savestate_6!: Savestate | null;

	@Setting(null)
	public savestate_7!: Savestate | null;

	@Setting(null)
	public savestate_8!: Savestate | null;

	@Setting(null)
	public savestate_9!: Savestate | null;
}

namespace AppSettings {
	export type Keys = keyof AppSettings;
	export const VERSION = 2;
}

// ---------------------------------------------------------------------------------------------------------------------
export default AppSettings;
export {AppSettings};
