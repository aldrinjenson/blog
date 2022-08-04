---
title: "I gave a talk at an international conference and Murphy's law sucks!"
date: 2022-07-26T19:09:07+05:30
description: "How my faith in Arch Linux was may be a bit too much🥲"
tags: [indiaFoss, FOSS, arch-linux, talk]
draft: true
---


## Introduction

I got an opportunity to present a talk for IndiaFoss conference held in Bangalore on 23-24 July 2022 and boy, Murphy's law messed up my presentation!


The topic of my talk was: How to make sharing of digital assets as easy and accessible as possible.
It was about an app I made to send messages by using the most common app in one's phone without having to save contact number


## Background

Whatsapp has a public api to open the chat of someone from a link. Really useful for companies who would want to have a link on which when clicked, takes the user to the Whatsapp chat of the company.
It looks kind of in the following format: api.whatsapp.com/send?<number>


There's an even shorter version which looks like: wa.me/<number>


I've been using this for months and recently when I had to learn Flutter for college mini-project, I wanted to try out my Flutter experiences by building an app. Hence I built my app:send_whatsapp_msg_without save. Cheesy name, I know. Making it the most obvious/explicit.

Anyways, I had made this app 2 months ago and the funny thing is that this was super useful for me. I never expected to be using this app so much, but it' like one of those apps which you never know you needed it until you really start using it.

---

Anyways, I was inspired by a talk which I heard over at IndiaFoss from Akash Hamirwasia who made a web-app called blaze for sending files over the internet using a website.
His project was cool, but to me it seemed like the common man would find it a bit difficult. When I talk about the common man, I'm talking about they who doesn't even know to open web browsers. Yes, I've seen people to whom when I asked to search this term, they have opened settings and searched in the settings searchbar.

To these people, they don't have a browser in their home screens. It may be there somewhere in the apps list, but the only apps they care about are Whatsapp, Facebook and some Indian Music app. You can easily see people like this when you travel by local buses.

People are really helpful and I've been asked not more than once by people to share my number so that they could save it to their contact list and have them send some file or link to me. The thing is these people won't necessarily be using my number ever again, but they still are having to save my contact for the lack of a better familiar option.

Whatsapp is the app with which they are the most comfortable... if only there was a way to send files through whatsapp without having to save the contact number...

Introducing my app which solves exactly this problem. It launches the above mentioned whatsapp api url behind the scenes to trigger and open whatsapp chat of the person whose number has just been entered.

## About the talk

So being inspired by Mr.Akash, I gave my name for the flash talk. I had to make a presentation and have it sent to their mail and all. But anyways, they were pretty impressed and I got selected.

Now I've being using Arch for so long and I had bought a new laptop only a few weeks ago. I had never connected this to an HDMI port before and was a bit doubtful. But then I saw others with thinkPad easily connnecting their laptops and presenting and so I thought like the plug and play support provided by Linux will have me covered.. boy I was mistaken.

Anwyays, I got slot number 8 of the only 9 slots available and by the time it was my turn, the participants had taken up more time than what they were allotted and the event was late of schedule.

My name got called, I went up and connected my laptop to HDMI cable only to find nothing being presented🥲.

Apparently my faith in Arch linux may have been a bit too much because had I bothered to check the status during some break maybe I wouldn't have to face the difficulty.(Well technically, I tried doing that but then another speaker beat me to it and took a long time that I had to leave.. still..).


So here I was in front of the stage with my laptop not being able to present and the schedule already really late for me to get another's laptop.

Well, I started speaking. I didn't want to take up more time and delay the program. So I talked about the problem, about my solution and about my app. I had this cool demo planned where I would call up someone from the audience and will send them a hi withought having to save their contact information, but couldn't do it without being able to present. Still I talked and showed my vision. I had a bit.ly link which I asked everyone to enter to see a demo which I think atleast a few would have done already.

I spoke and at then went down to sit. Instantly a guy near me asked if I could make something similar for iOS as well to which I had to reply by saying that I'm not having a macBook at present to compile and build for iOS even though I used Flutter to build the project.


Before I even left the hall, 3 people came near me and asked if I could build for iOS as well. I mean this is something magical about giving a talk I think. People know about your project and you get feedback instantly!







