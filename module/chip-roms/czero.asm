; -------------------------------------------------------------------------------------------------------------------- ;
; C-ZERO                                                                                                               ;
; Copyright (C) 2019 Ethan Pini                                                                                        ;
; - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -;
; This program was designed to be assembled with https://github.com/wernsey/chip8                                      ;
; -------------------------------------------------------------------------------------------------------------------- ;
define FALCON_X 28       ; 64/2 - 8/2
define FALCON_Y 26       ; 32 - 5 - 1
define FALCON_SMOKE_Y 23
define FALCON_HEIGHT 5
define FALCON_MAX_SPEED 4
define FALCON_FORWARDS 1
define FALCON_LEFT     0
define FALCON_RIGHT    2
define ROAD_CENTER 1
define ROAD_LEFT 0
define ROAD_RIGHT 2

define MAP_CENTER_INITIAL 128
define MAP_WIDTH 50
define MAP_GEN_LBOUND 75
define MAP_GEN_RBOUND 180

define COUNTDOWN_NUM_X 30
define COUNTDOWN_GO_X 27

define FALCON_ANIMATION_EXPLODE_FRAMES 4
define FALCON_ANIMATION_EXPLODE_SMOKE_FRAMES 10

define KEY_LEFT #7
define KEY_RIGHT #9
define KEY_DRIVE #5
define KEY_BRAKE #8

define temp1 V1
define temp2 V2
define temp3 V3
define ioptemp V4
define ioptemp2 V5
define ioptemp3 V8

define output V5
define mul_multiplicand V8
define mul_multiplier V9

define frame V6
define road_type V7
define map_change V0
define map_center VA
define falcon_center VB
define falcon_frame VC
define falcon_speed VD
define falcon_direction VE

; -------------------------------------------------------------------------------------------------------------------- ;
define TILE_LAYER1_HEIGHT 5
define TILE_LAYER1_DRIFTL 0
define TILE_LAYER1_DRIFTR 0
define TILE_LAYER1_Y      27
define TILE_LAYER1_XL     8
define TILE_LAYER1_XR     52

define TILE_LAYER2_HEIGHT 5
define TILE_LAYER2_DRIFTL 1
define TILE_LAYER2_DRIFTR 3
define TILE_LAYER2_Y      22
define TILE_LAYER2_XL     10
define TILE_LAYER2_XR     50

define TILE_LAYER3_HEIGHT 4
define TILE_LAYER3_DRIFTL 1
define TILE_LAYER3_DRIFTR 6
define TILE_LAYER3_Y      18
define TILE_LAYER3_XL     12
define TILE_LAYER3_XR     49

define TILE_LAYER4_HEIGHT 4
define TILE_LAYER4_DRIFTL 2
define TILE_LAYER4_DRIFTR 9
define TILE_LAYER4_Y      14
define TILE_LAYER4_XL     14
define TILE_LAYER4_XR     47

define TILE_LAYER5_HEIGHT 3
define TILE_LAYER5_DRIFTL 2
define TILE_LAYER5_DRIFTR 12
define TILE_LAYER5_Y      11
define TILE_LAYER5_XL     16
define TILE_LAYER5_XR     46

define TILE_LAYER6_HEIGHT 3
define TILE_LAYER6_DRIFTL 3
define TILE_LAYER6_DRIFTR 15
define TILE_LAYER6_Y      8
define TILE_LAYER6_XL     18
define TILE_LAYER6_XR     44

define TILE_LAYER7_HEIGHT 2
define TILE_LAYER7_DRIFTL 3
define TILE_LAYER7_DRIFTR 18
define TILE_LAYER7_Y      6
define TILE_LAYER7_XL     20
define TILE_LAYER7_XR     43

