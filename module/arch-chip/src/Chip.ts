//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Uint16 from '@chipotle/types/Uint16';

import Interpreted from '@chipotle/vm/Interpreted';
import VMContext from '@chipotle/vm/VMContext';

import ISA_Operation from '@chipotle/isa/Operation';

import ChipArchitecture from './ChipArchitecture';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * A namespace containing type aliases and classes to help implement the CHIP-8 architecture.
 */
namespace Chip {
	/**
	 * An alias for {@link VMContext}<{@link ChipArchitecture}>.
	 */
	export type Context = VMContext<ChipArchitecture>;

	/**
	 * An instruction set {@link ISA_Operation operation} that can be {@link Interpreted interpreted} by the virtual
	 * machine.
	 */
	export abstract class Operation extends ISA_Operation implements Interpreted<ChipArchitecture> {
		/**
		 * @inheritDoc
		 */
		public abstract execute(
			this: void,
			context: Chip.Context,
			p1: Uint16 | never,
			p2: Uint16 | never,
			p3: Uint16 | never
		): void;
	}
}

export default Chip;
export {Chip};
