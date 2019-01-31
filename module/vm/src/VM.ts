//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Emitter from '@chipotle/types/Emitter';

import Instruction from '@chipotle/isa/Instruction';
import InstructionCache from '@chipotle/isa/InstructionCache';

import Architecture from './Architecture';
import IR from './IR';
import Program from './Program';
import {ProgramAddress, isValid} from './ProgramAddress';
import ProgramError from './ProgramError';
import VMContext from './VMContext';
import VMInstructionSet from './VMInstructionSet';

import assert from '@chipotle/types/assert';
import VMError from '@chipotle/vm/VMError';
import Optional from '@chipotle/types/Optional';
import OpCompiled from '@chipotle/vm/OpCompiled';

// ---------------------------------------------------------------------------------------------------------------------

/**
 * The base class of a VM.
 */
export class VMBase<A> extends Emitter {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * The executable program.
	 */
	public program: Program<A>;

	/**
	 * The program counter.
	 * This should not be directly manipulated.
	 *
	 * @internal
	 */
	public program_counter: ProgramAddress;

	/**
	 * The clock speed of the virtual machine CPU.
	 */
	public speed: number;

	/**
	 * An ascending counter for the number of cycles executed.
	 */
	public tick: number;

	/**
	 * The instruction lookup table.
	 */
	protected isa: VMInstructionSet<A>;

	/**
	 * The instruction cache.
	 */
	public opcache: InstructionCache<IR<A>>;

	/**
	 * The VM's architecture.
	 * @internal
	 */
	protected readonly _VM_arch: Architecture<A>;

	/**
	 * A boolean which tells whether or not the virtual machine is currently executing an instruction.
	 * @internal
	 */
	protected _VM_executing: boolean;

	/**
	 * The program is waiting on a hardware event.
	 * @internal
	 */
	public _VM_awaiting: boolean;

