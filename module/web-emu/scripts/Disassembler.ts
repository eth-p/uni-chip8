//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import {toHexString as u16_toHexString} from '@chipotle/types/Uint16';
import Optional from '@chipotle/types/Optional';

import Instruction from '@chipotle/isa/Instruction';
import InstructionSet from '@chipotle/isa/InstructionSet';

import IR from '@chipotle/vm/IR';
import VM from '@chipotle/vm/VM';

import OperandTags from '@chipotle/isa/OperandTags';
import OperandType from '@chipotle/isa/OperandType';

// ---------------------------------------------------------------------------------------------------------------------

/**
 * An extremely simple and naive CHIP-8 disassembler.
 * Leverages the isa module to perform disassembly.
 */
class Disassembler<I = unknown> {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	protected readonly isa: InstructionSet<I>;
	protected readonly asmCache: Map<Instruction, string>;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructors:                                                                                             |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a new disassembler from a virtual machine.
	 * This will inherit the virtual machine opcache and architecture.
	 *
	 * @param vm The virtual machine.
	 */
	public constructor(vm: VM<I>);

	/**
	 * Creates a new disassembler from an instruction set.
	 *
	 * @param isa The instruction set.
	 */
	public constructor(isa: InstructionSet<I>);

	public constructor(arg1: VM<I> | InstructionSet<I>) {
		this.asmCache = new Map();
		this.isa = arg1 instanceof InstructionSet ? arg1 : <InstructionSet<I>>arg1.getArchitecture().isa;

		// If we have a VM, we'll just piggyback off of its decode method.
		if (!(arg1 instanceof InstructionSet)) {
			this.decode = arg1.decode.bind(arg1);
		}
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Decodes an instruction.
	 *
	 * @param instruction The instruction to decode.
	 * @returns The decoded instruction, or undefined if not found.
	 */
	protected decode(instruction: Instruction): Optional<IR.COMMON<I>> {
		let op = this.isa.lookup(instruction);
		if (op === undefined) return undefined;

		return {
			operation: op,
			operands: op.decode(instruction)
		};
	}

	/**
	 * Disassembles an instruction into assembly code.
	 *
	 * @param instruction The instruction code.
	 * @param ir The instruction IR.
	 *
	 * @returns The assembly representation.
	 */
	protected disassembleIR(instruction: Instruction, ir: IR.COMMON<I> | undefined): string {
		if (ir === undefined) {
			return `.data ${u16_toHexString(instruction).toUpperCase()}`;
		}

		let operands = ir.operation.operands;
		let operandValues = ir.operands;
		let asmops = new Array(operands.length);

		for (let i = 0, n = operands.length; i < n; i++) {
			let operand = operands[i];
			let asm: string | null = operand.tags != null ? operand.tags.get(OperandTags.IS_EXACT) : null;

			if (asm == null) {
				switch (operand.type) {
					case OperandType.REGISTER: {
						asm = `V${operandValues[i].toString(16).toUpperCase()}`;
						break;
					}

					case OperandType.CONSTANT: {
						asm = `${operandValues[i]}`;
						break;
					}

					case OperandType.ROM_ADDRESS:
					case OperandType.RAM_ADDRESS: {
						asm = `${u16_toHexString(operandValues[i]).toUpperCase()}h`;
						break;
					}

					default:
						throw new Error('UNIMPLEMENTED OPERAND TYPE DISASSEMBLER');
				}
			}

			asmops[i] = asm;
		}

		return `${ir.operation.mnemonic} ${asmops.join(', ')}`;
	}

	// -------------------------------------------------------------------------------------------------------------
	// | API:                                                                                                      |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Gets the assembly representation of an instruction.
	 * Invalid opcodes are denoted by `.data [ABCD]`.
	 *
	 * @param instruction The instruction code.
	 *
	 * @returns The assembly representation.
	 */
	public disassemble(instruction: Instruction): string {
		let cached = this.asmCache.get(instruction);
		if (cached != null) return cached;

		let ir = this.decode(instruction);
		let asm = this.disassembleIR(instruction, ir);
		this.asmCache.set(instruction, asm);
		return asm;
	}

	/**
	 * Purges the disassembly cache.
	 */
	public purge(): void {
		this.asmCache.clear();
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default Disassembler;
export {Disassembler};
