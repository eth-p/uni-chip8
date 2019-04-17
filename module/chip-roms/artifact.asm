; -------------------------------------------------------------------------------------------------------------------- ;
; Artifact Demo                                                                                                        ;
; Copyright (C) 2019 Ethan Pini                                                                                        ;
; - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -;
; This program was designed to be assembled with https://github.com/wernsey/chip8                                      ;
; -------------------------------------------------------------------------------------------------------------------- ;
define x V1
define y V2
define rng V3
define scratch VE
define scratch2 VD

define SCREEN_HEIGHT 32
define SCREEN_WIDTH 64

; -------------------------------------------------------------------------------------------------------------------- ;
; ENTRY:                                                                                                               ;
; -------------------------------------------------------------------------------------------------------------------- ;
entry:
	LD x, 0
	LD y, 0

draw_line:
	RND rng, %00000111
	LD I, sprite_af
	CALL randomize_sprite
	DRW x, y, 3
	ADD x, 1

	CALL next_column
	JP draw_line

next_column:
	; Check if (x < SCREEN_WIDTH).
	LD scratch, x
	LD scratch2, SCREEN_WIDTH
	SUB scratch, scratch2
	SE VF, 0
		JP next_line

	; Nope. Just return.
	RET

next_line:
	ADD y, 4
	LD x, 0

	; Check if (y < SCREEN_HEIGHT).
	LD scratch, y
	LD scratch2, SCREEN_HEIGHT
	SUB scratch, scratch2
	SE VF, 0
		JP halt

	RET

randomize_sprite:
	SNE rng, 0
		RET

	LD scratch, 3
	LD scratch2, 1
	ADD I, scratch
	SHR rng, scratch2
	JP randomize_sprite

; -------------------------------------------------------------------------------------------------------------------- ;
; HALT:                                                                                                                ;
; -------------------------------------------------------------------------------------------------------------------- ;
halt:
	LD VF, K
	JP halt

; -------------------------------------------------------------------------------------------------------------------- ;
; SPRITES:                                                                                                             ;
; -------------------------------------------------------------------------------------------------------------------- ;
sprite_af:
db	%10000000,
	%01000000,
	%10000000

db	%00100000,
	%00000000,
	%01000000

db	%00000000,
	%10100000,
	%00000000

db	%01000000,
	%00000000,
	%00100000
