define PERSON_X VA
define PERSON_Y VB
define DISPLAY_X_MAX #3F
define DISPLAY_Y_MAX #1F
define CAR_X VC
define CAR_Y VD
define IS_CAR_GOING_RIGHT VE

define CAR_SPEED #2
define KEY_UP #5
define KEY_DOWN #8
define KEY_LEFT #7
define KEY_RIGHT #9

initNewGame:
    LD V0, #0
    LD V1, #A
    JP loop

loop:
    CALL controlCar

    CLS
    CALL renderCar

    LD I, SPRITE_Person
    DRW PERSON_X, PERSON_Y, #8
    LD V0, #1
    SUB PERSON_X, V0

    CALL testCarCollide

    SNE VF, #0
    JP loopContinue
    LD V0, #2
    LD ST, V0
    LD I, SPRITE_Explosion
    LD V0, CAR_X
    LD V1, CAR_Y
    DRW V0, V1, #8

    loopContinue:

    LD V0, #2
    LD DT, V0
    CALL wait

    JP loop

testCarCollide:
    CALL renderCar
    CALL renderCar
    RET

controlCar:
    controlCarUp:
        ; Limit upper wall
        SNE CAR_Y, #0
        JP controlCarDown
        SNE CAR_Y, #1
        JP controlCarDown

        LD V0, KEY_UP
        SKP V0
        JP controlCarDown
        LD V0, CAR_SPEED
        SUB CAR_Y, V0

    controlCarDown:
        ; Limit lower wall
        SNE CAR_Y, #1C
        JP controlCarLeft
        SNE CAR_Y, #1B
        JP controlCarLeft

        LD V0, KEY_DOWN
        SKP V0
        JP controlCarLeft
        ADD CAR_Y, CAR_SPEED

    controlCarLeft:
        ; Limit left wall
        SNE CAR_X, #0
        JP controlCarRight
        SNE CAR_X, #1
        JP controlCarRight

        LD V0, KEY_LEFT
        SKP V0
        JP controlCarRight
        LD V0, CAR_SPEED
        SUB CAR_X, V0
        LD IS_CAR_GOING_RIGHT, #0

    controlCarRight:
        ; Limit right wall
        SNE CAR_X, #37
        RET
        SNE CAR_X, #38
        RET

        LD V0, KEY_RIGHT
        SKP V0
        RET
        ADD CAR_X, CAR_SPEED
        LD IS_CAR_GOING_RIGHT, #1

    RET

renderCar:
    SNE IS_CAR_GOING_RIGHT, #1
    LD I, SPRITE_CarRight
    SNE IS_CAR_GOING_RIGHT, #0
    LD I, SPRITE_CarLeft
    DRW CAR_X, CAR_Y, #4
    RET

wait:
    waitLoop:
        LD V0, DT
        SE V0, #0
        JP waitLoop
    RET

; Height 8
SPRITE_Person:
    db
    #e0,
    #a0,
    #e0,
    #40,
    #e0,
    #40,
    #a0,
    #a0

; Height 4
SPRITE_CarRight:
    db
    #3c,
    #c2,
    #ff,
    #bd

; Height 4
SPRITE_CarLeft:
    db
    #3c,
    #43,
    #ff,
    #bd

; Height 8
SPRITE_Explosion:
    db
    #82,
    #54,
    #28,
    #54,
    #28,
    #54,
    #82