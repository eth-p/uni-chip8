;------------------------------------------------------------------------------------------------;
; CHIP 8 DINO GAME
; Version: 1.0
; Anthony Pham
; - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -;
; This program was designed to be assembled with https://github.com/wernsey/chip8
;------------------------------------------------------------------------------------------------;

;------------------------------------------------------------------------------------------------;
; DEFINE
;------------------------------------------------------------------------------------------------;
define score V5
define sound_timer VC
define jump_height VD
define temp VE
define obstacle_index V0

define MAX_JUMP_HEIGHT 15
define JUMP_SPEED 5
define OBSTACLE_SPEED 4

define dino_x VA
define dino_y VB
define animation_x V1
define animation_y V2
;------------------------------------------------------------------------------------------------;
; ENTRY
;------------------------------------------------------------------------------------------------;

init: 
    LD score, 0
    LD sound_timer, 5
    CALL animate_ground
    CALL dino_animation
    CALL start_screen
    LD temp, K
    CALL start_screen
    CALL init_score
    CALL init_obstacle
    JP loop
;-------------------------------------------------------------------------------------------------;
; GAME LOOP
;-------------------------------------------------------------------------------------------------;

loop: 
    LD temp, 1
    SKNP temp
    CALL dino_jump

    CALL dino_run
    CALL render_obstacle
    JP loop

;-------------------------------------------------------------------------------------------------;
; OBSTACLE ANIMATION
;-------------------------------------------------------------------------------------------------;
init_obstacle:
    LD animation_x, 56
    LD animation_y, 25

    LD I, obstacle0
    DRW animation_x, animation_y, 6
    RET

load_obstacle:
    SNE obstacle_index, 0
    LD I, obstacle0

    SNE obstacle_index, 1
    LD I, obstacle1

    SNE obstacle_index, 2
    LD I, obstacle2

    SNE obstacle_index, 3
    LD I, obstacle3

    RET

render_obstacle:
    CALL load_obstacle
    
    DRW animation_x, animation_y, 6
    LD temp, OBSTACLE_SPEED
    ADD temp, V9
    SUB animation_x, temp
    DRW animation_x, animation_y, 6

    SNE animation_x, 0
    CALL reset_obstacle
    
    CALL check_collision

    RET

reset_obstacle:
    RND V9, 2
    
    DRW animation_x, animation_y, 6
    
    LD animation_x, 56
    LD animation_y, 25

    SUB animation_x, V9

    RND obstacle_index, 3
    CALL load_obstacle
    DRW animation_x, animation_y, 6

    SE obstacle_index, 0
    CALL set_score
    
    RET

check_collision:
    SE VF, 1
    RET
    JP game_over
    
;-------------------------------------------------------------------------------------------------;
; DINOSAUR ANIMATION
;-------------------------------------------------------------------------------------------------;
dino_animation:
    LD dino_x, 10
    LD dino_y, 26
    LD I, dino
    DRW dino_x, dino_y, 5
    RET

dino_run:
    LD I, dino
    DRW dino_x, dino_y, 5
   
    LD I, dino_left
    DRW dino_x, dino_y, 5 
    DRW dino_x, dino_y, 5
    
    LD I, dino_right
    DRW dino_x, dino_y, 5
    DRW dino_x, dino_y, 5
    
    LD I, dino
    DRW dino_x, dino_y, 5
    RET

dino_jump:
    SNE jump_height, MAX_JUMP_HEIGHT
    JP dino_land

    LD temp, JUMP_SPEED
    ADD jump_height, temp
    LD I, dino
    DRW dino_x, dino_y, 5
    SUB dino_y, temp
    DRW dino_x, dino_y, 5

    CALL render_obstacle
    
    SNE jump_height, MAX_JUMP_HEIGHT
    LD ST, sound_timer

    JP dino_jump

dino_land:
    SNE jump_height, 0
    RET

    LD temp, JUMP_SPEED
    SUB jump_height, temp
    LD I, dino
    DRW dino_x, dino_y, 5   
    ADD dino_y, temp
    DRW dino_x, dino_y, 5

    CALL render_obstacle

    JP dino_land
;-------------------------------------------------------------------------------------------------;
; BACKGROUND
;-------------------------------------------------------------------------------------------------;
init_score:
    LD I, number
    LD V6, 56
    LD V7, 6
    DRW V6, V7, 6
    LD V6, 48
    DRW V6, V7, 6
    RET

set_score:
    LD V6, 56
    LD V7, 6

    LD I, number
    ADD I, score
    DRW V6, V7, 6

    LD temp, 6
    ADD score, temp

    SNE score, 60
    JP draw_digit

    LD I, number
    ADD I, score
    DRW V6, V7, 6
    RET

draw_digit:
    LD score, 0
    LD V6, 48

    LD I, number
    ADD I, V8
    DRW V6, V7, 6
    
    LD temp, 6
    ADD V8, 6

    LD I, number
    ADD I, V8
    DRW V6, V7, 6

    LD I, number
    LD V6, 56
    DRW V6, V7, 6   
       
    RET
