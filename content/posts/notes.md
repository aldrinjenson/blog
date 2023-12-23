---
title: "Notes"
date: 2022-09-12T19:02:56+05:30
draft: false
description: "Some notes of mine"
---

1. Reverting back git history from a commit:

```bash
git revert --no-commit 0766c053..HEAD
git commit
```

[source: stackoverflow](https://stackoverflow.com/a/21718540/11879596)

2. getting the IP Address quickly in most linux systems including termux:

```bash
ip a | grep inet
```

3. Downloading protected PDFs from google drive and having them be searchable:

- https://bytesbin.com/download-view-only-pdf-google-drive/
- https://askubuntu.com/a/474324

4. Finding the public IP of a computer or server

```sh
curl ipinfo.io/ip
```

(Optional) Create a bash alias like the following to make it even easier

```bash
alias whatismypublicip='curl ipinfo.io/ip'
```

5. Removing sensitive data after having it be committed to github
   `Use git filter branch`

6. Getting saved wifi passwords from a linux machine

```zsh
cd /etc/NetworkManager/system-connections/
ls
# find the correct connection-name / wifi SSID
cat <connection-name> | grep psk
```
