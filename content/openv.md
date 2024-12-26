---
  title: "how to prompt an ai video platform (fast)"
  date: 2024-12-21T00:00:00+02:00
  draft: false
  type: "subpage"
  img: "20221211_NERDDISCO_nd-xmas-001.jpg"
  tags: ""
---

## the idea

{{< date "oct 26, 2024" >}}

when i saw [rain1011/pyramid-flow-sd3](https://huggingface.co/rain1011/pyramid-flow-sd3) (= an open source video generation model), the idea for a new side project was born: a platform called OpenV (= Open Video) that can generate videos with open source ai models.

so i drafted a quick prototype using [v0](https://v0.dev):

{{< img-link url="https://v0.dev/chat/lNqzYhBbwMA" src="img/20241220_openv_v0_prototype_v1_initial.jpeg" alt="OpenV v0 prototype initial version" >}}

34 prompts later, i ended up with a version i was happy with:

{{< img-link url="https://v0.dev/chat/lNqzYhBbwMA" src="img/20241220_openv_v0_prototype_v1_final.jpeg" alt="OpenV v0 prototype final version" >}}

## Project Odyssey

{{< date "oct 29, 2024" >}}

CivitAI reached out to RunPod about becoming a gold sponsor for their ai film competition, [Project Odyssey](https://projectodyssey.ai) (dec 16, 2024 – jan 16, 2025), and we directly said yes. one part of the sponsorship deal says, that we have to provide our own video gen tool for the contestants of [Project Odyssey](https://projectodyssey.ai). and the tool must be free for the duration of the competition, so that users can generate up to 10 minutes of video.

{{< img-link url="https://www.youtube.com/watch?v=quSWxWpfMB0" src="img/20241216_civitai_project_odyssey_s2.jpeg" alt="CivitAI Project Odyssey Season 2" >}}

we decided to convert my side project OpenV into a full-blown product, to showcase the power of RunPod and provide educational resources for developers. but instead of using [pyramid-flow-sd3](https://huggingface.co/rain1011/pyramid-flow-sd3), we decided to use [mochi](https://github.com/genmoai/mochi) as the video generation model, as it generates way better high quality videos.

### category: sponsored tools

[Project Odyssey](https://projectodyssey.ai) has its own category for sponsored tools, which means that videos generated with OpenV can be submitted to the competition and RunPod will be judging them. the winners will receive prizes, so make sure to check this out if you are interested to win.

## PoC: model as api

{{< date "nov 28 - dec 6, 2024" >}}

the first thing i do in ai projects is usually to get a specific open source model running as an api on RunPod (think of this as a poc). when it's working, i continue with the rest of the project.

integrating mochi-1 was straight forward, as i could get a lot of inspiration from [camenduru/mochi-1-preview-tost](https://github.com/camenduru/mochi-1-preview-tost): a worker providing [mochi](https://github.com/genmoai/mochi) as a RunPod-compatible worker using ComfyUI in python.

### storage

first i tried to use the blob storage from Vercel, but this had no steady connection (upload failed many times, even with a retry strategy). so i switched over to UploadThing, which is working great. (i just don't think that my python implementation of the api is correct, would you mind to help me out here? yes, i mean literally you!)

## ai workflow

{{< date "dec 9 - 18, 2024" >}}

### planning

i used o1 to create a detailed high level overview of the project and how a typical workflow might look like.
this ended up in a nice sequence diagram showcasing the most important user interaction: generating a video.

{{< img-link url="https://mermaid.live/view#pako:eNp9U9Fq3DAQ_JVFD-FKr_0AQwO9-lwCLRj7nELxi87a3Kmxta4spZSQf-_KkpP2HHoPZ8s7M9oZaR9FRwpFJib86dF0mGt5snJoDfBvlNbpTo_SOGhATtBMaNelYh9qhSXj0Kh1_WN5EwD8WNfyXSjl0smjnHBdr8pQr7wp6RXl-hCqtSMrT0yOgObd9XWxz2DP7VgYLQ2jgyuwweHk4EErpIgs9gzltjKo_XHQqQYnNGil02SeSZsoswV03fs3kc1Epue7DG5lr5V0-Ay_gol7QvhBR9jw343agufswnOlUJUZfJJ9D9Yb4ABH0mzNEWuw1dQTiyz-DPFO9MDeAvNzbBbBnXHxFnFVyeL1IYNm7EmqJHSn-xRzfUibV-i8NVwxsk-opvryj8wc0jc8nonuwY-z2cUYt-n89KHjgHp0yF9mDZZYBdVEZojFYkdWwea_7MtjqlK-QSASL3coON7zKxvA28uu8t2L6uw_2lIzmd_k39LhPiXYy958zIvm5d271fhrPpF0lzDFz_2KrRjQDlIrHrvHQGsFIwdsRcavStr7VrTmiXHSO6p_m05kznrcCkv-dF4Wsd00r8tHnorvRLy8k_3Ea1SaL-LXOOPzqD_9AQW2S-Y" src="img/20241222_openv_sequence_diagram_generate_video.jpeg" alt="OpenV sequence diagram for video generation" >}}

i also generated a lot of user stories, that only contained the story + acceptance criteria.

### refining

went into v0 to get started with the frontend and iterated on the prototype i had created previously. it took me 78 prompts until the result was nice:

{{< img-link url="https://openv-v2.vercel.app" src="img/20241225_openv_v0_prototype_v2_final.jpeg" alt="OpenV prototype v2 generated with v0" >}}

### foundation

to get started quickly, i used [nextjs-starter-kit](https://github.com/michaelshimeles/nextjs-starter-kit) from [Michael Shimeles](https://www.rasmic.xyz) as the foundation. it comes packed with:

- NextJS + Shadcn/UI + TypeScript
- Clerk for authentication
- Supabase as database in combination with Prisma as orm
- Stripe for payments (but as we are not charging anything, this is not needed)

this results in a system overview like this:

{{< img-link url="https://openv.ai#startup-template" src="img/20241226_openv_system_overview.jpeg" alt="OpenV system overview" >}}

### developing

next step was to get the generated frontend from v0 into the project with the help of Cursor (using the agent in composer).

then i added all the business logic:

- Generate videos using the API deployed on RunPod
- Basic job status checking (initial naive approach)
- Webhook-based status updates with efficient polling
- "My Videos" to show all generated videos
- Concurrent job limits
- Left sidebar to navigate between views
- "Inspiration" view for prompt examples
- "Terms of Use" workflow with version control to enforce users to accept before they can use "My Videos"
- Account management view
- Voucher system for platform access, so that only "Project Odyssey" attendees can use OpenV for free
- "Monthly quota" to restrict the usage to 10 minutes of generated video per user
- Proper landing page (generated with v0 and then refined with cursor)
- Unit & integration tests

i also had a session with Frank Myles (product designer at RunPod) to refine the UX (thank you, Frank!). this was super easy, as i used the feedback in v0 to iterate very quickly on the ideas and was able to get this done in a few hours.

on top of this i was using ai to generate all the tickets and made sure that the legal documents are in place. the only manual thing was setting up the various accounts and making sure that everything is deployed.

### how to use cursor agent?

while working on this project, i learned a lot about how to work with an agent (that runs on _claude-3.5-sonnet_):

1. provide a lot of context (like `.cursorrules`, 'system docs', or 'diagrams', etc.) so that the agent goes into the same direction that you also want to go.
2. do the review on spot and try to understand the changes, don't just approve everything if you want to build a high quality product. if you don't do this, then you might end up with the same problem being solved in a different way over and over. which will make it harder in the future to add more features.
3. when the agent does something "wrong" from your perspective, try to understand why it did that and then update your context (like adding a new rule in `.cursorrules`) to prevent it from happening again.
4. treat commits as checkpoints and don't be afraid to revert to them if you want to go back.

## competition starts

{{< date "dec 16, 2024 - jan 16, 2025" >}}

participants receive access to all the tools for [Project Odyssey](https://projectodyssey.ai) via email. we are not done yet, so we provide this message on the landing page: `We are still cooking`.

## release day!

{{< date "dec 19, 2024" >}}

OpenV officially launched 3 days after the competition has started! this was needed as deploying the app on Vercel was producing a few bugs that didn't show up in local development.

## time tracking

let's break down the time spent on OpenV:

- **initial prototype (oct 26)**: ~2h for 34 prompts in v0
- **model as api phase (nov 28 - dec 6)**: 2 pt (as mentioned above)
- **ai workflow phase (dec 9-18)**:
  - one full weekend of work (~20h)
  - ~8 working days with roughly 8h/day focused on OpenV = ~64h
  - total for this phase: ~84h

which results in around 102h total.

i spend a lot of time on getting the tests working right, so if you want to be even more quick, you could remove them for the MVP and add them after you have launched. but for me personally, i feel much more comfortable with running tests than testing everything manually.

## build your own ai startup

all of this is open source, as we want to empower developers around the world to build on top of OpenV and create their own ai startup.

- Web App: [OpenV](https://github.com/runpod/openv) (MIT)
- Model API: [worker-mochi](https://github.com/runpod-workers/worker-mochi) (MIT)

## conclusion

we are living in amazing times, where one person can build and release a full fledged ai startup in just 102h by using ai.

## thanks

i'm so grateful to be working at RunPod, where i can work on cool ai demos as my job. can some please pinch me?

thanks to everyone at RunPod for making all of this possible and being such a supportive team to work with.
