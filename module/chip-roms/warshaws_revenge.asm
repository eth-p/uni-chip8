; -------------------------------------------------------------------------------------------------------------------- ;
; Warshaws' Revenge                                                                                                    ;
; Copyright (C) 2019 Ethan Pini                                                                                        ;
; - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -;
; This program was designed to be assembled with https://github.com/wernsey/chip8                                      ;
; -------------------------------------------------------------------------------------------------------------------- ;
define EET_HEIGHT 5
define SHAW_HEIGHT 3

define BAND_X 20

define SHIELD_X0 48
define SHIELD_X1 56

define SHIELD_Y0 6
define SHIELD_Y1 14
define SHIELD_Y2 17
define START_X 5
define START_Y 14
define EET_X 59
define EET_Y 13

define KEY_LEFT #7
define KEY_RIGHT #9
define KEY_DOWN #8
define KEY_UP #5
define KEY_SHOOT #B

define STATE_WIN 1

define shaw_x VD
define shaw_y VE
define shaw_projectile_x VB
define shaw_projectile_y VC
define shaw_animation V5
define eet_projectile_x V9
define eet_projectile_y VA
define draw_x V7
define draw_y V8
define temp V0
define temp2 V1
define temp3 V2
define tick V6
define state V4

define INT_MAX 255
define INT_MIN 0

; -------------------------------------------------------------------------------------------------------------------- ;
; ENTRY:                                                                                                               ;
; -------------------------------------------------------------------------------------------------------------------- ;
entry:
	LD temp, 30
	LD DT, temp
	JP restart

restart:
	CLS
	CALL draw_shield
	CALL draw_eet
	CALL draw_band
	LD state, 0
	LD shaw_x, START_X
	LD shaw_y, START_Y
	LD I, sprite_shaw2
	DRW shaw_x, shaw_y, 3
	LD tick, 0
	JP loop

win:
	LD temp, 30
	LD draw_x, EET_X
	LD draw_y, EET_Y
	LD I, sprite_eet
	DRW draw_x, draw_y, 5

	LD DT, temp
	LD ST, temp
	LD I, sprite_eet_death1
	DRW draw_x, draw_y, 5
	CALL wait

	LD DT, temp
	LD I, sprite_eet_death1
	DRW draw_x, draw_y, 5
	LD I, sprite_eet_death2
	DRW draw_x, draw_y, 5
	CALL wait

	LD DT, temp
	LD ST, temp
	LD I, sprite_eet_death2
	DRW draw_x, draw_y, 5
	LD I, sprite_eet_death3
	DRW draw_x, draw_y, 5
	CALL wait

	LD DT, temp
	LD I, sprite_eet_death3
	DRW draw_x, draw_y, 5
	LD I, sprite_eet_death4
	DRW draw_x, draw_y, 5
	CALL wait

	LD DT, temp
	LD ST, temp
	LD I, sprite_eet_death4
	DRW draw_x, draw_y, 5
	LD I, sprite_eet_death5
	DRW draw_x, draw_y, 5

	JP halt

; -------------------------------------------------------------------------------------------------------------------- ;
; LOOP:                                                                                                                ;
; -------------------------------------------------------------------------------------------------------------------- ;
loop:
	LD temp, 1
	LD DT, temp
	SE state, 0
	JP win
	CALL handle_input
	CALL handle_enemy_projectile
	CALL handle_player_projectile
	SNE tick, 2
	CALL draw_band
	CALL draw_shaw
	CALL draw_projectiles
	ADD tick, 1
	SNE tick, 3
	LD tick, 0
	CALL wait
	JP loop

; -------------------------------------------------------------------------------------------------------------------- ;
; HANDLE:                                                                                                              ;
; -------------------------------------------------------------------------------------------------------------------- ;
; Handle's player input.
handle_input:
	; Left
	LD temp, KEY_LEFT
	SKNP temp
	CALL shaw_move_left

	; Right
	LD temp, KEY_RIGHT
	SKNP temp
	CALL shaw_move_right

	; Up
	LD temp, KEY_UP
	SKNP temp
	CALL shaw_move_up

	; Down
	LD temp, KEY_DOWN
	SKNP temp
	CALL shaw_move_down

	; Shoot
	LD temp, KEY_SHOOT
	SKNP temp
	CALL shaw_shoot

	RET

handle_player_projectile:
	SNE shaw_projectile_x, 0
	RET

	CALL draw_projectile_shaw
	ADD shaw_projectile_x, 1

	; Collision check.
	CALL draw_projectile_shaw
	SE VF, 0
	CALL handle_player_projectile_collision
	CALL draw_projectile_shaw

	; Remove projectile if off the edge.
	SNE shaw_projectile_x, 63
	LD shaw_projectile_x, 0
	RET

