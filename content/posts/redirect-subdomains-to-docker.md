---
title: "Redirecting Subdomains to docker containers in same server"
date: 2022-12-25T18:15:07+05:30
draft: true
description: "How to create subdomains and have them point to diferrent services running in the same machine"
tags: ["infra", "docker", "backend", "nginx", "linux"]
---

## Introduction

Article on how to have multiple running docker containers (or any other web servers) and have separate subdomains which map to these services. 
<!-- Bonus tip on how to add https on these as well :) -->

## Requirements

1. A Linux machine on which you have docker containers running
2. SSH access to this Linux machine.
3. DNS management access.

## Steps

1. Start by installing a tool to manage a reverse proxy. nginx is a really good option.

```bash
sudo apt install nginx
```

2. Ensure that you can access your docker containers locally using curl/wget command.

3. Write a rule for configuring nginx to like this

```nginx
	server {
	    listen 443;
	    server_name server.iedcmec.in;
    	    ssl_certificate /etc/letsencrypt/live/server.iedcmec.in/fullchain.pem;
    	    ssl_certificate_key /etc/letsencrypt/live/server.iedcmec.in/privkey.pem;
	    location / {
	        root /usr/share/nginx/html;
	        index index.html index.htm;
	    }
	}
```

4. Start running your services or docker containers to which you want to route traffic
```sh
cd <your_project_folder>
docker-compose up
```

5. Find the port in which your container or services re running. Double check using this command

```sh
ss -lntp
curl localhost:PORT
```

6. Decide on the subdomains to which you want to route traffic and add them using your dns management console

Here's an example image using cloudflare
<center>
	<image src="/images/ssl/cloudflareDns.png" alt="Cloudflare DNS - Adding new subdomain"></image>
<p class='caption'>Cloudflare DNS - Adding new subdomain(replace the ip with your server's public ip)</p>
</center>

Note: You can get the public IP of your server using the following `curl` command

```bash 
curl ipinfo.io/ip
```

7. Once you add a subdomain in cloudflare, the next step is to ask nginx to route traffic from these subdomains to the docker services. This can be achieved by the following configuration in `/etc/nginx/nginx.conf`



```nginx
http {
     	server {
     	    listen 443 ssl;
     	    server_name subdomain.your-domain.tld;
 
#     	    ssl_certificate /etc/letsencrypt/live/mail.iedcmec.in/fullchain.pem;
#     	    ssl_certificate_key /etc/letsencrypt/live/mail.iedcmec.in/privkey.pem;
 
     	    location / {
     	        proxy_pass http://localhost:9000;
     	        proxy_set_header Host $host;
     	        proxy_set_header X-Real-IP $remote_addr;
     	        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
     	        proxy_set_header X-Forwarded-Proto $scheme;
     	    }
     	}
  }

```