---
title: "Notes"
date: 2022-09-12T19:02:56+05:30
draft: true
description: "Some notes of mine"
---

1. Reverting back git history from a commit:
   ```bash
   git revert --no-commit 0766c053..HEAD
   git commit
   ```
   [source: stackoverflow](https://stackoverflow.com/a/21718540/11879596)

2. getting the ipaddress quickly in most linux systems including termux:
  ```bash
  ip a | grep inet
  ```

3. Downloading protected pdfs from google drive and having them be searchable:
  - https://bytesbin.com/download-view-only-pdf-google-drive/
  - https://askubuntu.com/a/474324
