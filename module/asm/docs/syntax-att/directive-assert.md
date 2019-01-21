# CHIP-8 Assembler Reference (AT&T)

| [Back](reference.md) | [Home](../index.md) |

## Assert Directive (AT&T Syntax)

Asserts something.
This can be used to narrow macro parameters.

**Syntax:**

```
.assert <condition ...>
```

**Example:**

```asm
.macro x f
	.assert type \f is constant
	.assert expr \f < 3
	; Do something with \f
.end
```
