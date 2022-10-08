---
title: "I recreated Google's Teachable Machine and made it better!"
date: 2022-10-03T11:20:30
draft: true
description: "How I made a general purpose ML model trainer for vision data"
tags: ["ML", "PyTorch", "FastAI"]
---

# Introduction

Google's Teachable machine is pretty cool for training a quick model with images received from a webcam. However, it's very limited if, as a developer you want to update the pre-trained model and add extra data into it. I faced this issue when working on a [project](memoria) wherein I had to train an Image classification ML model and when new training data is received, retrain the model such that the new data is incorporated as well.

##
