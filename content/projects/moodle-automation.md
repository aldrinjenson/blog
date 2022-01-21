---
title: "Moodle Automation"
date: 2022-01-19T19:25:18+05:30
draft: false
description: "A nodeJs program to automate the attendance marking in Moodle Classroom "
tags: [tech, telegram, nodeJs]
---

Reflections on a nodeJS program I wrote to automate marking online attendance.

## Motivation

I used to attend online classes. Sometimes I'll be sleepy or the class may be really boring, but I always used to attend them given a choice. However, at times I used to forget marking the attendance.

The attendance marking system in our college(and in many other Govt. colleges) for online classes was kinda ridiculous. We use the awesome [Moodle LMS](https://moodle.com/lms/) system for managing online classes.
The students have to go to the Moodle course page every hour and mark the attendance for that particular subject happening at that particular hour. That's right, the students mark their own attendance irrespective of whether they actually attends any classes at all🤦. The funniness of this situation becomes even more evident when the student is presented with the following three options for marking attendance in the course page:
Present, Late or Absent.
Seriously.. will any absent or late student actually mark the same given an option?🤷

<!-- todo: add image here -->

Anyways.. I used to attend classes, but the attendance marking was very hard for me. I used to occasionally forget and sometimes by the time I'd have remembered about marking the attendance, the hour would've run out and the option would have been gone to mark it for that subject.

It once reached a dangerous point where I had only 38% of attendance for DS subject in which I had actually missed only 2 classes which I think were due to some genuine reasons. This led me to find a solution which was foolproof.

## Thought Process

I thought about the flow a student takes to mark his attendance.

- He navigates to the course page
- He logs in to the moodle account by entering email and password. (yeah there are no persistent cookies in Moodle to preserve login state, atleast it's not set up in the Moodle installation our college uses).
- He clicks the attendance anchor tag element to go to the attendance page.
- He selects the list item for the date which is having a field for marking attendance.
- Once clicked he is navigated to another page having the 3 options: Present, Absent, Late
- He selects the radio button for Present(obviously)
- He clicks the Submit button.
- He sighs at having marked his own attendance. The End

The fact that I could describe the steps this way meant that I could definitely ask a computer to do these for me ie. to automate the process. Now the question was how to implement a program which could log in on my behalf and mark the attendance by following the above steps. Additionally I also wanted a way to let me know once the attendance had been successfully marked or if the attendance marking failed for some reason as then I could go and mark the attendance manually.

## Building the automation program

I used the nodeJs [puppeteer](https://github.com/puppeteer/puppeteer/) library for browser automation.
I had once used it an year before for generating PDFs out of html. <br/>
Anyways, I created a new nodeJs project, installed puppeteer and added my username and password as environment variables.
<br>
I created a file wherein I could add the subjectLinks for which I wanted to automatically mark attendance. I also installed expressJs and created a web UI - something like a dashboard which could show me the stats for various subjects - whether they were marked, when is the next check etc.

I tested the program a couple of times. Testing was a bit slow because there would be only one slot for me to test in one hour when there is an actual attendance open to automate.

Afterwards I installed the awesome [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api) library for getting notifications through Telegram and also added some control commands as well.
Anyways, within a few days, I had ironed out the bugs(most of them that is) and had the code working fine. Now the question was regarding hosting the server.

Running a web server is costly(atleast for a student that is). The only option I had was to use an AWS ec2 instance. In the initial code I wrote, I used the node-cron library to set a cron job which automatically executes the scraping program every 30 minutes from morning to evening every day and checks if any of my subject links have got an open attendance to mark. This worked fine.. but the problem was that this would mean my server would have to be continuously running to have the program be executed at the right time.
This was not acceptable.

So I started looking for alternate solutions, and came upon this wonderful [site](https://cron-job.org/en/)🤩.My new approach didn't have the cron script in my code. I had an API endpoint which will be called by the cron-job site every 30 minutes from morning to evening. I hosted by code in Heroku and gave the api endpoint url to the cron-job site to ping. Heroku has some serious limitations for free apps which prevents them to be up more than 21 days etc. With my new approach however this was not at all a problem as now my server will be active exactly only when the cron site executes ie. it'll be active only when it is time to mark the attendance. No extra wasted awake time.

I hosted the project, and I have to say by the end of semester I had more than 75% of attendance for all subjects. Mind you that I actually did attend all the online classes myself, just that I didn't have to do the boring process of opening Moodle and marking the attendance manually.

One doubt I initially had was if this was a good project from an ethical standpoint and whether my code could be used by others for getting attendance without coming to class. Since I was conflicted on this, for over one year, I didn't tell to anyone about this project and kept the code in a private Github repo. However it was only a matter of time before I saw that students were just tired of this stupid process of manually going to moodle and marking their own attendance. I saw over 4 other automation projects for marking attendance, ie students were trying to find a way to get around the broken system;

Me keeping my project closed because I was afraid of my code being misused didn't really matter much, people were always looking for a workaround and it was only a matter of time before they follow similar paths that you took.

That being said, each time I saw another attendance automation project, I couldn't just think that my version of automation was actually kinda good. You didn't even have to enter any timetable, just the attendance page urls would suffice. I saw projects for which you have to enter time-tables which was a problem because sometimes time tables may change or a different teacher may take class on a different subject if one teacher is on leave etc. Other automation projects I sad didn't have a notification system as well, they were all python programs written to be run in the terminal. I was kinda happy though that I wasn't the only one fed up of this system, but this also made me wonder if using your skills to get around a broken system is actually wrong..

I open sourced the project after 14 months of the initial commit. Within that period I have seen good people losing attendance(and hence their marks due to the minimum 75% attendance scheme in Kerala colleges) because they had forgotten to mark in Moodle often times when they had attended the actual classes as well. I open sourced my code without any flashy announcements in the firm belief that if one is genuiniely looking for a solution, he should find it. As the Bible says, "Seek and You will Find".

Check out the code [here](https://github.com/aldrinjenson/moodle-automation) :).
