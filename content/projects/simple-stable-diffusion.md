---
title: "Custom Stable Diffusion; uncensored, but without NSFW 🙂 "
date: 2023-07-23T19:25:18+05:30
draft: true
description: "How a Stable Diffusion project I created was used for NSFW purposes by the public and finally had to rewrite cuz it was hosted in College server🙂"
---

## Links

- http://diffusion.mec.ac.in/

## Project Abstract

A minimalist and opinionated web user interface (UI) for AI based image generation using the open source Stable Diffusion models.

## Tech Stack

- Python/Streamlit(awesome framework)
- Stable diffusion webUI by Automatic1111

## Thoughts

- I initially hosted the Stable-Diffusion-webUI by Automatic11111 directly in our servers. We made

## How it came to be

1. I got admitted into Govt. Model Engineering College
2. The final year project our team worked on required GPU resources
3. Titty sir and CS department was kind and considerate to give access to a GPU server from MEC
4. I was so happy with getting access to a server that I tried out lot of cool ML models that I may not have been able to try out otherwise on my laptop🙂
5. I was lucky enough to get access during the time when stable diffusion and LLMs were beginning to be in the hype. After Facebook's LLama model weights were made public,lot of development in the Open Source LLMs were being done, leading to lot of cool tools and projects to explore

- Discovered stable diffusion from the internet and explored it extensively - from generating character based images using LoRa to creating AI QR codes using ControlNet.

There was this awesome open-source project called stable-diffusion-webui by a person called Automatic1111(props to him for the great open source work he has done). I was doing all my image generation on his project. I tested out a lot of differrent models starting from the base stable-diffusion 1.5 to a wide variety of others ranging from generating comic book style versions to super ultra realistic portraits of Humans. Lot of time was spent on reading blogs, watching Youtube videos exploring various models etc to try this out. His software requires a good GPU and could only be run in the college Server with 8 GB GPU.

Now after being satisfied, towards the end of my final year project, I went to Titty Sir(bless him for being so awesome) and showed him the UI. He was impressed and liked the idea. He was cool with opening it to the public. I was happy too, though after having explored the models quite well, I was aware that this could be well misused as well. The stable diffusion webui involved a section where you can just use just your text to manipulate existing images - similar to using PhotoShop / Adobe Firefly.

But then I went with the flow, because I remembered the quote which is associated with Linux and Mac:

> Mac is not idiot proof, it is smart people proof.

Most people would just want something that works, but there would be a few people. Few tinkerers who really want to explore and do great things. Craftsmen - tinkerers who would think about taking existing pices and thinking ho they could bbe crafted upon in great creative ways. For them, I felt the extra features would be super useful.
