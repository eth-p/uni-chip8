//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import {default as Uint8} from '@chipotle/types/Uint8';
import {default as Uint16} from '@chipotle/types/Uint16';

import Architecture from '@chipotle/vm/Architecture';
import ProgramSource from '@chipotle/vm/ProgramSource';
import ProgramStack from '@chipotle/vm/ProgramStack';
import TimerDescending from '@chipotle/vm/Timer';
import VMContext from '@chipotle/vm/VMContext';
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
import OP_JP_ADDR_CON from './OP_JP_ADDR_CON';
import OP_LD_I_CON from './OP_LD_I_CON';
import OP_DRW_REG_REG_CON from './OP_DRW_REG_REG_CON';
import ProgramError from '@chipotle/vm/ProgramError';

// ---------------------------------------------------------------------------------------------------------------------
// ISA:
// ---------------------------------------------------------------------------------------------------------------------
export const INSTRUCTION_SET = new VMInstructionSet<Chip>([
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
	OP_JP_ADDR_CON,
	OP_LD_I_CON,
	OP_DRW_REG_REG_CON
]);

// ---------------------------------------------------------------------------------------------------------------------

/**
 * Chip-8 Architecture.
 *
 * 16 Data Registers: register_data[0x0 to 0xF]
 * 1  Addr Register:  register_addr
 * 4k Memory:         memory
 * 64x32 Display:     display
 */
export default class Chip extends Architecture<Chip> {
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
	 * The random access memory.
	 */
	public memory: Uint8Array;

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
	protected _timer_timer: TimerDescending;

	/**
	 * The sound register's timer.
	 * Decrements at 60 Hz.
	 */
	protected _timer_sound: TimerDescending;

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
		return this._timer_timer.value;
	}

	public set register_timer(value: Uint8) {
		this._timer_timer.value = value;
		this._timer_timer.reset();
	}

	/**
	 * The sound register.
	 * Decrements at 60 Hz.
	 */
	public get register_sound(): Uint8 {
		return this._timer_sound.value;
	}

	public set register_sound(value: Uint8) {
		this._timer_sound.value = value;
		this._timer_sound.reset();
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Constructor:                                                                                              |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a new instance of the Chip-8 architecture.
	 * A unique instance should be passed to the {@link VM} constructor.
	 */
	public constructor() {
		super(INSTRUCTION_SET);

		this.register_data = new Uint8Array(this.MAX_DATA_REGISTERS);
		this.register_index = 0;
		this._timer_sound = new TimerDescending(this.CLOCK_SPEED, this.TIMER_SPEED);
		this._timer_timer = new TimerDescending(this.CLOCK_SPEED, this.TIMER_SPEED);
		this.memory = new Uint8Array(this.MAX_MEMORY);
		this.display = new ChipDisplay();
		this.stack = new ProgramStack(this.MAX_STACK);
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Overload:                                                                                                 |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * @override
	 */
	protected async _load(source: ProgramSource): Promise<Uint8Array | false> {
		if (source instanceof Uint8Array) {
			if (source.length > this.MAX_MEMORY - this.PROGRAM_LOAD_OFFSET) {
				throw new ProgramError(ProgramError.ROM_TOO_LARGE);
			}

			this.memory.fill(0, 0, this.MAX_MEMORY);
			this.memory.set(source, this.PROGRAM_LOAD_OFFSET);
			return source;
		}

		return false;
	}

	/**
	 * @override
	 */
	protected _reset(this: VMContext<Chip>): void {
		this.register_data.fill(0, 0, this.MAX_DATA_REGISTERS);
		this.register_sound = 0;
		this.register_timer = 0;
		this.register_index = 0;
		this.stack.clear();
		this.display.clear();
		this.jump(this.PROGRAM_ENTRY);
	}

	/**
	 * @override
	 */
	protected _tick(this: VMContext<Chip>): void {
		if (this._timer_sound.value > 0) this._timer_sound.descend();
		if (this._timer_timer.value > 0) this._timer_timer.descend();
	}
}
