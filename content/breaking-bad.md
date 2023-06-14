---
  title: "Breaking Bad"
  date: 2012-07-17T00:00:00+02:00
  draft: false
  type: "subpage"
  img: ""
  tags: ""
  aliases:
  - breaking-bad-logo
---

<div class="center center--items separate">
    <a href="https://codepen.io/TimPietrusky/pen/kdxVok" target="_blank">
        <picture class="picture">
            <img src="img/20120717_NERDDISCO_BreakingBad.jpg" alt="Breaking Bad logo rebuild with CSS/HTML/JS" loading="lazy">
        </picture>
    </a>
</div>

I really love the series and thought: What would be better than recreating the logo with awesome web technologies?

## The Basics: CSS

I started with the chemical elements **Br** & **Ba**, because they are super easy to create with CSS. But what font is used here?

> Google: "breaking bad font"  
> First hit is MyFonts.com

[**myfonts.com**/WhatTheFont/forum/case/282847](https://web.archive.org/web/20191027093610/https://www.myfonts.com/WhatTheFont/forum/case/282847/)

One of the fonts is **Arial MT Bold**, so I can use the default Arial... nice! But wait. The other parts of the logo are set in a font called **Bundy**? I searched for a couple of minutes, but could not find this specific font. So what are my options?

An image? No: Not resolution independent and much too big in file size.  
Another font? No: Are you kidding me? This must be real!

## Special font operations: SVG

I never created a SVG before, but it is just an ordinary vector right? Perfect, so I opened Photoshop (inside my virtual Windows) and created the path for every letter.

And now just save as \*.svg right? What? Are you kidding me? No SVG with Photoshop? Thanks Adobe. 

Luckily, I have also Illustrator installed, so I exported my Photoshop **Paths to Illustrator...**, opened the exported \*.ai (with Illustrator) and saved it as \*.svg! That's easy... isn't it?

You can download the created SVG here:  
[**nerddis.co**/img/lab/breakingbad\_eaking.svg](https://nerddis.co/img/lab/breakingbad_eaking.svg)  
[**nerddis.co**/img/lab/breakingbad\_d.svg](https://nerddis.co/img/lab/breakingbad_d.svg)

Everything is perfect now. The logo looks just nice. But something is missing? Yes, the meth lab smoke!

### How to create SVG

I wrote the article **SVG - How to create & use vector graphics on the web** where I describe how to create vector graphics (+ screencast).  
[**nerddis.co**/svg-how-to-create-and-use-vector-graphics-on-the-web](/svg-how-to-create-and-use-vector-graphics-on-the-web)

## Meth lab smoke: HTML5 canvas

Cause I'm really new to this hole canvas stuff I searched once again for a nice tutorial explaining how to do it right.

> Google: "html5 canvas smoke"  
> One of the center hits is Astronautz.com

[**astronautz.com**/wordpress/creating-realistic-particle-effect-with-html5-canvas](https://astronautz.com/wordpress/creating-realistic-particle-effect-with-html5-canvas)

And boom: What a nice smoke effect by Ed Welch. I had to create a few meth lab alike smoke puffs with Photoshop and adjust the default values of the JavaScript particle emitter.

## Official theme song: HTML5 audio

For the third time in this article I use Google to find something... boring, but what should I do instead?

> Google: "breaking bad theme"  
> One of the center hits is televisiontunes.com

[**televisiontunes.com**/Breaking\_Bad.html](https://www.televisiontunes.com/Breaking_Bad.html)

I converted the \*.mp3 to \*.ogg, because the main browser don't support every audio format. Why should they? That would be too easy. By the way: WE WANT OGG!!!  
[**wewantogg.com**](https://wewantogg.com/)

You might be wondering: How do you know what audio format you take for what browser?  
The answer: I don't, I use Modernizr!  
[**modernizr.com**/docs/#features-html5](https://modernizr.com/docs/#features-html5)

```javascript
Modernizr.audio.ogg ? '*.ogg' : '*.mp3';
```

## Result

<div class="center center--items separate">
    <a href="https://codepen.io/TimPietrusky/pen/kdxVok" target="_blank">
        <picture class="picture">
            <img src="img/20120717_NERDDISCO_BreakingBad.jpg" alt="Breaking Bad logo rebuild with CSS/HTML/JS" loading="lazy">
        </picture>
    </a>
</div>

## Thanks goes to

**Ed Welch**

He created a freaking awesome canvas smoke effect.  
[**astronautz.com**/wordpress/creating-realistic-particle-effect-with-html5-canvas](https://web.archive.org/web/20220518103255/http://astronautz.com/wordpress/creating-realistic-particle-effect-with-html5-canvas/)

**Gray Ghost Visuals**

He inspired me to add the official theme song with his comment at CodePen: *audio intro please in honor of WW!*