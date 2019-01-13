@ECHO OFF
REM --------------------------------------------------------------------------------------------------------------------
REM Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
REM MIT License
REM - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
REM SCT: Simple Contribution Tool
REM This tool is used for repository contribution and management.
REM --------------------------------------------------------------------------------------------------------------------

SET HERE=%~dp0
%HERE:~0,-1%\.script\sct\bin\sct %*
EXIT /B %ERRORLEVEL%
