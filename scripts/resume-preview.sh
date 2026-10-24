#!/bin/sh
# Renders public/resume.pdf to public/resume.webp, the picture phones show on
# /cv (mobile browsers will not draw an embedded PDF). Run it every time the
# PDF changes; tests/resume-preview.test.ts fails until you do.
set -e
cd "$(dirname "$0")/.."
tmp=$(mktemp -d)
pdftoppm -r 200 -png -singlefile -f 1 -l 1 public/resume.pdf "$tmp/page"
cwebp -quiet -q 82 "$tmp/page.png" -o public/resume.webp
# Line 1: the PDF this picture came from. Line 2: the picture itself.
{ shasum -a 256 public/resume.pdf; shasum -a 256 public/resume.webp; } | cut -d' ' -f1 > src/data/resume-preview.sha256
rm -rf "$tmp"
