---
title: "Send Whatsapp messages without saving contact!"
date: 2022-6-23T19:25:18+05:30
draft: true
description: "An app I made to make sharing digital assets as easy and accessible as possible"
tags: [ whatsapp, flutter, global-good]
---

I had to learn flutter for a mini-project in my college. I wanted to build something to try out and this is regarding a very simple Flutter app I made which I believe solves a great problem in the lives of the common people.


# The Problem

For a common man, the most familiar app in their phone is Whatsapp. All the controls for texting and sending files are so familiar to them. When they see someone new and have to send something to them, what they usually do is to save the contact number and then searches whatsapp to locate their chat and send the file or link.
This is cool and all, but why save someone's contact if it' going to be a one time file sharing..

I've faced this dilemma before as well when I'm part of the organizing team for some event and often times we may have to message the participants regarding some important announcement or even Google Meet links. E-mails cannot be relied upon for short term reminders while Whatsapp messages would be an excellent way.

If only there was some way to send messages and files through whatsapp without having to save contact....


## The Solution

Whatsapp have this public api which can be used to open the Whatsapp chat of a user by passing in the mobile number as parameter.

It's of this form:
https://api.whatsapp.com/send?<mobile-number>o

This is nice if you're a techie as this is way better than