; -------------------------------------------------------------------------------------------------------------------- ;
; ENTRY:                                                                                                               ;
; -------------------------------------------------------------------------------------------------------------------- ;
entry:
	CALL copyright

	LD map_center, MAP_CENTER_INITIAL
	LD road_type, ROAD_CENTER
	LD frame, 0
	LD falcon_speed, 1
	LD falcon_center, map_center
	LD falcon_direction, FALCON_FORWARDS

	; Start direction.
	LD map_change, 1
	RND temp1, 1
	LD map_change, 254

setup_scene:
	CALL draw_falcon
	CALL draw_tile_layer1
	CALL draw_tile_layer2
	CALL draw_tile_layer3
	CALL draw_tile_layer4
	CALL draw_tile_layer5
	CALL draw_tile_layer6
	CALL draw_tile_layer7
	LD temp3, 1
	LD ioptemp, 3
	JP countdown

; -------------------------------------------------------------------------------------------------------------------- ;
; COUNTDOWN:                                                                                                           ;
; -------------------------------------------------------------------------------------------------------------------- ;
countdown:
	SNE ioptemp, 0
	JP countdown_finish
	CALL draw_countdown

	; Play sound.
	LD temp1, 30      ; 500 ms
	LD DT, temp1
	LD ST, temp1
	CALL wait

	; Wait until next second.
	LD temp1, 30      ; 500 ms
	LD DT, temp1
	CALL wait
	CALL draw_countdown
	SUB ioptemp, temp3
	JP countdown

countdown_finish:
	CALL draw_countdown_go
	LD temp1, 60
	LD ST, temp1
	LD DT, temp1
	CALL wait
	CALL draw_countdown_go
	JP loop

; -------------------------------------------------------------------------------------------------------------------- ;
; GAME OVER:                                                                                                           ;
; -------------------------------------------------------------------------------------------------------------------- ;
game_over:
	SNE falcon_frame, 1
	CALL draw_falcon_engine
	CALL draw_falcon
	LD falcon_frame, 0
	LD falcon_direction, 0
	LD falcon_speed, 0
	CALL draw_falcon_explosion
	CALL draw_falcon_explosion_smoke

game_over_loop:
	LD ioptemp, 1

	; Animate explosion.
	LD DT, ioptemp
	ADD falcon_frame, 1
	SNE falcon_frame, FALCON_ANIMATION_EXPLODE_FRAMES
	LD falcon_frame, 1
	CALL draw_falcon_explosion
	CALL game_over_sounds

	; Animate smoke.
	LD DT, ioptemp

	ADD falcon_speed, 1
	SE falcon_speed, 3
		JP game_over_loop_nosmoke

	LD falcon_speed, 0
	ADD falcon_direction, 1
	SNE falcon_direction, FALCON_ANIMATION_EXPLODE_SMOKE_FRAMES
	LD falcon_direction, 1
	CALL draw_falcon_explosion_smoke

	game_over_loop_nosmoke:
		CALL game_over_sounds

	; Loop.
	JP game_over_loop

game_over_sounds:
	LD temp1, 1
	LD temp2, 3
	LD temp3, 1
	game_over_sound_loop:
		LD ST, temp1
		CALL wait
		LD DT, temp1
		SUB temp2, temp3

		SE temp2, 0
		RET
		JP game_over_sound_loop

; -------------------------------------------------------------------------------------------------------------------- ;
; LOOP:                                                                                                                ;
; -------------------------------------------------------------------------------------------------------------------- ;
loop:
	LD temp1, 1
	LD DT, temp1

	; Handle turning.
	CALL input

	; Handle accel
	SNE frame, 0
	CALL tick2
	ADD frame, 1
	SNE frame, 7
	LD frame, 0

	; Movement and collision.
	CALL tick

	; Animate engine.
	CALL animate_engine

	; Sounds.
	LD ST, falcon_speed

	; Repeat
	CALL wait
	JP loop

animate_engine:
	SNE falcon_speed, 0
		JP animate_engine_off

	ADD falcon_frame, 1
	SNE falcon_frame, 2
		LD falcon_frame, 0
	CALL draw_falcon_engine
	RET

