---
title: "How to SSH to Termux Shell"
date: 2023-01-27T03:06:56+05:30
draft: false
description: "Steps to access your phone using Termux over SSH"
tags: [android, ssh, linux]
---

# Introduction

Easy way to ssh to termux shell running on Android

# Prerequisites

- A device running Android with Termux installed
- A Linux machine with OpenSSH installed

## Steps

1. Find the IP address of termux using the following command

```bash
ip addr | grep 192
```

2. install open ssh
3. start ssh service using the following

```bash
sshd
```

4. Find hostname of termux machine using `hostname` command
5. From host machine, perform ssh using the following command

```bash
  ssh -p 8022 $hostname@$phoneIp
```

6. The END

## Conclusion

Tada, You've successfully done ssh to termux✨

Use termux to start web-servers (Apache, Nginx etc) just like you would normally do in a Linux machine and you can expose it to the internet using free services like ngrok.

## Bonus Tip

replace `ssh` in step 5 using `sftp` and suddenly you now have an extremely safe and easy way to transfer files to and from your phone. You're welcome😊

## Troubleshooting

- Connection refused: Make sure that your device is connected to the same network as your Linux machine and that the SSH service is running on Termux.
- Incorrect IP address: Double-check that you have the correct IP address of your device.
- Firewall issues: Make sure that your firewall is not blocking the SSH connection.

## Additional Resources

-[Termux Wiki](https://wiki.termux.com/wiki/Main_Page) -[OpenSSH](https://www.openssh.com/)
