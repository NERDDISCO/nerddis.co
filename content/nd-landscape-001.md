---
title: "nd-landscape-001"
date: 2022-10-04T16:02:46+02:00
draft: false
type: "subpage"
img: "20221015_NERDDISCO_nd-landscape-001_ooNWvzQMaUvLvY87mx5evJ4C8xUM4eNRxDmkTFfZQCcwpqG1KUn.jpg"
---

# nd-landscape-001

After reading [Building a Vaporwave scene with Three.js](https://blog.maximeheckel.com/posts/vaporwave-3d-scene-with-threejs/) by [Maxime Heckel](https://twitter.com/MaximeHeckel) I was super inspired to generate a pseudo random landscape based on a single plane in ThreeJS. The mountains and the road in the middle are sculpted out of the plane by using a generated low resolution grayscale displacement map: A dark color means no change to the plane = small mountains / flat road, where a light color means that the vertices are elevated = high mountains / road. On the plane a generated colourful grid is used as the texture, which has the same size as the displacement map, but with a much higher resolution. The last part is a bloom effect (which is based on a shader) that lets the landscape glow... sometimes even too much. 

<br /><br />

This was the first time that I used a [pseudo random number generator](https://en.wikipedia.org/wiki/Pseudorandom_number_generator) combined with a seed from [fxhash](https://www.fxhash.xyz/doc/artist/guide-publish-generative-token#fxhash-code-snippet) to create a random artwork, that looks the same for a specific iteration.

<br /><br />

The piece has 8 different features and there is a very small chance to receive a **starlight**. 

<br /><br />

Interactive: Use mouse or touch to zoom in/out and rotate the landscape. 

{{< attention url="https://fxhash.xyz/gentk/1213087" name="fxhash.xyz.com/gentk/1213087" >}} 

Code licensed via [MIT](https://nerddis.co/MIT-License)