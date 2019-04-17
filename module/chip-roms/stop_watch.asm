; -------------------------------------------------------------------------------------------------------------------- ;
; This program was designed to be assembled with https://github.com/wernsey/chip8                                      ;
; -------------------------------------------------------------------------------------------------------------------- ;

;--------------------------------------------------------------------------------------------------;
; DEFINE
;--------------------------------------------------------------------------------------------------;
define key V0
define digit1 V1
define digit2 V2
define digit3 V3
define digit4 V4
define digit5 V5
define digit6 V6
define x VA
define y VB

;--------------------------------------------------------------------------------------------------;
; ENTRY
;--------------------------------------------------------------------------------------------------;
init:
    LD x, 0
    LD y, 6

    LD digit1, 0
    LD digit2, 0
    LD digit3, 0
    LD digit4, 0
    LD digit5, 0
    LD digit6, 0

    CALL init_clock
    LD key, K
    JP loop
;--------------------------------------------------------------------------------------------------;
; LOOP
;-------------------------------------------------------------------------------------------------;
loop:
    LD key, 1
    SKNP key
    JP halt
    
    render_digits:
        JP digit_6

    LD VD, #10
    LD DT, VD
    CALL wait
    JP loop

;--------------------------------------------------------------------------------------------------;
; CLOCK FUNCTION
;--------------------------------------------------------------------------------------------------;
digit_6:
    SNE digit6, 60 
    JP digit_5

    CALL draw_digit_6
    ADD digit6, 6
    CALL draw_digit_6

    JP loop

digit_5:
    SNE digit5, 30 
    JP digit_4

    CALL draw_digit_6
    CALL draw_digit_5
    
    LD digit6, 0
    ADD digit5, 6

    CALL draw_digit_6
    CALL draw_digit_5

    JP loop

digit_4:
    SNE digit4, 54 
    JP digit_3

    CALL draw_digit_6
    CALL draw_digit_5
    CALL draw_digit_4
    
    LD digit6, 0
    LD digit5, 0
    ADD digit4, 6

    CALL draw_digit_6
    CALL draw_digit_5
    CALL draw_digit_4

    JP loop

digit_3:
    SNE digit3, 30
    JP digit_2

    CALL draw_digit_6
    CALL draw_digit_5
    CALL draw_digit_4
    CALL draw_digit_3
    

    LD digit6, 0
    LD digit5, 0
    LD digit4, 0
    ADD digit3, 6
    
    CALL draw_digit_6
    CALL draw_digit_5
    CALL draw_digit_4
    CALL draw_digit_3

    JP loop


digit_2:  
    SNE digit2, 54
    JP digit_1

    CALL draw_digit_6
    CALL draw_digit_5
    CALL draw_digit_4
    CALL draw_digit_3    
    CALL draw_digit_2

    LD digit6, 0
    LD digit5, 0    
    LD digit4, 0
    LD digit3, 0
    ADD digit2, 6
    
    CALL draw_digit_6
    CALL draw_digit_5
    CALL draw_digit_4
    CALL draw_digit_3 
    CALL draw_digit_2

    JP loop

digit_1:
    SNE digit1, 30
    JP halt
    
    CALL draw_digit_6
    CALL draw_digit_5
    CALL draw_digit_4
    CALL draw_digit_3
    CALL draw_digit_2
    CALL draw_digit_1
    
    LD digit6, 0
    LD digit5, 0
    LD digit4, 0
    LD digit3, 0
    LD digit2, 0
    ADD digit1, 6
    
    CALL draw_digit_6
    CALL draw_digit_5
    CALL draw_digit_4
    CALL draw_digit_3
    CALL draw_digit_2
    CALL draw_digit_1

    JP loop

;--------------------------------------------------------------------------------------------------;
; BACKGROUND
;--------------------------------------------------------------------------------------------------;
init_clock:
    CALL draw_colon_1
    CALL draw_colon_2

    CALL draw_digit_1
    CALL draw_digit_2
    CALL draw_digit_3
    CALL draw_digit_4
    CALL draw_digit_5
    CALL draw_digit_6

    RET

clock_reset:
    CALL init_clock

    JP init
;--------------------------------------------------------------------------------------------------;
; ANIMATION
;--------------------------------------------------------------------------------------------------;
draw_animation:
    draw_colon_1:
        LD x, 16
        LD I, colon
        DRW x, y, 6
        RET
    
    draw_colon_2:
        LD x, 40
        LD I, colon
        DRW x, y, 6
        RET

    draw_digit_1:
        LD x, 0
        LD I, number
        ADD I, digit1
        DRW x, y, 6
        RET

    draw_digit_2:
        LD x, 8
        LD I, number
        ADD I, digit2
        DRW x, y, 6
        RET

    draw_digit_3:
        LD x, 24
        LD I, number
        ADD I, digit3
        DRW x, y, 6
        RET

    draw_digit_4:
        LD x, 32
        LD I, number
        ADD I, digit4
        DRW x, y, 6
        RET

    draw_digit_5:
        LD x, 48
        LD I, number
        ADD I, digit5
        DRW x, y, 6
        RET

    draw_digit_6:
        LD x, 56
        LD I, number
        ADD I, digit6
        DRW x, y, 6
        RET
;--------------------------------------------------------------------------------------------------;
; SUPPORT
;--------------------------------------------------------------------------------------------------;
wait:
    wait_loop:
        LD VC, DT 
        SE VC, 0
        JP wait_loop
        RET

halt:
    LD key, 2
    SKNP key
    JP loop

    LD key, 3
    SKNP key   
    JP clock_reset

    JP halt
;--------------------------------------------------------------------------------------------------;
; DESIGN
;--------------------------------------------------------------------------------------------------;
colon:
db  %00000000,
    %00011000,
    %00000000,
    %00000000,
    %00011000,
    %00000000

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
