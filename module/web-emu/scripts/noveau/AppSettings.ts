//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import {Settings, Setting} from '@chipotle/wfw/Settings';
import Savestate from '../Savestate';

// ---------------------------------------------------------------------------------------------------------------------

class AppSettings extends Settings<keyof AppSettings> {
	@Setting(500, {validator: speed => speed >= 1 && speed <= 10000})
	public cpu_speed!: number;

	@Setting(true)
	public show_keypad!: boolean;

	@Setting(false)
	public show_registers!: boolean;

	@Setting(false)
	public show_disassembler!: boolean;

	@Setting(false)
	public show_stack!: boolean;

	@Setting(false)
	public enable_debugger!: boolean;

	@Setting(true)
	public display_frameless!: boolean;

	@Setting(true)
	public display_scaling!: boolean;

	@Setting(true)
	public enable_feedback_sound!: boolean;

	@Setting(false)
	public enable_feedback_vibrate!: boolean;

	@Setting(440)
	public sound_frequency!: number;

	@Setting(15, {validator: volume => volume >= 0 && volume <= 100})
	public sound_volume!: number;

	@Setting('#ffffff', {validator: color => /^#[0-9A-F]{6}$/i.test(color)})
	public screen_foreground!: string;

	@Setting('#000000', {validator: color => /^#[0-9A-F]{6}$/i.test(color)})
	public screen_background!: string;

	@Setting('X')
	public keybind_key_0!: string;

	@Setting('1')
	public keybind_key_1!: string;

	@Setting('2')
	public keybind_key_2!: string;

	@Setting('3')
	public keybind_key_3!: string;

	@Setting('Q')
	public keybind_key_4!: string;

	@Setting('W')
	public keybind_key_5!: string;

	@Setting('E')
	public keybind_key_6!: string;

	@Setting('A')
	public keybind_key_7!: string;

	@Setting('S')
	public keybind_key_8!: string;

	@Setting('D')
	public keybind_key_9!: string;

	@Setting('Z')
	public keybind_key_A!: string;

	@Setting('C')
	public keybind_key_B!: string;

	@Setting('4')
	public keybind_key_C!: string;

	@Setting('R')
	public keybind_key_D!: string;

	@Setting('F')
	public keybind_key_E!: string;

	@Setting('V')
	public keybind_key_F!: string;

	@Setting(' ')
	public keybind_control_turbo!: string;

	@Setting('P')
	public keybind_control_pause!: string;

	@Setting('=')
	public keybind_control_quicksave!: string;

	@Setting('-')
	public keybind_control_quickload!: string;

	@Setting(',')
	public keybind_control_step_prev!: string;

	@Setting('.')
	public keybind_control_step_next!: string;

	@Setting({unset: true})
	public savestate_quickslot!: Savestate | {unset: boolean};

	@Setting({unset: true})
	public savestate_1!: Savestate | {unset: boolean};

	@Setting({unset: true})
	public savestate_2!: Savestate | {unset: boolean};

	@Setting({unset: true})
	public savestate_3!: Savestate | {unset: boolean};

	@Setting({unset: true})
	public savestate_4!: Savestate | {unset: boolean};

	@Setting({unset: true})
	public savestate_5!: Savestate | {unset: boolean};

	@Setting({unset: true})
	public savestate_6!: Savestate | {unset: boolean};

	@Setting({unset: true})
	public savestate_7!: Savestate | {unset: boolean};

	@Setting({unset: true})
	public savestate_8!: Savestate | {unset: boolean};

	@Setting({unset: true})
	public savestate_9!: Savestate | {unset: boolean};
}

namespace AppSettings {
	export type Keys = keyof AppSettings;
}

// ---------------------------------------------------------------------------------------------------------------------
export default AppSettings;
export {AppSettings};
