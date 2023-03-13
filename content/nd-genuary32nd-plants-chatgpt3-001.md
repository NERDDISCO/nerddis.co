---
title: "nd-genuary32nd-plants-chatgpt3-001"
date: 2023-02-17T16:02:46+02:00
draft: false
type: "subpage"
img: "20230317_NERDDISCO_nd-genuary32nd-plants-chatgpt3-001_ooWxjDocz6oTKvFgnwW6SJtJ34UqGpFZqBFsKcdTGNRdebbvwSf.jpg"
tags: "nd-genuary32nd-plants-chatgpt3-001,chatgpt,nerddisco,agpl,opensource,aigenerated,humangenerated,aifoundation,canvas2d"
hash: "ooWxjDocz6oTKvFgnwW6SJtJ34UqGpFZqBFsKcdTGNRdebbvwSf"
---

# nd-genuary32nd-plants-chatgpt3-001

{{< attention url="https://www.fxhash.xyz/generative/slug/nd-genuary32nd-plants-chatgpt3-001" name="fxhash.xyz/generative/slug/nd-genuary32nd-plants-chatgpt3-001" >}}

For [GENUARY](https://genuary.art) 2023 (= Generative art in January, a month where you have a different prompt every day and can use that to create art in any form you like) I wanted to create something, but had no idea what I could actually do. Instead I was playing around with [ChatGPT](https://chat.openai.com). When my friend [2xAA](https://2xaa.fm) released his new album [Alescere](https://2xaa.bandcamp.com/album/alescere-data113) on February 2, 2023, I finally got the inspiration I needed, because the [cover artwork](https://www.instagram.com/p/CoMZlxjtfvc) contains a minimalistic plant and "Alescere" is Latin for "to grow". My first thought was: How can I create a plant on [Canvas 2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D) which is actually growing?
{.text}

Since it was already February, I was not sure if I even should start working on this project, but then I saw that [fx(hash) had already announced GENUARY 32nd on their Discord](https://discord.com/channels/900333075509149767/909081044932788295/1069726490779996182): An imaginary point in time specifically for celebrating generative art. The idea was to have a week long (February 1-7) minting party with submissions for GENUARY 2023. AND on the website of GENUARY it states, that you can do the prompt when ever it's convenient to do so.
{.text}

But how to get started? I created Canvas 2D stuff in the past, but never a growing plant. So I was wondering: Can I combine my plant-idea with a research on how to use ChatGPT to create generative art from scratch? Soon after I started to record the whole process and it was actually working out pretty nice. The thing I totally underestimated was the time it took to edit the video, that's why I missed the deadline for GENUARY 32nd by more than a month. But it's done now and you can sit back, get some snacks and watch the show: [Create Generative Art with ChatGPT without any coding experience?](https://youtube.com) TODO TITLE OF YOUTUBE AND LINK!!!
{.text}

<div class="center center--items text separate">
    <a href="TODO: LINK TO VIDEO" target="_blank">
        <picture class="picture">
            <img class="" src="img/20230317_NERDDISCO_nd-genuary32nd-plants-chatgpt3-001-youtube-thumbnail.jpg" alt="TODO" loading="lazy">
        </picture>
    </a>
</div>

If you have no time to watch the video, I can give you a short summary of what happened there:
{.text}

- Goal: Use ChatGPT to create the foundation of a generative artwork
- Result: [A basic scene of plants that are growing, written in JavaScript on Canvas 2D](https://codesandbox.io/s/jovial-sea-68teiy?file=/src/index.js)

<div class="center center--items text separate">
    <a href="https://codesandbox.io/s/jovial-sea-68teiy?file=/src/index.js" target="_blank">
        <picture class="picture">
            <img class="" src="img/plants_foundation.jpg" alt="TODO" loading="lazy">
        </picture>
    </a>
</div>

## fx(hash)ify

After holding the generated code from ChatGPT in my hands, I switched to my manual process (which involves using my human brain) to convert the foundation into something that can be actually minted on fx(hash). If you are interested in this process, then please leave a comment on the video. If you just want to know what I changed, then please continue reading:
{.text}

- Used the Pseudo Random Number Generator from the [fxhash-webpack-boilerplate](https://github.com/fxhash/fxhash-webpack-boilerplate) instead of `Math.random()`
- Randomized ALL THE parameters (like `position`, `size`, `color`, `height`, `growthSpeed` and more) to control the plants, ground, sun and sky
- Established the scene to have between 1 and 8 plants
- Spread the plants evenly on the ground with consistent spacing, related to the amount of plants
- Made sure that tall plants are in front of small plants
- To prevent the plants from extending outside the scene, smaller-sized plants are placed along the edge whenever more than three plants were generated
- The petal composition operation for special plants was distinct from that of regular plants
- Two different environments were included: Sunny Day vs Rainbow Night
- The proportions of the scene were kept, regardless of how it was scaled, using 2048 x 2048 px as the reference size
- A lot of fine-tuning was done to make it look pretty and get the colors right in terms of lightness and saturation... <3 HSL
- Added various helper-functions (like `inRange` or `pseudoRandomBetween`) and the possibility to save the scene as image by pressing "s" on the keyboard
- The characteristic was added to continuously redraw the scene after a random timeout between 0 and 60000 ms, so that you can see the plants growing over and over again. After each redraw, `stemGrowthSpeed` / `centerGrowthSpeed` / `petalGrowthSpeed` are randomized
- Included only a few fx(hash) features, but went into a rabbit hole for `firstRedraw` and added quotes from my most favorite movies, shows and music. But only the ones that had a connection to time
- Comments were added on all functions and everything in between

## Code

[Everything is JavaScript + Canvas 2D and open source under AGPLv3](https://github.com/NERDDISCO/nd-genuary32nd-plants-chatgpt3-001)

## Interactive

- Press 's' on your keyboard to download a screenshot
- The scene is redrawn every pseudo-random ms

## Credits

- The music for the intro and the chapters is composed & produced by my friend [Syrenoize](https://soundcloud.com/syrenoize), please check out her awesome music!
