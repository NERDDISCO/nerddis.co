---
title: "nd-xmas-001"
date: 2022-12-09T16:02:46+02:00
draft: false
type: "subpage"
img: "20221211_NERDDISCO_nd-xmas-001.jpg"
tags: "christmas,nd-xmas-001,box,threejs,seed,nerddisco,gltf,webgl"
---



# nd-xmas-001

My friends Patrick and Jasmin run a co-working space in Mainz (Germany) and every year they host an awesome christmas-party among friends. Jasmin asked me 2 days before the event (which happened on 2022-12-09) if I could bring some xmas-like decoration with me. As I already used up my decoration at home (I ❤️ xmas), I created a winter wonderland in ThreeJS, which was projected onto a wall in their office. 

You can check it out yourself:

{{< attention url="nd-xmas-001/live" name="nd-xmas-001/live" >}} 

Some aspects of this are pseudo-random, using the hash from fxhash as the seed. So every time you reload the page, these things are generated:

* Initial y rotation of all elements
* Snowflake shape
* Movement of the snowflakes
* Amount of gifts
* Gift-wrappings
* Rotation and position of the gifts

## Code

[github.com/NERDDISCO/nd-xmas-001](https://github.com/NERDDISCO/nd-xmas-001)

The project is released under MIT, but please take a look at the [Resources](/nd-xmas-001/#resources) to find the corresponding licenses for the third-party things I used. 

## Resources

* [White Fir Trees Collection Photoscanned For Cycles (CC 4.0)](https://blendermarket.com/products/white-fir-trees-collection-photoscanned-for-cycles) by Michal Sornat from which I used one tree, scattered it on a box in Blender, exported it as GLTF
  * The needle-texture was altered by adding some snow ontop of it
  * The bark-textures where resized to 50% of their size + transformed from png to jpg to make them smaller
* [Snow 02 (CC 0)](https://polyhaven.com/a/snow_02) by Rob Tuytel was used for the ground
* [Snowy Forest Path 01 (CC 0)](https://polyhaven.com/a/snowy_forest_path_01) by Oliksiy Yakovlyev used as the environment map
* [Randomised Fractal Snowflakes](https://www.youtube.com/watch?v=HXTC5LSep3M) by 
Franks laboratory was used as inspiration to generate a random  Snowflake-Texture
* [2a How to make falling snow three.js](https://www.youtube.com/watch?v=OXpl8durSjA) by flanniganable inspired the particle system to animate the snow so that it falls from the sky
* [How To Create A Loading Screen For Your Three.js App](https://www.youtube.com/watch?v=zMzuPIiznQ4) by Wael Yasmina was used to create a progress bar when the resources are loaded

## Interactive
- Use mouse or touch to zoom in/out and rotate the scene.
- Press 's' on your keyboard to download a screenshot