//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import {Uint8} from '@chipotle/types/Uint8';
import {Uint16} from '@chipotle/types/Uint16';

import Architecture from '@chipotle/vm/Architecture';
import FloatTimer from '@chipotle/vm/FloatTimer';
import ProgramError from '@chipotle/vm/ProgramError';
import ProgramSource from '@chipotle/vm/ProgramSource';
import ProgramStack from '@chipotle/vm/ProgramStack';
import VMContext from '@chipotle/vm/VMContext';
import VMError from '@chipotle/vm/VMError';
import VMInstructionSet from '@chipotle/vm/VMInstructionSet';

import ChipDisplay from './ChipDisplay';

import OP_ADD_REG_CON from './OP_ADD_REG_CON';
import OP_LD_REG_CON from './OP_LD_REG_CON';
import OP_SE_REG_CON from './OP_SE_REG_CON';
import OP_SE_REG_REG from './OP_SE_REG_REG';
import OP_SNE_REG_CON from './OP_SNE_REG_CON';
import OP_SNE_REG_REG from './OP_SNE_REG_REG';
import OP_JP_ADDR from './OP_JP_ADDR';
import OP_SYS_ADDR from './OP_SYS_ADDR';
import OP_ADD_REG_REG from './OP_ADD_REG_REG';
import OP_AND_REG_REG from './OP_AND_REG_REG';
import OP_LD_REG_REG from './OP_LD_REG_REG';
import OP_OR_REG_REG from './OP_OR_REG_REG';
import OP_SHR_REG from './OP_SHR_REG';
import OP_SUB_REG_REG from './OP_SUB_REG_REG';
import OP_XOR_REG_REG from './OP_XOR_REG_REG';
import OP_SUBN_REG_REG from './OP_SUBN_REG_REG';
import OP_SHL_REG from './OP_SHL_REG';
import OP_RND_REG_CON from './OP_RND_REG_CON';
import OP_JP_V0_ADDR from './OP_JP_V0_ADDR';
import OP_LD_I_CON from './OP_LD_I_CON';
import OP_DRW_REG_REG_CON from './OP_DRW_REG_REG_CON';
import OP_ADD_I_REG from './OP_ADD_I_REG';
import OP_CALL_ADDR from './OP_CALL_ADDR';
import OP_LD_DT_REG from './OP_LD_DT_REG';
import OP_LD_MEM_I_REG from './OP_LD_MEM_I_REG';
import OP_LD_REG_DT from './OP_LD_REG_DT';
import OP_LD_REG_K from './OP_LD_REG_K';
import OP_LD_REG_MEM_I from './OP_LD_REG_MEM_I';
import OP_LD_ST_REG from './OP_LD_ST_REG';
import OP_CLS from './OP_CLS';
import OP_LD_B_REG from './OP_LD_B_REG';
import OP_RET from './OP_RET';
import OP_SKP from './OP_SKP';
import OP_SKNP from './OP_SKNP';
import OP_LD_F_REG from './OP_LD_F_REG';

import ChipKeyboard from './ChipKeyboard';

// ---------------------------------------------------------------------------------------------------------------------
// Constants:
// ---------------------------------------------------------------------------------------------------------------------

/**
 * The CHIP-8 instruction set.
 */
const ISA = new VMInstructionSet<Chip>([
	OP_ADD_REG_CON,
	OP_LD_REG_CON,
	OP_SE_REG_CON,
	OP_SE_REG_REG,
	OP_SNE_REG_CON,
	OP_SNE_REG_REG,
	OP_JP_ADDR,
	OP_SYS_ADDR,
	OP_ADD_REG_REG,
	OP_AND_REG_REG,
	OP_LD_REG_REG,
	OP_OR_REG_REG,
	OP_SHR_REG,
	OP_SUB_REG_REG,
	OP_XOR_REG_REG,
	OP_SUBN_REG_REG,
	OP_SHL_REG,
	OP_RND_REG_CON,
	OP_JP_V0_ADDR,
	OP_LD_I_CON,
	OP_DRW_REG_REG_CON,
	OP_ADD_I_REG,
	OP_CALL_ADDR,
	OP_LD_DT_REG,
	OP_LD_MEM_I_REG,
	OP_LD_REG_DT,
	OP_LD_REG_K,
	OP_LD_REG_MEM_I,
	OP_LD_ST_REG,
	OP_CLS,
	OP_LD_B_REG,
	OP_RET,
	OP_SKP,
	OP_SKNP,
	OP_LD_F_REG
]);

