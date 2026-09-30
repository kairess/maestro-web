#!/bin/sh
# Builds a copy of the game with the capture bot (synthetic 21-point hands holding the quill,
# ?botfail=<s>) into showreel/build/game. The repo's own src/ is not modified.
# Vite 8 needs Node 20.19+ or 22.12+.
set -e
HERE=$(cd "$(dirname "$0")/.." && pwd)
REPO=$(cd "$HERE/.." && pwd)
DEST="$HERE/build/game"
node -e 'const [a,b]=process.versions.node.split(".").map(Number); if(!(a>=23||(a===22&&b>=12)||(a===20&&b>=19))){console.error("Vite 8 needs Node 20.19+ or 22.12+ (current "+process.version+")");process.exit(1)}'
rm -rf "$DEST"
mkdir -p "$DEST"
(cd "$REPO" && git ls-files -z -- . ':!showreel' | xargs -0 tar cf -) | (cd "$DEST" && tar xf -)
(cd "$DEST" && patch -p1 < "$HERE/patches/bot-landmarks.patch")
(cd "$DEST" && PUPPETEER_SKIP_DOWNLOAD=1 npm install --no-audit --no-fund && npx vite build)
echo "game build ready → $DEST/dist"
