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

* The original image (must be a jpg) for a show goes into `static/shows/original`
* Create the optimized webp & jpg versions of the image
  ```
    cd static/shows/original
    ./image-convert.sh
  ```


## Uses

* [Workbox](https://developers.google.com/web/tools/workbox/guides/generate-service-worker/cli) for Service Worker
* [pwa-update-available](https://github.com/thepassle/pwa-helpers#pwa-update-available) to update the app when a new version is released