/**
 * The CHIP-8 built-in font.
 */
const FONT = [
	[/* 0 */ 0xf0, 0x90, 0x90, 0x90, 0xf0],
	[/* 1 */ 0x20, 0x60, 0x20, 0x20, 0x70],
	[/* 2 */ 0xf0, 0x10, 0xf0, 0x80, 0xf0],
	[/* 3 */ 0xf0, 0x10, 0xf0, 0x10, 0xf0],
	[/* 4 */ 0x90, 0x90, 0xf0, 0x10, 0x10],
	[/* 5 */ 0xf0, 0x80, 0xf0, 0x10, 0xf0],
	[/* 6 */ 0xf0, 0x80, 0xf0, 0x90, 0xf0],
	[/* 7 */ 0xf0, 0x10, 0x20, 0x40, 0x40],
	[/* 8 */ 0xf0, 0x90, 0xf0, 0x90, 0xf0],
	[/* 9 */ 0xf0, 0x90, 0xf0, 0x10, 0xf0],
	[/* A */ 0xf0, 0x90, 0xf0, 0x90, 0x90],
	[/* B */ 0xe0, 0x90, 0xe0, 0x90, 0xe0],
	[/* C */ 0xf0, 0x80, 0x80, 0x80, 0xf0],
	[/* D */ 0xe0, 0x90, 0x90, 0x90, 0xe0],
	[/* E */ 0xf0, 0x80, 0xf0, 0x80, 0xf0],
	[/* F */ 0xf0, 0x80, 0xf0, 0x80, 0x80]
];

// ---------------------------------------------------------------------------------------------------------------------

/**
 * Chip-8 Architecture.
 *
 * 16 Data Registers: register_data[0x0 to 0xF]
 * 1  Addr Register:  register_addr
 * 4k Memory:         memory
 * 64x32 Display:     display
 */
class Chip extends Architecture<Chip> {
	// -------------------------------------------------------------------------------------------------------------
	// | Constants:                                                                                                |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 *  The maximum size of the Chip-8's memory.
	 */
	public static readonly MAX_MEMORY = 4096;
	public readonly MAX_MEMORY: number = (<any>this.constructor).MAX_MEMORY;

	/**
	 * The maximum number of entries in the stack.
	 */
	public static readonly MAX_STACK = 16;
	public readonly MAX_STACK: number = (<any>this.constructor).MAX_STACK;

	/**
	 * The maximum number of data registers.
	 * V0 to VF.
	 */
	public static readonly MAX_DATA_REGISTERS = 16;
	public readonly MAX_DATA_REGISTERS: number = (<any>this.constructor).MAX_DATA_REGISTERS;

	/**
	 * The program entry point.
	 */
	public static readonly PROGRAM_ENTRY = 0x200;
	public readonly PROGRAM_ENTRY: number = (<any>this.constructor).PROGRAM_ENTRY;

	/**
	 * The program load offset.
	 * This is where byte 0x0000 of the program will load into.
	 */
	public static readonly PROGRAM_LOAD_OFFSET = 0x200;
	public readonly PROGRAM_LOAD_OFFSET: number = (<any>this.constructor).PROGRAM_LOAD_OFFSET;

	/**
	 * The CPU clock speed.
	 * For the Chip-8, this is 500 Hz.
	 */
	public static readonly CLOCK_SPEED = 500;
	public readonly CLOCK_SPEED: number = (<any>this.constructor).CLOCK_SPEED;

	/**
	 * The timer clock speed.
	 * For the Chip-8, this is 60 Hz.
	 */
	public static readonly TIMER_SPEED = 60;
	public readonly TIMER_SPEED: number = (<any>this.constructor).TIMER_SPEED;

	public static readonly ROM: Uint8Array = (() => {
		let rom = new Uint8Array(0x200);

		rom.set([]);

		return rom;
	})();

	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * The data registers.
	 * V0 to VF.
	 */
	public register_data: Uint8Array;

	/**
	 * The index register, also known as "I".
	 */
	public register_index: Uint16;

	/**
	 * The keyboard.
	 */
	public keyboard: ChipKeyboard;

	/**
	 * The call stack.
	 */
	public stack: ProgramStack;

	/**
	 * The display.
	 */
	public display: ChipDisplay;

