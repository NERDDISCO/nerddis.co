# nerddis.co

## Contribute

* Install [hugo](https://gohugo.io/getting-started/installing/)
* Clone the repo
* Run `npm i` to install dependencies
* Start the local hugo server: `hugo server -D`
* Make your changes
* Push back to the repo

When your commit / PR is merged into the master, it will trigger a build on netlify automatically and update the website. 


### Optimizations

Make sure to optimize the images to the maximum

```
cd static/shows/original
jpegoptim -o -d ../ -m 1
```