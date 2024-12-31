---
  title: "how to prompt an ai video platform for project odyssey"
  date: 2024-12-21T00:00:00+02:00
  draft: false
  type: "subpage"
  img: "20221211_NERDDISCO_nd-xmas-001.jpg"
  tags: ""
---

## tl;dr

i created an ai video gen platform called [OpenV](https://openv.ai) in ~100 hours by using ai (planning in [ChatGPT o1](https://chatgpt.com/?model=o1), frontend in [v0](https://v0.dev), business logic in [Cursor](https://www.cursor.com) agent) for [CivitAI](https://civitai.com)'s [Project Odyssey](https://projectodyssey.ai) (an ai film competition). it's built on top of the [nextjs-starter-kit](https://starter.rasmic.xyz/) by [Ras Mic](https://www.rasmic.xyz) (which comes with [NextJS](https://nextjs.org), [Shadcn](https://ui.shadcn.com), [Clerk](https://clerk.com), [Supabase](https://supabase.com)), deployed on [Vercel](https://vercel.com) & [RunPod](https://runpod.io), while using [UploadThing](https://uploadthing.com) as storage and [Mochi 1](https://genmo.ai) as the model to generate videos.

## the idea

{{< meta date="oct 26, 2024" >}}

when i saw [rain1011/pyramid-flow-sd3](https://huggingface.co/rain1011/pyramid-flow-sd3) (= an open source video generation model), the idea for a new side project was born: a platform called [OpenV](https://openv.ai) (= Open Video) that can generate videos with open source ai models.

so i drafted a quick prototype using [v0](https://v0.dev):

```markdown
I want to build a website based on nextjs, shadcn, typescript. Its name is "OpenV" and it's an generative video web app using AI. We are building the homepage, which consists of:

- a large prompt area and a "generate" button and an element to change the length (5 or 10 seconds) and an checkbox to "enhance prompt"
- a tab area with "inspiration" and "my videos"
- inspiration showing in a grid videos from other users and how to guidelines
- my videos showing all videos that the user already has generated
- when the user clicks on generate, the video is added in some kind of queue and the queue is always visible
```

{{< img-link url="https://v0.dev/chat/lNqzYhBbwMA" src="img/20241220_openv_v0_prototype_v1_initial.jpeg" alt="OpenV v0 prototype initial version" >}}

34 prompts later:

{{< img-link url="https://v0.dev/chat/lNqzYhBbwMA" src="img/20241220_openv_v0_prototype_v1_final.jpeg" alt="OpenV v0 prototype final version" >}}

i then used pyramid-flow-sd3 via an api on [RunPod](https://runpod.io), but did not connect the frontend with this api. and then the weekend was over.

## project odyssey

{{< meta date="oct 29, 2024" >}}

[CivitAI](https://civitai.com) reached out to [RunPod](https://runpod.io) about becoming a gold sponsor for their ai film competition, [Project Odyssey](https://projectodyssey.ai) (dec 16, 2024 – jan 16, 2025), and we directly said yes.

{{< img-link url="https://www.youtube.com/watch?v=quSWxWpfMB0" src="img/20241216_civitai_project_odyssey_s2.jpeg" alt="CivitAI Project Odyssey Season 2" >}}

one part of the sponsorship deal says that we have to provide our own video gen tool, that can be used the by contestants of [Project Odyssey](https://projectodyssey.ai) for free for the duration of the competition to generate up to 10 minutes of video.

as [RunPod](https://runpod.io) is a provider of infrastucture for ai companies, we had no such tool in our portfolio. this is why we decided to convert my side project [OpenV](https://openv.ai) into a full-blown product. the goal is to showcase the power of RunPod and provide educational resources for developers. but instead of using [pyramid-flow-sd3](https://huggingface.co/rain1011/pyramid-flow-sd3), we decided to use [Mochi](https://github.com/genmoai/mochi) as the video generation model, as it generates way better high quality videos.

### category: sponsored tools

[Project Odyssey](https://projectodyssey.ai) has its own category for sponsored tools, which means that videos generated with [OpenV](https://openv.ai) can be submitted to the competition and [RunPod](https://runpod.io) (propably me + community votes, will ask about this on socials) will be judging them. the winners will receive prizes, so make sure to check this out if you are interested to win.

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

then i switched over to [UploadThing](https://uploadthing.com), which was working great. (i just don't think that [the python implementation of the api](https://github.com/runpod-workers/worker-mochi/blob/main/src/handler.py#L49-L140) is correct. would you please help me out here, Theo?)

### response

when the user wants to generate a video, [OpenV](https://openv.ai) will send a request to the api, which will add the request to a queue and returns a job id. [OpenV](https://openv.ai) also provides a webhook endpoint, that the api will call when the video was generated (or inform about an error).

```json
{
  "id": "job-123",
  "status": "COMPLETED",
  "output": {
    "result": "https://utfs.io/f/a655aa95-1f60-4809-8528-25a875d80539-92yd7b.mp4"
  }
}
```

## The Web App

{{< meta
date="dec 9 - 18, 2024"
src="https://github.com/runpod/openv"
src-name="OpenV"
license="MIT">}}

### foundation

to get started quickly, i used [nextjs-starter-kit](https://starter.rasmic.xyz/) from [Michael Shimeles](https://www.rasmic.xyz) as the foundation. it comes packed with:

- NextJS + [Shadcn/UI](https://ui.shadcn.com) + [TypeScript](https://www.typescriptlang.org)
- [Clerk](https://clerk.com) for authentication
- [Supabase](https://supabase.com) as database in combination with [Prisma](https://www.prisma.io) as orm
- [Stripe](https://stripe.com) for payments (but as we are not charging anything, this is not needed)

it helps me a lot to have a visual representation of the project, so i created this system overview:

{{< img-link url="https://openv.ai#startup-template" src="img/20241226_openv_system_overview.jpeg" alt="OpenV system overview" >}}

### planning

i used ChatGPT o1 to create a high level overview of the project and tried to describe how a typical workflow might look like.
this ended up in a nice sequence diagram showcasing the most important user interaction: generating a video.

{{< img-link url="https://mermaid.live/view#pako:eNp9U9Fq3DAQ_JVFD-FKr_0AQwO9-lwCLRj7nELxi87a3Kmxta4spZSQf-_KkpP2HHoPZ8s7M9oZaR9FRwpFJib86dF0mGt5snJoDfBvlNbpTo_SOGhATtBMaNelYh9qhSXj0Kh1_WN5EwD8WNfyXSjl0smjnHBdr8pQr7wp6RXl-hCqtSMrT0yOgObd9XWxz2DP7VgYLQ2jgyuwweHk4EErpIgs9gzltjKo_XHQqQYnNGil02SeSZsoswV03fs3kc1Epue7DG5lr5V0-Ay_gol7QvhBR9jw343agufswnOlUJUZfJJ9D9Yb4ABH0mzNEWuw1dQTiyz-DPFO9MDeAvNzbBbBnXHxFnFVyeL1IYNm7EmqJHSn-xRzfUibV-i8NVwxsk-opvryj8wc0jc8nonuwY-z2cUYt-n89KHjgHp0yF9mDZZYBdVEZojFYkdWwea_7MtjqlK-QSASL3coON7zKxvA28uu8t2L6uw_2lIzmd_k39LhPiXYy958zIvm5d271fhrPpF0lzDFz_2KrRjQDlIrHrvHQGsFIwdsRcavStr7VrTmiXHSO6p_m05kznrcCkv-dF4Wsd00r8tHnorvRLy8k_3Ea1SaL-LXOOPzqD_9AQW2S-Y" src="img/20241222_openv_sequence_diagram_generate_video.jpeg" alt="OpenV sequence diagram for video generation" >}}

i then broke down the project into various user stories together with ChatGPT o1.

one example is the "monthly quota" feature: it limits the user to generate 10 minutes of video per month. it also takes into the custom date of the competition (dec 16, 2024 - jan 16, 2025) into account:

<div class="special">

**User Story**

As a user, I want a monthly video generation limit that can also be enforced within custom date
ranges, so I never exceed my allowed usage, and admins can easily adjust or reset these limits.

**Acceptance Criteria**

1. **Configurable Window and Limit**

   - The system reads a start date (`LIMIT_START_DATE`) and end date (`LIMIT_END_DATE`) from
     environment variables.
     - If these are set, the limit applies only within that date range.
     - If these are not set, the system defaults to a standard monthly cycle (e.g., usage resets
       on the 1st of each month).
   - The total allowed monthly usage (e.g., `MONTHLY_LIMIT_SECONDS`) is also set via environment
     variables.

2. **Usage Tracking and Enforcement**

   - Each user has a `monthlyUsage` field (in seconds) that is incremented whenever they create a
     job.
   - On each job creation (`POST /api/runpod`):
     1. Check if the current date is within the custom date range (`LIMIT_START_DATE` to
        `LIMIT_END_DATE`).
        - If yes, enforce the usage limit for that range.
        - If not, fallback to the standard monthly logic (e.g., usage resets on the 1st).
     2. Compare `(current monthlyUsage + requestedVideoDuration)` to `MONTHLY_LIMIT_SECONDS`.
        - If it exceeds the limit, return an error (e.g., 403 or 409) with a clear message (“You
          have reached your monthly limit.”).
        - Otherwise, allow the job and add the requested video duration to `monthlyUsage`.

3. **Monthly Reset or End-of-Period Behavior**

   - When the date range ends (`LIMIT_END_DATE` is reached), the system reverts to the normal
     monthly cycle.
   - If no date range is defined, the system uses a standard monthly reset strategy (e.g.,
     resetting `monthlyUsage` to 0 on the 1st).
   - Document how and when these resets occur so that admins can update the usage policy if needed.

4. **Documentation**
   - In `docs/system-overview.md`, describe how the start date, end date, and monthly usage limit
     are read from environment variables.
   - Provide examples:
     - A standard monthly cycle (no start/end date, 600 seconds limit).
     - A special date range (Dec 16 – Jan 16) with a higher or lower limit.

</div>

### refining the frontend

after defining the foundation and the corresponding user stories, i went back into [v0](https://v0.dev) to refine the prototype for [OpenV](https://openv.ai). the goal was to make it more user friendly and provide a place to control all the settings needed to generate videos with mochi.

78 prompts later:

{{< img-link url="https://openv-v2.vercel.app" src="img/20241225_openv_v0_prototype_v2_final.jpeg" alt="OpenV prototype v2 generated with V0" >}}

### developing the whole thing

next step was to get the generated frontend from [v0](https://v0.dev) into the project with the help of [Cursor](https://www.cursor.com) (using the agent in composer).

then i added all the business logic based on the user stories:

- generate videos using the api deployed on RunPod
- basic job status checking (initial naive approach)
- webhook-based status updates with efficient polling
- "my videos" to show all generated videos
- concurrent job limits
- left sidebar to navigate between views
- "inspiration" view for prompt examples
- "terms of use" workflow with version control to enforce users to accept before they can use "my videos"
- account management view
- voucher system for platform access, so that only "Project Odyssey" attendees can use [OpenV](https://openv.ai) for free
- "monthly quota" to restrict the usage to 10 minutes of generated video per user
- proper landing page (generated with [v0](https://v0.dev) and then refined with [Cursor](https://www.cursor.com))
- unit & integration tests

### improve with feedback

spend 1h with [Frank Myles](https://www.frankmyles.com/) (product designer at [RunPod](https://runpod.io), thank you!) to refine the ux. we ended up with this ui mock:

{{< img-link src="img/20241210_openv_ux_feedback_frank_myles.jpeg" alt="OpenV UX feedback from Frank Myles" >}}

the most important change was to get rid of the settings panel on the right and instead integrate it into the prompt component. i took this then into [v0](https://v0.dev) and generated a very concise version of the prompt.

33 prompts later:

{{< img-link url="https://openv-promptv2.vercel.app/" src="img/20241228_openv_prompt_v2.jpeg" alt="OpenV home page redesign v1" >}}

### good enough landing page

went back to [v0](https://v0.dev) to generate a proper landing page and finally putting into words what OpenV is all about.

37 prompts later:

{{< img-link url="https://openv-homepagev1.vercel.app" src="img/20241228_openv_hompage_redesign_v1.jpeg" alt="OpenV home page redesign v1" >}}

integrated the new landing page with [Cursor](https://www.cursor.com) into [OpenV](https://openv.ai):

<div class="special">

I have used another AI to generate a new home page in `@new-home-page.tsx`. please use this as our new `@page.tsx` but use our components (`logo`, `title`). also make sure to replace our `@footer.tsx` with the footer from `@new-home-page.tsx`.</div>

### pm & legal

on top of this i was using [ChatGPT o1](https://chatgpt.com/?model=o1) to generate all the tickets and made sure that the provided "terms of use" from legal are in sync with [OpenV](https://openv.ai).

### manual work

the only manual thing was setting up the various accounts (as it was the first time for me using [Clerk](https://clerk.com), [Supabase](https://supabase.com), [UploadThing](https://uploadthing.com)), getting budget approved, having meetings with people, talking via slack, making sure that everything is deployed.

## competition starts

{{< meta date="dec 16, 2024 - jan 16, 2025" >}}

participants receive access to all the tools for [Project Odyssey](https://projectodyssey.ai) via email.

[OpenV](https://openv.ai) is not ready yet, so the landing page reads: `we are still cooking`.

## release day!

{{< meta date="dec 19, 2024" >}}

[OpenV](https://openv.ai) officially launched 3 days after the competition has started! this was needed as OpenV was not feature complete yet and i needed to get some "production only" bugs fixed.

## time tracking

let's break down the time spent on [OpenV](https://openv.ai):

- **initial prototype (oct 26)**: ~2h
- **model as api (nov 28 - dec 6)**: 2 pt (8h / person)
- **the web app(dec 9-18)**:
  - one full weekend of work (~18h)
  - ~8 working days with roughly 8h/day focused on [OpenV](https://openv.ai) = ~64h
  - total for this phase: ~84h

which results in around ~100h total.

i spent a lot of time on getting the tests working right, so if you want to be even more quick, you could remove them for the mvp and add them after you have launched. but for me personally, i feel much more comfortable with running tests than testing everything manually.

## how to use an agent?

while working on this project, i learned a lot about how to work with an agent (that runs on [Claude](https://anthropic.com)-3.5-sonnet inside of [Cursor](https://www.cursor.com)):

1. provide a lot of context (like [`.cursorrules`](https://github.com/runpod/openv/blob/main/.cursorrules) & [docs](https://github.com/runpod/openv/tree/main/docs)) so that the agent goes into the same direction that you also want to go.
2. do the review on spot and try to understand the changes, don't just approve everything if you want to build a high quality product. if you don't do this, then you might end up with the same problem being solved in a different way over and over. which will make it harder in the future to add more features.
3. when the agent does something "wrong" from your perspective, try to understand why it did that and then update your context (like adding a new rule in `.cursorrules`) to prevent it from happening again.
4. treat commits as checkpoints and don't be afraid to revert to them if you want to go back.

## build your own ai startup

all of this is open source, as we want to empower developers around the world to build on top of [OpenV](https://openv.ai) and create their own ai startup.

- web app: [OpenV](https://github.com/runpod/openv) (MIT)
- model api: [worker-mochi](https://github.com/runpod-workers/worker-mochi) (MIT)

## conclusion

we are living in amazing times, where one person can build and release a full fledged ai startup in just ~100h by using ai.

what will this number be at the end of 2025?

## thanks

i'm so grateful to be working at [RunPod](https://runpod.io) (thanks to everyone there!), because i can create cool ai stuff with awesome people.

can someone pinch me, please?
