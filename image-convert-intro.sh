#!/bin/bash

# Converts original images to web-friendly intro images for blog posts
# Output: 1200px wide, 80% quality JPG

SRC="./static/shows/original"
DEST="./static/shows/intro"

# Create destination directory if it doesn't exist
mkdir -p "$DEST"

for f in $SRC/*.*
do
  # Get the name without the path
  filename="${f##*/}"

  # Get file extension
  fileextension="${filename#*.}"

  # Remove extension
  filename="${filename::${#filename}-${#fileextension}-1}"

  echo "convert $filename.$fileextension to intro jpg"

  magick "$SRC/$filename.$fileextension" -resize 1200 -quality 80 "$DEST/$filename.jpg"
done