handle_player_projectile_collision:
	LD temp2, SHIELD_X0
	SUBN temp2, shaw_projectile_x
	SE VF, 1
	RET

	LD temp2, EET_X
	SUBN temp2, shaw_projectile_x
	SNE VF, 1
	CALL handle_player_projectile_collision2

	LD shaw_projectile_x, 0
	CALL draw_projectile_shaw
	RET

handle_player_projectile_collision2:
	LD temp2, EET_Y
	SUBN temp2, shaw_projectile_y
	SE VF, 1
	RET

	LD temp2, EET_Y
	ADD temp2, 5
	SUBN temp2, shaw_projectile_y
	SNE VF, 0
	LD state, STATE_WIN

	RET

handle_enemy_projectile:
	RET

; -------------------------------------------------------------------------------------------------------------------- ;
; SHAW:                                                                                                                ;
; -------------------------------------------------------------------------------------------------------------------- ;
shaw_move_left:
	SNE shaw_x, 0
	RET

	CALL clear_shaw
	LD temp, 1
	SUB shaw_x, temp
	CALL clear_shaw
	RET

shaw_move_right:
	SNE shaw_x, 58
	RET

	CALL clear_shaw
	ADD shaw_x, 1
	CALL clear_shaw
	RET

shaw_move_up:
	SNE shaw_y, 0
	RET

	CALL clear_shaw
	LD temp, 1
	SUB shaw_y, temp
	CALL clear_shaw
	RET

shaw_move_down:
	SNE shaw_y, 29
	RET

	CALL clear_shaw
	ADD shaw_y, 1
	CALL clear_shaw
	RET

shaw_shoot:
	SE shaw_projectile_x, 0
	RET

	LD shaw_projectile_x, shaw_x
	LD shaw_projectile_y, shaw_y
	ADD shaw_projectile_x, 5
	ADD shaw_projectile_y, 1
	CALL draw_projectile_shaw
	RET

; -------------------------------------------------------------------------------------------------------------------- ;
; DRAW:                                                                                                                ;
; -------------------------------------------------------------------------------------------------------------------- ;

; Draws the EET's shield.
draw_shield:
	LD draw_x, SHIELD_X0
	LD draw_y, SHIELD_Y0
	LD I, sprite_eet_shield_00
	DRW draw_x, draw_y, 8
	LD draw_y, SHIELD_Y1
	LD I, sprite_eet_shield_01
	DRW draw_x, draw_y, 3
	LD draw_y, SHIELD_Y2
	LD I, sprite_eet_shield_02
	DRW draw_x, draw_y, 8
	LD draw_x, SHIELD_X1
	LD draw_y, SHIELD_Y0
	LD I, sprite_eet_shield_10
	DRW draw_x, draw_y, 8
	LD draw_y, SHIELD_Y1
	LD I, sprite_eet_shield_11
	DRW draw_x, draw_y, 3
	LD draw_y, SHIELD_Y2
	LD I, sprite_eet_shield_12
	DRW draw_x, draw_y, 8
	RET

; Draws the EET itself.
draw_eet:
	LD draw_x, EET_X
	LD draw_y, EET_y
	LD I, sprite_eet
	DRW draw_x, draw_y, 5
	RET

; Draws the screen band.
; This is a SLOW operation.
draw_band:
	CALL stash

	; Copy band1 to band2 memory space.
	LD I, sprite_band1
	LD [I], V8
	LD I, sprite_band2
	LD V8, [I]

	; Generate new band1.
	RND V0, INT_MAX
	RND V1, INT_MAX
	RND V2, INT_MAX
	RND V3, INT_MAX
	RND V4, INT_MAX
	RND V5, INT_MAX
	RND V6, INT_MAX
	RND V7, INT_MAX
	RND V8, INT_MAX
	LD I, sprite_band1
	LD [I], V8
	; Draw! (Slowly)
	LD draw_x, BAND_X
	LD draw_y, 0

	LD temp, 0
	draw_band_loop:
		LD I, sprite_band2
		DRW draw_x, draw_y, 8
		LD I, sprite_band1
		DRW draw_x, draw_y, 8
		ADD temp, 1
		ADD draw_y, temp
		SE draw_y, 36
		JP draw_band_loop

	; Return.
	CALL unstash
	RET

; Draws Shaw.
draw_shaw:
	SE shaw_animation, 0
	JP draw_shaw2
	JP draw_shaw1

