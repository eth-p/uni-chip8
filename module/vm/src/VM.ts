//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Architecture from './Architecture';
import VMContext from './VMContext';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Hello, world!
 */
export class VMBase<A extends Architecture> {
	constructor(arch: A) {
		let ctx: VMContext<A> = <VMContext<A>>(<any>this);
		Object.assign(ctx, arch);
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
	new <A extends Architecture>(): VMContext<A>;
}

const VM: VMClass = <any>VMBase;
interface VM<A extends Architecture> extends VMBase<A> {}
export default VM;
