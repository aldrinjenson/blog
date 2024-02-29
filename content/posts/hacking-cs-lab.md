---
title: "How we hacked an entire computer lab✨"
date: 2022-07-26T19:09:07+05:30
description: "How we hacked our network lab and played rick roll on all computers at once:)"
tags: [personal, fun, project]
draft: false
---

Linux is cool.

Computer Networks is cool.

Rick roll is cool.

Our lab teacher - Titty sir, is definitely cool.

So, hacking all the computers over there, should be cool too.?🙂

## Introduction

Short write up of how I wrote a script to play rick roll in all computers in our lab. 🙂

<center>
  <video alt="demo of us rick-rolling" src="/videos/hackCSLab.mp4" controls muted poster="/thumbs/hackCSLab.jpg" ></video>
  <p class='caption'>In hindsight, should have added the --fullscreen flag to the browser as well!</p>
</center>

1. find your ip address using

```bash
ip a | grep 192.
```

<center>
  <image src="/images/hackCsLab/ipGrep.jpg" alt="ip grep image"></image>
  <p class='caption'>
  If the computer is connected to two or more networks(ethernet and wifi for example) the above would result in more than one entries.
  Note that the address ending with 255 is for broadcast and hence should not be used.
  </p>
</center>

2. Get the list of all devices connected to your network using the **nmap** tool

```bash
sudo nmap -sn 192.168.143.0-255
sudo nmap -sn 192.168.143.0-255 > ips.txt # to store output to a file
```

3. Install [sshpass](https://man.archlinux.org/man/sshpass.1) on your host machine

```bash
sudo apt install sshpass
```

4. (i) Create simple bash script to ssh into one file and remotely execute a command

<center>
  <image src="/images/hackCsLab/remoteExec.jpg" alt="Remote exec sample script"></image>
  <p class='caption'>
  Simple script to remotely execute a command in a single client machine in network using sshpass.
  </p>
</center>

4. (ii) Create script to loop through the script and remotely execute a command.

<center>
  <image src="/images/hackCsLab/loopIpScript.jpg" alt="sample script for looping over ips and executing a bash command"></image>
  <p class='caption'>
  Simple script to loop over a set of ips and execute a bash command.
  </p>
</center>

## Afterthoughts

There you go. This script should let you run a command remotely in all the devices in your network.

I used this only once for playing rickRoll in all the computers in our lab just as a proof of concept.

Now, even though we demoed using a rick roll, just know that if one could do this much, really dangerous stuff can be done once access to these many computers are granted. Stuff can range from crypto-mining to running keyloggers for accessing passwords of students.

This worked perfectly in our case because the passwords of all the computers were same. In little more stricter scenarios, the passwords being same are rare and hence you'd need to create separate files to map the ips to passwords before looping through.

Finally, we were able to pull this off only because the staff in CS Lab were kind and understanding of the student's curiosity and interest to explore stuff.✨

I suppose I should mention that this is a powerful method and you should use it only with care respecting privacy of others in the network.🙂