game_over:
    LD I, letter_g
    LD animation_x, 16
    LD animation_y, 6
    DRW animation_x, animation_y, 6

    LD I, letter_a
    LD animation_x, 24
    LD animation_y, 6
    DRW animation_x, animation_y, 6

    LD I, letter_m
    LD animation_x, 32
    LD animation_y, 6
    DRW animation_x, animation_y, 6

    LD I, letter_e
    LD animation_x, 40
    LD animation_y, 6
    DRW animation_x, animation_y, 6

    LD I, letter_o
    LD animation_x, 16
    LD animation_y, 16
    DRW animation_x, animation_y, 6

    LD I, letter_v
    LD animation_x, 24
    LD animation_y, 16
    DRW animation_x, animation_y, 6

    LD I, letter_e
    LD animation_x, 32
    LD animation_y, 16
    DRW animation_x, animation_y, 6

    LD I, letter_r
    LD animation_x, 40
    LD animation_y, 16
    DRW animation_x, animation_y, 6

    LD I, number
    ADD I, score
    DRW V6, V7, 6

    LD I, number
    ADD I, V8
    LD V6, 48
    DRW V6, V7, 6

    JP halt

start_screen:
    LD I, letter_s
    LD animation_x, 16
    LD animation_y, 6
    DRW animation_x, animation_y, 6

    LD I, letter_t
    LD animation_x, 24
    LD animation_y, 6
    DRW animation_x, animation_y, 6

    LD I, letter_a
    LD animation_x, 32
    LD animation_y, 6
    DRW animation_x, animation_y, 6

    LD I, letter_r
    LD animation_x, 40
    LD animation_y, 6
    DRW animation_x, animation_y, 6

    LD I, letter_t
    LD animation_x, 48
    LD animation_y, 6
    DRW animation_x, animation_y, 6

    RET
 
animate_ground:
    LD animation_x, 0
    LD animation_y, 31
	LD I, ground

animate_ground_loop:
	SNE animation_x, 64
	RET

	DRW animation_x, animation_y, 1
	ADD animation_x, 8

	JP animate_ground_loop

;--------------------------------------------------------------------------------------------------;
; SUPPORT
;--------------------------------------------------------------------------------------------------;

mult:
    SNE V7, 0 
    RET

    LD temp, 1
    SUB V7, temp  

    ADD V6, 6
    JP mult

halt:
    LD temp, K
    JP halt

;-------------------------------------------------------------------------------------------------;
; DESIGN
;-------------------------------------------------------------------------------------------------;

obstacle0:
db  %000000,  
    %000000,
    %000000,
    %000000,
    %000000,
    %000000 

obstacle1:
db  %000000,
    %000000,
    %000000,
    %000001,
    %000001,
    %000001

obstacle2:
db  %10000001,
    %10000001,
    %01000010,
    %00100100,
    %00011000,
    %11111111

obstacle3:
db  %10001001,
    %10001001,
    %10001001,
    %10001001,
    %10001001,
    %11111111

dino:
db  %00111,
    %10101,
    %01110,
    %00110,
    %01001

dino_left:
db  %00111,
    %10101,
    %01110,
    %00110,
    %00001

dino_right:
db  %00111,
    %10101,
    %01110,
    %00110,
    %01000

ground:
db  %11111111

space:
db  %00000000,
    %00000000,
    %00000000,
    %00000000,
    %00000000,
    %00000000

letter_p:
db  %01111110,
    %01100110,
    %01101100,
    %01111000,
    %01100000,
    %01100000

letter_r:
db  %01111110,
    %01100110,
    %01101100,
    %01111000,
    %01101100,
    %01100110

letter_e:
db  %01111110,
    %01100000,
    %01111110,
    %01000000,
    %01100000,
    %01111110
    
letter_s:
db  %00111110,
    %01000000,
    %00111110,
    %00000010,
    %00000100,
    %01111000

letter_t:
db  %01111110,
    %00011000,
    %00011000,
    %00011000,
    %00011000,
    %00011000

letter_o:
db  %00111100,
    %01000010,
    %01000010,
    %01000010,
    %01000010,
    %00111100

letter_a:
db  %00011000,
    %01100110,
    %01111110,
    %01100110,
    %01100110,
    %01100110
letter_g:
db  %00111110,
    %01000000,
    %01100000,
    %01100110,
    %01000010,
    %00111110

letter_m:
db  %00101000,
    %01010100,
    %01010100,
    %01010100,
    %01010100,
    %01010100

letter_v:
db  %01000100,
    %01000100,
    %01000100,
    %00100100,
    %00101000,
    %00010000

number:
db  %00111100,
    %01000010,
    %10000010,
    %10000010,
    %01000010,
    %00111100

db  %00011000,
    %00101000,
    %00001000,
    %00001000,
    %00001000,
    %00001000

db  %00111100,
    %01000010,
    %00000100,
    %00001000,
    %00010000,
    %01111110

db  %01111100,
    %00000010,
    %00111100,
    %00000010,
    %00000010,
    %01111100

db  %00000110,
    %00010010,
    %01111110,
    %00000010,
    %00000010,
    %00000010

db  %01111110,
    %01000000,
    %00111100,
    %00000010,
    %00000010,
    %01111100

db  %00111110,
    %01000000,
    %01111100,
    %01000010,
    %01000010,
    %00111100

db  %11111110,
    %00000010,
    %00011110,
    %00001000,
    %00010000,
    %00100000

db  %00011000,
    %00100100,
    %00111100,
    %01000010,
    %01000010,
    %00111100

db  %00011000,
    %00100100,
    %00011100,
    %00000100,
    %00000100,
    %00111000
