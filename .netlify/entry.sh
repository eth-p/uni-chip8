#!/usr/bin/env bash
# ----------------------------------------------------------------------------------------------------------------------
# Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
# MIT License
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# Netlify build scripts.
# This is... unfortunately needed. Netlify doesn't play nicely with git-lfs.
# ----------------------------------------------------------------------------------------------------------------------
# Fix LFS:
git lfs install --local
git checkout .

# Fix SCT:
mkdir -p ".tmp" &>/dev/null
touch ".tmp/sct-setup" &>/dev/null

# Run.
"$@"
exit $?
