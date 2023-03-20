---
title: "nd-genuary32nd-plants-chatgpt3-001"
date: 2023-03-11T16:02:46+02:00
draft: false
type: "subpage"
img: "20230317_NERDDISCO_nd-genuary32nd-plants-chatgpt3-001_ooWxjDocz6oTKvFgnwW6SJtJ34UqGpFZqBFsKcdTGNRdebbvwSf.jpg"
tags: "nd,chatgpt,chatgpt3,nerddisco,agpl,opensource,aiinfluenced,canvas2d,params"
hash: "ooWxjDocz6oTKvFgnwW6SJtJ34UqGpFZqBFsKcdTGNRdebbvwSf"
---

# nd-genuary32nd-plants-chatgpt3-001

<div class="center center--items separate">
    <a href="https://www.fxhash.xyz/generative/slug/nd-genuary32nd-plants-chatgpt3-001" target="_blank">
        <picture class="picture">
            <img src="img/20230317_NERDDISCO_nd-genuary32nd-plants-chatgpt3-001_ooWxjDocz6oTKvFgnwW6SJtJ34UqGpFZqBFsKcdTGNRdebbvwSf.jpg" alt="nd-genuary32nd-plants-chatgpt3-001 on fxhash" loading="lazy">
        </picture>
        <!-- <iframe width="512" height="512" src="nd-genuary32nd-plants-chatgpt3-001/live"></iframe> -->
    </a>

</div>

{{< attention url="https://www.fxhash.xyz/generative/slug/nd-genuary32nd-plants-chatgpt3-001" name="mint the NFT on fxhash" >}}

## Disclaimer

This artwork is partly created by using AI. I wanted to be as open and transparent as possible so that everyone can see which part belongs to the machine and which part belongs to me, the human. That's why I wrote down the following background story and also recorded a video of me using AI to generate the foundation of the generative token.

## From idea to foundation

For [GENUARY](https://genuary.art) 2023 (= generative art in January, a month when you have a different prompt every day and can use that to create art in any form you like) I wanted to create something myself, but had no idea what I could actually do. Instead, I played around with [ChatGPT](https://chat.openai.com) and explored how to generate GLSL (which worked in some simple cases but failed in many others) or learned the basics of writing smart contracts for Tezos.

On February 2nd, my friend [2xAA](https://2xaa.fm) released his new album [Alescere](https://2xaa.bandcamp.com/album/alescere-data113) and I finally got the inspiration I needed because the cover artwork contained a minimalistic plant and "Alescere" is Latin for "grow". Which was a perfect match for the "plants" prompt of GENUARY.

Since it was already February, I still wasn't sure to get started with the artwork for GENUARY, but then I saw that [fxhash had already announced GENUARY 32nd on their Discord](https://discord.com/channels/900333075509149767/909081044932788295/1069726490779996182): An imaginary point in time specifically for celebrating generative art. The idea was to have a week-long (February 1-7) minting party with submissions for GENUARY 2023. Soon after I also found another encouraging info on the website of GENUARY where it stated, that you could do the prompt whenever it was convenient to do so.

I was super motivated, but uncertain about how to get started. I created Canvas 2D stuff in the past, but never a growing plant. So I was wondering: Can I combine my plant idea with research on how to use ChatGPT to create generative art from scratch? The next day I started to record the whole process and it was actually working. The only thing that I totally underestimated was the time it took to edit the video, that's why I missed the deadline (February 7) for GENUARY 32nd on [fxhash](https://www.fxhash.xyz) by more than a month.

But it's done now. Please grab a glass of whatever, some snacks and watch the show: [Create Generative Art with ChatGPT without any coding experience?](TODO)

<div class="center center--items text separate">
    <a href="TODO: LINK TO VIDEO" target="_blank">
        <picture class="picture">
            <img src="img/20230317_NERDDISCO_nd-genuary32nd-plants-chatgpt3-001-youtube-thumbnail.jpg" alt="TODO" loading="lazy">
        </picture>
    </a>
</div>

I have summarized the video for you if you don't have time to watch it:

- <b>Goal</b>: Use ChatGPT to create the foundation of a generative artwork that renders a scene of growing plants
- <b>Result</b>: [A basic scene of plants that are growing, written in JavaScript on Canvas 2D](https://codesandbox.io/s/jovial-sea-68teiy?file=/src/index.js)

<div class="center center--items text separate">
    <a href="https://codesandbox.io/s/jovial-sea-68teiy?file=/src/index.js" target="_blank">
        <picture class="picture">
            <img class="" src="img/plants_foundation.jpg" alt="TODO" loading="lazy">
        </picture>
    </a>
</div>

## fxhashify

After holding the generated code from ChatGPT in my hands, I switched to my manual process (which involves using my human brain) to convert the foundation into something that can be actually minted on [fxhash](https://www.fxhash.xyz). I call this "fxhashify", as this process is tailored to the capabilities of fxhash. If you are interested in this process, then please leave a comment on the video. If you just want to know what I changed, then please continue reading:

- Used the Pseudo Random Number Generator from the [fxhash-webpack-boilerplate](https://github.com/fxhash/fxhash-webpack-boilerplate) instead of `Math.random()`
- Randomized ALL THE parameters (like `position`, `size`, `color`, `height`, `growthSpeed` and more) to control the plants, ground, sun and sky
- Established the scene to have `plantsAmount` between 1 and 8
- Spread the plants evenly on the ground with consistent spacing, related to the `plantsAmount`
- Made sure that tall plants are in front of small plants
- To prevent the plants from extending outside the scene, smaller-sized plants are placed along the edge whenever more than three plants were generated
- A different `globalCompositeOperation` was used for the petals of the "special plants", distinguishing them from regular plants
- Two different environments were included: Sunny Day vs Rainbow Night
- The proportions of the scene were kept, regardless of how it was scaled, using 2048 x 2048 px as the reference size
- A lot of fine-tuning was done to make it look pretty and get the colors right in terms of lightness and saturation... <3 HSL
- Added various helper functions (like `inRange` or `pseudoRandomBetween`) and the possibility to save the scene as an image by pressing "s" on the keyboard
- The characteristic was added to continuously redraw the scene after a random timeout between 0 and 60000 ms, so that you can see the plants growing over and over again. After each redraw, `stemGrowthSpeed`, `centerGrowthSpeed` and `petalGrowthSpeed` are randomized
- Included only a few fxhash features, but went into a rabbit hole for `firstRedraw` and added quotes from my most favorite movies, shows and music. But only the ones that had a connection to time
- Comments were added on all functions and everything in between

## Code

[Everything is JavaScript + Canvas 2D and open source under AGPLv3](https://github.com/NERDDISCO/nd-genuary32nd-plants-chatgpt3-001)

## Interactive

- Press `s` on your keyboard to download a screenshot
- The scene is redrawn every pseudo-random ms

## Credits

- The music for the intro and the chapters of the video was composed & produced by my friend [Syrenoize](https://www.instagram.com/syrenoize), please check out her awesome music!
