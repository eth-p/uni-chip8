# CHIP-8 Assembler Reference (AT&T)

| [Back](reference.md) | [Home](../index.md) |

## Repeat Directive (AT&T Syntax)

Repeats a block of code a number of times.

**Syntax:**

```
.repeat <counter>, <times>
```

**Example:**

```asm
.repeat \i, 5
	add %V0, \i
.end
```
