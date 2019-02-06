# CHIP-8 Assembler Reference (AT&T)

| [Back](reference.md) | [Home](../index.md) |

## Labels (AT&T Syntax)

Labels are special variables that are mapped 12-bit memory address.

**Syntax:**
Labels are defined using a name followed by a colon.

```
<label>:
```

**Example:**

```gas
my_label:
	instruction
	instruction
	instruction
```
