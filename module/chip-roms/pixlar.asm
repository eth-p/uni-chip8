; -------------------------------------------------------------------------------------------------------------------- ;
; Team Chipotle Pixelar Animation                                                                                      ;
; Copyright (C) 2019 Ethan Pini                                                                                        ;
; - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -;
; This program was designed to be assembled with https://github.com/wernsey/chip8                                      ;
; It will later be converted to the syntax used for our assembler.                                                     ;
; -------------------------------------------------------------------------------------------------------------------- ;
; CAT - Chip Animation Toolkit
;
; Operations:
; db A_DRAW
; db [X]
; db [Y]
; db [H]
; db [sprite]
;
; db A_SET_TIMER
; db [DT]
;
; db A_SET_SOUND
; db [ST]
;
; db A_WAIT
; -------------------------------------------------------------------------------------------------------------------- ;
define A_EXIT 0
define A_SET_TIMER 1
define A_SET_SOUND 2
define A_SET_HEIGHT 3
define A_WAIT 4
define A_WAIT_AND_TIMER 5
define A_DRAW 6
define A_USER_1 8
define A_USER_2 9

; -------------------------------------------------------------------------------------------------------------------- ;
; REGISTERS:                                                                                                           ;
; -------------------------------------------------------------------------------------------------------------------- ;
define reg_op       V0
define reg_st_time  V1
define reg_dt_time  V1
define reg_sh_value V1
define reg_drw_x    V1
define reg_drw_y    V2
define reg_drw_h    VE
define reg_scratch  VD
define reg_scratch2 VC

; -------------------------------------------------------------------------------------------------------------------- ;
; MAIN:                                                                                                                ;
; -------------------------------------------------------------------------------------------------------------------- ;
entry:
	LD I, animation
	JP animate

halt:
	LD VF, K
	JP halt

animate:
	LD V3, [I]
	ADD V0, V0
	JP V0, animate_jtable_op

animate_jtable_op:
	JP halt
	JP animate_op_dt
	JP animate_op_st
	JP animate_op_sh
	JP animate_op_wait
	JP animate_op_wait_and_timer
	JP animate_op_draw
	JP halt
	JP animate_user
	JP animate_user

animate_jtable_user:
	CALL user_1
	JP animate
	CALL user_2
	JP animate

animate_user:
	LD V0, [I]
	LD reg_scratch, 1
	ADD I, reg_scratch
	LD reg_scratch, A_USER_1
	SUB V0, reg_scratch
	ADD V0, V0
	ADD V0, V0
	JP V0, animate_jtable_user

animate_op_st:
	LD reg_scratch, 2
	ADD I, reg_scratch
	LD ST, reg_st_time
	JP animate

animate_op_dt:
	LD reg_scratch, 2
	ADD I, reg_scratch
	LD DT, reg_dt_time
	JP animate

animate_op_sh:
	LD reg_scratch, 2
	ADD I, reg_scratch
	LD reg_drw_h, reg_sh_value
	JP animate

animate_op_wait:
	LD reg_scratch, 1
	ADD I, reg_scratch
	CALL wait
	JP animate

animate_op_wait_and_timer:
	LD reg_scratch, 2
	ADD I, reg_scratch
	CALL wait
	LD DT, reg_st_time
	JP animate

animate_op_draw:
	LD reg_scratch, 3
	ADD I, reg_scratch
	LD V0, reg_drw_h
	ADD V0, V0
	ADD V0, V0
	JP V0, animate_jtable_drw

animate_op_draw_finish:
	ADD I, reg_drw_h
	JP animate

