---
title: "how to prompt a genai video platform for Project Odyssey"
date: 2024-12-31T00:00:00+02:00
draft: false
type: "subpage"
img: "20241231_openv_my_videos.jpg"
tags: ""
---

## tl;dr

i created a genai video platform called [OpenV](https://openv.ai) in ~100 hours for [CivitAI](https://civitai.com)'s [Project Odyssey](https://projectodyssey.ai) (an ai film competition) by using ai:

- planning in [ChatGPT o1](https://chatgpt.com/?model=o1)
- frontend in [v0](https://v0.dev)
- everything else in [Cursor](https://www.cursor.com) agent

it's built on top of the [nextjs-starter-kit](https://starter.rasmic.xyz/) by [Ras Mic](https://www.rasmic.xyz) (which comes with [NextJS](https://nextjs.org), [Shadcn](https://ui.shadcn.com), [Clerk](https://clerk.com), [Supabase](https://supabase.com)), deployed on [Vercel](https://vercel.com) & [RunPod](https://runpod.io), using [UploadThing](https://uploadthing.com) as storage and [Mochi](https://github.com/genmoai/mochi) as the model to generate videos.

[OpenV](https://openv.ai) consists of a [web app](https://github.com/runpod/openv) and a [model api](https://github.com/runpod-workers/worker-mochi), both open source under MIT.

## the idea

{{< meta date="oct 26 - 27, 2024" >}}

when i saw [rain1011/pyramid-flow-sd3](https://huggingface.co/rain1011/pyramid-flow-sd3) (an open source video generation model), the idea for a new side project was born: a platform called [OpenV](https://openv.ai) (open video) that can generate videos with open source ai models.

so i drafted a quick prototype using [v0](https://v0.dev):

<div class="special">

i want to build a website based on nextjs, shadcn, typescript. its name is "OpenV" and it's a generative video web app using ai. we are building the homepage, which consists of:

- a large prompt area and a "generate" button and an element to change the length (5 or 10 seconds) and a checkbox to "enhance prompt"
- a tab area with "inspiration" and "my videos"
- inspiration showing in a grid videos from other users and how to guidelines
- my videos showing all videos that the user already has generated
- when the user clicks on generate, the video is added in some kind of queue and the queue is always visible
</div>

this prompt one-shotted this:

{{< img-link url="https://v0.dev/chat/lNqzYhBbwMA" src="img/20241220_openv_v0_prototype_v1_initial.jpeg" alt="OpenV v0 prototype initial version" >}}

34 prompts later:

{{< img-link url="https://v0.dev/chat/lNqzYhBbwMA" src="img/20241220_openv_v0_prototype_v1_final.jpeg" alt="OpenV v0 prototype final version" >}}

i then used [pyramid-flow-sd3](https://huggingface.co/rain1011/pyramid-flow-sd3) via an api on [RunPod](https://runpod.io), but did not connect the frontend with this api, and then the weekend was over.

## project odyssey

{{< meta date="oct 29, 2024" >}}

[CivitAI](https://civitai.com) reached out to [RunPod](https://runpod.io) about becoming a gold sponsor for their ai film competition, [Project Odyssey](https://projectodyssey.ai) (dec 16, 2024 to jan 16, 2025), and we directly said yes.

{{< img-link url="https://www.youtube.com/watch?v=quSWxWpfMB0" src="img/20241216_civitai_project_odyssey_s2.jpeg" alt="CivitAI Project Odyssey Season 2" >}}

one part of the sponsorship deal says that we have to provide our own video gen tool that can be used by contestants of [Project Odyssey](https://projectodyssey.ai) for free for the duration of the competition to generate up to 10 minutes of video.

as [RunPod](https://runpod.io) is a provider of infrastructure for ai companies, we had no such tool in our portfolio. this is why we decided to convert my side project [OpenV](https://openv.ai) into a full-blown product. the goal is to showcase the power of RunPod and provide educational resources for developers. but instead of using [pyramid-flow-sd3](https://huggingface.co/rain1011/pyramid-flow-sd3), we decided to use [Mochi](https://github.com/genmoai/mochi) as the video generation model, as it generates better high quality videos.

### category: sponsored tools

[Project Odyssey](https://projectodyssey.ai) has its own category for sponsored tools, which means that videos generated with [OpenV](https://openv.ai) can be submitted to the competition, and [RunPod](https://runpod.io) (probably me plus community votes) will be judging them. the winners will receive prizes, so make sure to check this out if you want to win.

## model as api

{{< meta
date="nov 28 - dec 6, 2024"
src="https://github.com/runpod-workers/worker-mochi"
src-name="worker-mochi"
license="MIT">}}

almost every ai product i start working on requires a specific open source model running as an api. when it's working, i continue with the rest of the project.

converting mochi-1 into an api was straightforward, as i could get a lot of inspiration from [camenduru/mochi-1-preview-tost](https://github.com/camenduru/mochi-1-preview-tost) (a RunPod-compatible worker serving Mochi with [ComfyUI](https://github.com/comfyanonymous/ComfyUI) in python).

this is how a request to the api looks like:

```json
{
  "input": {
    "positive_prompt": "a cat playing with yarn",
    "negative_prompt": "",
    "width": 848,
    "height": 480,
    "seed": 42,
    "steps": 60,
    "cfg": 6,
    "num_frames": 31
  }
}
```

### video storage

when the video is generated, it must be stored somewhere (as all of this runs serverless, so before the request is finished, the video will be deleted), so that it can be served to the user.

i first tried to use the blob storage from [Vercel](https://vercel.com), but this had no steady connection (upload failed many times, even with a retry strategy).

then i switched over to [UploadThing](https://uploadthing.com), which was working great. (i just don't think that [the python implementation of the api](https://github.com/runpod-workers/worker-mochi/blob/main/src/handler.py#L49-L140) is correct. would you please help me out here, theo?)

### response

when the user wants to generate a video, [OpenV](https://openv.ai) will send a request to the api, which will add the request to a queue and return a job id. [OpenV](https://openv.ai) also provides a webhook endpoint that the api calls when the video is generated (or to inform about an error).

```json
{
  "id": "job-123",
  "status": "COMPLETED",
  "output": {
    "result": "https://utfs.io/f/a655aa95-1f60-4809-8528-25a875d80539-92yd7b.mp4"
  }
}
```

## the web app

{{< meta
date="dec 9 - 18, 2024"
src="https://github.com/runpod/openv"
src-name="OpenV"
license="MIT">}}

### foundation

to get started quickly, i used [nextjs-starter-kit](https://starter.rasmic.xyz/) from [michael shimeles](https://www.rasmic.xyz) as the foundation. it comes packed with:

- NextJS + [Shadcn/UI](https://ui.shadcn.com) + [TypeScript](https://www.typescriptlang.org)
- [Clerk](https://clerk.com) for authentication
- [Supabase](https://supabase.com) as database in combination with [Prisma](https://www.prisma.io) as orm
- [Stripe](https://stripe.com) for payments (but we’re not charging anything, so this isn’t needed)

it helps me a lot to have a visual representation of the project, so i created this system overview:

{{< img-link url="https://openv.ai#startup-template" src="img/20241226_openv_system_overview.jpeg" alt="OpenV system overview" >}}

### planning

i used ChatGPT o1 to create a high-level overview of the project and tried to describe how a typical workflow might look. this ended up in a nice sequence diagram showing the most important user interaction: generating a video.

{{< img-link url="https://mermaid.live/view#pako:eNp9U9Fq3DAQ_JVFD-FKr_0AQwO9-lwCLRj7nELxi87a3Kmxta4spZSQf-_KkpP2HHoPZ8s7M9oZaR9FRwpFJib86dF0mGt5snJoDfBvlNbpTo_SOGhATtBMaNelYh9qhSXj0Kh1_WN5EwD8WNfyXSjl0smjnHBdr8pQr7wp6RXl-hCqtSMrT0yOgObd9XWxz2DP7VgYLQ2jgyuwweHk4EErpIgs9gzltjKo_XHQqQYnNGil02SeSZsoswV03fs3kc1Epue7DG5lr5V0-Ay_gol7QvhBR9jw343agufswnOlUJUZfJJ9D9Yb4ABH0mzNEWuw1dQTiyz-DPFO9MDeAvNzbBbBnXHxFnFVyeL1IYNm7EmqJHSn-xRzfUibV-i8NVwxsk-opvryj8wc0jc8nonuwY-z2cUYt-n89KHjgHp0yF9mDZZYBdVEZojFYkdWwea_7MtjqlK-QSASL3coON7zKxvA28uu8t2L6uw_2lIzmd_k39LhPiXYy958zIvm5d271fhrPpF0lzDFz_2KrRjQDlIrHrvHQGsFIwdsRcavStr7VrTmiXHSO6p_m05kznrcCkv-dF4Wsd00r8tHnorvRLy8k_3Ea1SaL-LXOOPzqD_9AQW2S-Y" src="img/20241222_openv_sequence_diagram_generate_video.jpeg" alt="OpenV sequence diagram for video generation" >}}

i then broke down the project into various user stories together with ChatGPT o1.

one example is the “monthly quota” feature: it limits the user to generate 10 minutes of video per month. it also takes into account the custom date of the competition (dec 16, 2024 to jan 16, 2025):

<div class="special">

**user story**

as a user, i want a monthly video generation limit that can also be enforced within custom date ranges, so i never exceed my allowed usage, and admins can easily adjust or reset these limits.

**acceptance criteria**

1. **configurable window and limit**

   - the system reads a start date (`LIMIT_START_DATE`) and end date (`LIMIT_END_DATE`) from environment variables.
     - if these are set, the limit applies only within that date range.
     - if these are not set, the system defaults to a standard monthly cycle (usage resets on the 1st).
   - the total allowed monthly usage (`MONTHLY_LIMIT_SECONDS`) is also set via environment variables.

2. **usage tracking and enforcement**

   - each user has a `monthlyUsage` field (in seconds) that increments whenever they create a job.
   - on each job creation (`POST /api/runpod`):
     1. check if the current date is within the custom date range (`LIMIT_START_DATE` to `LIMIT_END_DATE`).
        - if yes, enforce the usage limit for that range.
        - if not, fallback to the standard monthly logic (usage resets on the 1st).
     2. compare `(current monthlyUsage + requestedVideoDuration)` to `MONTHLY_LIMIT_SECONDS`.
        - if it exceeds the limit, return an error (403 or 409) with a clear message (“you have reached your monthly limit.”).
        - otherwise, allow the job and add the requested video duration to `monthlyUsage`.

3. **monthly reset or end-of-period behavior**

   - when the date range ends (`LIMIT_END_DATE` is reached), the system reverts to the normal monthly cycle.
   - if no date range is defined, the system uses a standard monthly reset strategy (resetting `monthlyUsage` to 0 on the 1st).
   - document how and when these resets occur so admins can update the usage policy if needed.

4. **documentation**
   - in `docs/system-overview.md`, describe how the start date, end date, and monthly usage limit are read from environment variables.
   - provide examples: - a standard monthly cycle (no start/end date, 600 seconds limit). - a special date range (dec 16 – jan 16) with a higher or lower limit.
   </div>

### refining the frontend

after defining the foundation and the corresponding user stories, i went back into [v0](https://v0.dev) to refine the prototype for [OpenV](https://openv.ai). the goal was to make it more user-friendly and provide a place to control all the settings needed to generate videos with mochi.

78 prompts later:

{{< img-link url="https://openv-v2.vercel.app" src="img/20241225_openv_v0_prototype_v2_final.jpeg" alt="OpenV prototype v2 generated with V0" >}}

### developing the whole thing

the next step was to get the generated frontend from [v0](https://v0.dev) into the project with the help of [Cursor](https://www.cursor.com) (using the agent in composer).

then i added all the business logic based on the user stories:

- generate videos using the api deployed on RunPod
- basic job status checking (initial naive approach)
- webhook-based status updates with efficient polling
- “my videos” to show all generated videos
- concurrent job limits
- left sidebar to navigate between views
- “inspiration” view for prompt examples
- “terms of use” workflow with version control to enforce users to accept before they can use “my videos”
- account management view
- voucher system for platform access, so only “Project Odyssey” attendees can use [OpenV](https://openv.ai) for free
- “monthly quota” to restrict usage to 10 minutes of generated video per user
- proper landing page (generated with [v0](https://v0.dev) and then refined with [Cursor](https://www.cursor.com))
- unit & integration tests

### improve with feedback

i spent 1h with [frank myles](https://www.frankmyles.com/) (product designer at [RunPod](https://runpod.io), thank you!) to refine the ux. we ended up with this ui mock:

{{< img-link src="img/20241210_openv_ux_feedback_frank_myles.jpeg" alt="OpenV UX feedback from Frank Myles" >}}

the most important change was removing the settings panel on the right and instead integrating it into the prompt component. i took this back into [v0](https://v0.dev) and generated a very concise version of the prompt.

33 prompts later:

{{< img-link url="https://openv-promptv2.vercel.app/" src="img/20241228_openv_prompt_v2.jpeg" alt="OpenV home page redesign v1" >}}

### good enough landing page

went back to [v0](https://v0.dev) to generate a proper landing page and finally put into words what [OpenV](https://openv.ai) is all about.

37 prompts later:

{{< img-link url="https://openv-homepagev1.vercel.app" src="img/20241228_openv_hompage_redesign_v1.jpeg" alt="OpenV home page redesign v1" >}}

integrated the new landing page with [Cursor](https://www.cursor.com) into [OpenV](https://openv.ai):

<div class="special">

i have used another ai to generate a new home page in `@new-home-page.tsx`. please use this as our new `@page.tsx` but use our components (`logo`, `title`). also make sure to replace our `@footer.tsx` with the footer from `@new-home-page.tsx`.

</div>

### pm & legal

on top of this, i was using [ChatGPT o1](https://chatgpt.com/?model=o1) to generate all the tickets and made sure that the provided “terms of use” from legal are in sync with [OpenV](https://openv.ai).

### manual work

the only manual part was setting up the various accounts (as it was my first time using [Clerk](https://clerk.com), [Supabase](https://supabase.com), [UploadThing](https://uploadthing.com)), getting budget approved, having meetings with people, talking via slack, and making sure everything is deployed.

## competition starts

{{< meta date="dec 16, 2024 to jan 16, 2025" >}}

participants receive access to all the tools for [Project Odyssey](https://projectodyssey.ai) via email.

[OpenV](https://openv.ai) is not ready yet, so the landing page says: `we are still cooking`.

## release day!

{{< meta date="dec 19, 2024" >}}

[OpenV](https://openv.ai) officially launched three days after the competition started. this was needed because OpenV was not feature-complete yet and i needed to fix some “production only” bugs.

{{< img-link src="img/20241231_openv_myvideos_v1.jpeg" alt="OpenV showing 'my videos'" >}}

## time tracking

let's break down the time spent on [OpenV](https://openv.ai):

- **initial prototype (oct 26)**: ~2h
- **model as api (nov 28 - dec 6)**: 2 pt (8h / person)
- **the web app (dec 9-18)**:
  - one full weekend (~18h)
  - ~8 working days with roughly 8h/day focused on [OpenV](https://openv.ai) = ~64h
  - total for this phase: ~84h

which results in around ~100h total.

i spent a lot of time getting the tests working right, so if you want to be even quicker, you could skip them for the mvp and add them after launch. but for me personally, i feel more comfortable running tests than testing everything manually.

## what's shipping next?

- nsfw filter for the prompt
- ui performance improvements
- hunyuanfast model for video generation

## how to use an agent?

while working on this project, i learned a lot about how to work with an agent (running on [Claude](https://anthropic.com)-3.5-sonnet inside [Cursor](https://www.cursor.com)):

1. provide a lot of context (like [`.cursorrules`](https://github.com/runpod/openv/blob/main/.cursorrules) & [docs](https://github.com/runpod/openv/tree/main/docs)) so the agent goes in the same direction you want.
2. do the review on the spot and try to understand the changes. don’t just approve everything if you want to build a high-quality product. if you don’t, you might end up solving the same problem in a different way over and over.
3. when the agent does something “wrong” from your perspective, try to understand why it did that and then update your context (like adding a new rule in `.cursorrules`) to prevent it from happening again.
4. treat commits as checkpoints and don’t be afraid to revert to them if you want to go back.

## build your own ai startup

all of this is open source, as we want to empower developers around the world to build on top of [OpenV](https://openv.ai) and create their own ai startup.

- web app: [OpenV](https://github.com/runpod/openv) (MIT)
- model api: [worker-mochi](https://github.com/runpod-workers/worker-mochi) (MIT)

## conclusion

we are living in amazing times, where one person can build and release a full-fledged ai startup in just ~100h by using ai.

what will this number be at the end of 2025?

## thanks

i'm so grateful to be working at [RunPod](https://runpod.io) (thanks to everyone there), because i can create cool ai stuff with awesome people.

can someone pinch me, please?
