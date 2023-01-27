---
title: "Redirecting Subdomains to docker containers in same server"
date: 2022-12-25T18:15:07+05:30
draft: true
description: "How to create subdomains and have them point to diferrent services running in the same machine"
tags: ["infra", "docker", "backend", "nginx", "linux"]
---

## Introduction

Article on how to have multiple running docker containers (or any other web servers) and have separate subdomains which map to these services.

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
