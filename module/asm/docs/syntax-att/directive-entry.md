# CHIP-8 Assembler Reference (AT&T)

| [Back](reference.md) | [Home](../index.md) |

## Entry Directive (AT&T Syntax)

Specifies the entry point of the program.
In the absence of the `.entry` directive, the first top-level instruction will be used.

**Syntax:**

```
.entry <address>
.entry <label>
```

**Example:**

```asm
.entry entry
entry:
	drw
```
