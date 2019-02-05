# CHIP-8 Assembler Reference (AT&T)

| [Back](reference.md) | [Home](../index.md) |

## Else Directive (AT&T Syntax)

Generates code when an if-condition is not matched.

**Syntax:**

```
.else
```

**Example:**

```asm
.if (\f is constant)
	; \f is constant
.else
	; \f is not constant
.end
```
