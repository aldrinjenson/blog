---
title: "Hosting Hugo Sites on Gh Pages"
date: 2021-10-21T00:20:33+05:30
draft: false
---

It took me a day to fix a bug related to hosting a Hugo blog on github pages. Here are the three main points to note which was not properly mentioned in the official Documentation:

1. The baseUrl in your config file should point to wherer your files are located, not the url of your home page

2. If images are not being displayed on your site, enter `canonifyURLs: true` in your config file

<!-- 3. **** -->