animate_jtable_drw:
	JP halt
	JP halt
	DRW reg_drw_x, reg_drw_y, 1
	JP animate_op_draw_finish
	DRW reg_drw_x, reg_drw_y, 2
	JP animate_op_draw_finish
	DRW reg_drw_x, reg_drw_y, 3
	JP animate_op_draw_finish
	DRW reg_drw_x, reg_drw_y, 4
	JP animate_op_draw_finish
	DRW reg_drw_x, reg_drw_y, 5
	JP animate_op_draw_finish
	DRW reg_drw_x, reg_drw_y, 6
	JP animate_op_draw_finish
	DRW reg_drw_x, reg_drw_y, 7
	JP animate_op_draw_finish
	DRW reg_drw_x, reg_drw_y, 8
	JP animate_op_draw_finish
	DRW reg_drw_x, reg_drw_y, 9
	JP animate_op_draw_finish
	DRW reg_drw_x, reg_drw_y, 10
	JP animate_op_draw_finish
	DRW reg_drw_x, reg_drw_y, 11
	JP animate_op_draw_finish
	DRW reg_drw_x, reg_drw_y, 12
	JP animate_op_draw_finish
	DRW reg_drw_x, reg_drw_y, 13
	JP animate_op_draw_finish
	DRW reg_drw_x, reg_drw_y, 14
	JP animate_op_draw_finish
	DRW reg_drw_x, reg_drw_y, 15
	JP animate_op_draw_finish

wait:
	LD VF, DT
	SE VF, 0
	JP wait
	RET

; -------------------------------------------------------------------------------------------------------------------- ;
; ANIMATION:                                                                                                           ;
; -------------------------------------------------------------------------------------------------------------------- ;
define LOGO_Y          20
define LAMP_Y          7
define LAMP_SPEED      5
define LAMP_SPEED_TURN 10
define LAMP_HEIGHT     9

animation:
db	A_SET_TIMER, 60
db	A_SET_HEIGHT, 8

;
; INITIAL SCENE
;
db	A_DRAW, 2, LOGO_Y
db	%11111110,
	%00110011,
	%00110000,
	%00110011,
	%00111100,
	%00110000,
	%00110000,
	%11111100

db	A_DRAW, 10, LOGO_Y
db	%00000000,
	%00000000,
	%10000000,
	%00000000,
	%00000000,
	%00000000,
	%00000000,
	%00000000

db	A_DRAW, 12, LOGO_Y
db	%11111100,
	%00110000,
	%00110000,
	%00110000,
	%00110000,
	%00110000,
	%00110000,
	%11111100

db	A_DRAW, 20, LOGO_Y
db	%11111001,
	%11100010,
	%00110100,
	%00011000,
	%00010100,
	%00100010,
	%01100001,
	%11110000

db	A_DRAW, 28, LOGO_Y
db	%10000000,
	%00000000,
	%00000000,
	%00000000,
	%00000000,
	%00000000,
	%00000000,
	%10000000

db	A_DRAW, 31, LOGO_Y
db	%11110000,
	%01100000,
	%01100000,
	%01100000,
	%01100000,
	%01100000,
	%01100011,
	%01111110

db	A_DRAW, 40, LOGO_Y
db	%00111111,
	%00010011,
	%00010011,
	%00100001,
	%00111111,
	%01000000,
	%01000000,
	%11100000

db	A_DRAW, 48, LOGO_Y
db	%10000000,
	%00000000,
	%00000000,
	%11000000,
	%11000000,
	%01100000,
	%01100000,
	%11111000

db	A_DRAW, 54, LOGO_Y
db	%11111110,
	%00110011,
	%00110000,
	%00110011,
	%00111100,
	%00110110,
	%00110011,
	%11111001

db	A_DRAW, 62, LOGO_Y
db	%00000000,
	%00000000,
	%10000000,
	%00000000,
	%00000000,
	%00000000,
	%00000000,
	%10000000

;
; LAMP ENTERS SCENE
;
db	A_SET_HEIGHT, 5
db	A_WAIT_AND_TIMER, LAMP_SPEED
db	A_DRAW, 56, LAMP_Y
db	%00000000,
	%00000000,
	%00000001,
	%00000001,
	%00000001

db	A_WAIT_AND_TIMER, LAMP_SPEED
db	A_DRAW, 56, LAMP_Y
db	%00000000,
	%00000000,
	%00000010,
	%00000010,
	%00000010

db	A_WAIT_AND_TIMER, LAMP_SPEED
db	A_DRAW, 56, LAMP_Y
db	%00000000,
	%00000110,
	%00000100,
	%00000101,
	%00000011

db	A_WAIT_AND_TIMER, LAMP_SPEED
db	A_SET_HEIGHT, 8
db	A_DRAW, 56, LAMP_Y
db	%00000000,
	%00001010,
	%00001001,
	%00001011,
	%00000001,
	%00000010,
	%00000000,
	%00000000

