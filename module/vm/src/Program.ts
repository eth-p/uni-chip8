//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import assert from '@chipotle/types/assert';
import Decoder from '@chipotle/types/Decoder';
import Encoder from '@chipotle/types/Encoder';

import {Instruction, bitshiftl, or} from '@chipotle/isa/Instruction';

import ProgramAddress from './ProgramAddress';
import ProgramSource from './ProgramSource';
import VMError from './VMError';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * An executable program that can run in the virtual machine.
 */
export default class Program<A> {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * The program data.
	 */
	public data: Uint8Array | null;

	/**
	 * The program loader function.
	 */
	protected loader: (source: ProgramSource) => Promise<Uint8Array | false>;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructor:                                                                                              |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a new executable program.
	 *
	 * @param loader A function.
	 */
	public constructor(loader: (source: ProgramSource) => Promise<Uint8Array | false>) {
		this.data = null;
		this.loader = loader;
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Loads a program.
	 * @param source The source of the program.
	 */
	public async load(source: ProgramSource) {
		let data = await this.loader(source);
		if (data === false) {
			throw new VMError(`NO PROGRAM LOADER FOR TYPE: ${(<any>source).constructor.name}`);
		}

		this.data = data;
	}

	/**
	 * Fetches an instruction at an address.
	 *
	 * @param address The address to fetch from.
	 * @returns The fetched instruction.
	 */
	public fetch(address: ProgramAddress): Instruction {
		assert(this.data != null, 'Program is not loaded');
		assert(address < this.data!.length - 1, "Parameter 'address' is out of bounds for program (over)");
		assert(address >= 0, "Parameter 'address' is out of bounds for program (over)");
		return or(bitshiftl(this.data![address], 8), this.data![address + 1]);
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods: Snapshot                                                                                         |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a snapshot of the program.
	 * @returns The program snapshot.
	 */
	public snapshot(): string {
		return Encoder.base64(Encoder.string(this.data!));
	}

	/**
	 * Restores a snapshot of the program.
	 * @param snapshot The program snapshot.
	 */
	public restore(snapshot: string): void {
		const buffer = new Uint8Array(Decoder.string(Decoder.base64(snapshot)));

		if (this.data == null) {
			this.data = buffer;
		} else {
			this.data.set(new Uint8Array(buffer));
		}
	}
}
