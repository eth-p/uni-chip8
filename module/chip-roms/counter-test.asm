DEFINE VALUE V3
DEFINE H_X VA
DEFINE T_X VB
DEFINE O_X VC
DEFINE V_Y VD

init:
    LD VALUE, #0
    LD V0, #5
    LD V1, #19 ; Hundreds x-coordinate

    LD H_X, V1
    ADD V1, V0
    LD T_X, V1
    ADD V1, V0
    LD O_X, V1
    LD V_Y, #D
    JP loop


loop:
    LD I, BCD_STORE
    LD B, VALUE

    CLS

    LD V2, [I]

    LD F, V0
    DRW H_X, V_Y, #5

    LD F, V1
    DRW T_X, V_Y, #5

    LD F, V2
    DRW O_X, V_Y, #5

    SE VALUE, #FF
    JP no_sound

    sound:
        LD V0, #4
        LD ST, V0
    no_sound:
        JP after_sound

    after_sound:

    ADD VALUE, #1

    LD V0, #4
    LD DT, V0
    CALL wait
    JP loop

wait:
    waitLoop:
        LD V0, DT
        SE V0, #0
        JP waitLoop
    RET

BCD_STORE:
    db #0, #0, #0