animate_engine_off:
	SE falcon_frame, 1
		RET

	CALL draw_falcon_engine
	LD falcon_frame, 0
	RET

tick:
	; Handle movement.
	SNE falcon_direction, FALCON_LEFT
	SUB falcon_center, falcon_speed
	SNE falcon_direction, FALCON_RIGHT
	ADD falcon_center, falcon_speed

	; Handle road type.
	LD temp1, map_center
	LD temp2, map_center
	LD temp3, 10
	LD ioptemp, road_type
	LD road_type, ROAD_CENTER

	ADD temp1, temp3 ; Maximum
	SUB temp2, temp3 ; Minimum

	SUB temp1, falcon_center
	SE VF, 1
	LD road_type, ROAD_LEFT

	SUB temp2, falcon_center
	SNE VF, 1
	LD road_type, ROAD_RIGHT

	SE road_type, ioptemp
	CALL redraw_road_type

	; Handle collision.
	LD temp1, map_center
	LD temp2, map_center
	LD temp3, MAP_WIDTH

	ADD temp1, temp3 ; Maximum
	SUB temp2, temp3 ; Minimum

	SUB temp1, falcon_center
	SE VF, 1
	JP game_over

	SUB temp2, falcon_center
	SNE VF, 1
	JP game_over

	RET

tick2:
	CALL input2

	LD ioptemp, 0
	tick2_drive:
		SNE ioptemp, falcon_speed
			RET

		ADD ioptemp, 1
		CALL drive
		JP tick2_drive


drive:
	; Handle map generation.
	ADD map_center, map_change

	LD temp2, MAP_GEN_LBOUND
	LD temp3, MAP_GEN_RBOUND

	; Hits the left edge.
	SUBN temp2, map_center
	SE VF, 1
		JP change_map_right

	; Hits the right edge.
	SUB temp3, map_center
	SE VF, 1
		JP change_map_left

	RET

change_map_left:
	LD map_change, 254
	RET

change_map_right:
	LD map_change, 1
	RET

redraw_road_type:
	LD ioptemp3, road_type
	LD road_type, ioptemp
	CALL draw_tile_layer1
	CALL draw_tile_layer2
	CALL draw_tile_layer3
	CALL draw_tile_layer4
	CALL draw_tile_layer5
	CALL draw_tile_layer6
	CALL draw_tile_layer7
	LD road_type, ioptemp3
	CALL draw_tile_layer1
	CALL draw_tile_layer2
	CALL draw_tile_layer3
	CALL draw_tile_layer4
	CALL draw_tile_layer5
	CALL draw_tile_layer6
	CALL draw_tile_layer7
	RET

; -------------------------------------------------------------------------------------------------------------------- ;
; INPUT:                                                                                                               ;
; -------------------------------------------------------------------------------------------------------------------- ;
input2:
	LD temp1, 1
	LD temp2, falcon_speed

	LD temp3, KEY_DRIVE
	SKNP temp3
	CALL input2_drive

	LD temp3, KEY_BRAKE
	SKNP temp3
	CALL input2_brake

	RET

input2_drive:
	; Prevent both buttons.
	LD temp3, KEY_BRAKE
	SKNP temp3
	RET

	; Speed up.
	ADD falcon_speed, temp1

	; Ensure upper limit.
	LD temp1, FALCON_MAX_SPEED
	SUB temp1, falcon_speed
	SNE VF, 0
	LD falcon_speed, FALCON_MAX_SPEED
	RET

input2_brake:
	; Prevent both buttons.
	LD temp3, KEY_DRIVE
	SKNP temp3
	RET

	; Speed up.
	SUB falcon_speed, temp1

	; Ensure lower limit.
	LD temp1, FALCON_MAX_SPEED
	SUB temp1, falcon_speed
	SNE VF, 0
	LD falcon_speed, 0
	RET

