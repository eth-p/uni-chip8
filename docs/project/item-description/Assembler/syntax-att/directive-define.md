# CHIP-8 Assembler Reference (AT&T)

| [Back](reference.md) | [Home](../index.md) |

## Define Directive (AT&T Syntax)

Defines a named value.

**Syntax:**

```
.define <name> <register>
.define <name> <constant>
```

**Example:**

```asm
.define flag %VF
.define MAGIC $0xF3
```
