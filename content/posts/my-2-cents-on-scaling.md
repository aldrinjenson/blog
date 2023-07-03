---
title: "My Two Cents on Scaling"
date: 2023-03-01T10:29:22+05:30
draft: true
description: "As a young developer, a few thoughts I've learned about scaling over the years"
tags: ["scaling", backend]
---


# Introduction

As a young developer, there are a few things I've learned about scaling over the years through talking to wise and experienced people in the industry. I want to share some of my thoughts on scaling and architecting software systems based on my experience. These thoughts are specific to certain software systems that I've used so far and are not generalized.

I am scared to write this to be honest. I am writing these mostly as a suggestion/ guidelines to myself to be used in the very near future. Many of these may be improved and if you know of them please don't hesitate to point them out in the comments. 

These are just a few tips and tricks I've learned, but it needn't be the best.

# Prerequisites

- I have limited years of experience
- These are the few things I've learned over the years after talking to wise or experienced people in the industry who know what they are talking about.

# Let's Begin

## 0. Don't Prematurely Optimize

You don't need to worry about scaling for your side project from the very beginning or ideation stage. Premature optimization can add more pressure and kill the initial drive/motivation.

## 1. Be Cautious With Serverless/Lambda Functions

Don't use serverless/lambda functions unless your service has certain peak times of load. Good candidates for serverless functions would be development servers or APIs which will be called occasionally only. Hence, it may not be a good idea to convert the whole backend to serverless most of the time.

## 2. Good Coding Practices Matter

No matter how much you architect, poor coding practices can always let you down. Writing optimized code always has way more precedence than the caching system you use or the type of database you use.

## 3. Decouple Gradually

You don't need to go full-blown serverless or monolith route. Just start by decoupling large bits. Maybe the database can be separated. If the app is complex, maybe the frontend and backend could be separated.

# Rules of Thumb

1. First and foremost, when you write code, ensure that it is written well with reasonable optimizations.
2. Whatever happens, don't use AWS Lightsail.
3. Start with a small EC2 instance maybe.
4. Maybe decouple the database gradually.
5. Maybe decouple the frontend and backend gradually.
6. Add EC2 to an auto-scaling group slowly.
7. Add a load balancer in front.
8. As you anticipate more traffic incoming, the load balancer + auto-scaling should help you scale while reducing costs.
9. If database requests are taking the maximum time, maybe see if you can decouple it, but still bring it closer to the same region using AWS Aurora or Amazon Relational Database service.

## Other Learnings

- Avoiding joins in the database is good.
  - If you think that most of your queries would be joins, maybe it's time to rearchitect your relational database or maybe even skip it to use a non-relational one.
- Make good use of Promise.all when necessary so as to parallelize network requests.
- Make good use of Cloudflare for free caching.
- Even adding simple caching in server without any Redis, just by storing the past result in memory for a short time, can severely improve performance speeds.
- JSON.stringify and JSON.parse (or their counterparts in other languages) are not CPU intensive operations. Write code well to avoid these.
- When you want to go the serverless route, it's much easier to write the serverless code using a traditional server-side framework and then write a wrapper file which converts it to serverless once you push to GitHub repo. (
- When you want to go the serverless route, it's much easier to write the serverless code using a traditional server-side framework and then write a wrapper file that converts it to serverless once you push it to the GitHub repo. For example, define all routes and write logic using something like Express.js in Node.js and then use a wrapper file that uses aws-serverless-express to do the conversion behind the scenes.
- When you just want to get an API hosted, free services like deta.sh could be really useful.
- When you know that you have a front-end and back-end separately from the beginning and the chances of projects scaling to extreme levels are rare, maybe start with Next.js. - P.S. What I've felt is that, if you are starting with a React project, it would be easiest to go with Next.js from the start.
- Supabase is a great free option for a hosted backend. It has the full power of a relational database (PostgreSQL) with a clean UI and authentication features.
- Setting up CI/CD pipelines is really good and can make you proud of yourself after saving your time.

## My defacto standard to start a new project:

- If it's React-based, use Next.js + Supabase. Host it on Vercel, managing DNS with Cloudflare and with caching turned on.
- Just a simple website, host it on Netlify or Vercel.
- If it's a proper backend server that needs to be running most of the time, host it on AWS EC2.
- If it's just a few APIs, host it on Deta.sh or AWS Lambda. If there's front-end code associated, use a Next.js project.

## Extra resources which I found to be quite useful

- [Scaling With Common Sense - Kaliash Nadh](https://zerodha.tech/blog/scaling-with-common-sense/)
- [MemCached](https://github.com/memcached/memcached/wiki/TutorialCachingStory)
- [rant](http://widgetsandshit.com/teddziuba/2008/04/im-going-to-scale-my-foot-up-y.html)

That's it! Scaling is not as hard as it seems to be. Keep these rules of thumb and best practices in mind, and you'll be on your way to success. Remember to keep your code well-written and optimized, and you'll have a solid foundation to build upon.
