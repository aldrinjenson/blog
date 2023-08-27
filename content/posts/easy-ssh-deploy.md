---
title: "Easy SSH based Continuous delivery pipeline"
date: 2023-04-25T00:32:13+05:30
draft: false
description: "Super simple way which may be obvious, but I casually discovered to set up a deployment pipeline to a Linux server"
tags: [linux, ssh, devops]
---

If you have a Virtual Private Server(VPS) and want to have the code you push to github/VCS, be deployed in your server, here is a super simple and quick way to do so.

It basically involves creating a github action workflow that does the following.

```yml
name: Deploy to Server
on:
  push:
    branches:
      - main
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Install sshpass
        run: |
          sudo apt install sshpass -y
      - name: Git pull and Deploy with Docker Compose
        run: |
          sshpass -p ${{ secrets.SERVER_PASS }} ssh -o StrictHostKeyChecking=no ${{ secrets.SERVER_NAME }} "cd project-folder && git pull && docker compose up -d"
```

## Pre-Requisites

- Install git and docker on your VM
- configure your vm for ssh
- store the server ssh url and server ssh password as github secrets with the same variable names as mentioned above in the workflow

## What the workflow does

- Installs `sshpass` on the github VM
- Does SSH to your VM with `sshpass`
- Runs the command to
  - git clone the repository
  - run the command to start the project(`docker compose up` in this case )

## Customisability

- Currently it's based on docker. But you can easily replace the final command with anything else to build your product (eg: `make` or `npx serve`)
- Replace `project-folder` with the path to the folder in which you have the project. sshpass will run the command to clone the latest version from VCS to this folder and will run the start/build/serve command.

## Limitations

- Currently this script is based on traditional servers which works on the basis of ssh log-in using username and password. If you want to use it to access servers like AWS EC2 which supports only pem file based auth, you'd need to modify the workflow.
  - You can store the pem file contents in a github secret and then use it inside the sshpass flow indirectly.
  - Or, you can use existing github actions [like this](https://lightrains.com/blogs/deploy-aws-ec2-using-github-actions) written specifically for CI/CD with AWS.

## How did this come to be?

It basically started of by thinking about the steps you would do to push your code to production without having to automate it. This would come to have the following steps in a really high level way:

1. Pushing your local code to a VCS.
2. SSH-ing to your VPS
3. Pulling the code from VCS to the server
4. Running the start command

Now, what are github actions? A way to run linux commands when certain events occur in github. So can we combine them both? Of course yes.
There you go.🙂

## Things to note

1. I use ssh-pass to do steps 2,3 and 4 at once.
   sshpass allows you to ssh to a server and run custom commands on it as the user doing SSH.

   You can also use rsync

   SSHPass is first installed in the serverless instance where the github action is run.

2. Store the SSH username and passwords as a Github secret to not let it be exposed.
3. In the workflow file, don't have commands with any stateful logic as the workflow instance would be a fresh one each time.
