build linux x64 "favicon.png"
echo "Zipping app package..."
zip --symlinks -r "$OUT/release-linux_x64.zip" * >/dev/null
