---
title: "How to add meta tags to a streamlit app"
date: 2023-08-27T07:00:55
draft: true
description: "Workaround to adding meta tags in a streamlit app which does not support doing this out of the box"
tags: [tech, python, docker, hack]
---

## Introduction

- Streamlit is a cool Python library to build GUIs for python based web-apps
- It doesn't support the feature to provide custom meta-tags for the apps you make and instead always have the default streamlit-tags instead
- The following steps is based on deploying a streamlit app bundled as a docker which you can deploy in your VPS.

## Pre-requisites

- Ensure docker/docker-compose is installed on your VPS

## Workaround

- Replace the default index file used by streamlit with our custom file containing meta tags of our own

1. Create an index.html in the src directory with similar contents:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="shortcut icon" href="./favicon.png" />
    <title>Your Site Name</title>
    <script>
      window.prerenderReady = !1;
    </script>
    <script defer="defer" src="./static/js/main.dccfd6b5.js"></script>
    <link href="./static/css/main.f4a8738f.css" rel="stylesheet" />
    <!-- Primary Meta Tags -->
    <meta name="title" content="MEC Diffusion - Text to Image Generation✨" />
  </head>

  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
```

Feel free to add in more meta tags of your choice.

2. Update your dockerfile to have a line like the following:

```dockerfile
FROM python:3.9

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# important line for adding custom metatags
COPY src/index.html /usr/local/lib/python3.9/site-packages/streamlit/static/index.html
# ensure that the above line is present in your dockerfile

COPY . .

CMD ["streamlit", "run", "Home.py", "--server.headless", "true", "--server.fileWatcherType", "none", "--browser.gatherUsageStats=False"]
```

Basically we're copying the index file to replace the streamlit default index.html inside the docker container.

2. Start the container. eg: `docker-compose up`
   You'll notice that what you get is just a white screen in the streamlit app endpoint. This is because the javascript is not loaded yet.
3. Find the pid of the container(`docker ps`) and exec into it to run bash

```bash
docker exec -it d27ea25e46cf bash
```

This basically lets you go inside the running container and inspect it using bash. Replace the PID with the PID of your container

4. Go to the path `/usr/local/lib/python3.9/site-packages/streamlit/static/static/js` inside the interactive bash shell inside container.
   Note that the python3.9 may be different in your case. In that case, just let `cd` + `tab` autocomplete the path for you.

5. Now do an `ls` like the following:

```bash
ls main*.js
```

6. Copy the full filename of this file and replace it in the script tag of the index.html file we created earlier.
7. Restart the container.(rebuild if necessary too).

This should let the javascript load correctly and have your project be loaded fine with custom meta tags.

If you note that somehow css seems to have broken, then just `cd` to `/usr/local/lib/python3.9/site-packages/streamlit/static/static/css` inside the container and do an ls like:

```bash
ls main.*.css
```
