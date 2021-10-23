---
title: "How to Speed up your programming workflow by adding auto-correct in git"
date: 2020-11-01T17:07:10+05:30
draft: false
description: "Neat trick to add auto-correct to git-commands"
tags: ["tech"]
---

In this short post I would like to share a neat trick I learned which you can use to speed up your development workflow - adding auto-correct to git.

## Current Scenario

Currently, if you have a typo or some small error in your git command, git will automatically suggest the most plausible command corresponding to your keyboard input.
Majority of the time this suggested command is bound to be the one you were trying to use. However, just suggesting the command is not that helpful since the programmer still has to navigate around and change the typo.

<br/>

![image1](/images/git-autocorrect/image1.png)

<p align = "center">
Before setting up auto-correct
</p>
<br/>

According to the official git [docs](https://git-scm.com/book/en/v2/Customizing-Git-Git-Configuration#_code_help_autocorrect_code),

> Git helpfully tries to figure out what you meant, but it still refuses to do it. If you set help.autocorrect to 1, Git will actually run this command for you

## Solution:

Just open your terminal and add the following line

```bash
git config --global help.autocorrect 1
```

Adding the above command in your terminal results in the following :

![image2](/images/git-autocorrect/image2.png)

<p align = "center">
With auto-correct turned on
</p>
<br/>

See, git gave us a warning saying that there is a typo in our command and then executed the most matching/similar command.

Now, here the value which we assigned at the end has to be an integer which represents the tenths of a second after which your command will be executed.

## Preventing accidental commands

If you are worried about git accidentally executing a command which is similar to your input but is not what you actually wanted to run, then you can add a few seconds of extra time before which the command will be executed, so that you can cancel out the execution if needed.

This can be achieved by changing the final integer value at the end to a multiple of 10 (say 20 or 30 which corresponds to 2 or 3 seconds respectively).

```bash
git config --global help.autocorrect 30
```

Adding the above code in your terminal gives the following output when you have another typo in your code.

![image3](/images/git-autocorrect/image3.png)

<p align = "center">
Executing a git command after 3 seconds
</p>
<br/>

The actual command will be executed only after 3 seconds; which means that you can cancel the execution anytime within three seconds by just pressing **ctrl-c**.

## Disabling auto-correct:

If for some reason, you want to disable autocorrect feature (though I can’t really imagine why), all you need is to set the final integer to 0.

```bash
git config --global help.autocorrect 0
```

This will revert back the config settings to the default stage – to how it was before we modified it.

![image4](/images/git-autocorrect/image4.png)

<p align = "center">
Just like how it was before
</p>
<br/>

## Conclusion

I have been using this cool autocorrect feature of git for some years now and it's really a cool time saver. The small few micro seconds it saves by preventing us from not pressing the up arrow and then navigating around to fix typos in our command, can get compounded and become a huge time saver in the long run.

### References:

[Here](https://git-scm.com/book/en/v2/Customizing-Git-Git-Configuration) is the official git docs in case you have further doubts.

P.S. Other than the auto-correct, git has got some other cool features as well. Be sure to check them out too while you are at it :).

![background image](/images/bg/bg1.jpg)

Have a good day!
