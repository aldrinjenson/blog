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

## How it came to be

1. I got admitted into Govt. Model Engineering College
2. The final year project our team worked on required GPU resources
3. Titty sir and CS department was kind and considerate to give access to a GPU server from MEC
4. I was so happy with getting access to a server that I tried out lot of cool ML models that I may not have been able to try out otherwise on my laptop🙂
5. I was lucky enough to get access during the time when stable diffusion and LLMs were beginning to be in the hype. After Facebook's LLama model weights were made public,lot of development in the Open Source LLMs were being done, leading to lot of cool tools and projects to explore

- Discovered stable diffusion from the internet and explored it extensively - from generating character based images using LoRa to creating AI QR codes using ControlNet.

There was this awesome open-source project called stable-diffusion-webui by a person called Automatic1111(props to him for the great open source work he has done). I was doing all my image generation on his project. I tested out a lot of different models starting from the base stable-diffusion 1.5 to a wide variety of others ranging from generating comic book style versions to super ultra realistic portraits of Humans. Lot of time was spent on reading blogs, watching Youtube videos exploring various models etc to try this out. His software requires a good GPU and could only be run in the college Server with 8 GB GPU.

Now after being satisfied, towards the end of my final year project, I went to Titty Sir(bless him for being so awesome) and showed him the UI. He was impressed and liked the idea. He was cool with opening it to the public. I was happy too, though after having explored the models quite well, I was aware that this could be well misused as well. The stable diffusion webui involved a section where you can just use just your text to manipulate existing images - similar to using PhotoShop / Adobe Firefly.

But then I went with the flow, because I remembered the quote which is associated with Linux and Mac:

> Mac is not idiot proof, it is smart people proof.

Most people would just want something that works, but there would be a few people. Few tinkerers who really want to explore and do great things. Craftsmen - tinkerers who would think about taking existing pices and thinking ho they could bbe crafted upon in great creative ways. For them, I felt the extra features would be super useful.

## Thoughts

- I initially hosted the Stable-Diffusion-webUI by Automatic11111 directly in our servers.
- Showed it to Titty Sir and he liked it and was cool to make it public. Titty sir is a good person.
- Anyways, we did it so and then people strated using it for NSFW images because the model used was uncensored🙂
- uncensored models are usually way powerful and really good at generating realistic faces and hyper realistic natural bodies, but yeah they can be used for nsfw content too.
- By default the Automatic1111 webui used to save all images generated in the db. Surprised to find the patter that, the common themes were: celebrities, Gods, random descriptions of art copied from midjourney and then nsfw content.
- Very few people tried generating nsfw, but those that did, actually tried generating a lot!

### Issues with Automatic1111

- Was too complex for most people.
- Many people used it for generating images with their names. They didn't really understand the power and potential of such project
- So many feature, with little to no description on hwo to use them!(In the project's defence, it was meant for people who were already familiar with stable diffusion concepts). Hence wasn't suitable for a lot of people because they find it too hard to use
- Had a bug where if you hit the Generate button without any prompt, then by default it generates random images and multiple of these were NSFW.

## So,

The model I used was one called Deliberate. It was the most rated and downloaded model in civitai during that time. It was really good at generating faces and any general purpose art for that matter. This is the model which caused issues:)

As soon as a friend called me up and informed about the bug, I called up Titty sir, told him as well and we decided to replace deliberate with a pixar based model. This model works, but was definitiely less impressive. Almost like how chatGPT got nerfed out, this one was weak, but yes no more NSFW content.

But now there's the issue of the ui being complex.

The solution was simple. Build something new from scratch.
Well, that's exactly what I did.
