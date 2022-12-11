module.exports = {
  "globDirectory": "public/",
  "globPatterns": [
    "**/*.{ico,svg,jpg,png,js,webmanifest,html}",
    "font/Badd-Mono-Regular.woff2"
  ],
  "globIgnores": [
    "**/original/*",
    "sw.js",
    "sw.js.map",
    "workbox-*",
    "img/nerddisco.jpg",
    "**/live/**/*",
    "js/pwa-helper-components/test/*",
    "js/pwa-helper-components/demo/**/*",
    "js/pwa-helper-components/karma*",
    "js/pwa-helper-components/pwa-dark-mode*",
    "js/pwa-helper-components/pwa-dark-mode/*",
    "js/pwa-helper-components/index.js",
    "js/pwa-helper-components/pwa-install-button*",
    "js/pwa-helper-components/pwa-install-button/*",
    "js/pwa-helper-components/pwa-update-available*",
    "js/pwa-helper-components/update-available-helper/update-available.js"
  ],
  "swDest": "public/sw.js"
};