db	A_WAIT_AND_TIMER, LAMP_SPEED
db	A_DRAW, 56, LAMP_Y
db	%00011000,
	%00010000,
	%00010100,
	%00001111,
	%00000100,
	%00000000,
	%00000010,
	%00001111

db	A_WAIT_AND_TIMER, LAMP_SPEED
db	A_DRAW, 56, LAMP_Y
db	%00101000,
	%00100100,
	%00101110,
	%00000110,
	%00001111,
	%00000110,
	%00000110,
	%00010000

db A_USER_1

animation_squish:
db	A_SET_HEIGHT, 9
db	A_SET_TIMER, LAMP_SPEED
db	A_DRAW, 12, 10
db	%11000000,
	%00100000,
	%00110000,
	%11000000,
	%00111000,
	%00111000,
	%00000000,
	%01101100,
	%01111100

db A_USER_2

animation_end:
db	A_SET_HEIGHT, 9
db	A_WAIT_AND_TIMER, LAMP_SPEED
db	A_DRAW, 12, 10
db	%11000000,
	%00100000,
	%00110000,
	%11000000,
	%00111000,
	%00111000,
	%00000000,
	%01101100,
	%01111100

db	A_SET_HEIGHT, 11
db	A_WAIT_AND_TIMER, LAMP_SPEED
db	A_DRAW, 12, 11
db	%11000000,
	%00100000,
	%00110000,
	%11000000,
	%00111000,
	%00111000,
	%00000000,
	%01101100,
	%01111100,
	%11111100,
	%11001100

db	A_WAIT_AND_TIMER, LAMP_SPEED
db	A_DRAW, 12, 12
db	%11000000,
	%00100000,
	%00110000,
	%11000000,
	%00111000,
	%00111000,
	%00000000,
	%01101100,
	%01111100,
	%11111100,
	%11001100

db	A_WAIT_AND_TIMER, LAMP_SPEED
db	A_DRAW, 12, 13
db	%11000000,
	%00100000,
	%00110000,
	%11000000,
	%00111000,
	%00111000,
	%00000000,
	%01101100,
	%01111100,
	%11111100,
	%11001100

db	A_WAIT_AND_TIMER, LAMP_SPEED
db	A_DRAW, 12, 14
db	%11000000,
	%00100000,
	%00110000,
	%11000000,
	%00111000,
	%00111000,
	%00000000,
	%01101100,
	%01111100,
	%11111100,
	%11001100

db	A_WAIT_AND_TIMER, LAMP_SPEED
db	A_DRAW, 12, 15
db	%11000000,
	%00100000,
	%00110000,
	%11000000,
	%00111000,
	%00111000,
	%00000000,
	%01101100,
	%01111100,
	%11111100,
	%11001100

db	A_WAIT_AND_TIMER, LAMP_SPEED
db	A_DRAW, 12, 16
db	%11000000,
	%00100000,
	%00110000,
	%11000000,
	%00111000,
	%00111000,
	%00000000,
	%01101100,
	%01111100,
	%11111100,
	%11001100

db	A_SET_HEIGHT, 10
db	A_WAIT_AND_TIMER, LAMP_SPEED
db	A_DRAW, 12, 17
db	%11000000,
	%00100000,
	%00110000,
	%11000000,
	%00111000,
	%00111000,
	%00000000,
	%01101100,
	%01111100,
	%11111100

db	A_WAIT_AND_TIMER, LAMP_SPEED
db	A_DRAW, 12, 18
db	%11000000,
	%00100000,
	%00110000,
	%11000000,
	%00111000,
	%00111000,
	%00000000,
	%01101100,
	%01111100,
	%11111100

db	A_WAIT_AND_TIMER, LAMP_SPEED_TURN
db	A_DRAW, 12, 19
db	%11000000,
	%00100000,
	%00110000,
	%11000000,
	%00111000,
	%00111000,
	%00000000,
	%01101100,
	%01111100,
	%00000000

db	A_SET_HEIGHT, 8
db	A_WAIT_AND_TIMER, LAMP_SPEED_TURN
db	A_DRAW, 12, 20
db	%10100000,
	%10010000,
	%10100000,
	%00000000,
	%00000000,
	%00000000,
	%00000000,
	%00000000