	/**
	 * A boolean which specifies whether or not JIT compiling is allowed.
	 * @internal
	 */
	public _VM_jit: boolean;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructor:                                                                                              |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a new virtual machine.
	 * @param arch The architecture of the emulated machine.
	 */
	public constructor(arch: A) {
		super();

		this._VM_arch = <Architecture<A>>(<unknown>arch);
		this._VM_executing = false;
		this._VM_awaiting = false;
		this._VM_jit = false;
		this.emit = Emitter.prototype.emit;
		this.isa = (<Architecture<A>>(<unknown>arch)).isa;
		this.program = new Program((<any>arch)._load.bind(this));
		this.program_counter = 0;
		this.tick = 0;
		this.speed = 1;
		this.opcache = new InstructionCache<IR<A>>();

		// Copy descriptors from the architecture.
		let inherit = {
			...Object.getOwnPropertyDescriptors(arch),
			...Object.getOwnPropertyDescriptors(Object.getPrototypeOf(arch))
		};

		for (let [prop, descriptor] of Object.entries(inherit)) {
			if (prop.startsWith('_') || prop.toUpperCase() === prop) descriptor.enumerable = false;
		}

		Object.defineProperties(this, inherit);
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Accessors:                                                                                                |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Sets whether or not JIT compiling is enabled.
	 * This will clear the opcache.
	 *
	 * @param enabled True if JIT compiling is enabled.
	 */
	public setJIT(enabled: boolean): void {
		if (this._VM_jit !== enabled) this.opcache.invalidateAll();
		this._VM_jit = enabled;
	}

	/**
	 * Gets whether or not JIT compiling is enabled.
	 * @returns True if JIT compiling is enabled.
	 */
	public getJIT(): boolean {
		return this._VM_jit;
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Decodes an instruction into an IR.
	 * This will attempt to use a cached value if one exists.
	 *
	 * @param instruction The instruction to decode.
	 * @returns The intermediate representation of the instruction, or undefined if not valid.
	 */
	public decode(instruction: Instruction): Optional<IR<A>> {
		let ir: IR<A> | null = this.opcache.get(instruction);
		if (ir !== null) return ir;

		// Instruction wasn't located in the cache.
		// The IR will need to be created now.
		let operation = this.isa.lookup(instruction);
		if (operation === null) return undefined;

		// Decode the operands and create an IR.
		ir = {
			operation: operation,
			operands: operation.decode(instruction),
			execute: operation.execute
		};

		// If enabled, create a JIT function.
		if (this._VM_jit && 'compile' in operation) {
			ir.execute = (<OpCompiled<A>>(<unknown>operation)).compile(ir.operands);
		}

		// Cache the IR and return it.
		this.opcache.put(instruction, ir);
		return ir;
	}

	/**
	 * Jumps to an address in the program.
	 * @param address The address to jump to.
	 */
	public jump(address: ProgramAddress): void {
		assert(address >= 0, "Parameter 'address' is out of bounds for program (under)");
		assert(address < this.program.data!.length, "Parameter 'address' is out of bounds for program (over)");
		assert(isValid(address), "Parameter 'address' is out of range for OpAddress");

		// NOTE: If the VM is executing, we need to account for the fact that the PC will be
		//       incremented after the instruction has finished executing.

		this.program_counter = this._VM_executing ? address - 2 : address;
	}

	/**
	 * Jumps forwards by a specified number of opcodes.
	 * Unlike {@link #jump jump}, this is a 2-byte relative jump.
	 *
	 * **NOTE**: A value of 1 is the equivalent to letting the PC increment naturally.
	 *
	 * @param instructions The number of instructions to jump.
	 */
	public hopForwards(instructions: ProgramAddress): void {
		assert(isValid(instructions), "Parameter 'instructions' is out of range for OpAddress");
		this.jump(this.program_counter + instructions * 2);
	}

	/**
	 * Jumps backwards by a specified number of opcodes.
	 * Unlike {@link #jump jump}, this is a 2-byte relative jump.
	 *
	 * @param instructions The number of instructions to jump.
	 */
	public hopBackwards(instructions: ProgramAddress): void {
		assert(isValid(instructions), "Parameter 'instructions' is out of range for OpAddress");
		this.jump(this.program_counter - instructions * 2);
	}

	/**
	 * Tells the virtual machine to pause until an event is received.
	 * @param expect The desired event.
	 * @param callback The function to execute when the event is called.
	 */
	public await(expect: string, callback: (event: string, ...args: any[]) => void): void {
		if (this._VM_awaiting) throw new VMError('Called await() when already awaiting event');

		this._VM_awaiting = true;
		this.emit = (...args) => {
			if (expect === args[0]) {
				this._VM_awaiting = false;
				this.emit = Emitter.prototype.emit;
				callback(...args);
			}

			Emitter.prototype.emit.apply(this, args);
		};
	}

	/**
	 * Resets the virtual machine.
	 * This will reset the virtualized hardware, but not reload the program.
	 */
	public reset(): void {
		this.program_counter = 0;
		this.tick = 0;
		this._VM_executing = false;
		this._VM_awaiting = false;
		this.emit = Emitter.prototype.emit;
		(<any>this)._reset();
	}

	/**
	 * Executes an instruction and decrements timers.
	 */
	public step(): void {
		assert(!this._VM_executing, 'The VM is already executing an instruction');
		assert(this.program !== null, 'There is no program loaded');

		this._VM_executing = true;

		// Increment the timers.
		(<any>this)._tick();

		// Return if waiting on a hardware event.
		if (this._VM_awaiting === true) {
			this._VM_executing = false;
			return;
		}

		// Fetch and decode the opcode.
		let instruction = this.program.fetch(this.program_counter);
		let ir: Optional<IR<A>> = this.decode(instruction);
		if (ir === undefined) throw new ProgramError(ProgramError.UNKNOWN_OPCODE);

		// Execute the opcode.
		ir.execute(<VMContext<A>>(<unknown>this), ir.operands);

		// Increment the program counter.
		this.program_counter += 2;
		if (this.program_counter >= this.program.data!.length) {
			throw new ProgramError(ProgramError.PROGRAM_OVERRUN);
		}

		// Return.
		this.tick++;
		this._VM_executing = false;
	}
}

// ---------------------------------------------------------------------------------------------------------------------
// Developer Notes:
// @eth-p: Everything past here is essentially really fancy type overloading.
//         In TypeScript, you can't directly change the return type of a constructor and generic mixins aren't allowed.
//         To solve this, we use declaration merging and define an overloaded constructor.
// ---------------------------------------------------------------------------------------------------------------------

/**
 * A representation of the {@link VMBase VM} class's static members.
 * If you need to add a static method to VM, you need to define it here as well.
 */
interface VMClass {
	new <A>(arch: A): VMContext<A>;
}

const VM: VMClass = <any>VMBase;

interface VM<A> extends VMBase<A> {}

export default VM;
