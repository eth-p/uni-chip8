#!/usr/bin/env bash
.script/sct/libexec/get-repository-stats.js || echo "Couldn't get repo stats. Oh well."
./sct build --release --minify
