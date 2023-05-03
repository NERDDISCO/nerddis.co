---
  title: "SVG - How to create & use vector graphics on the web"
  date: 2012-09-29T00:00:00+02:00
  draft: false
  type: "subpage"
  img: ""
  tags: ""
---

# SVG - How to create & use vector graphics on the web

![](/img/svg_logo.svg)

The web is full of images and most of them are raster graphics like jpeg, png or gif. Those formats are fixed in width / height and don't look good when heavily resized. Not even think about high resolution displays...  
And that's why I'm going to show you **how to handle SVG without Photoshop** or Illustrator!

## What is a SVG?

The **S**calable **V**ector **G**raphics (SVG) is an XML-based file format for two-dimensional vector graphics, which has been under development since 1999 by the World Wide Web Consortium.  
[**w3.org**/TR/SVG11](https://www.w3.org/TR/SVG11/intro.html)

It is possible to embed vector graphics, raster graphics and text into SVG. You can even edit any SVG in every text-based editor, because it's just some XML. Sounds nice? It is!

### Example

This is a simple red rectangle with a black stroke:  
![](/img/svg_how_to_create_and_use-example.svg)

And this is the belonging XML code:

```markup

<svg width="150" height="150" xmlns="http://www.w3.org/2000/svg">
  <g>
    <rect 
      height="75" 
      width="75" 
      fill="#cff"
      y="50" 
      x="50" 
      stroke-width="5" 
      stroke="#000" 
    />
  </g>
</svg>

```

### Even more information

If you want to know more about the syntax to code your own SVG, you should read **A Beginner’s Guide to SVG (Part 1)** by Johnny Simpson.  
[**inserthtml.com**/2012/02/svg-tutorial-part-1](https://inserthtml.com/2012/02/svg-tutorial-part-1)

## How to create/edit a SVG?

> **Child**: Hey mom, I want to edit a SVG. What do I need?
> 
> **Mom**: I think you need money to buy Photoshop or Illustrator!
> 
> **Child**: But I want to use free software :(

### svg-edit

**svg-edit** comes for the rescue. It's an awesome vector graphics editor in the browser (JavaScript, HTML5) with native support for Internet Explorer 9+.  
[code.**google.com**/p/svg-edit](https://code.google.com/p/svg-edit/)

Some of the features are:

*   Free-hand drawing
*   Path tool
*   Lines / Rects / Ellipses / Polygons
*   Export to SVG / PNG
*   Layers
*   Shape library

## Convert a scribble to SVG

The following screencast describes how to use **svg-edit** to convert a hand drawn scribble into a SVG.

[**youtube.com**/watch?v=39nVZsPP\_\_E](https://www.youtube.com/watch?v=39nVZsPP__E)

### Scribble

![Scribble: SVG](/img/scribble_to_svg_scribble.jpg)  

### Result

![](/img/scribble_to_svg_result.svg)

### Variation

![](/img/svg_logo.svg)

## Use the created SVG

You can use the SVG like any other image, except that SVG is not supported in every browser.

### CSS - background-image: file

```css
background-image: url(my_image.svg);
```

### CSS - background-image: embedded

```css
background-image: url(data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><rect height="5" width="5" fill="#000" /></svg>);
```

### HTML - img

```markup
<img src="my_image.svg" />
```

**Support**  
[**caniuse.com**#feat=svg-img](https://caniuse.com/#feat=svg-img)

### HTML - embed / object

```markup
<embed src="my_image.svg" type="image/svg+xml" />
```

**Support**  
[**caniuse.com**#feat=svg](https://caniuse.com/#feat=svg)

### HTML - inline

```markup
<div>
  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10">
    <rect height="5" width="5" fill="#000" />
  </svg>
</div>
```

## Browser support

SVG is supported in almost every browser. But you can check out the specific versions on **When can I use** if you like!  
[**caniuse.com**#feat=svg](https://caniuse.com/#feat=svg)

**IE hint**: SVG is only supported from Internet Explorer 9+! But you can use the **svgweb** JavaScript library to enable SVG on older versions.  
[code.**google.com**/p/svgweb](https://code.google.com/p/svgweb)

## There is more to come...

Based on some feedback for this article I'm going to extend it with this topics:

*   Other free SVG editors
*   Raphael
*   canvg
*   jQuery SVG