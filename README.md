# nerddis.co

## Contribute

* Install [hugo](https://gohugo.io/getting-started/installing/)
* Clone the repo
* Run `npm i` to install dependencies
* Install [imagemagick](https://imagemagick.org/script/download.php)
* Start the local hugo server: `hugo server -D --renderToDisk -d public`
* Start Workbox: `npm run watch`
* Make your changes
* Push back to the repo

When your commit / PR is merged into the master, it will trigger a build on netlify automatically and update the website. 


### Shows

* The original image for a show goes into `static/shows/original`
* Create the optimized jpg versions of the image
  ```
    ./image-convert.sh
  ```

### base64 of woff2 font

```
# Node => 13.0

npm run build:font
```

## Uses

* [Workbox](https://developers.google.com/web/tools/workbox/guides/generate-service-worker/cli) for Service Worker
* [pwa-update-available](https://github.com/thepassle/pwa-helpers#pwa-update-available) to update the app when a new version is released
* [Badd Mono](https://paulconley.works/badd-mono/) font


https://dev.to/thepassle/lessons-learned-building-a-covid-19-pwa-57fi



## Optimizations

* Inline CSS
* Converted Badd Mono from otf (76 kb) into woff2 (7 kb)
* Inline base64 encoded woff2
* All images are jpg with quality 1
* Lazyload images
* Service Worker
* Async JavaScript
* Thanks to Pascal Schilp for https://dev.to/thepassle/lessons-learned-building-a-covid-19-pwa-57fi