input:
	LD temp1, 1
	LD temp2, falcon_direction
	LD falcon_direction, FALCON_FORWARDS

	LD temp3, KEY_LEFT
	SKNP temp3
	SUB falcon_direction, temp1

	LD temp3, KEY_RIGHT
	SKNP temp3
	ADD falcon_direction, temp1

	SNE falcon_direction, temp2
	RET

input_redraw:
	; Remove old Falcon.
	LD ioptemp, falcon_direction
	LD falcon_direction, temp2
	CALL draw_falcon

	; Remove old engine trail.
	SNE falcon_frame, 1
	CALL draw_falcon_engine

	; Add new Falcon.
	LD falcon_direction, ioptemp
	CALL draw_falcon

	; Add new engine trail.
	SNE falcon_frame, 1
	CALL draw_falcon_engine

	; Return
	RET

; -------------------------------------------------------------------------------------------------------------------- ;
; HALT:                                                                                                                ;
; This halts execution.                                                                                                ;
; -------------------------------------------------------------------------------------------------------------------- ;
halt:
	LD VF, K
	JP halt

; -------------------------------------------------------------------------------------------------------------------- ;
; MUL:                                                                                                                 ;
; Multiples two numbers.                                                                                               ;
; -------------------------------------------------------------------------------------------------------------------- ;
mul:
	LD temp1, mul_multiplicand
	LD temp2, 1
	LD output, 0

	mul_loop:
		SNE temp1, 0
		RET

		ADD output, mul_multiplier
		SUB temp1, temp2
		JP mul_loop


; -------------------------------------------------------------------------------------------------------------------- ;
; DRAW:                                                                                                                ;
; -------------------------------------------------------------------------------------------------------------------- ;
draw_falcon:
	SNE falcon_direction, FALCON_RIGHT
	JP draw_falcon_right
	SNE falcon_direction, FALCON_LEFT
	JP draw_falcon_left
	JP draw_falcon_forwards

draw_falcon_left:
	LD I, sprite_falcon_left
	LD temp1, FALCON_X
	LD temp2, FALCON_Y
	DRW temp1, temp2, FALCON_HEIGHT
	RET

draw_falcon_right:
	LD I, sprite_falcon_right
	LD temp1, FALCON_X
	LD temp2, FALCON_Y
	DRW temp1, temp2, FALCON_HEIGHT
	RET

draw_falcon_forwards:
	LD I, sprite_falcon_forwards
	LD temp1, FALCON_X
	LD temp2, FALCON_Y
	DRW temp1, temp2, FALCON_HEIGHT
	RET

draw_falcon_engine:
	SNE falcon_direction, FALCON_RIGHT
	JP draw_falcon_right_engine
	SNE falcon_direction, FALCON_LEFT
	JP draw_falcon_left_engine
	JP draw_falcon_forwards_engine

draw_falcon_left_engine:
	LD I, sprite_falcon_left_engine
	LD temp1, FALCON_X
	LD temp2, FALCON_Y
	DRW temp1, temp2, FALCON_HEIGHT
	RET

draw_falcon_right_engine:
	LD I, sprite_falcon_right_engine
	LD temp1, FALCON_X
	LD temp2, FALCON_Y
	DRW temp1, temp2, FALCON_HEIGHT
	RET

draw_falcon_forwards_engine:
	LD I, sprite_falcon_forwards_engine
	LD temp1, FALCON_X
	LD temp2, FALCON_Y
	DRW temp1, temp2, FALCON_HEIGHT
	RET

draw_falcon_explosion:
	LD mul_multiplier, falcon_frame
	LD mul_multiplicand, FALCON_HEIGHT
	CALL mul

	LD temp1, FALCON_X
	LD temp2, FALCON_Y
	LD I, sprite_falcon_explode
	ADD I, output
	DRW temp1, temp2, FALCON_HEIGHT
	RET

