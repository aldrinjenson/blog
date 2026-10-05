---
title: "Giving my Limitless Pendant a second life (no cloud required)"
date: 2026-10-05T04:00:00-04:00
description: "Limitless got acquired by Meta and the Pendant's software is winding down, but the hardware is fine. Here's how I turned it into a local, private rambling-mic that transcribes on my Mac with Whisper and feeds my personal wiki, plus the full code to build your own."
tags: ["limitless", "pendant", "whisper", "bluetooth", "self-hosting", "voice", "personal-knowledge"]
categories: ["AI & LLM", "Tools"]
draft: false
---

## The problem: good hardware, dying software

I've had a [Limitless Pendant](https://www.limitless.ai/) since late 2025. It's a small clip-on that records everything around you and turns it into transcripts and summaries. Then in December 2025, **Limitless announced it was being acquired by Meta**. Pendant sales stopped the same day. I emailed their support to ask what happens next, and the answer was polite but clear: existing Pendants are supported **through 2026**, and after that you're on your own. I got the "export your data" email, did the export, and was left holding a perfectly good piece of hardware.

That bothered me. I paid for the device. It has a decent microphone, a battery that lasts, a button, and half a gigabyte of storage. The only thing dying is the company's cloud. So I spent a late night (with Claude Code doing a lot of the heavy lifting) figuring out how to keep using it **without any company in the loop**.

What I wanted was simple: a mic I can leave in my bedroom or wear around the house, **ramble thoughts into**, and have those thoughts land in my personal wiki where I can query them later. It doesn't need to be live. It does need to be private, and it can't be one more subscription.

Here's how it went: what failed, what worked, and all the code.

## Step 0: what is this thing, actually?

First I wanted to see what the Pendant looks like over Bluetooth. A quick scan from the Mac with Python's [`bleak`](https://github.com/hbldh/bleak) library found nothing called "Pendant" at first. **A Bluetooth Low Energy device usually stops advertising once it's connected to its phone.** After I turned my phone's Bluetooth off, it showed up right away as the closest device in the room.

Connecting and listing what it exposes:

- **Battery Service** (standard): mine read 4%, which explained a few things.
- **A custom Limitless service** `632de001-604c-446b-a80f-7963e950f3fb`, with one characteristic for sending commands (`…e002`) and one for receiving data (`…e003`).
- **An MCUmgr (SMP) service.** This is the standard management channel of Zephyr, the embedded OS the chip runs. Read-only queries told me the firmware is **1.1.20** on the **MCUboot** bootloader.

I also made a little live "Bluetooth radar" page that plotted every nearby device by signal strength, which was more fun than useful. Mostly it showed me how many of my neighbours' AirPods are always broadcasting.

## Step 1: what's already out there

A few people have been down this road already. The useful projects:

