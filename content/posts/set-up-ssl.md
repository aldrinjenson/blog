---
title: "How to add SSL and make a server https"
date: 2022-12-25T18:14:39+05:30
draft: false
description: "How to set up ssl in a server using letsencrypt without even using nginx"
tags: ["infra", "ssl", "backend", "nginx", "linux"]
---

## Introduction

An easy way to set up Secure Socket Layer (SSL) on a web server without having necessary nginx installation. SSL is a security protocol that encrypts data sent between a client and a server, helping to protect against hacking and other online threats. By enabling SSL on your web server, you can ensure that sensitive data sent to and from your server is protected.

## Requirements

To set up SSL on your server, you will need the following:

1. A Linux machine on which you want to enable SSL.
2. SSH access to the Linux machine.
3. A web server that listens on a route for requests.
4. DNS management access.

## Steps to follow

1. Install the certbot package on your machine. Certbot is a tool for interacting with Letsencrypt, a free, automated, and open certificate authority. You can install Certbot using the following command:

```bash
sudo apt-get install certbot
```

2. Find the public IP address of your machine. You can get it from the cloud console of your cloud provider, or by running the following command:

```bash
curl ipinfo.io/ip
```

3. Go to the DNS manager and add a new DNS entry for the server domain for which you want to enable SSL. For example, if you want to add SSL for the domain <your.domain.tld>, you would add a DNS entry for the public IP address of your server.

4 a. Run Certbot to generate an SSL certificate for this domain using the command:

```bash
sudo certbot certonly --standalone
```

4 b. If you're having nginx already running, then use the following command instead:

```bash
sudo certbot --nginx --domain <your.domain.name>
```

Note: If you get the errror: `The requested nginx plugin does not appear to be installed` on running the above command(usually on the first time), just install the cerbot-nginx plugin using the following:

```bash
sudo apt install python3-certbot-nginx
```

5.  Follow the instructions provided by the Certbot wizard. At the end, you will have SSL certificate .pem files stored in the location /etc/letsencrypt/live/<your.url.entered>. Make note of this location, as you will need it later.

6.  Start your web server and note down the port on which it is listening (e.g. 8080).

7.  Add the path to the SSL certificate and private key generated earlier to your web server. The process for doing this will depend on the type of web server you are using.

For example, if you are using a Node.js server, you can do it using the following code:

```javascript
const express = require("express");
const https = require("https");
const fs = require("fs");

const app = express();

// Read SSL certificate and private key
const options = {
  key: fs.readFileSync("/etc/letsencrypt/live/<your.domain.tld>/privkey.pem"),
  cert: fs.readFileSync("/etc/letsencrypt/live/<your.domain.tld>/cert.pem"),
};

// Define GET method in the root route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});
// Create HTTPS server
https.createServer(options, app).listen(443);

console.log("Server listening on port 443");
```

For nginx, you will have a server block having configuration similar to the following:

```nginx
	server {
	    listen 443; # listens for https requests
	    server_name <your.domain.tld>;
    	    ssl_certificate /etc/letsencrypt/live/<your.domain.tld>/fullchain.pem;
    	    ssl_certificate_key /etc/letsencrypt/live/<your.domain.tld>/privkey.pem;
          # serves the files mentioned here
	    location / {
	        root /usr/share/nginx/html;
	        index index.html index.htm;
	    }
	}

```

There you go, by now you should have the web server listening to https request on port 443✨.

To configure SSL for other types of web servers, such as Apache or even a Python/Flask server, you will need to consult the documentation for those servers.

But essentially, the process is simple. Generate ssl certificate for a site that has a DNS entry pointing to the public IP address of your server and have this certificate be referenced in code of your web server.

You can even write redirect rules which automatically forwards/redirects a request in http to https.

Here's a demo using nginx.

```nginx
 	server {
 	    server_name <your.domain.tld>;
    	    # to redirect http requests automatically to https
 	    return 301 https://$host$request_uri;
}

```

## References

- [Letsencrypt Getting Started](https://letsencrypt.org/getting-started/)

- [How To Set Up a Self-Signed SSL Certificate for Apache in Ubuntu 20.04](https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-20-04)

- [Nginx SSL Configuration](https://nginx.org/en/docs/http/configuring_https_servers.html)

- [Chat GPT](https://chat.openai.com/)