draw_falcon_explosion_smoke:
	LD mul_multiplier, falcon_direction
	LD mul_multiplicand, FALCON_HEIGHT
	CALL mul

	LD temp1, FALCON_X
	LD temp2, FALCON_SMOKE_Y
	LD I, sprite_falcon_explode_smoke
	ADD I, output
	DRW temp1, temp2, FALCON_HEIGHT
	RET

draw_tile_adjust_coords:
	SNE road_type, ROAD_LEFT
	JP draw_tile_adjust_coords_left
	SNE road_type, ROAD_RIGHT
	JP draw_tile_adjust_coords_right
	RET

draw_tile_adjust_coords_left:
	SUB temp2, output
	SUB temp3, ioptemp
	RET

draw_tile_adjust_coords_right:
	ADD temp2, ioptemp
	ADD temp3, output
	RET

draw_tile_layer1:
	LD I, tile_layer1
	LD temp2, TILE_LAYER1_XL
	LD temp3, TILE_LAYER1_XR
	LD ioptemp, TILE_LAYER1_DRIFTL
	LD output, TILE_LAYER1_DRIFTR
	LD temp1, TILE_LAYER1_Y
	CALL draw_tile_adjust_coords
	DRW temp2, temp1, TILE_LAYER1_HEIGHT
	DRW temp3, temp1, TILE_LAYER1_HEIGHT
	RET

draw_tile_layer2:
	LD I, tile_layer2
	LD temp2, TILE_LAYER2_XL
	LD temp3, TILE_LAYER2_XR
	LD ioptemp, TILE_LAYER2_DRIFTL
	LD output, TILE_LAYER2_DRIFTR
	CALL draw_tile_adjust_coords
	LD temp1, TILE_LAYER2_Y
	DRW temp2, temp1, TILE_LAYER2_HEIGHT
	DRW temp3, temp1, TILE_LAYER2_HEIGHT
	RET

draw_tile_layer3:
	LD I, tile_layer3
	LD temp2, TILE_LAYER3_XL
	LD temp3, TILE_LAYER3_XR
	LD ioptemp, TILE_LAYER3_DRIFTL
	LD output, TILE_LAYER3_DRIFTR
	CALL draw_tile_adjust_coords
	LD temp1, TILE_LAYER3_Y
	DRW temp2, temp1, TILE_LAYER3_HEIGHT
	DRW temp3, temp1, TILE_LAYER3_HEIGHT
	RET

draw_tile_layer4:
	LD I, tile_layer4
	LD temp2, TILE_LAYER4_XL
	LD temp3, TILE_LAYER4_XR
	LD ioptemp, TILE_LAYER4_DRIFTL
	LD output, TILE_LAYER4_DRIFTR
	CALL draw_tile_adjust_coords
	LD temp1, TILE_LAYER4_Y
	DRW temp2, temp1, TILE_LAYER4_HEIGHT
	DRW temp3, temp1, TILE_LAYER4_HEIGHT
	RET

draw_tile_layer5:
	LD I, tile_layer5
	LD temp2, TILE_LAYER5_XL
	LD temp3, TILE_LAYER5_XR
	LD ioptemp, TILE_LAYER5_DRIFTL
	LD output, TILE_LAYER5_DRIFTR
	CALL draw_tile_adjust_coords
	LD temp1, TILE_LAYER5_Y
	DRW temp2, temp1, TILE_LAYER5_HEIGHT
	DRW temp3, temp1, TILE_LAYER5_HEIGHT
	RET

draw_tile_layer6:
	LD I, tile_layer6
	LD temp2, TILE_LAYER6_XL
	LD temp3, TILE_LAYER6_XR
	LD ioptemp, TILE_LAYER6_DRIFTL
	LD output, TILE_LAYER6_DRIFTR
	CALL draw_tile_adjust_coords
	LD temp1, TILE_LAYER6_Y
	DRW temp2, temp1, TILE_LAYER6_HEIGHT
	DRW temp3, temp1, TILE_LAYER6_HEIGHT
	RET