db	A_SET_HEIGHT, 8
db	A_WAIT_AND_TIMER, LAMP_SPEED_TURN
db	A_DRAW, 12, 20
db	%01011000,
	%01011000,
	%01001000,
	%00000000,
	%00000000,
	%00000000,
	%00000000,
	%00000000

db A_EXIT

; -------------------------------------------------------------------------------------------------------------------- ;
; SPRITES:                                                                                                             ;
; -------------------------------------------------------------------------------------------------------------------- ;
sprite_lamp:
db	%11000000,
	%11100000,
	%11010000,
	%00010000,
	%00101000,
	%00010000,
	%00010000,
	%01111100,
	%00000000

sprite_lamp_vert:
db	%11000000,
	%00100000,
	%00110000,
	%11000000,
	%00111000,
	%00111000,
	%00000000,
	%01101100,
	%01111100

; -------------------------------------------------------------------------------------------------------------------- ;
; HOP ANIMATION:                                                                                                       ;
; -------------------------------------------------------------------------------------------------------------------- ;
define hop_direction V7
define hop_y V6
define hop_x V5
define MIN_HOP_Y 6
define MAX_HOP_Y 10
define HOP_END_X 12

user_1:
	LD reg_scratch, LAMP_SPEED
	LD DT, reg_scratch
	LD I, sprite_lamp
	LD hop_y, 7
	LD hop_x, 58
	LD hop_direction, 255
	CALL animate_hop
	DRW hop_x, hop_y, LAMP_HEIGHT
	LD I, animation_squish
	RET

animate_hop:
	CALL wait
	LD reg_scratch, 5
	LD reg_scratch2, 1

	; Remove old sprite.
	DRW hop_x, hop_y, LAMP_HEIGHT

	; Calculate new X.
	SUB hop_x, reg_scratch2
	SNE hop_x, HOP_END_X
	RET

	; Calculate new Y.
	ADD hop_y, hop_direction
	SNE hop_y, MIN_HOP_Y
		LD hop_direction, 1

	SNE hop_y, MAX_HOP_Y
		LD ST, reg_scratch

	SNE hop_y, MAX_HOP_Y
		LD hop_direction, 255

	; Add new sprite.
	DRW hop_x, hop_y, LAMP_HEIGHT

	; Repeat loop.
	LD reg_scratch, LAMP_SPEED
	LD DT, reg_scratch
	JP animate_hop

; -------------------------------------------------------------------------------------------------------------------- ;
; SQUISH ANIMATION:                                                                                                    ;
; -------------------------------------------------------------------------------------------------------------------- ;
define squish_max_y V8
define squish_direction V7
define squish_y V6
define squish_x V5
define MIN_SQUISH_Y 6
define MAX_SQUISH_Y 10
define SQUISH_END_Y 2

user_2:
	LD reg_scratch, LAMP_SPEED
	LD DT, reg_scratch
	LD I, sprite_lamp
	LD squish_y, 11
	LD squish_x, 12
	LD squish_direction, 255
	LD squish_max_y, 5

	CALL animate_squish
	LD I, animation_end
	RET

animate_squish:
	CALL wait
	LD reg_scratch2, 1

	; Remove old sprite.
	DRW squish_x, squish_y, LAMP_HEIGHT

	; Calculate new Y.
	ADD squish_y, squish_direction

	SNE squish_y, squish_max_y
		LD squish_direction, 1

	SNE squish_y, squish_max_y
		SUB squish_max_y, reg_scratch2

	SNE squish_y, MAX_SQUISH_Y
		LD ST, reg_scratch

	SNE squish_y, MAX_SQUISH_Y
		LD squish_direction, 255

	; Add new sprite.
	DRW squish_x, squish_y, LAMP_HEIGHT

	; End?
	SE squish_max_y, SQUISH_END_Y
		JP animate_squish_next

	SE squish_y, MAX_SQUISH_Y
		JP animate_squish_next

	RET

animate_squish_next:
	; Repeat loop.
	LD reg_scratch, LAMP_SPEED
	LD DT, reg_scratch
	JP animate_squish

