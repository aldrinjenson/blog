---
title: "Speaking at IndiaFOSS 2.0 — and how Murphy's Law made it interesting"
date: 2022-07-26T19:09:07+05:30
description: "Notes from giving my first international conference talk at IndiaFOSS 2.0, July 23–24, 2022 at NIMHANS, Bengaluru — and what happened when Arch Linux let me down on stage."
tags: ["indiafoss", "foss", "arch-linux", "talk", "public-speaking", "community", "linux"]
categories: ["Personal"]
draft: false
---

## Introduction

I was selected to deliver a Flash Talk at **IndiaFOSS 2.0**, held on **July 23–24, 2022 at the NIMHANS Convention Centre in Bengaluru**. IndiaFOSS is the flagship annual Free and Open Source Software conference organised by the [FOSS United Foundation](https://fossunited.org/), and the 2.0 edition received approximately 122 talk submissions of which around 30 were selected through peer review — about a 25% acceptance rate. This was my first time speaking at a conference of this scale, and as it turned out, [Murphy's Law](https://en.wikipedia.org/wiki/Murphy's_law) had plans of its own.

<center>
  <image src="/images/indiaFoss/indiaFossTalk.jpg" alt="Speaking at IndiaFOSS 2.0, NIMHANS Convention Centre, Bengaluru — July 2022"/>
<p class='caption'>On stage at IndiaFOSS 2.0, NIMHANS Convention Centre, Bengaluru. (Excuse the 240p quality!)</p>
</center>

## The talk

**Title:** *How to make sharing of digital assets as easy and accessible as possible.*

The talk was built around [a small open-source app I had shipped earlier]({{<ref "projects/whatsapp-msg-without-save.md" >}}) that lets you send a WhatsApp message to any phone number *without first having to save the contact* — by generating a `wa.me` link in the background and triggering the WhatsApp chat directly.

## Why I built the project

The inspiration came from a previous IndiaFOSS talk by Akash Hamirwasia, who built [Blaze](https://blaze.vercel.app/) — a web app for sending files peer-to-peer over the internet. Blaze is a beautiful piece of engineering, but I kept thinking about the user I most wanted to reach: not the developer, not the early adopter, but the everyday person who is more comfortable inside WhatsApp than inside any web browser.

Anyone who has helped a parent or a grandparent open a browser knows what I mean. WhatsApp is the one app almost everyone in India is fluent in. So I built the smallest possible tool that meets people where they already are: enter a number, hit send, and you're inside a WhatsApp chat — no contact saved, no friction.

## And then Arch Linux happened

I had been daily-driving Arch Linux for a while and had recently switched to a new laptop. I'd seen ThinkPad-wielding speakers connect to the projector with no fuss all morning, so I assumed Linux's plug-and-play would have me covered. I was, in retrospect, perhaps a bit too confident.

I had been given slot 8 of 9, and by the time my name was called the schedule had slipped. I walked up, plugged in the HDMI cable, and… nothing on the projector. I'd intended to check the display setup during one of the breaks, but another speaker had grabbed the stage to test theirs and time had run out.

So there I was, in front of the room, with no slides and no demo.

I started talking anyway. I didn't want to delay the program any further, so I described the problem, walked through the solution, and explained how the app worked — without the live demo I'd planned (the one where I'd call up someone in the audience and send them a "hi" on WhatsApp without ever saving their number). I shared a `bit.ly` link to the demo and the GitHub repo so people could try it later.

## What happened afterwards

The reaction surprised me. Before I'd even left the hall, three people had come up to ask whether I could ship an iOS version. I had to explain that the project was built in Flutter and I didn't have a Mac at the time to compile and sign the iOS build.

That moment is when I understood something about giving a talk that you can't really get from shipping code into a repository. People learn about your project, give you feedback in real time, and tell you — to your face — whether the problem you solved actually mattered to them. It's a much faster signal than waiting on GitHub stars.

## Final thoughts

Speaking at a conference of this scale was a different kind of experience entirely. I went in expecting to deliver a clean demo and instead delivered an unscheduled lesson in resilience. The slides didn't survive contact with the projector, but the idea did, and that turned out to be the part that mattered.

If you're considering submitting to a community-organised FOSS conference for the first time: do it. The selection process is open, the audience is generous, and the worst that can happen — your laptop doesn't connect — is the kind of thing you'll be writing about years later anyway.

---

**EDIT (post-publication):** WhatsApp has since introduced a click-to-chat feature that replicates the core functionality of this app — paste an unsaved number into any chat, click it, and you're taken to a WhatsApp conversation with that number. The problem the project was built to solve has now been solved upstream by WhatsApp itself, which is, in its own way, the best outcome an open-source side project can hope for.
