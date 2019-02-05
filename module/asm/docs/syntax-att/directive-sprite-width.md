# CHIP-8 Assembler Reference (AT&T)

| [Back](reference.md) | [Home](../index.md) |

## Sprite Width Directive (AT&T Syntax)

Returns a constant of the sprite width.
This is calculated as `8-n` where `n` is the whitespace from the right-hand side of the sprite.

**Syntax:**

```
.sprite_width <sprite>
```

**Example:**

```asm
drw ((.sprite_width my_sprite) * 2), 0, 1
```
