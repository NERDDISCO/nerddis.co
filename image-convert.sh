#!/bin/bash

SRC=./static/shows/original
DEST=./static/shows

for f in $SRC/*.jpg
do
  # Get the name without the path
  filename="${f##*/}"

  # Remove last 4 characters
  filename="${filename::${#filename}-4}"

  echo "convert $filename"

  convert $SRC/$filename.jpg -resize 1280 -quality 1 $DEST/$filename.webp
  convert $SRC/$filename.jpg -resize 1280 -quality 1 $DEST/$filename.jpg
done

# convert 20200221_schickmalzwo_Hybris_Peng.jpg -resize 1280 -quality 1 ../20200221_schickmalzwo_Hybris_Peng.webp