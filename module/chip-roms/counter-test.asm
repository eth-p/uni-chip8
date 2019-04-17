; -------------------------------------------------------------------------------------------------------------------- ;
; This program was designed to be assembled with https://github.com/wernsey/chip8                                      ;
; -------------------------------------------------------------------------------------------------------------------- ;

DEFINE VALUE V3
DEFINE H_X VA
DEFINE T_X VB
DEFINE O_X VC
DEFINE V_Y VD
DEFINE VALUE_TOP_LEFT_X #19
DEFINE VALUE_TOP_LEFT_Y #D

init:
    LD VALUE, #0
    CALL initValueDisplay
    CALL renderValueDisplay
    JP loop


loop:
    SE VALUE, #FF
    JP no_sound

    sound:
        LD V0, #4
        LD ST, V0
    no_sound:
        JP after_sound

    after_sound:

    CALL renderValueDisplay
    ADD VALUE, #1
    CALL renderValueDisplay

    LD V0, #2
    LD DT, V0
    CALL wait
    JP loop

initValueDisplay:
    LD V0, #5
    LD V1, VALUE_TOP_LEFT_X ; Hundreds x-coordinate
    LD H_X, V1
    ADD V1, V0
    LD T_X, V1
    ADD V1, V0
    LD O_X, V1
    LD V_Y, VALUE_TOP_LEFT_Y
    RET

renderValueDisplay:
    LD I, BCD_STORE
    LD B, VALUE
    LD V2, [I]

    LD F, V0
    DRW H_X, V_Y, #5

    LD F, V1
    DRW T_X, V_Y, #5

    LD F, V2
    DRW O_X, V_Y, #5
    RET

wait:
    waitLoop:
        LD V0, DT
        SE V0, #0
        JP waitLoop
    RET

BCD_STORE:
    db #0, #0, #0
