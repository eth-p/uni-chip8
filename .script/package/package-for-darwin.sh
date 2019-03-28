build darwin x64 "favicon.icns"
echo "Zipping app package..."
zip --symlinks -r "$OUT/release-darwin_x64.zip" * >/dev/null
