#!/usr/bin/env bash
# Shrink a PDF for the web and linearize it so browsers can load it page by page.
# Usage: scripts/optimize-pdf.sh input.pdf [output.pdf] [image-dpi]
# Requires: ghostscript (gs) and qpdf  ->  brew install ghostscript qpdf
set -euo pipefail

in="${1:?usage: optimize-pdf.sh input.pdf [output.pdf] [image-dpi]}"
out="${2:-${in%.pdf}.optimized.pdf}"
dpi="${3:-150}"
tmp="$(mktemp -t optimize-pdf).pdf"
trap 'rm -f "$tmp"' EXIT

gs -sDEVICE=pdfwrite -dPDFSETTINGS=/ebook -dCompatibilityLevel=1.6 \
  -sColorConversionStrategy=LeaveColorUnchanged \
  -dDownsampleColorImages=true -dColorImageResolution="$dpi" \
  -dDownsampleGrayImages=true -dGrayImageResolution="$dpi" \
  -dNOPAUSE -dBATCH -dQUIET -sOutputFile="$tmp" "$in" 2>/dev/null
qpdf --linearize --warning-exit-0 --no-warn "$tmp" "$out"

size() { du -h "$1" | cut -f1; }
echo "$(size "$in") -> $(size "$out")  ($out, $(qpdf --show-npages "$out") pages)"
