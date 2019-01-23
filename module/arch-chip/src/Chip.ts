//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Interpreted from '@chipotle/vm/Interpreted';
import VMContext from '@chipotle/vm/VMContext';

import ChipArchitecture from './ChipArchitecture';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * A namespace containing aliases for implementing operations.
 */
namespace Chip {
	/**
	 * An alias for {@link Interpreted}<{@link ChipArchitecture}>.
	 */
	export type Interpreter = Interpreted<ChipArchitecture>;

	/**
	 * An alias for {@link VMContext}<{@link ChipArchitecture}>.
	 */
	export type Context = VMContext<ChipArchitecture>;
}

export default Chip;
export {Chip};
