---
title: "Sending Whatsapp messages without saving contact"
date: 2022-6-23T19:25:18+05:30
draft: false
description: "An app I built to make the sharing of digital assets as easy and accessible as possible"
tags: [whatsapp, flutter, global-good]
---

### Abstract

An app I made to ensure that you can share links and files really easily to anyone without having to save the contact number of that person by using the already existing most famous digital medium of communication - Whatsapp.

Get the code and APK from this [link](https://github.com/aldrinjenson/send-whatsapp-msg-without-save)

## Introduction

I had to learn flutter for a mini-project in my college. I wanted to build something to try out and this is regarding a very simple Flutter app I made which I believe solves a great problem in the lives of the common people.

# The Problem

For a common man, the most familiar app in their phone is Whatsapp. All the controls for texting and sending files are so familiar to them. When they see someone new and have to send something to them, what they usually do is to save the contact number and then searches whatsapp to locate their chat and send the file or link.
This is cool and all, but why save someone's contact if it' going to be a one time file sharing..

I've faced this dilemma before as well when I'm part of the organizing team for some event and often times we may have to message the participants regarding some important announcement or even Google Meet links. E-mails cannot be relied upon for short term reminders while Whatsapp messages would be an excellent way.

If only there was some way to send messages and files through whatsapp without having to save contact....

## The Solution

Whatsapp have this public api which can be used to open the Whatsapp chat of a user by passing in the mobile number as parameter.

It's of this form:

> https://api.whatsapp.com/send?\<mobile-number>

This is nice if you're a techie as this is way better than actually having to save a contact number. However, it's still clumsy as you'd have to enter this long URL each time you want to text someone on Whatsapp. Aha, I know what you're thinking, what if me pass this to a url shortener like bit.ly... Well, you're right, an even easier way would be to have the url of the form:

> wa.me/\<mobile-number>

I've been using this above URL for months and it works flawlessly.

## Even better solution

Now, what if there was one app which could automate this even further so that even very common man could use this without having to use a browser to enter a URL each time!

Well, that's exactly what I made: An app which behind the scene, calls this link with a mobile number accepted as parameter.

Here's a demo:

<img src="/images/wa_msg_without_save_demo.gif" width=400 alt="demo workflow gif">
<br/>

## Code and implementation

The code is written in Flutter because the main reason for the starting of this project was for me to try out Flutter.

Right now, it's built only for Android as I don't have access to a Macbook.

The implementation part is very simple with just one class and one dart file.

The code can be found in this Github repo: [aldrinjenson/send-whatsapp-msg-without-save](https://github.com/aldrinjenson/send-whatsapp-msg-without-save)

## Conclusion and afterthoughts

Most of my projects so far which a lot of people have felt really awesome are those which are really simple to implement. Within just 2 months of building this app, I felt myself using this way more than I initially anticipated. An app like this is really useful if you're organizing an event and you'd want to just start a conversation with a participant but you know for sure that you won't be contacting him again after the event.

Also really useful if you started talking to someone at a conference and you want to send them a link about your project.

I found this really useful and when I showed it to a few friends, even they could instantly relate with the problem. Hey, maybe you can try out and see if it's useful to you as well✨.

Get the APK file from [here](https://github.com/aldrinjenson/send-whatsapp-msg-without-save)