| Project | What it does | Catch |
|---|---|---|
| [MAkcanca/pendant-cli](https://github.com/MAkcanca/pendant-cli) | Python CLI built from analysing the official app and firmware 1.1.20. Downloads recordings over BLE and **deletes each page from the Pendant after saving it** | Needs exclusive pairing |
| [girlflipwebsite-spec/limitless-pendant](https://github.com/girlflipwebsite-spec/limitless-pendant) | macOS tool, deliberately read-only, with Whisper transcription | Never frees space on the Pendant |
| [Omi](https://github.com/BasedHardware/omi) | Open-source AI wearable app with Limitless Pendant support | Audio goes through Omi's cloud |
| [RePendant](https://github.com/COREkunas/RePendant) | Fully open replacement firmware | You open the device and flash it with a hardware programmer. One-way, tested on one unit |

The most important finding, from pendant-cli's README: **on firmware 1.1.20 the Pendant's "real-time" mode does nothing.** The Pendant always records to its own flash, and a client has to download ("drain") it afterwards. So there's no live streaming. You record, then sync. For rambling into a wiki that's fine.

## Step 2: the Omi detour (didn't work, but worth knowing)

Omi looked like the easiest path: install an app, pair, done. I turned on wireless ADB debugging on my Android phone so Claude could drive the phone from the Mac (install the app, tap through screens, read the logs). That turned out to be the killer feature of the whole night: **you can debug a phone app by reading its `logcat` instead of guessing.**

What happened:

1. **The old Limitless app kept stealing the Pendant.** Every time Bluetooth turned on, it relaunched itself and connected first. The fix was revoking its Bluetooth permissions with `adb shell pm revoke ai.limitless.mobile android.permission.BLUETOOTH_CONNECT` (and `BLUETOOTH_SCAN`). That's reversible from Settings.
2. **Omi found the Pendant and connected**, even showing a nice note that my firmware "works great with Omi". It reused the phone's existing pairing, so no reset was needed.
3. **The live transcript stayed empty.** The logs said it plainly: `Realtime stream silent (rx_without_audio_frames)`. Same 1.1.20 limitation.
4. Omi has a **"Transcribe Later"** mode (Settings → Recording & Transcription) that drains the flash instead. It started working, then **jammed on Android Bluetooth "busy" errors** (`writeCharacteristic returned 201`). Two parts of the app were writing commands at once. The one recording that got through was 2 seconds of static.

**Honest take:** Omi's Limitless support is real and actively developed (there were relevant fixes merged days before I tried), but the Play Store build I had (1.0.554) wasn't there yet. If you're reading this later, it may well just work, and it's the easiest option if it does. I also looked at building Omi from source with the latest fixes. That doesn't work either: a self-built app can't sign in to Omi's cloud, so you'd also be self-hosting their whole backend.

## Step 3: the Mac as the hub (this works)

The plan that worked: **make the Mac the Pendant's only paired device and do everything locally.**

### Factory reset to free the pairing

**The Pendant allows only one pairing.** It was still paired to my phone, so every command from the Mac was rejected with `GATT Protocol Error: Insufficient Encryption`. Turning the phone's Bluetooth off doesn't help, because the pairing is stored on the Pendant itself. You have to factory-reset it ([Limitless's guide](https://help.limitless.ai/en/articles/10547401-how-do-i-factory-reset-my-pendant)):

1. Unplug it from the charger (the orange charging light makes the reset colours confusing).
2. Press the button twice: **press-and-release, then press-and-hold.**
3. A purple light appears. Keep holding until it goes out, then release.
4. Blue light means it's reset and ready to pair.

On macOS you don't pair explicitly. Bleak's `pair()` isn't implemented for CoreBluetooth, and you don't need it: **macOS pairs automatically the first time a program asks for a secure connection.** Running `pendant info <address>` once was enough. After a reset the recordings are **not encrypted**, so pendant-cli's output plays directly.

### The first sync

```bash
pendant sync <address> -o first.opus
```

About three minutes of me talking came back as four Ogg Opus files, plus a manifest with timestamps. Afterwards the Pendant reported `Flash pages: 0 .. 0`. **pendant-cli acknowledges each page after saving it, and that frees it on the device**, so storage never fills up.

### Transcription: Whisper, locally

For speech-to-text I used [whisper.cpp](https://github.com/ggml-org/whisper.cpp) (`brew install whisper-cpp`) with OpenAI's **Whisper `large-v3-turbo`** model in ggml format (`ggml-large-v3-turbo.bin`, about 1.6 GB, [from Hugging Face](https://huggingface.co/ggerganov/whisper.cpp)). Turbo is large-v3 with the decoder cut from 32 layers to 4. You get close to large-v3 accuracy at several times the speed, and on an Apple Silicon Mac it runs on the GPU through Metal. A few minutes of audio transcribes in seconds, with no cloud, no API key and no monthly minute cap.

The first transcript:

> "I'm just talking randomly. I just hope this works. Not sure if it's working, but…"

It works. It mishears some words ("Deepgram" became "deep grammar"), but that's fine for notes, where whatever reads them later can work out what was meant.

## Step 4: the pipeline

The pieces:

```text
Pendant ──BLE──▶ pendant-cli (download + delete pages on the device)
                     │
                     ▼
               .opus recordings ──ffmpeg──▶ 16 kHz wav ──whisper.cpp──▶ text
                                                                         │
                                       ~/notes/raw/pendant/YYYY-MM-DD.md ◀┘
                                                     │
                                  local web UI (localhost:8766)
                                  + my wiki agent files it into articles
```

A few decisions:

- **On-demand, not always-on.** I first set up a launchd job to sync every 5 minutes, then realised I don't need that. The Pendant buffers everything, so I sync when I sit down at the Mac. In my wiki that's a `/pendant` command in Claude Code, which runs the sync and then files anything worth keeping into the right wiki articles.
- **Plan for slow drains.** BLE downloads run at roughly **10 KB/s**, so a full day of recording can take an hour or more to pull. The script allows up to 4 hours and uses a lock file so two syncs never overlap.
- **Skip junk.** Recordings under 3 seconds are skipped. So are Whisper's classic silence hallucinations ("Thank you.", "you", `[BLANK_AUDIO]`).
- **Raw transcripts stay out of git.** Ambient audio can catch other people. Only what gets compiled into wiki articles is committed.

## Step 5: a small UI

I wanted somewhere to glance at what was captured, so there's a tiny local web app. Python standard library only, no frameworks. It lists transcripts by day, plays the audio for each one, has full-text search, shows battery and last-sync status, and has a **Sync now** button. It runs as a launchd agent, so `http://localhost:8766` is always up.

## Build your own

You need a Mac (Apple Silicon is ideal for Whisper), a Limitless Pendant, and about 30 minutes.

```bash
# 1. Tools
brew install whisper-cpp ffmpeg opus

# 2. Folder + pendant-cli
mkdir -p ~/pendant-sync && cd ~/pendant-sync
git clone https://github.com/MAkcanca/pendant-cli.git
python3 -m venv .venv
./.venv/bin/pip install -e "./pendant-cli[dev,opus]"
(cd pendant-cli && ../.venv/bin/python scripts/gen_proto.py)

# 3. Whisper model (~1.6 GB)
mkdir -p models && curl -L -o models/ggml-large-v3-turbo.bin \
  https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-large-v3-turbo.bin

# 4. Factory-reset the Pendant (see above), keep it near the Mac, then:
./.venv/bin/pendant scan                 # prints the address
./.venv/bin/pendant info <address>       # first secure request = macOS pairs it

# 5. Save the three files below into ~/pendant-sync, set ADDRESS in pendant_sync.py, then:
./.venv/bin/python pendant_sync.py       # sync + transcribe
./.venv/bin/python ui.py                 # open http://localhost:8766
```

To keep the UI running in the background, add a launchd agent at `~/Library/LaunchAgents/com.you.pendant-ui.plist` that runs `.venv/bin/python ui.py` with `KeepAlive` set to true, then load it with `launchctl bootstrap gui/$(id -u) <plist>`.

<details>
<summary><strong>pendant_sync.py</strong>: download, transcribe, append to daily notes</summary>

```python
#!/usr/bin/env python3
"""Pendant → Mac → Whisper → MemoryPalace pipeline.

Each run: connect to the Limitless Pendant over BLE (pendant-cli), drain its
flash (pendant-cli ACK-deletes pages after download, so the pendant never
fills), transcribe new recordings locally with whisper.cpp, append them to
~/notes/raw/pendant/YYYY-MM-DD.md, and update status.json
(read by the local UI, ui.py).

Run on demand (by hand, from a Claude Code command, or the UI's Sync now
button in ui.py): `.venv/bin/python pendant_sync.py`.
"""
import datetime as dt
import fcntl
import json
import shutil
import subprocess
import sys
import time
from pathlib import Path

HOME = Path(__file__).resolve().parent
ADDRESS = "YOUR-PENDANT-ADDRESS"  # from `pendant scan` (on macOS this is a per-host UUID)
PENDANT = HOME / ".venv/bin/pendant"
MODEL = HOME / "models/ggml-large-v3-turbo.bin"
WHISPER = shutil.which("whisper-cli") or "/opt/homebrew/bin/whisper-cli"
FFMPEG = shutil.which("ffmpeg") or "/opt/homebrew/bin/ffmpeg"
WIKI_RAW = Path.home() / "notes/raw/pendant"  # where daily transcript files go
AUDIO = HOME / "data/audio"
RUNS = HOME / "data/runs"
STATUS_JSON = HOME / "status.json"
LOG = HOME / "logs/sync.log"

MIN_SECONDS = 3.0          # skip blips shorter than this
SYNC_TIMEOUT_S = 4 * 3600  # BLE drains ~10 KB/s, so a multi-day backlog can take hours
KEEP_RUNS_DAYS = 14        # wire-fidelity .bin captures kept this long
# Whisper's stock outputs for silence/noise; never worth writing to the wiki.
HALLUCINATIONS = {"", "you", "thank you", "thank you.", "thanks for watching!", "bye.", "okay.", "[blank_audio]", "(silence)"}


def log(msg):
    LOG.parent.mkdir(parents=True, exist_ok=True)
    line = f"{dt.datetime.now():%Y-%m-%d %H:%M:%S} {msg}"
    print(line, flush=True)
    with LOG.open("a") as f:
        f.write(line + "\n")


def load_status():
    try:
        return json.loads(STATUS_JSON.read_text())
    except Exception:
        return {"recent": [], "days": {}}


def save_status(st):
    STATUS_JSON.write_text(json.dumps(st, indent=1))


def recording_start(rec):
    """Pendant clock is unset for the first chunk after a reset (epoch ~0), so
    fall back to last_chunk minus duration when first_chunk looks bogus."""
    first = rec.get("first_chunk", {}).get("absolute_timestamp_ms") or 0
    if first > 1_600_000_000_000:
        return dt.datetime.fromtimestamp(first / 1000)
    last = rec.get("last_chunk", {}).get("absolute_timestamp_ms") or 0
    if last > 1_600_000_000_000:
        return dt.datetime.fromtimestamp((last - rec.get("approx_duration_ms", 0)) / 1000)
    return dt.datetime.now()


def transcribe(opus: Path) -> str:
    wav = opus.with_suffix(".wav")
    # The last Ogg packet of a drained recording is often truncated; ffmpeg
    # complains but still writes everything before it.
    subprocess.run([FFMPEG, "-loglevel", "quiet", "-y", "-i", str(opus), "-ar", "16000", "-ac", "1", str(wav)])
    if not wav.exists() or wav.stat().st_size < 16000:
        return ""
    out = subprocess.run([WHISPER, "-m", str(MODEL), "-f", str(wav), "-l", "en", "-nt", "-np"],
                         capture_output=True, text=True, timeout=600)
    wav.unlink(missing_ok=True)
    return " ".join(out.stdout.split()).strip()


def append_to_wiki(start: dt.datetime, seconds: float, text: str, audio_rel: str):
    WIKI_RAW.mkdir(parents=True, exist_ok=True)
    day = WIKI_RAW / f"{start:%Y-%m-%d}.md"
    if not day.exists():
        day.write_text(
            "---\n"
            f"date: {start:%Y-%m-%d}\n"
            "source: limitless-pendant (local sync via pendant-cli + whisper.cpp)\n"
            "processed: false\n"
            "---\n\n"
            f"# Pendant transcripts — {start:%A, %B %-d %Y}\n\n"
            "Raw ambient/rambling transcripts from the Limitless Pendant. Whisper output: expect "
            "misheard words. Audio kept locally in `pendant-sync/data/audio/`.\n"
        )
    with day.open("a") as f:
        f.write(f"\n## {start:%H:%M} ({seconds:.0f}s)\n\n{text}\n\n<!-- audio: {audio_rel} -->\n")


def cleanup_runs():
    cutoff = time.time() - KEEP_RUNS_DAYS * 86400
    for d in RUNS.glob("*"):
        if d.is_dir() and d.stat().st_mtime < cutoff:
            shutil.rmtree(d, ignore_errors=True)


def run():
    st = load_status()
    st["last_attempt"] = dt.datetime.now().isoformat(timespec="seconds")
    run_dir = RUNS / dt.datetime.now().strftime("%Y%m%d-%H%M%S")
    run_dir.mkdir(parents=True, exist_ok=True)
    base = run_dir / "cap.opus"

    try:
        proc = subprocess.run([str(PENDANT), "sync", ADDRESS, "-o", str(base)],
                              capture_output=True, text=True, timeout=SYNC_TIMEOUT_S)
    except subprocess.TimeoutExpired:
        st["last_error"] = "sync timed out"
        log("sync timed out")
        save_status(st)
        return
    manifest_path = run_dir / "cap.opus.manifest.json"
    if proc.returncode != 0 or not manifest_path.exists():
        tail = (proc.stderr or proc.stdout).strip().splitlines()[-1:] or ["unknown"]
        st["last_error"] = f"not reachable / sync failed: {tail[0][:200]}"
        st["connected"] = False
        log(f"sync failed rc={proc.returncode}: {tail[0][:200]}")
        shutil.rmtree(run_dir, ignore_errors=True)
        save_status(st)
        return

    manifest = json.loads(manifest_path.read_text())
    dev = manifest.get("device", {})
    st.update(connected=True, last_error=None, last_success=st["last_attempt"],
              battery=dev.get("battery_percent"), firmware=dev.get("firmware_ver"))

    recs = manifest.get("recordings", [])
    kept = 0
    for rec in recs:
        seconds = rec.get("approx_duration_ms", 0) / 1000
        src = run_dir / rec["file"]
        if seconds < MIN_SECONDS or not src.exists():
            continue
        start = recording_start(rec)
        dest_dir = AUDIO / f"{start:%Y-%m-%d}"
        dest_dir.mkdir(parents=True, exist_ok=True)
        dest = dest_dir / f"{start:%H%M%S}.opus"
        shutil.move(str(src), dest)
        text = transcribe(dest)
        day = st["days"].setdefault(f"{start:%Y-%m-%d}", {"recordings": 0, "seconds": 0, "transcribed": 0})
        day["recordings"] += 1
        day["seconds"] += round(seconds)
        if text.lower() in HALLUCINATIONS:
            log(f"{dest.name}: {seconds:.0f}s, no speech")
            continue
        append_to_wiki(start, seconds, text, str(dest.relative_to(HOME)))
        day["transcribed"] += 1
        kept += 1
        st["recent"] = ([{"at": start.isoformat(timespec="minutes"), "seconds": round(seconds), "text": text[:400]}]
                        + st["recent"])[:15]
        log(f"{dest.name}: {seconds:.0f}s -> {len(text)} chars")

    if not recs:
        shutil.rmtree(run_dir, ignore_errors=True)  # nothing captured; don't keep empty runs
    log(f"sync ok: battery={st['battery']}% recordings={len(recs)} transcribed={kept}")
    cleanup_runs()
    save_status(st)


if __name__ == "__main__":
    lock = open(HOME / ".sync.lock", "w")
    try:
        fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
    except BlockingIOError:
        sys.exit(0)  # previous run still draining
    run()
```

</details>

<details>
<summary><strong>ui.py</strong>: the local server (stdlib only)</summary>

```python
#!/usr/bin/env python3
"""Local Pendant browser: http://localhost:8766

Reads the transcripts pendant_sync.py appends to ~/notes/raw/pendant/,
plays the matching audio, shows sync status, and can trigger a sync.
Keep it running with a launchd agent (or just run it); stdlib only.
"""
import json
import re
import subprocess
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse

HOME = Path(__file__).resolve().parent
WIKI_RAW = Path.home() / "notes/raw/pendant"
PORT = 8766
ENTRY = re.compile(r"^## (\d\d:\d\d) \((\d+)s\)\n\n(.*?)\n\n<!-- audio: (.*?) -->", re.M | re.S)


def day_entries(day: str):
    f = WIKI_RAW / f"{day}.md"
    if not f.exists():
        return []
    return [{"time": t, "seconds": int(s), "text": txt.strip(), "audio": a}
            for t, s, txt, a in ENTRY.findall(f.read_text())]


def days():
    out = []
    for f in sorted(WIKI_RAW.glob("*.md"), reverse=True):
        es = day_entries(f.stem)
        out.append({"day": f.stem, "count": len(es), "seconds": sum(e["seconds"] for e in es)})
    return out


def search(q: str):
    q = q.lower()
    hits = []
    for d in days():
        for e in day_entries(d["day"]):
            if q in e["text"].lower():
                hits.append({**e, "day": d["day"]})
    return hits[:200]


class H(BaseHTTPRequestHandler):
    def log_message(self, *a):
        pass

    def send(self, body, ctype="application/json", code=200):
        if isinstance(body, (dict, list)):
            body = json.dumps(body).encode()
        elif isinstance(body, str):
            body = body.encode()
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        u = urlparse(self.path)
        p = unquote(u.path)
        if p == "/":
            return self.send((HOME / "ui.html").read_bytes(), "text/html; charset=utf-8")
        if p == "/api/status":
            try:
                st = json.loads((HOME / "status.json").read_text())
            except Exception:
                st = {}
            st["syncing"] = (HOME / ".sync.running").exists()
            return self.send(st)
        if p == "/api/days":
            return self.send(days())
        if p.startswith("/api/day/"):
            return self.send(day_entries(p.rsplit("/", 1)[1]))
        if p == "/api/search":
            q = dict(x.split("=", 1) for x in u.query.split("&") if "=" in x).get("q", "")
            return self.send(search(unquote(q.replace("+", " "))))
        if p.startswith("/audio/"):
            f = (HOME / p[len("/audio/"):]).resolve()
            if HOME in f.parents and f.exists() and f.suffix == ".opus":
                return self.send(f.read_bytes(), "audio/ogg")
        self.send({"error": "not found"}, code=404)

    def do_POST(self):
        if self.path == "/api/sync":
            marker = HOME / ".sync.running"
            if not marker.exists():
                marker.touch()
                # Same script launchd runs; its file lock prevents overlapping drains.
                subprocess.Popen(["/bin/sh", "-c", f'"{sys.executable}" "{HOME}/pendant_sync.py"; rm -f "{marker}"'],
                                 cwd=HOME, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            return self.send({"started": True})
        self.send({"error": "not found"}, code=404)


if __name__ == "__main__":
    print(f"Pendant UI on http://localhost:{PORT}", flush=True)
    ThreadingHTTPServer(("127.0.0.1", PORT), H).serve_forever()
```

</details>

<details>
<summary><strong>ui.html</strong>: the transcript browser</summary>

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Pendant Transcripts</title>
<style>
:root {
  --bg: #f6f5f1; --panel: #ffffff; --ink: #1d1d1b; --muted: #75736c; --line: #e3e1da;
  --accent: #d9480f; --accent-soft: #fde4d6; --good: #2f9e44; --bad: #c92a2a; --hl: #fff3bf;
}
@media (prefers-color-scheme: dark) {
  :root { --bg: #121211; --panel: #1b1b1a; --ink: #ecebe6; --muted: #9a978e; --line: #2c2b29;
          --accent: #ff7a3d; --accent-soft: #3a2116; --good: #51cf66; --bad: #ff6b6b; --hl: #5c4b00; }
}
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--ink); font: 14px/1.55 -apple-system, BlinkMacSystemFont, system-ui, sans-serif; }
.app { display: grid; grid-template-columns: 260px 1fr; min-height: 100vh; }
aside { border-right: 1px solid var(--line); padding: 20px 14px; position: sticky; top: 0; height: 100vh; overflow-y: auto; }
main { padding: 20px 28px 60px; max-width: 900px; }
@media (max-width: 760px) { .app { grid-template-columns: 1fr; } aside { position: static; height: auto; border-right: 0; border-bottom: 1px solid var(--line); } main { padding: 16px; } }
h1 { font-size: 18px; margin: 0 0 2px; letter-spacing: -0.01em; }
.meta { color: var(--muted); font-size: 12px; }
.status { background: var(--panel); border: 1px solid var(--line); border-radius: 12px; padding: 12px; margin: 14px 0; }
.status .row { display: flex; justify-content: space-between; padding: 2px 0; }
.dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 6px; vertical-align: 1px; }
button { font: inherit; border: 1px solid var(--line); background: var(--panel); color: var(--ink); border-radius: 8px; padding: 6px 12px; cursor: pointer; }
button.primary { background: var(--accent); border-color: var(--accent); color: #fff; width: 100%; margin-top: 8px; }
button:disabled { opacity: .6; cursor: default; }
input[type=search] { width: 100%; font: inherit; padding: 8px 10px; border-radius: 8px; border: 1px solid var(--line); background: var(--panel); color: var(--ink); }
.days { list-style: none; padding: 0; margin: 14px 0 0; }
.days li { padding: 8px 10px; border-radius: 8px; cursor: pointer; display: flex; justify-content: space-between; }
.days li:hover { background: var(--panel); }
.days li.sel { background: var(--accent-soft); }
.days .d { font-weight: 500; }
.entry { background: var(--panel); border: 1px solid var(--line); border-radius: 12px; padding: 14px 16px; margin-bottom: 10px; }
.entry header { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
.entry .t { font-weight: 600; font-variant-numeric: tabular-nums; }
.entry audio { height: 30px; margin-left: auto; max-width: 260px; }
.entry p { margin: 0; white-space: pre-wrap; }
mark { background: var(--hl); color: inherit; border-radius: 3px; padding: 0 1px; }
.empty { color: var(--muted); padding: 40px 0; text-align: center; }
h2 { font-size: 16px; margin: 0 0 14px; }
</style>
</head>
<body>
<div class="app">
  <aside>
    <h1>Pendant</h1>
    <div class="meta">Transcripts synced from your Limitless Pendant</div>
    <div class="status" id="status">Loading…</div>
    <input type="search" id="q" placeholder="Search all transcripts">
    <ul class="days" id="days"></ul>
  </aside>
  <main id="main"><div class="empty">Loading…</div></main>
</div>
<script>
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const mins = s => s >= 60 ? `${Math.round(s / 60)} min` : `${s}s`;
const ago = iso => { if (!iso) return 'never'; const s = (Date.now() - new Date(iso)) / 1000;
  return s < 60 ? 'just now' : s < 3600 ? `${Math.floor(s/60)} min ago` : s < 86400 ? `${(s/3600).toFixed(1)} h ago` : `${Math.floor(s/86400)} d ago`; };
const fmtDay = d => new Date(d + 'T12:00').toLocaleDateString(undefined, {weekday: 'short', month: 'short', day: 'numeric'});
let selected = null;

async function loadStatus() {
  const st = await (await fetch('/api/status')).json();
  const ok = st.connected && !st.last_error;
  $('#status').innerHTML = `
    <div class="row"><span><span class="dot" style="background:var(${ok ? '--good' : '--bad'})"></span>${ok ? 'In range' : 'Not reachable'}</span><span>${st.battery != null ? '🔋 ' + st.battery + '%' : ''}</span></div>
    <div class="row meta"><span>Last sync</span><span>${ago(st.last_success)}</span></div>
    <div class="row meta"><span>Last attempt</span><span>${ago(st.last_attempt)}</span></div>
    ${st.last_error ? `<div class="meta" style="margin-top:4px">${esc(st.last_error)}</div>` : ''}
    <button class="primary" id="sync" ${st.syncing ? 'disabled' : ''}>${st.syncing ? 'Syncing…' : 'Sync now'}</button>`;
  $('#sync').onclick = async () => { await fetch('/api/sync', {method: 'POST'}); loadStatus(); };
}

async function loadDays() {
  const ds = await (await fetch('/api/days')).json();
  $('#days').innerHTML = ds.map(d => `<li data-day="${d.day}" class="${d.day === selected ? 'sel' : ''}"><span class="d">${fmtDay(d.day)}</span><span class="meta">${d.count} · ${mins(d.seconds)}</span></li>`).join('')
    || '<li class="meta">No transcripts yet</li>';
  document.querySelectorAll('#days li[data-day]').forEach(li => li.onclick = () => { $('#q').value = ''; showDay(li.dataset.day); });
  if (!selected && ds.length) showDay(ds[0].day);
  if (!ds.length) $('#main').innerHTML = '<div class="empty">No transcripts yet. Talk near the Pendant, then press Sync now.</div>';
}

function entryHtml(e, q, showDay) {
  let text = esc(e.text);
  if (q) text = text.replace(new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), m => `<mark>${m}</mark>`);
  return `<div class="entry"><header><span class="t">${showDay ? fmtDay(e.day) + ' · ' : ''}${e.time}</span><span class="meta">${mins(e.seconds)}</span>
    <audio controls preload="none" src="/audio/${encodeURI(e.audio.replace(/^data\//, 'data/'))}"></audio></header><p>${text}</p></div>`;
}

async function showDay(day) {
  selected = day;
  document.querySelectorAll('#days li').forEach(li => li.classList.toggle('sel', li.dataset.day === day));
  const es = await (await fetch('/api/day/' + day)).json();
  $('#main').innerHTML = `<h2>${new Date(day + 'T12:00').toLocaleDateString(undefined, {weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'})}</h2>`
    + (es.length ? es.slice().reverse().map(e => entryHtml(e)).join('') : '<div class="empty">Nothing this day.</div>');
}

let t;
$('#q').oninput = () => { clearTimeout(t); t = setTimeout(async () => {
  const q = $('#q').value.trim();
  if (!q) return selected && showDay(selected);
  const hits = await (await fetch('/api/search?q=' + encodeURIComponent(q))).json();
  $('#main').innerHTML = `<h2>${hits.length} result${hits.length === 1 ? '' : 's'} for “${esc(q)}”</h2>` + hits.map(e => entryHtml(e, q, true)).join('');
}, 250); };

loadStatus(); loadDays();
setInterval(() => { loadStatus(); if (!$('#q').value) loadDays(); }, 15000);
</script>
</body>
</html>
```

</details>

## What I made of it

The surprising part wasn't the Bluetooth. It was **how much of this was already solved by strangers on GitHub**. Someone had reverse-engineered the protocol from the official app. Someone else had hit the same macOS quirks and written them down. Omi had built a whole drain engine for a device they don't even sell. My job was mostly to put the pieces together and get past the one-pairing-at-a-time wall.

The other lesson: **when a gadget company dies, the hardware usually doesn't have to.** The mic, battery and storage were never the problem. If you have a Pendant in a drawer, it can still be useful.

---

## Practical notes

- **Firmware:** everything here is tested on Pendant firmware **1.1.20**. Don't update through the Limitless app; Omi also warns that newer firmware may break compatibility.
- **Whisper model:** `ggml-large-v3-turbo.bin` with whisper.cpp 1.9.1. If you're on an older Intel Mac, `ggml-small.en.bin` is a lighter option.
- **Range:** syncing only happens near the Mac. If you want it on the go, the Bluetooth part has to stay near the Pendant (a phone or a Raspberry Pi at home). Transcription could move to a server.
- **Consent:** this is an always-on microphone. I use it for my own rambling at home. If you wear it around people, tell them.
- **Costs:** $0 ongoing. Whisper runs locally, nothing is cloud-hosted, and there's no subscription.
