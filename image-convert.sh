#!/bin/bash

SRC=./static/shows/original
DEST=./static/shows

for f in $SRC/*.*
do
  # Get the name without the path
  filename="${f##*/}"

  # Get file extension
  fileextension="${filename#*.}"

  # Remove last 4 characters
  filename="${filename::${#filename}-4}"

  echo "convert $filename.$fileextension to jpg & webp"

  # convert $SRC/$filename.$fileextension -resize 660 -quality 1 $DEST/$filename.webp
  convert $SRC/$filename.$fileextension -resize 660 -quality 1 $DEST/$filename.jpg
done

# convert 20200221_schickmalzwo_Hybris_Peng.jpg -resize 1280 -quality 1 ../20200221_schickmalzwo_Hybris_Peng.webp