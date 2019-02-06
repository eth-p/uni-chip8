; -------------------------------------------------------------------------------------------------------------------- ;
; Team Chipotle Intro Animation                                                                                        ;
; Copyright (C) 2019 Ethan Pini                                                                                        ;
; - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -;
; This program was designed to be assembled with https://github.com/wernsey/chip8                                      ;
; It will later be converted to the syntax used for our assembler.                                                     ;
; -------------------------------------------------------------------------------------------------------------------- ;
define frame_height 7
define frame_max 8
define animation_speed_max 14
define reg_animation_frame VA
define reg_animation_x VB
define reg_animation_y VC
define reg_speed VD
define reg_end V9
define one VE
define right_start 56

; -------------------------------------------------------------------------------------------------------------------- ;
; ENTRY:                                                                                                               ;
; -------------------------------------------------------------------------------------------------------------------- ;
entry:
	LD one, 1
	LD reg_speed, 2
	LD reg_animation_x, 28
	LD reg_animation_y, 12
	LD reg_animation_frame, 255
	LD I, sprite_null
	JP loop

; -------------------------------------------------------------------------------------------------------------------- ;
; MAIN:                                                                                                                ;
; -------------------------------------------------------------------------------------------------------------------- ;
loop:
	LD DT, reg_speed
	CALL animate
	DRW reg_animation_x, reg_animation_y, frame_height
	CALL wait
	JP loop

transition:
	CLS
	LD reg_speed, 1
	LD I, sprite_animated
	DRW reg_animation_x, reg_animation_y, frame_height
	JP loop2

loop2:
	LD DT, reg_speed
	SNE reg_animation_x, 5
	JP final
	CALL animate_left
	CALL wait
	JP loop2

final:
	; Letter: H
	LD reg_animation_x, right_start
	LD reg_end, 14
	LD I, sprite_h
	CALL animate_letter

	; Letter: I
	LD reg_animation_x, right_start
	LD reg_end, 23
	LD I, sprite_i
	CALL animate_letter

	; Letter: P
	LD reg_animation_x, right_start
	LD reg_end, 32
	LD I, sprite_p
	CALL animate_letter

	; Letter: -
	LD reg_animation_x, right_start
	LD reg_end, 41
	LD I, sprite_hyphen
	CALL animate_letter

	; Letter: 8
	LD reg_animation_x, right_start
	LD reg_end, 50
	LD I, sprite_8
	CALL animate_letter

	; Border
	LD reg_animation_x, 0
	CALL animate_border

	; Sound
	LD reg_speed, 15
	CALL sndwait

	LD reg_speed, 10
	CALL sndwait

	LD reg_speed, 5
	CALL sndwait

	; Done
	JP halt

halt:
	LD VF, K
	JP halt

; -------------------------------------------------------------------------------------------------------------------- ;
; ANIMATE:                                                                                                             ;
; -------------------------------------------------------------------------------------------------------------------- ;
animate:
	; Increment frame.
	ADD reg_animation_frame, 1
	SNE reg_animation_frame, frame_max
	CALL animate_reset

	; Load sprite.
	LD V1, reg_animation_frame
	LD V2, frame_height
	CALL mul
	DRW reg_animation_x, reg_animation_y, frame_height
	LD I, sprite_animated
	ADD I, V3
	RET

animate_reset:
	LD reg_animation_frame, 0
	SNE reg_speed, animation_speed_max
	JP transition

	ADD reg_speed, 4
	RET

animate_left:
	DRW reg_animation_x, reg_animation_y, frame_height
	SUB reg_animation_x, one
	DRW reg_animation_x, reg_animation_y, frame_height
	RET

animate_letter:
	DRW reg_animation_x, reg_animation_y, frame_height
	JP animate_letter_loop

animate_letter_loop:
	LD DT, reg_speed
	DRW reg_animation_x, reg_animation_y, frame_height
	SUB reg_animation_x, one
	DRW reg_animation_x, reg_animation_y, frame_height
	SE reg_animation_x, reg_end
	JP animate_letter_loop
	CALL wait
	RET

animate_border:
	LD I, sprite_border

animate_border_loop:
	SNE reg_animation_x, 64
	RET

	LD DT, reg_speed
	LD reg_animation_y, 0
	DRW reg_animation_x, reg_animation_y, 3
	LD reg_animation_y, 29
	DRW reg_animation_x, reg_animation_y, 3
	ADD reg_animation_x, 8

	CALL wait
	JP animate_border_loop

; -------------------------------------------------------------------------------------------------------------------- ;
; WAIT:                                                                                                                ;
; -------------------------------------------------------------------------------------------------------------------- ;
wait:
	LD V0, DT
	SE V0, 0
	JP wait
	RET

sndwait:
	LD ST, reg_speed
	LD reg_speed, 5
	JP wait

; -------------------------------------------------------------------------------------------------------------------- ;
; MUL:                                                                                                                 ;
; Input:  V1 * V2                                                                                                      ;
; Output: V3                                                                                                           ;
; -------------------------------------------------------------------------------------------------------------------- ;
mul:
	LD V3, 0
	LD V0, 1

mul_loop:
	SNE V1, 0
	RET

	ADD V3, V2
	SUB V1, V0
	JP mul_loop

; -------------------------------------------------------------------------------------------------------------------- ;
; SPRITES:                                                                                                             ;
; -------------------------------------------------------------------------------------------------------------------- ;
sprite_null:
db	0,0,0,0,0,0,0,0

sprite_animated:
db	%00111000,
	%01111100,
	%01100000,
	%01100000,
	%01100000,
	%00111110,
	%00111110

db	%00111000,
	%00111000,
	%00110000,
	%00110000,
	%00110000,
	%00011100,
	%00011100

db	%00011000,
	%00011000,
	%00011000,
	%00011000,
	%00011000,
	%00011000,
	%00011000

db	%00011100,
	%00011100,
	%00001100,
	%00001100,
	%00001100,
	%00111000,
	%00111000

db	%00011100,
	%00111110,
	%00000110,
	%00000110,
	%00000110,
	%01111100,
	%01111100

db	%00011100,
	%00001100,
	%00001100,
	%00001100,
	%00001100,
	%00111000,
	%00111000

db	%00011000,
	%00011000,
	%00011000,
	%00011000,
	%00011000,
	%00011000,
	%00011000

db	%00111000,
	%00111000,
	%00110000,
	%00110000,
	%00110000,
	%00011100,
	%00011100

sprite_h:
db	%11000110,
	%11000110,
	%11000110,
	%11111110,
	%11000110,
	%11000110,
	%11000110

sprite_i:
db	%11111110,
	%11111110,
	%00010000,
	%00010000,
	%00010000,
	%11111110,
	%11111110

sprite_p:
db	%11111110,
	%11000110,
	%11000110,
	%11111110,
	%11000000,
	%11000000,
	%11000000

sprite_hyphen:
db	%00000000,
	%00000000,
	%11111110,
	%11111110,
	%11111110,
	%00000000,
	%00000000

sprite_8:
db	%11111110,
	%11000110,
	%11000110,
	%11111110,
	%11000110,
	%11000110,
	%11111110

sprite_border:
db	%11111111,
	%00000000,
	%11111111
