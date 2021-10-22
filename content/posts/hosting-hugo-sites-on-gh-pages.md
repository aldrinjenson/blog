---
title: "How to host a Hugo static site using Github pages"
description: "Some pointers on hosting a Hugo site using Github pages"
date: 2021-10-21T00:20:33+05:30
draft: false
tags: [tech]
---

It took me a day to fix a bug related to hosting a Hugo blog on github pages. Thought I'd compile down the learnings here.

To get started with the local installation and setting up of the development environment, it's quite easy. Just check out these two links:

- [Start a blog in 30 minutes with Hugo](https://opensource.com/article/18/3/start-blog-30-minutes-hugo?utm_source=nomedium&utm_medium=web&utm_campaign=nomedium)
- [Official Hugo Quick Start](https://gohugo.io/getting-started/quick-start/)

By now you should be having a blog with atleast one post which can be previewed locally using `hugo server -D` command.

Now the part which I found difficult is to host this site and make it available for the internet. Whie there are guides available on the official docs for a log of hosting options, the one for hosting in github pages isn't very helpful (as I could understand from a lot of Youtube comments in a tutorial video)

Anyways, here are the simple gotchas you need to take note of for easy hosting after following the official guide [here](to be kept in mind).

1. The baseUrl in your config file should point to the url where which your site will be deployed. (Usually, `yourusername.github.io/{repoName}`). No need to change it to rawgithubUserContent link if images or css doesn't load initially.

2. If images are not being displayed on your site, add on `canonifyURLs: true` in your config file

3. When using the [gh-action](https://github.com/peaceiris/actions-gh-pages) as mentioned in the docs, it's basically creating a new branch called gh-pages and then putting in the build files (from the public folder) in this branch and this is the one that is getting deployed in github pages. Basically, your source code is in the main branch, and the build output is in the gh-pages.

So there you go, these are the three simple points which you need to take note of so as to make the whole deployment process with hugo a bit easier.
