# CHIP-8 Assembler Reference (AT&T)

| [Back](reference.md) | [Home](../index.md) |

## Macro Directive (AT&T Syntax)

Defines a macro.
A macro is a set of instructions that can be inserted anywhere in the program.

**Syntax:**

```
.macro <macro>
.macro <macro> [[<param_value>[:req|:required]|<param_name>=<param_value>], ...]
```

**Example:**

```asm
.macro my_macro p1:req, p2=5
	.repeat \x, (\p1 - 1)
		drw (\x * 3), 0, 1
	.end
.end
```
