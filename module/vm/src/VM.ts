// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Team Chipotle
// MIT License
// ---------------------------------------------------------------------------------------------------------------------
import VMRegisters from './VMRegisters';
import { Uint16, Uint8 } from './VMTypes';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * A software representation of CHIP-8 hardware.
 */
export default class VM {
	// -------------------------------------------------------------------------------------------------------------
	// | Constants:                                                                                                |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * The maximum amount of memory available to the CHIP-8.
	 */
	public static readonly MEMORY_MAX = 0x1000;
	public static readonly TIMER_DECREMENT_MS = 16;
	public static readonly INSTRUCTION_SET_COUNT = 35;

	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Virtual machine memory.
	 * Stores 0x1000 (4096) bytes.
	 */
	private _memory: Uint8Array;

	/**
	 * Virtual machine registers.
	 */
	private _register: VMRegisters;

	private _program_counter: Uint16;
	
	private _I: Uint16;

	private _stack_pointer: Uint8;

	private _delay_timer: Uint8;
	
	private _sound_timer: Uint8;

	private _last_decrement_time: number;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructor:                                                                                              |
	// -------------------------------------------------------------------------------------------------------------

	public constructor() {
		this._memory = new Uint8Array(VM.MEMORY_MAX);
		this._register = new VMRegisters();
		this._program_counter = 0x200;
		this._I = 0;
		this._stack_pointer = 0;
		this._delay_timer = 0;
		this._sound_timer = 0;
		this._last_decrement_time = 0;
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Opcode fetcher:                                                                                           |
	// -------------------------------------------------------------------------------------------------------------

	private fetchOpcode(location: Uint16): Uint16 {
		return (this._memory[location] << 8) | this._memory[location + 1];
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Opcode loader:                                                                                            |
	// -------------------------------------------------------------------------------------------------------------

	private loadOpcode(location: Uint16, opcode: Uint16): void {
		this._memory[location] = (opcode & 0xFF00) >> 8;
		this._memory[location + 1] = (opcode & 0x00FF);
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Forward execution:                                                                                        |
	// -------------------------------------------------------------------------------------------------------------
	public cycleAhead(): void {

		let opcode: Uint16 = this.fetchOpcode(this._program_counter);
		this._program_counter += 2;

		let current_time = Date.now();
		let time_difference = current_time - this._last_decrement_time;

		if (this._sound_timer > 0) {
			// Play single tone sound
		}

		if (time_difference >= VM.TIMER_DECREMENT_MS) {
			this._last_decrement_time = time_difference;

			if (this._delay_timer > 0) {
				--this._delay_timer;
			}
			if (this._sound_timer > 0) {
				--this._sound_timer;
			}
		}

	}
}