draw_tile_layer7:
	LD I, tile_layer7
	LD temp2, TILE_LAYER7_XL
	LD temp3, TILE_LAYER7_XR
	LD ioptemp, TILE_LAYER7_DRIFTL
	LD output, TILE_LAYER7_DRIFTR
	CALL draw_tile_adjust_coords
	LD temp1, TILE_LAYER7_Y
	DRW temp2, temp1, TILE_LAYER7_HEIGHT
	DRW temp3, temp1, TILE_LAYER7_HEIGHT
	RET

draw_countdown:
	; Calculate sprite.
	LD mul_multiplicand, 5
	LD mul_multiplier, ioptemp
	CALL mul
	LD I, sprite_countdown
	ADD I, output

	; Draw.
	LD temp1, COUNTDOWN_NUM_X
	LD temp2, 1
	DRW temp1, temp2, 5
	RET

draw_countdown_go:
	LD temp1, 1
	LD temp2, COUNTDOWN_GO_X
	LD temp3, temp2
	ADD temp3, 8
	LD I, sprite_go0
	DRW temp2, temp1, 5
	LD I, sprite_go1
	DRW temp3, temp1, 5
	RET

; -------------------------------------------------------------------------------------------------------------------- ;
; WAIT:                                                                                                                ;
; -------------------------------------------------------------------------------------------------------------------- ;
wait:
	LD VF, DT
	SE VF, 0
	JP wait
	RET

; -------------------------------------------------------------------------------------------------------------------- ;
; SPRITES:                                                                                                             ;
; -------------------------------------------------------------------------------------------------------------------- ;
sprite_falcon_forwards:
db	%00011000,
	%01111110,
	%10100101,
	%01111110,
	%00000000

sprite_falcon_forwards_engine:
db	%00000000,
	%00000000,
	%01000010,
	%00000000,
	%01000010

sprite_falcon_right:
db	%00101100,
	%01011110,
	%00110111,
	%00011101,
	%00000010

sprite_falcon_right_engine:
db	%00000000,
	%00100000,
	%01000000,
	%10000010,
	%00000100

sprite_falcon_left:
db	%00110100,
	%01111010,
	%11101100,
	%10111000,
	%01000000

sprite_falcon_left_engine:
db	%00000000,
	%00000100,
	%00000010,
	%01000001,
	%00100000

sprite_falcon_explode:
db	%00000000,
	%00000000,
	%00111100,
	%01000010,
	%10011001

db	%00000000,
	%00000000,
	%00111100,
	%01000010,
	%10000001

db	%00000000,
	%00000000,
	%00000000,
	%00111100,
	%01011010

db	%00000000,
	%00000000,
	%00111100,
	%01111110,
	%11011011

sprite_falcon_explode_smoke:
db	%00000000,
	%00000000,
	%00000000,
	%00000000,
	%00010000

db	%00000000,
	%00000000,
	%00000000,
	%00100000,
	%00010000

db	%00000000,
	%00000000,
	%01000000,
	%00100000,
	%00001000

db	%00000000,
	%00100000,
	%01000000,
	%00000100,
	%00001000

db	%00010000,
	%00100000,
	%00001000,
	%00000100,
	%01000000

db	%00010000,
	%00010000,
	%00001000,
	%00100000,
	%01000100

db	%00100000,
	%00010000,
	%01000000,
	%00101000,
	%00000100

db	%00100000,
	%01000000,
	%01000100,
	%00001000,
	%00000000

db	%00100000,
	%01000100,
	%00000100,
	%00000000,
	%00000000

db	%00100000,
	%00000100,
	%00000000,
	%00000000,
	%00010000

sprite_countdown:
db  0,0,0,0,0

db	%01100000,
	%10100000,
	%00100000,
	%00100000,
	%11111000

db	%11111000,
	%00001000,
	%11111000,
	%10000000,
	%11111000

