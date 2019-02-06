# CHIP-8 Assembler Reference (AT&T)

| [Back](reference.md) | [Home](../index.md) |

## Sprite Height Directive (AT&T Syntax)

Returns a constant of the sprite height.
This is calculated as `n` where `n` is the number of lines in the sprite.

**Syntax:**

```
.sprite_height <sprite>
```

**Example:**

```asm
drw 0, 0, ((.sprite_width my_sprite) * 2)
```
