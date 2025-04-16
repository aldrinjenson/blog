---
title: "How to host a Hugo static site using Github pages"
description: "Some pointers on hosting a Hugo site using Github pages"
# date: 2021-10-21T00:20:33+05:30
draft: false
tags: [tech]
---

It took me a day to fix a bug related to hosting a Hugo blog on github pages. Thought I'd compile down my learnings here.

Check out these two links to get started with the local installation and setting up of the development environment. This part is quite easy.

- [Start a blog in 30 minutes with Hugo](https://opensource.com/article/18/3/start-blog-30-minutes-hugo?utm_source=nomedium&utm_medium=web&utm_campaign=nomedium)
- [Official Hugo Quick Start Guide](https://gohugo.io/getting-started/quick-start/)

By now you should be having a blog with atleast one post which can be previewed locally using `hugo server -D` command.

Now, the part which I found difficult is to host this site and make it available for the public. While there are guides available on the official docs for a lot of hosting options, the one for hosting with github pages isn't very helpful (general opinion of a lot of developers).

Anyways, here are the simple gotchas you need to take note of for easy hosting after following the official guide.

1. The baseUrl in your config file should point to the url where which your site will be deployed. (Usually, `yourusername.github.io/`). No need to change it to rawgithubUserContent link if images or css doesn't load initially.

2. If images are not being displayed on your site, add on `canonifyURLs: true` in your `config.yaml` file or the toml version in your `config.toml` file if you are using toml.

3. When using the [gh-pages](https://github.com/peaceiris/actions-gh-pages) github action as mentioned in the docs for deploying with Github, it's basically creating a new branch called gh-pages and then putting in the build files (from the public folder) in this branch and this is the one that is getting deployed in github pages. Basically, your source code is in the main branch, and the build output is in the gh-pages branch. (Not knowing this can confuse you in understanding how the magic happens ). The static HTML pages in this branch are deployed using github pages.
4. If you want to host your site in a custom domain, then you got to create a file `CNAME` and put it in the hugo static folder. This file should contain just the domain name eg: `www.example.com`. This file from static folder will be put in the root folder of gh-pages branch once the site has been built by the gh action on push. If you get some errors regarding the domain, check out [this part](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/troubleshooting-custom-domains-and-github-pages#cname-errors) of the official docs.

So there you go, these are the three simple points which you need to take note of so as to make the whole deployment process with hugo a bit easier. Now you can write blog posts and the site gets deployed once you push to the main branch.

P.S. Just so you know, this current site you are looking at has been made completely using Hugo by following the above steps. So yeah, this works. You can check out the source code for this site [here](https://github.com/aldrinjenson/aldrinjenson.github.io) if interested.

## Pro Tip:

If you want to make your life a bit easier, add the following alias script to your bash or zsh shell to start up the dev server and open up your browser quickly to the localhost hugo dev URL.

```bash
  alias hs='firefox --new-tab http://localhost:1313/ & hugo server -D'
```

The above works for most modern browsers and hence you can replace firefox with the browser of your choice. So next time you want to write a new blog, fire up your editor and simply enter the `hs` command in your blog directory to start up hugo dev server and have your browser navigate to the hugo dev port.
