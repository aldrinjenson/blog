---
title: "How to deploy a Telegram bot to Serverless"
date: 2021-10-24T19:25:18+05:30
draft: true
description: "Documenting the steps on how we moved our Telegram Bot servers to AWS Lambda and saved tons of money in the process"
tags: [tech, telegram, serverless, AWS]
---

When I worked as a Product Developer at TGH Tech, I had built multiple Telegram bots in nodeJs. In the inital stages all bots were using the default long polling method which required a server to be constantly running. We ran some bots on AWS ec2 and others using Heroku paid Plan. Keeping the server running all the time wasn't economical for our usecase as there would be long gaps when the users won't be using the bot. Running the server at night time and all hence wasn't economical at all. So I started researching on AWS Lambda and how I could move the bots to serverless. The advantage of AWS Lambda functions is that you are paid only for the usage, as in you are paid only for the server running when a user uses your bot. No money is charged for all the idle time. Once I kinda figured out the steps to modify the code and have the bot deployed to Lambda, I created a document, outlining the process and shared it to many others who successfully managed to deploy their bots on serverless as well. This way we were able to save off a lot of money.

I'm adding the steps here as well for future references of anyone interested in moving their existing Telegram Bots to AWS Lambda using the [Serverless Framework](https://www.serverless.com/).

- Read [this](https://www.google.com/url?q=https://iamondemand.com/blog/building-your-first-serverless-telegram-bot/&sa=D&source=docs&ust=1643292794318291&usg=AOvVaw245vcHmEft7pWlVi0Muvf2) guide first
- Skim through [this official Telegram docs](https://www.google.com/url?q=https://core.telegram.org/bots/webhooks&sa=D&source=docs&ust=1643292815912938&usg=AOvVaw3Qvi7OgCOjGUL7dwHRYa4M) about webhooks.
  - Basically, a webhook is used for getting updates when a user sends a command or a message to the bot.
  - However, in order to set a webhook, telegram requires an HTTPS enabled url to which telegram servers make a POST request on each message input.
  - We create a lambda function, which when deployed, provides us an HTTPS enabled url.
  - We set up the Telegram webhook using the above url to which telegram makes a POST request which contains the message object just as it is received in the msg object.
  ```javascript
  bot.onText(/regex/, (msg) => console.log(msg));
  ```
  - We can then set up a switch statement or an if-else ladder to evaluate the message text and perform various actions depending on the command entered.

Note: It is not necessary that you use the `node-telegram-bot-api` library to send a message or get msg input etc. Telegram provides apis which can be used to send messages easily by passing in the chatId, msg-text, keyboardType etc, as seen in the above articles. Msg input can be received using webhooks as well as mentioned in the above paragraph

- Create a serverless.yml file and define the function with a path similar to the article mentioned above and deploy the function using `serverless deploy` to get the url.
- Set up, remove, get status of webhooks easily using the urls mentioned in [this article](https://xabaras.medium.com/setting-your-telegram-bot-webhook-the-easy-way-c7577b2d6f72)

### Some things to keep in mind

- It is important that you return an object with statusCode 200 so that telegram understands that the query has been successful. (Check the first link above for reference)
- When you want to send JSON data, ensure that you send it after properly stringifying it first.
- For sending URLs, sometime you may get the error TypeError: Request path contains unescaped characters which can be fixed by creating a function to format text using [this stackoverflow answer](https://stackoverflow.com/questions/31024779/typeerror-request-path-contains-unescaped-characters-how-can-i-fix-this/62437210#62437210)
- Lambda functions are <span style="background-color:#717140;padding: 0px 4px;">stateless</span>, meaning that you can’t persist variable states in global variables, Each new call will result in a fresh instance being fired upon. This would have implications when storing user keyboard presses in memory. (Some alternative would be storing the button status in a db (too slow) or using some in-memory cache systems like Redis or Memcached (as suggested in the discussion thread by Node-telegram bot api)).
- Telegram ensures only one way of getting inputs is active at any particular moment. Hence you can’t have polling and webhooks enabled at the same time. Ie. If you use the node-telegram-bot-api and set polling:true and have also enabled a webhook, when you run npm start, the webhook will automatically get disabled.
- In order to delete pending messages which may get accumulated in case you forgot to return 200 statusCode or for any other reason that could result in same response message being sent by the bot, you can use the following url structure to delete pending updates: https://api.telegram.org/bot{my_bot_token}/setWebhook?url={url_to_send_updates_to}&drop_pending_update=true
- If you’ve got some extra route defined which accepts a request from a backend and performs an action (eg: ‘/notify’ route which when called sends a telegram notification message to the user), then that function can be exported and defined in the serverless.yml file which will give a new HTTPS url for that function. This can then be called by the backend to invoke that function. The package aws serverless express can be used if the function is complex and would require some expressJs like route handling.
- Note that you may have environment variables which may be defined in a .env file. This needs to be added to the aws console as well by going to the `configuration` tab and selecting `environment-variables` section from the left side menu.

### Things which could be explored and improved when the need arises

- Use ngrok to expose a local port to the internet, which would provide an HTTPS enabled url which can be used to set up the webhook. This would enable live-reloading whenever a change is made as there would be no more need to deploy the function to AWS to see the changes

- A way to connect a database like MongoDb. This can be done by calling the Mongo connect function in the handler function so as to persist the database connection for some time without having to do a cold start for each invocation like mentioned in this example.

## Extra references

https://github.com/TGH-Tech/open-fruit-admin-bot/tree/lambda
https://github.com/TGH-Tech/query-search-bot
https://github.com/TGH-Tech/open-fruit-seller-bot/tree/test-deployment
