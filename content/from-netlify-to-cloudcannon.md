---
title: "From Netlify to CloudCannon"
date: 2023-06-14T12:02:46+02:00
draft: false
type: "subpage"
tags: "ssg,hosting,netlify,cloudcannon,workbox"
introimg: "shows/original/20230614_from_netlify_to_cloudcannon.jpg"
---


In this post, I'll share my experience of moving my Hugo-based static website from [Netlify](https://www.netlify.com/) to [CloudCannon](https://cloudcannon.com). As a developer, I'm always interested in exploring new tools and technologies to see how they can improve my workflow. When I came across [CloudCannon](https://cloudcannon.com), its intuitive interface and robust set of features immediately caught my attention. I was intrigued and decided to see if it could offer a better hosting solution for my static site than the one I was using. 

I'll guide you through the transition process, highlighting the steps I took and discussing some of the questions and challenges that emerged along the way. My hope is that this post will give you an insight into what it's like to work with [CloudCannon](https://cloudcannon.com) and help you decide whether it could be the right fit for your own projects.


## Personal site for free

The default plan on [CloudCannon](https://cloudcannon.com) is the "Standard" plan, which costs $45 per month. However, if you're using [CloudCannon](https://cloudcannon.com) for personal projects or just getting started, you might not need all the features that the "Standard" plan offers.

Fortunately, [CloudCannon](https://cloudcannon.com) offers a "Personal" plan that is free of charge and can be a great way to start hosting your site. 

To switch to the "Personal" plan, navigate to your "org settings > subscription > review your billing plan > change plan". From there, you can select the "Personal" plan.


## Setting up the site

To get started with [CloudCannon](https://cloudcannon.com), I created a new site and selected "Build with your own files", as I already have a [repository on GitHub](https://github.com/NERDDISCO/nerddis.co). This option allows me to sync the site on [CloudCannon](https://cloudcannon.com) with my repository. 

After the sync was over, the [CloudCannon](https://cloudcannon.com) user interface suggested adding a `cloudcannon-config.yml` file to my project root. This file is used to configure various settings for my site on [CloudCannon](https://cloudcannon.com). Since I'm not using any specific features yet, my config is literally the default one. I just stripped it down to the absolute minimum and changed the timezone:


```yaml
# allows you to define your content collections
collections_config:
  # "pages" is the name of a collection and represents
  # the default content under "content"
  pages:
    # the pages in this collection will be rendered to your site's output
    output: true

# lets you define the locations of different types of files in your site
paths:
  data: data
  # "collections" are located in the "content" directory
  collections: content
  includes: layouts
  layouts: layouts
  static: static
  uploads: static/uploads

# Timezone of your site in IANA format. This is used by date and datetime inputs
# within the CloudCannon Data Editor.
timezone: Europe/Berlin
```

Then I was able to configure some "Build Options" (`--minify` and `--gc`) and then the site was built. 

## Reset the baseURL in the UI

I have the `baseURL` configured in my `config.yaml`, but in the UI of [CloudCannon](https://cloudcannon.com) it was set to `/`, which lead to some problems with my absolute URLs. 

Solution: I removed the `/` in the UI and then my config was corretly loaded. 

## Running Workbox Build

Next, I wanted to ensure that [Workbox](https://developer.chrome.com/docs/workbox/) would still build my PWA correctly after the transition. To accomplish this, I added a `postbuild` script in the `.cloudcannon` directory to run my [Workbox](https://developer.chrome.com/docs/workbox/) build, because this runs after the static files are built and `public` is populated. 

Here's the content of my `.cloudcannon/postbuild` script:

```bash
#!/bin/bash
npm run build
```

This script is run after the site build process is complete, but before the files are uploaded to [CloudCannon](https://cloudcannon.com) servers.

## Setting Up a Custom Domain

After setting up my site and build process, I moved on to configuring my custom domain: nerddis.co. I added my custom domain in [CloudCannon](https://cloudcannon.com) and then updated the nameservers for my domain on my domain provider, Gandi. This took around 1 hour and then my site was accessible. 

It was not possible to use an External DNS Server to configure the custom domain, because SSL certificate can only be issued, when you use the build-in DNS Server from [CloudCannon](https://cloudcannon.com). 


## Possible developer experience improvements

Some things that could be improved in the future to make it easier for devs to switch over to [CloudCannon](https://cloudcannon.com): 

* It's nice that you can host a personal website for free. But why do I have to pay for a custom domain? 
* I wonder why the personal plan is not visible on the official [pricing page](https://cloudcannon.com/pricing/)? 
* Why can't I use the external DNS in combination with an SSL certificate? I have not encountered this on any provider I have used in the past. Would be nice to get this solved also on [CloudCannon](https://cloudcannon.com). 
* When interacting with the documention as I wanted to understand the `cloudcannon-config.yml`, I used the link that came with the default config. That points to an URL that has the URL parameter `ssg=Hugo`. For me, this had no effect, as I was expecting that this is actually changing the selected static site generator. Would be nice to either fix this or update the URL in the default config
* Add an AI assistant when setting up a new project to detect specific configurations (like Workbox), that suggests how to solve those (like adding a custom postbuild hook) using [CloudCannon](https://cloudcannon.com) specific features
  * The assistant could also detect, that the `baseURL` is already configured in the Hugo config. And only if there is no config, set a default value of `/` or suggest a better value based on the data that the user provided.

## Conclusion

Transitioning my Hugo-based static website from [Netlify](https://www.netlify.com/) to [CloudCannon](https://cloudcannon.com) turned out to be a relatively straightforward process. The platform offers a personal plan that allows me to host my site for free, and the setup process was simple. Additionally, I was able to set up a custom domain and run Workbox in [CloudCannon](https://cloudcannon.com) without much difficulty.

However, there are some areas where [CloudCannon](https://cloudcannon.com) can improve to provide an even smoother developer experience. For instance, it would be helpful if the personal plan was more visible and if an external DNS could be used in combination with an SSL certificate. Furthermore, enhancing the documentation and adding an AI assistant to help during the setup process could be beneficial.

Overall, [CloudCannon](https://cloudcannon.com) provides a solid solution for hosting static websites, with a few potential enhancements that could take the platform to the next level. As I continue to use [CloudCannon](https://cloudcannon.com), I look forward to seeing how it evolves and improves over time.