draw_shaw1:
	LD shaw_animation, 1
	LD I, sprite_shaw2
	DRW shaw_x, shaw_y, 3
	LD I, sprite_shaw1
	DRW shaw_x, shaw_y, 3
	RET

draw_shaw2:
	LD shaw_animation, 0
	LD I, sprite_shaw1
	DRW shaw_x, shaw_y, 3
	LD I, sprite_shaw2
	DRW shaw_x, shaw_y, 3
	RET

; Draws Shaw without clearing the previous animation.
clear_shaw:
	SE shaw_animation, 0
	JP clear_shaw2
	JP clear_shaw1

clear_shaw1:
	LD I, sprite_shaw2
	DRW shaw_x, shaw_y, 3
	RET

clear_shaw2:
	LD I, sprite_shaw1
	DRW shaw_x, shaw_y, 3
	RET

; Draws projectiles.
draw_projectiles:
	SE shaw_projectile_x, 0
	CALL draw_projectile_shaw
	SE eet_projectile_x, 0
	CALL draw_projectile_eet
	RET

draw_projectile_shaw:
	LD I, sprite_projectile
	DRW shaw_projectile_x, shaw_projectile_y, 1
	RET

draw_projectile_eet:
	LD I, sprite_projectile_long
	DRW eet_projectile_x, eet_projectile_y, 1
	RET

; -------------------------------------------------------------------------------------------------------------------- ;
; STASH:                                                                                                               ;
; -------------------------------------------------------------------------------------------------------------------- ;

; Stashes all the registers.
stash:
	LD I, stash_region
	LD [I], VF

; Unstashes all the registers.
unstash:
	LD I, stash_region
	LD VF, [I]


; -------------------------------------------------------------------------------------------------------------------- ;
; WAIT:                                                                                                                ;
; -------------------------------------------------------------------------------------------------------------------- ;

; Waits for [DT] 60ths of a second.
; DT should be loaded beforehand.
; Reserves: V0
wait:
	wait_loop:
		LD V0, DT
		SE V0, 0
		JP wait_loop

	RET

; -------------------------------------------------------------------------------------------------------------------- ;
; HALT:                                                                                                                ;
; -------------------------------------------------------------------------------------------------------------------- ;
halt:
	LD VF, K
	JP halt

; -------------------------------------------------------------------------------------------------------------------- ;
; SPRITES:                                                                                                             ;
; -------------------------------------------------------------------------------------------------------------------- ;
sprite_projectile:
db	%10000000

sprite_projectile_long:
db	%11000000

sprite_shaw1:
db	%10101000,
	%11010000,
	%10101000

sprite_shaw2:
db	%11001000,
	%11110000,
	%11001000

sprite_eet:
db	%00111000,
	%01001000,
	%10001000,
	%01001000,
	%00111000

sprite_eet_death1:
db	%00011000,
	%00101000,
	%01010000,
	%00101000,
	%00011000

sprite_eet_death2:
db	%00000000,
	%00111000,
	%01010000,
	%00111000,
	%00000000

sprite_eet_death3:
db	%00000000,
	%00010000,
	%00111000,
	%00010000,
	%00000000

sprite_eet_death4:
db	%00010000,
	%00000000,
	%01010000,
	%00000000,
	%00010000

sprite_eet_death5:
db	%01001000,
	%00000000,
	%00000000,
	%00000000,
	%01001000

sprite_eet_shield_10:
db	%00001111,
	%00011111,
	%00111111,
	%01111110,
	%11111000,
	%11110000,
	%11100000,
	%11000000

sprite_eet_shield_11:
db	%11000000,
	%11000000,
	%11000000

sprite_eet_shield_12:
db	%11000000,
	%11100000,
	%11110000,
	%11111000,
	%01111110,
	%00111111,
	%00011111,
	%00001111

sprite_eet_shield_00:
db	%00000000,
	%00000000,
	%00000000,
	%00000000,
	%00000000,
	%00000001,
	%00000011,
	%00000111

sprite_eet_shield_01:
db	%00001111,
	%00001111,
	%00001111

sprite_eet_shield_02:
db	%00000111,
	%00000011,
	%00000001,
	%00000000,
	%00000000,
	%00000000,
	%00000000,
	%00000000

; These will be automatically populated by random garbage.
sprite_band1:
db	0,0,0,0,0,0,0,0

sprite_band2:
db	0,0,0,0,0,0,0,0

; -------------------------------------------------------------------------------------------------------------------- ;
; DATA:                                                                                                                ;
; -------------------------------------------------------------------------------------------------------------------- ;
stash_region:
db	0,0,0,0,0,0,0,0,
	0,0,0,0,0,0,0,0
