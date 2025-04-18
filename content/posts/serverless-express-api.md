---
title: "How to deploy an express application to serverless with AWS Lambda"
date: 2023-03-26T16:04:39
draft: false
description: "My easy and custom way to set up a CI/CD pipeline for easily deploying a node Express application to AWS Lambda"
tags: ["serverless", "express", "node", "AWS"]
---

# Introduction

AWS Lambda is an easy way to set up APIs which you don't use regularly. The free tier from AWS is very generous (1 million requests per month). I personally found it to be a pain to find an easy way to setup a CI/CD workflow with it. After several hours, here is the approach I made myself to have a super easy way to set up a pipeline to Lambda.

# Steps

1. Initialise a nodejs application if you don't have one already

```bash
npm init
```

2. Install the packages `express` and `serverless-http`

```bash
npm install express serverless-http
```

3. In the index.js file, create an express app and export it

```js
const express = require("express");
const app = express();

app.get("/", (_, res) => {
  res.send("Server active");
});

if (process.env.isDev) {
  app.listen(5000, () => console.log("listening on port 5000"));
}

module.exports = app;
```

4. Create a file called `lambda.js` which takes this exported app and converts the routes to lambda functions using `serverless-http` package.

```js
// lambda.js
"use strict";

const app = require("./index");
const serverless = require("serverless-http");

module.exports.handler = serverless(app);
```

5. Create a `serverless.yml` file like the one below. The service property can be renamed to anything you see fit.

There needs to be only one handler. Any routes created using standard express convention will be automatically configured as lambda routes using the filename as the endpoint slug.

```yml
service: express-to-lambda
provider:
  name: aws
  runtime: nodejs16.x
  stage: prod
  region: ap-south-1
  memorySize: 512
functions:
  app:
    handler: lambda/lambda.handler
    events:
      - http:
          path: /
          method: ANY
          cors: true
      - http:
          path: /{proxy+}
          method: ANY
          cors: true
```

NOTE: CORS is taken care by default in the above yml. If you would require fine grained control, you can add fine-grained and programmatic CORS control using the nodeJS CORS middleware.

6. Deploy the functions

Deploying to AWS Lambda is super easy and can be done by the `serverless` nodejs library.
Run the following from the root directory of your project.

```bash
npm i -g serverless
serverless config credentials --provider aws --key AWS_ACCESS_KEY_ID --secret  AWS_SECRET_ACCESS_KEY
# replace the AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY with your own values which can be received from AWS IAM
serverless deploy
```

For easier way, wake it into a shell alias or add it as a script to do one command deploy as well. You can also try adding it as new workflow in github actions for getting CI/CD.

There you go. That's it. The above step may take some time, but with it, you would be able to deploy your express application with AWS Lambda.

# Bonus

Setting up CI/CD pipeline to deploy from a github repo is super easy as well.

```yml
# Place in .github/workflows/deploy.yml
name: deploy to lambda

on:
  push:
    branches: main

jobs:
  lambda-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repo
        uses: actions/checkout@v2
      - name: Setup node environment
        uses: actions/setup-node@v1
        with:
          node-version: 16

      - name: Install serverless globally
        run: npm install -g serverless

      - name: Configure serverless authentication
        run: sls config credentials --provider aws --key ${{ secrets.AWS_ACCESS_KEY_ID }} --secret ${{ secrets.AWS_SECRET_ACCESS_KEY }}

      - name: Install npm dependencies
        run: npm ci

      - name: Deploy lambda function
        run: sls deploy
```

Add the AWS values AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in github secrets and you're good to go. Now each time a new change is made and the code committed to the main branch, this workflow will run and the updated serverless function will be deployed to AWS Lambda✨

By the way, small tip - when doing local development, you can just add the following dev script in `package.json` to get live-reload as well.

```js
  "scripts": {
    "dev": "isDev=true nodemon index.js"
  }
```

Just run `npm run dev` the next time when developing locally.

Now, you can develope the function routes using the normal familiar express way, while also getting the ability to host these functions in a serverless environment on pushing to your VCS.

## Remarks

I wrote it for IEDC during my tenure as CTO. Once this was made multiple students were using it our projects. We had several serverless functions running for sending emails, doing cleanups, knowing status etc. Everyone who used it really found the benefit of this, especially in such ease of getting started with development.

### Extra things to keep in mind

Do note that while lambda is great, it doesn't usually go too well with things like puppeteer and other automation tools which spins up a full blown browser. You can get around this using special puppeteer packages made specifically for lambda. In our case, we had a small ec2 instance which was free and we just used that to run our puppeteer script quickly; Depending on your use case, you can do it either way✨.

# References

- [https://github.com/IEDCMEC/lambda-functions](https://github.com/IEDCMEC/lambda-functions)
- [https://aws.amazon.com/lambda](https://aws.amazon.com/lambda)
- ChatGPT
