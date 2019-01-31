//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import JITASM from './JITASM';
import JITOperation from './JITOperation';
import JITError from '@chipotle/vm/JITError';

// ---------------------------------------------------------------------------------------------------------------------

/**
 * A utility class for just-in-time compiling instructions.
 */
class JIT {
	// -------------------------------------------------------------------------------------------------------------
	// | Regex:                                                                                                    |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * A regex pattern to check if a JS property is valid (i.e. can be directly accessed).
	 */
	protected static CHECK_JS_PROPERTY_VALID: RegExp = /^[A-Z_][A-Z0-9_]*$/i;

	/**
	 * A regex pattern to check if a JS number is valid.
	 */
	protected static CHECK_JS_NUMBER_VALID: RegExp = /^(?:0o|0x|0b)?(?:(?:\.[0-9]+)|(?:[0-9]+\.[0-9]*)|(?:[0-9]+))$/i;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructor:                                                                                              |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Private constructor to prevent new instances.
	 */
	private constructor() {}

	// -------------------------------------------------------------------------------------------------------------
	// | Escaping:                                                                                                 |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Generates a JS string.
	 * @param str The string.
	 * @returns The generated code.
	 */
	protected static jsGenerateString(str: string): string {
		return JSON.stringify(str);
	}

	/**
	 * Generates a JS number.
	 * @param num The number.
	 * @returns The generated code.
	 */
	protected static jsGenerateNumber(num: number): string {
		return num.toString();
	}

	/**
	 * Generates a JS boolean.
	 * @param bool The boolean.
	 * @returns The generated code.
	 */
	protected static jsGenerateBoolean(bool: boolean): string {
		return bool ? 'true' : 'false';
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Constants:                                                                                                |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Reference to the virtual machine context.
	 */
	public static readonly CONTEXT: string = '__C';

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Compiles a JIT program.
	 *
	 * @param program The program.
	 *
	 * @returns An executable function.
	 */
	public static compile<A>(program: JITASM.Program): JITOperation<A> {
		let factory = 'var __L = arguments[0];';

		// Dereference library functions.
		if (program.lib != null) {
			for (let key of Object.keys(program.lib)) {
				factory += `var __L${key}=__L[${this.jsGenerateString(key)}];`;
			}
		}

		// Create locals.
		if (program.locals != null) {
			for (let key of program.locals) {
				factory += `var ${key};`;
			}
		}

		// Create body.
		factory += `return function(${this.CONTEXT},__O){`;
		factory += program.instructions.join(';');
		factory += '}';

		// Generate function.
		try {
			let factoryFn = new Function(factory);
			let jitFn = factoryFn(program.lib);
			return jitFn;
		} catch (ex) {
			throw new JITError('Failed to create JIT function.', ex);
		}
	}

	/**
	 * Generates code for referring to a variable.
	 *
	 * @param root The root.
	 * @param path The children.
	 *
	 * @returns The generated code.
	 */
	public static REF(root: JITASM.CodeRef, ...path: (string | number)[]): JITASM.CodeRef {
		let code = root;
		for (let component of path) {
			component = component.toString();
			if (this.CHECK_JS_PROPERTY_VALID.test(component)) {
				code += `.${component}`;
			} else if (this.CHECK_JS_NUMBER_VALID.test(component)) {
				code += `[${component}]`;
			} else {
				code += `[${this.jsGenerateString(component)}]`;
			}
		}

		return code;
	}

	/**
	 * Generates code for assigning a variable.
	 *
	 * @param ref The variable to assign.
	 * @param value The assigned value.
	 *
	 * @returns The generated code.
	 */
	public static ASSIGN(ref: JITASM.CodeRef, value: JITASM.CodeCon | JITASM.CodeRef): JITASM.CodeCon {
		return `${ref}=(${value})`;
	}

	/**
	 * Generates code for referring to a library function.
	 *
	 * @param lib The function.
	 *
	 * @returns The generated code.
	 */
	public static LIB(lib: string): JITASM.CodeRef {
		return `__L${lib}`;
	}

	/**
	 * Generates code for calling a function.
	 *
	 * @param fn The function reference.
	 * @param params The function parameters.
	 *
	 * @returns The generated code.
	 */
	public static CALL(
		fn: JITASM.CodeRef,
		...params: (JITASM.CodeRef | JITASM.CodeCon)[]
	): JITASM.CodeRef | JITASM.CodeCon {
		return `${fn}(${params.join(',')})`;
	}

	/**
	 * Generates code for constructing an object.
	 *
	 * @param fn The function reference.
	 * @param params The function parameters.
	 *
	 * @returns The generated code.
	 */
	public static CONSTRUCT(
		fn: JITASM.CodeRef,
		...params: (JITASM.CodeRef | JITASM.CodeCon)[]
	): JITASM.CodeRef | JITASM.CodeCon {
		return `(new ${fn}(${params.join(',')}))`;
	}

	/**
	 * Generates code for a constant value.
	 *
	 * @param value The constant value.
	 * @returns The generated code.
	 */
	public static CON(value: string | number | boolean): JITASM.Code {
		switch (typeof value) {
			case 'string':
				return this.jsGenerateString(value);

			case 'number':
				return this.jsGenerateNumber(value);

			case 'boolean':
				return this.jsGenerateBoolean(value);

			default:
				throw new JITError(`Cannot create constant from ${typeof value}`);
		}
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default JIT;
export {JIT};