	/**
	 * The timer register's timer.
	 * Decrements at 60 Hz.
	 */
	protected _timer_timer: FloatTimer;

	/**
	 * The sound register's timer.
	 * Decrements at 60 Hz.
	 */
	protected _timer_sound: FloatTimer;

	// -------------------------------------------------------------------------------------------------------------
	// | Accessors:                                                                                                |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * The flag register.
	 * This is an alias for the VF register.
	 */
	public get register_flag(this: VMContext<Chip>): Uint8 {
		return this.register_data[0xf];
	}

	public set register_flag(this: VMContext<Chip>, value: Uint8) {
		this.register_data[0xf] = value;
	}

	/**
	 * The timer register.
	 * Decrements at 60 Hz.
	 */
	public get register_timer(): Uint8 {
		return Math.max(0, Math.ceil(this._timer_timer.value));
	}

	public set register_timer(value: Uint8) {
		this._timer_timer.reset();
		this._timer_timer.value = value;
	}

	/**
	 * The sound register.
	 * Decrements at 60 Hz.
	 */
	public get register_sound(): Uint8 {
		return Math.max(0, Math.ceil(this._timer_sound.value));
	}

	public set register_sound(this: VMContext<Chip>, value: Uint8) {
		this._timer_sound.reset();
		this._timer_sound.value = value;
		this.emit('sound', value);
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Constructor:                                                                                              |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a new instance of the Chip-8 architecture.
	 * A unique instance should be passed to the {@link VM} constructor.
	 */
	public constructor() {
		super(ISA);

		this.register_data = new Uint8Array(this.MAX_DATA_REGISTERS);
		this.register_index = 0;
		this._timer_sound = new FloatTimer(this.CLOCK_SPEED, this.TIMER_SPEED);
		this._timer_timer = new FloatTimer(this.CLOCK_SPEED, this.TIMER_SPEED);
		this.display = new ChipDisplay();
		this.keyboard = new ChipKeyboard();
		this.stack = new ProgramStack(this.MAX_STACK);
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Gets the timer instances.
	 * This should only be used to adjust timers.
	 */
	public getTimerInstances(): FloatTimer[] {
		return [this._timer_sound, this._timer_timer];
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Implement:                                                                                                |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * @override
	 */
	protected async _load(source: ProgramSource): Promise<Uint8Array | false> {
		if (!(source instanceof Uint8Array)) {
			return false;
		}

		// Check if the ROM is too large.
		if (source.length > this.MAX_MEMORY - this.PROGRAM_LOAD_OFFSET) {
			throw new ProgramError(ProgramError.ROM_TOO_LARGE);
		}

		// Create an array to use as the program.
		let buffer = new Uint8Array(this.MAX_MEMORY);
		buffer.fill(0, 0, this.MAX_MEMORY);

		// Copy the ROM.
		buffer.set(source, this.PROGRAM_LOAD_OFFSET);

		// Copy the font.
		for (let i = 0; i <= 0x0f; i++) {
			buffer.set(FONT[i], 5 * i);
		}

		// Return.
		return buffer;
	}

	/**
	 * @override
	 */
	protected _reset(this: VMContext<Chip>): void {
		this.register_data.fill(0, 0, this.MAX_DATA_REGISTERS);
		this.register_sound = 0;
		this.register_timer = 0;
		this.register_index = 0;
		this.keyboard.reset();
		this.stack.clear();
		this.display.clear();
		this.display.transfer();
		this.jump(this.PROGRAM_ENTRY);
	}

	/**
	 * @override
	 */
	protected _tick(this: VMContext<Chip>): void {
		if (this._timer_sound.value > 0) this._timer_sound.descend();
		if (this._timer_timer.value > 0) this._timer_timer.descend();
	}

	/**
	 * @override
	 */
	protected _debugOption(this: VMContext<Chip>, option: string, value: any): void {
		switch (option) {
			case 'DISABLE_DT': {
				Object.defineProperty(this._timer_timer, 'value', {
					enumerable: true,
					configurable: true,
					...(value === true
						? {
								get: () => 0,
								set: () => {}
						  }
						: {
								writable: true,
								value: 0
						  })
				});

				break;
			}

			default:
				throw new VMError(`Unknown debug option: ${option}`);
		}
	}
}

// ---------------------------------------------------------------------------------------------------------------------

export default Chip;
export {Chip};
export {ISA};
export {FONT};
