---
title: "Creating and embedding Subtitles for custom videos"
date: 2023-12-24T00:45:00+05:30
draft: false
description: "Easy way to create subtitles and encode it in a custom video of yours"
tags: ["linux", "foss", "hack", "ffmpeg"]
---

# How to create and add subtitles to your custom video

It consists of the following steps

## Step 1: Have the video be ready at hand.

No-brainer. But ensure that you have a video in which there is speech present. You can record the video using any web based recorders if you don't have camera software installed.

If you are in Mac, you can also record using QuickTime Player -> File -> New Movie Recording. This way you don't need to use any other extra software than the ones already installed!

Linux has a bunch of cli and GUI based free software available that you can use as well.

## Step 2: Download whisper

Whisper is state of the speech recognition model released by OpenAI.
There is both the original whisper python package and also [whisper.cpp](https://github.com/ggerganov/whisper.cpp).
Second one is highly recommended as it's much more faster and optimised(cus it's in C++ 🚀).

If you have a good CPU, choose the medium model to begin with.

So now,

- Just install whisper by following the ReadMe instructions specific to your OS.
- choose the medium model
- build the binary by running: `make`

## Step 3: Creating an wav file from video

Now you'd need to convert the video file to an audio file to pass it on to `whisper`

As of writing this blog, whisper takes in only 16-bit `wav` file as input.

Converting the video to .wav is as easy as running this simple `ffmpeg` command:

```bash
ffmpeg -i input.mov -ar 16000 -ac 1 -c:a pcm_s16le output.wav
```

This will create a new file called `output.wav` which contains just the audio from your video file.

## Step 4: Generating an srt file using whisper

Now,

- pass in this audio file as input and generate subtitles
- If the subtitles generated are not _that_ great, just choose a bigger model.
- pass the `-osrt` flag to generate the output as a `.srt `file

This would be the final command to achieve the above:

```bash
./main -m  models/ggml-medium.en.bin ./output2.wav -osrt
```

This will generate subtitles in the file `output2.wav.srt` and place it in the same directory.

Open this file and do some minor manual editing if necessary.

Whisper is pretty good, but in some rare cases like for names, it may need some additional manual corrections.

## Step 5: Encoding the subtitle file to the original video(optional)

The final step involves creating a video which has the subtitles embedded inside.
This can be easily achieved using a simple ffmpeg script:

```bash
ffmpeg -i input.mov -vf subtitles=output2.wav.srt final_with_sub.mp4
```

The above script uses the `-vf` flag to pass in the subtitle file. It generates the final output in a `.mp4` format as well.

## Step 6: Boost the volume of video(optional)

If for some reason, you may want to increase the volume of the audio, you can achieve that also using ffmpeg with the -af param and passing the required audio.

eg:

```bash
ffmpeg -i input.mov -vf subtitles=output2.wav.srt -af "volume=1.3" final_with_sub.mov
```

---

There you go. That's all there is to adding custom subtitles to your videos!

No need for any proprietary fancy video editing software.

FFMPEG FTW ✨
