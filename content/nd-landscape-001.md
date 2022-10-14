---
title: "nd-landscape-001"
date: 2022-10-04T16:02:46+02:00
draft: false
type: "subpage"
img: "20211106_NERDDISCO_HEN_500000.jpg"
---

# nd-landscape-001

After getting super inspired by reading [Building a Vaporwave scene with Three.js](https://blog.maximeheckel.com/posts/vaporwave-3d-scene-with-threejs/) by [Maxime Heckel](https://twitter.com/MaximeHeckel) I created a pseudo random landscape based on a single plane. The mountains and the road in the middle are sculpted out of the plane by using a grayscale displacement map (where a dark color means no change to the plane and a light color means that the vertices are elevated). A colorful grid is used as the texture on the plane, which has the same scale as the displacement map, but with a much higher resolution. The last bit is a bloom effect (based on a shader) that lets the landscape glow. 

<br /><br />

This was the first time that I used a [pseudo random number generator](https://en.wikipedia.org/wiki/Pseudorandom_number_generator) combined with a seed from [fxhash](https://www.fxhash.xyz/doc/artist/guide-publish-generative-token#fxhash-code-snippet) to create a random artwork, that looks the same for a specific iteration.

<br /><br />

There is a small chance to receive a **starlight**. 

{{< attention url="https://fxhash.xyz/gentk/1213087" name="fxhash.xyz.com/gentk/1213087" >}} 

Code licensed via [Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)](https://creativecommons.org/licenses/by-nc-sa/4.0/)