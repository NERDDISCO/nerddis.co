---
title: "nd-landscape-001"
date: 2022-10-04T16:02:46+02:00
draft: false
type: "subpage"
img: "20221015_NERDDISCO_nd-landscape-001_ooNWvzQMaUvLvY87mx5evJ4C8xUM4eNRxDmkTFfZQCcwpqG1KUn.jpg"
tags: "landscape,offscreencanvas,threejs,nd,mountain,retro,road,displacement,bloom,glow,shader,webgl,mit,prng,starlight"
---


# nd-landscape-001

{{< attention url="https://www.fxhash.xyz/generative/slug/nd-landscape-001" name="fxhash.xyz/generative/slug/nd-landscape-001" >}} 

After reading [Building a Vaporwave scene with Three.js](https://blog.maximeheckel.com/posts/vaporwave-3d-scene-with-threejs/) by [Maxime Heckel](https://twitter.com/MaximeHeckel) I was super inspired to generate a pseudo random landscape based on a single plane in ThreeJS. 
The mountains and the road in the middle are sculpted out of the plane by using OffscreenCanvas to generate a low resolution grayscale displacement map: A dark color means no change to the plane = small mountains / flat road, where a light color means that the vertices are elevated = high mountains / road. 
The colourful grid texture is also generated with OffscreenCanvas: It has the same size as the displacement map, so that the lines match the displaced vertices. Just the resolution is much higher. 
The last part is a bloom effect (which is based on a shader) that lets the landscape glow... sometimes even too much. 

<br /><br />

The piece has 8 different features and there is a very small chance to receive a **starlight**. 

<br /><br />

This was the first time that I used a [pseudo random number generator](https://en.wikipedia.org/wiki/Pseudorandom_number_generator) combined with a seed from [fxhash](https://www.fxhash.xyz/doc/artist/guide-publish-generative-token#fxhash-code-snippet) to create a random artwork, that looks the same for a specific iteration. It was super much fun to enter this new realm of possibilities, especially because I love random AND parameterized visual experiences. 

What is generative art for NERDDISCO? Let's find out!

<br /><br />

## Interactive 
- Use mouse or touch to zoom in/out and rotate the landscape. 
- Press 's' on your keyboard to download a screenshot

## License
[MIT](https://nerddis.co/mit-license)