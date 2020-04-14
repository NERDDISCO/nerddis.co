#!/bin/bash

FILES=./*.jpg

for f in $FILES
do
  # Remove first two characters
  filename="${f:2}"
  # Remove last 4 characters
  filename="${filename::${#filename}-4}"

  echo "convert $filename"

  convert $filename.jpg -resize 1280 -quality 1 ../$filename.webp
  convert $filename.jpg -resize 1280 -quality 1 ../$filename.jpg
done

# convert 20200221_schickmalzwo_Hybris_Peng.jpg -resize 1280 -quality 1 ../20200221_schickmalzwo_Hybris_Peng.webp