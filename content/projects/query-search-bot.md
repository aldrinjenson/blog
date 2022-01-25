---
title: "Query Search Bot"
date: 2021-10-24T19:25:18+05:30
draft: false
description: "A telegram bot I made to make the internet queries directly from telegram"
tags: [tech, telegram, serverless, AWS]
---

I started my experiments with Telegram Bots in the November of 2020 when I wanted an easy way to receive notifications.
Discord was the first option, but it was just too cumbersome for the simple purpose of receiving notifications. Telegram was much more convenient and easy to use. I used and built various Telegram bots of different complexities during my tenure at TGH Tech. I also used it for my [Moodle Automation](/projects/moodle-automation) program as well.

## Motivation

This is one of my first major Telegram bot and was first made to get myself familiar with the functions offered by the [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api) library. The idea is simple - make Internet queries without leaving telegram.

## The flow

The steps involved are as follows:

- The user adds the bot to a group
- He uses a command to trigger the bot
- He sends the bot a query to search
- The bot sends the top search results of that particular query.
- END

## Implementation

Searching part is basically web-scraping. While google doesn't provide a free api to search, there are some alternative implementation like [googlr](https://github.com/jarun/googler). I tried to use these alternatives, but they either works only in the cli or were just too cumbersome to use.
<br/>
With Google unavailable, I started looking for alternatives, which lead me to my answer -> Bing api. Initially I was a bit skeptical about using bing search engine, but turns out it's the second most popular search engine after Google even though there's a large market share gap.
I found that the results for search queries were quite reasonable as well.
<br/>
So with bing fixed, I used the [bing-scraper](https://www.npmjs.com/package/bing-scraper) npm package for my query searching.

<hr/>

The logic was quite simple actually. Whenever the user sends a search query to the bot, in the backend, the bot uses the above library to scrape bing and find the top results which are then sent as response messages back to the user.

Since this was a small project, I didn't want to host it on a server as usual. Heroku was the first option I thought about. However, due to Heroku's free tier limitations, once the server entered a sleep state, it needs an external HTTP request to wake it up. The telegram bot I set up was using constant polling mechanism to listen for requests, which meant that the telegram triggers won't wake up the Heroku server.

I initially tried to create a simple API endpoint from the server, and then constantly pinging it at regular intervals to prevent the server from going to sleep. However even this wasn't sustainable as Heroku free tier has this limitation that your server cannot be active for more than 500 hours per month. Bummer.

So as usual, I started looking for other options to get free hosting. I had an AWS account. I didn't want to use and ec2 for this small project. But there were [Lambdas](https://aws.amazon.com/lambda) available. I didn't have much experiences with serverless computing before, but this seemed like a good opportunity to try them out. AWS Lambda offers 1 million free requests per month, which seemed more than plenty for my use case😇.

## Implementing Lambda functions

Implementing lambda functions can be made very easy using the [serverless framework](https://www.serverless.com/).
It was very confusing for me initially on the product's name - Serverless, the same name as the serverless architecture. 🤷 I'll refer to the Serverless platform with a capital S.
The process involved the following steps:

- You install Serverless cli and generates the serverless boilerplate for nodeJs(other languages also available)
- You create a Serverless account and login to your dashboard
- You connect your cloud provider(AWS Lambda in my case) to Serverless
- You push your code to a github repo and connect it to the Serverless platform. (optional)
- You enter the command `sls deploy` in your code directory to deploy the code to the connected cloud provider.
- END

Now there was one change I had to make for the bot to work with serverless. Since serverless functions will be active only once a request has been received, my initial approach of using long polling(default approach in the node-telegram-bot-api library as well) to query for updates won't work. So I used webhook approach to fix this issue. Basically once the user sends a message to the bot, it reaches the Telegram servers first, and then from there it calls the deployed serverless url wherein I have a switch statement that fires functions depending on the message content/command. [Here's](https://github.com/aldrinjenson/tg-querySearchBot/blob/d5260c7672909f07ca664bb075369f4bfbe0b5cd/index.js#L50) the actual code implementation.
Check out the [ReadMe file](https://github.com/aldrinjenson/tg-querySearchBot/blob/main/README.md) as well where I've added some instructions on the process of setting up webhooks for telegram bots.

## Conclusion

Once the serverless flow was understood, then building and deploying the bot was not that difficult. I had used this same bot as an example to explain the concept of building and deploying bots to many others. Overall even thought the project was kinda small in code or logic, it contained many learnings and people other than me were able to benefit out of this project. So Lesson learned, it's better almost always to learn something by building rather than just by simply watching a Youtube tutorial without applying the concepts.

This bot was actually the base of many other complex Telegram bots I made. By the end of 2 months in TGH Tech, I was pretty well-versed in the node-telegram-bot-api library and had even written several utility functions to make a lot of tasks much, much easier. It was my wish to group them together and publish them as a library so that many other who faced similar problems could use it. Sadly though, I got busy afterwards with other projects and by the time I was free, I had lost all touch with bots and I had this feeling that even if I had published them as a library, I may not be able to fix any issues people may raise or even test PRs because I won't be working with any Telegram bots at all. Now though, while writing about this, I'm having different thoughts.. may be I think even if I won't be feeling any motivation to fix these, the code could be useful to many people and maybe someone could fork it and work on it to improve.. The chances of bugs are pretty low as well, because several bots are running in production level at TGH tech using the utility functions I wrote.. so hmm, let me see, I'll update it here if I'm publishing the library🤞.

Check out the project [here](https://github.com/aldrinjenson/tg-querySearchBot).
<br/>
Live Demo at [querySearchBot](https://t.me/querySearchBot).
