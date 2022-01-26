---
title: "Love Match Calculator 😇"
date: 2022-1-23T19:25:18+05:30
draft: false
description: "My version of the Love Calculator. Use this to find the % love compatibility with your crush😉"
tags: [fun, firebase, ethics]
---

Before reading any further, visit this [link](https://aldrinjenson.github.io/Love-Calc/) and follow the instructions.

<hr>
Seriously dude, only continue if you visited the page and followed the instructions.

This project was inspired by an article written by Subin Siby of Vidhya Institue of Sciences where he mentioned about how we once got pranked by a similar site.
I haven't talked to him directly other than in an online meet when he answered a question I asked in chat, but I've heard he's a cool dude interested in building cool software. (Wish I could talk to him directly for once🤞).

Anyways, On April 1st 2020, I decided to build something since it's April Fool's and all. During those days, some of us in class had created a Whatsapp group for those interested in programming, where we shared different articles, tutorials etc for everyone to pick up and improve. In that group, began a conversation which somehow ended on the topic of compatibility between partners(I know, just the usual typical topic discussed in a programming group.😁). Anyway, I saw this message in the morning and this got me thinking. Since it was April Fool's day, I definitely wanted to do something fun; plus around that time, I had gotten myself pretty familiar with the awesome CSS framework [Materialize-CSS](https://materializecss.com/) and I wanted to build something cool with it as well.
So with all these reasons, I decided to build a Love compatibility calculator(Not an actual one ofc.)

## The Idea

The idea was simple - prank folks by asking them to enter the details of their crush for finding the percentage of love compatibility between them. What's the prank in this you ask? Well, once they details are submitted, instead of the data gets stored in a db and instead of a percentage value, the users get [Rick Rolled](https://en.wikipedia.org/wiki/Rickrolling)😇.

## Implementation

The project was built fairly quickly. I started working on it in the afternoon and by evening the whole project was pretty much completed.
The site was built using just HTML, Materialize-CSS and vanilla Javascript.
I used firebase as the database since it was super quick to set up.

Basically once the user filled the form with details, a POST request is made and a new record is created in the firebase DB.
The coding part was hence fairly easy. I added some GIFs and Mr.Been Youtube video as well.
Sadly though, I wasn't able to figure out how to autoplay Youtube videos in HTML at that time.

## Aftermath

I hosted the site using Netlify and put the link in the above mentioned Whatsapp group.
Well, a lot of people tried it out and quite a good number of people entered the names of their actual crush. When they found out at the end that it was a prank, well some took the joke lightly while others it seemed were quite anxious🙈.

I was actually very excited about this nice joke and had sent the link to 2 seniors from my college as well without much thinking. One chechi(elder sister) who was 3 years senior to me, sent me just one message after a while: `"Why?"`

All the excitement and pride of having built something cool suddenly drained out of me. I didn't know how to reply. After a while I took down the site, cleared the database and apologized. She was cool about my innocent joke though, as she later told me that she had a hunch about this being some sort of phishing website, so it was cool and all. But I was very much shaken. At that time, I didn't even know about the concept of phishing. On that day, I suddenly became very much aware of powers a programmer or a tech person holds. It's easy to trick people with innocent looking sites and apps. as much cliché as it may sound, with great power, comes great responsibility. It is not that difficult even for a single person to create a make believe site and ask people to enter sensitive information in the promise of some great reward. The collected information could then be used to blackmail the user and collect money or whatever.

This project hence, even though was a small one(only a few hours worth of work), it was an important one in my programming life. I realized that whatever you create could technically be used with a wrong intention as well which could result in major loss and sadness for people.

The main site was took down, and I had removed the firebase Db connections. What you might have already seen contains just the UI. So no data is sent to anyone in case you actually entered any sensitive information when you visited the above site. But of-course, you were smart and you didn't enter any actual details right?🌝

Check out the project code [here](https://github.com/aldrinjenson/Love-Calc)!