db	%11111000,
	%00001000,
	%11111000,
	%00001000,
	%11111000

sprite_go0:
db	%11111011,
	%10000010,
	%10111010,
	%10001010,
	%11111011

sprite_go1:
db	%11100000,
	%00100000,
	%00100000,
	%00100000,
	%11100000

; -------------------------------------------------------------------------------------------------------------------- ;
; TILES:                                                                                                               ;
; -------------------------------------------------------------------------------------------------------------------- ;
tile_layer1:
tile_layer2:
db	%01110000,
	%10001000,
	%10001000,
	%10001000,
	%01110000

tile_layer3:
tile_layer4:
db	%01100000,
	%10010000,
	%10010000,
	%01100000

tile_layer5:
tile_layer6:
db	%01000000,
	%10100000,
	%01000000

tile_layer7:
db	%11000000,
	%11000000

; -------------------------------------------------------------------------------------------------------------------- ;
; COPYRIGHT:                                                                                                           ;
; -------------------------------------------------------------------------------------------------------------------- ;
copyright:
	; Draw Title
	LD V1, 5
	LD V2, 16
	LD V3, 4
	LD V4, 1

	LD I, title_sprites
	copyright_draw_title:
		DRW V2, V1, 9

		LD V0, 9
		ADD I, V0
		ADD V2, 8
		SUB V3, V4
		SE V3, 0
		JP copyright_draw_title

	; Draw Year
	LD V1, 24
	LD V2, 1
	LD V3, 8
	LD V4, 1
	LD I, copyright_sprites
	copyright_draw_copyright:
		DRW V2, V1, 7

		LD V0, 7
		ADD I, V0
		ADD V2, 8
		SUB V3, V4
		SE V3, 0
		JP copyright_draw_copyright

	; Wait 4 seconds or until input.
	LD V2, 1
	LD V0, 240
	LD DT, V0
	copyright_wait:
		LD V0, DT
		SNE V0, 0
		JP copyright_cleanup

		LD V1, 16
		copyright_wait_cancel:
			SKNP V1
				JP copyright_cleanup
			SNE V1, 0
				JP copyright_wait
			SUB V1, V2
			JP copyright_wait_cancel

	copyright_cleanup:
		LD V0, 0
		LD DT, V0
		CLS
		RET

title_sprites:
db	%11111000,
	%10000000,
	%10000011,
	%10000000,
	%11111000,
	%00000000,
	%11001110,
	%01001010,
	%01101110

db	%00011111,
	%00000010,
	%11000100,
	%00001000,
	%00011111,
	%00000000,
	%11001110,
	%01001110,
	%11100010

db	%01111011,
	%01000010,
	%01111011,
	%01000011,
	%01111010,
	0,0,0,0

db	%11011110,
	%01010010,
	%11010010,
	%00010010,
	%11011110,
	0,0,0,0

copyright_sprites:
db	%11111110,
	%10000010,
	%10111010,
	%10100010,
	%10111010,
	%10000010,
	%11111110

db	%00000000,
	%11110111,
	%10000001,
	%11110001,
	%10000001,
	%11110001,
	%00000000

db	%00000000,
	%11010001,
	%00010001,
	%00011111,
	%00010001,
	%00010001,
	%00000000

db	%00000000,
	%01111010,
	%01001011,
	%01111010,
	%01001010,
	%01001010,
	%00000000

db	%00000000,
	%00100000,
	%00100000,
	%10100000,
	%01100000,
	%00100000,
	%00000000

pini_sprites:
db	%00000000,
	%11110111,
	%10010001,
	%11110001,
	%10000001,
	%10000111,
	%00000000

db	%00000000,
	%11010001,
	%00011001,
	%00010101,
	%00010011,
	%11010001,
	%00000000

db	%00000000,
	%01111100,
	%00010000,
	%00010000,
	%00010000,
	%01111100,
	%00000000
