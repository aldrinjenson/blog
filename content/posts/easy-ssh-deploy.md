---
title: "Easy Ssh Deploy"
date: 2023-04-25T00:32:13+05:30
draft: true
---

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
          sshpass -p ${{ secrets.SERVER_PASS }} ssh -o StrictHostKeyChecking=no ${{ secrets.SERVER_NAME }} "cd Project/backend/anomaly-detection/PrimaryBackend && git pull && docker compose up -d"

```
