# CHIP-8 Assembler Reference (AT&T)

| [Back](reference.md) | [Home](../index.md) |

## If Directive (AT&T Syntax)

Generates code if a condition is met.

**Syntax:**

```
.if [not] type <variable> is <"constant"|"immediate"|"address"|"register">
.if [not] expr ( <EXPR> )
```

**Example:**

```asm
.macro x f
	.if type \f is constant
		.if not expr (\f < 3)
			; F is a constant that is greater than 3.
		.end
	.end
.end
```
