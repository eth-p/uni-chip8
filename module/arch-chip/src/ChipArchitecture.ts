//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import {default as Uint8} from '@chipotle/types/Uint8';

import Architecture from '@chipotle/vm/Architecture';
import {default as ISA} from '@chipotle/vm/ISA';
import OpAddress from '@chipotle/vm/OpAddress';
import ProgramSource from '@chipotle/vm/ProgramSource';
import ProgramStack from '@chipotle/vm/ProgramStack';
import VMContext from '@chipotle/vm/VMContext';
import VMError from '@chipotle/vm/VMError';

import ChipDisplay from './ChipDisplay';

import OP_ADD_REG_CON from './OP_ADD_REG_CON';
import OP_LD_REG_CON from './OP_LD_REG_CON';
import OP_SE_REG_CON from './OP_SE_REG_CON';
import OP_SE_REG_REG from './OP_SE_REG_REG';
import OP_SNE_REG_CON from './OP_SNE_REG_CON';
import OP_SNE_REG_REG from './OP_SNE_REG_REG';
import OP_JP_ADDR from './OP_JP_ADDR';
import OP_SYS_ADDR from './OP_SYS_ADDR';

// ---------------------------------------------------------------------------------------------------------------------
// ISA:
// ---------------------------------------------------------------------------------------------------------------------
export const INSTRUCTION_SET: ISA<ChipArchitecture> = [
	OP_ADD_REG_CON,
	OP_LD_REG_CON,
	OP_SE_REG_CON,
	OP_SE_REG_REG,
	OP_SNE_REG_CON,
	OP_SNE_REG_REG,
	OP_JP_ADDR,
	OP_SYS_ADDR
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
export default class ChipArchitecture extends Architecture<ChipArchitecture> {
	// -------------------------------------------------------------------------------------------------------------
	// | Constants:                                                                                                |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 *  The maximum size of the Chip-8's memory.
	 */
	public readonly MAX_MEMORY = 4096;

	/**
	 * The maximum number of entries in the stack.
	 */
	public readonly MAX_STACK = 16;

	/**
	 * The maximum number of data registers.
	 * V0 to VF.
	 */
	public readonly REGISTER_MAX = 16;

	/**
	 * The program entry point.
	 */
	public readonly PROGRAM_ENTRY = 0x200;

	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * The data registers.
	 * V0 to VF.
	 */
	public register_data: Uint8Array;

	/**
	 * The timer register.
	 * Decrements at 60 Hz.
	 */
	public register_timer: Uint8;

	/**
	 * The sound register.
	 * Decrements at 60 Hz.
	 */
	public register_sound: Uint8;

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

	// -------------------------------------------------------------------------------------------------------------
	// | Accessors:                                                                                                |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * The flag register.
	 * This is an alias for the VF register.
	 */
	public get register_flag(this: VMContext<ChipArchitecture>): Uint8 {
		return this.register_data[0xf];
	}

	public set register_flag(this: VMContext<ChipArchitecture>, value: Uint8) {
		this.register_data[0xf] = value;
	}

	/**
	 * The address register.
	 * This stores a pointer to the currently-executing instruction.
	 */
	public get register_addr(this: VMContext<ChipArchitecture>): OpAddress {
		return this.program_counter;
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

		this.register_data = new Uint8Array(this.REGISTER_MAX);
		this.register_sound = 0;
		this.register_timer = 0;
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
			if (source.length > this.MAX_MEMORY) {
				throw new VMError('PROGRAM TOO LARGE');
			}

			this.memory.fill(0, 0, this.MAX_MEMORY);
			this.memory.set(source, 0);
			return source;
		}

		return false;
	}
}
