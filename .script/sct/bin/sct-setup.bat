@ECHO OFF
REM --------------------------------------------------------------------------------------------------------------------
REM Copyright (C) 2019 Ethan Pini <contact@eth-p.dev>
REM MIT License
REM - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
REM SCT: Setup Script
REM This script will attempt to set up the packages needed for SCT to run.
REM --------------------------------------------------------------------------------------------------------------------
SET HERE=%~dp0
SET HERE=%HERE:~0,-1%
SET TMP=%HERE%\..\..\..\.tmp

REM --------------------------------------------------------------------------------------------------------------------
REM Setup:
REM --------------------------------------------------------------------------------------------------------------------
CALL npm install

IF NOT EXIST %TMP% MKDIR %TMP%
IF NOT EXIST %TMP%\sct-setup COPY /y NUL %TMP%\sct-setup >NUL
