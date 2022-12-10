---
title: "I gave a talk at an international conference and Murphy's law sucks!"
date: 2022-07-26T19:09:07+05:30
description: "How my faith in Arch Linux was may be a bit too much🥲"
tags: [indiaFoss, FOSS, arch-linux, talk]
draft: false
---

## Introduction

I got an opportunity to do a Flash-Talk for IndiaFoss conference held in Bangalore on 23-24 July 2022 and boy, [Murphy's law](https://en.wikipedia.org/wiki/Murphy's_law) messed up my presentation!

<center>
  <image src="/images/indiaFoss/indiaFossTalk.jpg" alt="My talk at IndiaFoss"/>
<p class='caption'>Excuse the 240p quality please!</p>
</center>

The topic of my talk was: **How to make sharing of digital assets as easy and accessible as possible.**
It was based on [an app I had made earlier]({{<ref "projects/whatsapp-msg-without-save.md" >}}) to send messages by using the most common app in one's phone - Whatsapp, without having to save anyone's contact number.

## Background

I was inspired by a talk which I heard over at IndiaFoss from Akash Hamirwasia who made a web-app called [Blaze](https://blaze.vercel.app/) for sending files over the internet using a website.
His project was cool, but to me it seemed like the common man would find it a bit difficult. When I talk about the common man, I'm talking about they who doesn't even know to open web browsers(Yes, I've seen people to whom when I asked to open browser, they have opened settings and searched "browser" in the settings searchbar. Just know that you are really privileged if you think such people don't exist).

Whatsapp is the app with which people are most comfortable. If only there was a way to send files through whatsapp without having to save the contact number...

Introducing my app which solves exactly this problem. It generates a wa.me link and opens it behind the scenes so as to trigger and open whatsapp chat of the person whose number has just been entered.

## About the talk

So being inspired by Mr.Akash, I submitted my presentation and was selected to speak. I had been using Arch Linux for a while now and recently got a new laptop, but I was unsure if it would be able to connect to the HDMI port for the presentation. I saw others with ThinkPads easily connecting their laptops and presenting, so I thought Linux's plug and play support would have me covered. Unfortunately, I was mistaken.

I was given slot number 8 out of the 9 available slots, but by the time it was my turn, the participants had taken up more time than allotted and the event was running behind schedule.

## Et tu Arch..

My name got called, I went up and connected my laptop to HDMI cable only to find nothing being presented🥲.

Apparently my faith in Arch linux may have been a bit too much because had I bothered to check the status during some break maybe I wouldn't have to face the difficulty.(Well technically, I tried doing that but then another speaker beat me to it and took a long time that I had to leave.. still..).

So here I was in front of the stage with my laptop not being able to present and the schedule already really late for me to get another's laptop.

Well, I started speaking. I didn't want to take up more time and delay the program. So I talked about the problem, about my solution and about my app. I had this cool demo planned where I would call up someone from the audience and will send them a hi over Whatsapp without having to save their contact information, but couldn't do it without being able to present. Still I talked and shared my idea. I had a bit.ly link which I asked everyone to enter to see a demo and url of github repo so that people could check out the project later as well.

## Afterwords

Right after I finished the talk and went to sit, a guy near me asked if I could make something similar for iOS as well to which I had to reply by saying that I'm not having a macBook at present to compile and build for iOS even though I used Flutter to build the project.

Before I even left the hall, 3 people came near me and asked if I could build for iOS as well. I mean this is something magical about giving a talk I think. People know about your project and you get feedback instantly! I was happy to realize that the problem I solved was worthwhile and that many people found the solution good enough to be used!

### Final Thoughts

This was the first time I was speaking at such a large conference and it certainly gave a whole different feel. While I was sad that I couldn't demo the presentation, I was happy that this would lead more people to benefit from my project.✨

EDIT: Whatsapp recently introduced a click to chat feature recently which would replicate the functionality of my app. You just have to pasta an unsaved number to some chat and then click it again within whatsapp to take you to the whatsapp chat of that person.
