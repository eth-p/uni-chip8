build darwin x64 "favicon.icns"
echo "Zipping app package..."
zip -r "$OUT/release-darwin_x64.zip" * >/dev/null
