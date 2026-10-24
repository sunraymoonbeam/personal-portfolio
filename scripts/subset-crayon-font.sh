#!/bin/sh
# Rebuilds src/assets/fonts/shantell-hobbies.woff2: Shantell Sans at weight 600,
# cut down to the letters the crayon words use. Add letters to LETTERS when a
# new word is drawn in the crayon face. Needs fonttools: `pip install fonttools brotli`.
set -eu
LETTERS="Hobbiesplay"
SRC=node_modules/@fontsource-variable/shantell-sans/files/shantell-sans-latin-wght-normal.woff2
TMP=$(mktemp -d)
fonttools varLib.instancer "$SRC" wght=600 -o "$TMP/600.ttf" -q
pyftsubset "$TMP/600.ttf" --text="$LETTERS" --flavor=woff2 --layout-features='*' \
  --output-file=src/assets/fonts/shantell-hobbies.woff2
rm -r "$TMP"
