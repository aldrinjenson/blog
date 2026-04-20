---
title: "NYCGuessr — GeoGuessr with 960 live NYC traffic cameras"
date: 2026-04-19T21:00:00-04:00
draft: false
description: "Built a GeoGuessr-style game using NYC DOT's 960 live traffic camera feeds. Shipped in an evening, got removed from r/nyc despite 77 upvotes, found a silent geo-block bug thanks to a friend in India, and learned a lot about distribution along the way."
tags: ["tech", "javascript", "web-dev", "nyc", "launch", "side-project", "vercel", "vanilla-js"]
categories: ["Projects"]
---

> **Live:** [nycguessr.vercel.app](https://nycguessr.vercel.app) · **Code:** [github.com/aldrinjenson/nycguessr](https://github.com/aldrinjenson/nycguessr)

<img src="/images/nycguessr/og.png" width=700 alt="NYCGuessr social preview card — yellow on black, taxi-cab aesthetic">

A GeoGuessr-style game using 960 live NYC DOT traffic cameras. You see a real-time feed, drop a pin on the map where you think it is, closer guesses score more. 5 rounds, 40 seconds each.

The magic is that the feeds are genuinely live — every round has different cars, different weather, different pedestrians. A round at 3 AM looks nothing like rush hour. The halal cart you see on-screen might still be parked there when you look out the window.

This is the full story of how it got built, how it launched, how it broke, and how it got patched up.

## The spark

A few days before I built this, I was looking for something else entirely. I vaguely remembered a site that let you "take a photo from any NYC traffic light" and went searching for it. What I found was [Traffic Cam Photobooth](https://trafficcamphotobooth.com) by [Morry Kolman](https://wttdotm.com) — a static site that turns NYC DOT's public traffic camera feeds into a personal photo booth. 900+ cameras, a map, one-tap snapshots.

Playing with it, the obvious question was *how on earth does this work?* Poking at the page with Chrome dev tools turned up the answer: **there's no special API**. The page hits an unauthenticated endpoint on `webcams.nyctmc.org` that returns a JSON list of cameras and then loads individual JPEGs by UUID. The feeds themselves are served by NYC DOT as part of their civic-information mandate — the same feeds that run on NYC cable Channel 72.

That realization reframed 960 traffic cameras from "infrastructure you can't access" to "JSON file + plain `<img>` tags." A free substrate to build on.

(I only learned later that Morry had [written up the same discovery in detail](https://wttdotm.com/blog/tcpb_part_2.html) — which is a much better explanation than this blog post. If you're interested in the mechanics, read his post.)

I brainstormed what else could live on top of it. An Obsidian plugin that auto-captures the nearest-intersection camera view into today's note. A 900-camera video wall as a screensaver. A commute predictor that reads multiple cameras on a route to detect congestion 2-3 minutes before Google Maps reacts. A YOLO-powered pedestrian counter for "which intersection is busiest at 3 AM?"

But the cleanest idea was **GeoGuessr for NYC**. Camera gives you the image. Map is the input surface. Distance is the score. And the live feed is the magic — every round is unreproducible because the world is changing in real time.

## The build — one evening

I opened Claude Code and started with a single `index.html`. No framework, no build step, no backend. The whole thing is Leaflet for the map, vanilla JS for the game loop, the browser's Web Audio API for sound effects, and one big `cameras.js` (164 KB) with all 960 locations and their image URLs.

The camera list gets scraped once from `webcams.nyctmc.org/api/cameras` — CORS blocks that fetch in the browser, but I don't need to do it in the browser. I pull the list once, commit it to the repo as a `window.CAMERAS = [...]` blob, and the game just iterates it. Individual camera images come via `webcams.nyctmc.org/api/cameras/{uuid}/image` — CORS doesn't apply to plain `<img>` loads, so the browser can fetch them directly.

The gameplay loop:

- Pick 5 random cameras (filtered by borough if the player wants).
- Show the live camera feed (refreshed every 2 seconds via `<img src>` cache-busting).
- Let the player drop a pin on the map.
- Score with `5000 × exp(-distance_m / 1200)` — so 100m off gets you ~4800 points, 1km gets ~2100, 5km gets basically nothing.
- Show the truth location with a line connecting it to the guess. Do it five times. Sum.

<img src="/images/nycguessr/gameplay.png" width=700 alt="NYCGuessr mid-round — live traffic camera feed on the left shows a night-time Manhattan street with headlights and a 'Facing North' overlay; the right half is a dark map with a blue guess-pin dropped in Manhattan">

*A round in progress. The left half is the live camera feed (NYC DOT's own timestamp overlay visible); the right half is the guessing map with my pin dropped mid-Manhattan.*

For sound I used Web Audio API oscillators — no audio files bundled. Tones for pin drop, guess submit, "nice guess" chime, "bad guess" thunk, countdown ticks, end-game fanfare. The whole SFX layer is ~30 lines of code.

One detail I'm proud of: a 1200×630 PNG **share card** generated on the fly in `<canvas>` at game-end. Yellow accent bar, player name, huge score, colored dot-circles for the 5 rounds, "close guesses" MTA-style bullet badges, URL footer. `canvas.toBlob()` produces a `Blob` that gets fed to `navigator.share({files:[file]})` on mobile (the native share sheet attaches the image to whatever app the user picks) or `ClipboardItem` with `image/png` on desktop. No backend, no image server, entirely runtime.

A surprise during development: ~148 of the 960 cameras have NYC DOT internal route codes as names instead of human intersections — things like `C1-MDE-12-SB_at_Heath_Ave-Ex9`. I wrote a small lookup table covering ~35 highway/bridge codes (BQE, LIE, MDE, FDR, HHP, etc.) and a prettifier that turns that into **"Major Deegan Expwy · SB @ Heath Ave · Exit 9"**. Cameras with plain names (`"Hillside Ave @ Little Neck Pkwy"`) pass through untouched.

The whole app came out to roughly 1,100 lines of HTML + CSS + JS, one CDN dependency (Leaflet), one JSON file. No build step. Deployed it with a single `vercel --prod --yes`, then wired GitHub auto-deploy so every `git push origin main` ships to `nycguessr.vercel.app` in about 15 seconds.

## The launch — a mod takedown with hundreds of visitors trailing behind

I posted to r/nyc. Honest title: *"I made a game where you guess the NYC intersection from a live traffic camera."*

It landed. 77 upvotes, 17 comments in a few hours. People were genuinely into it — one person wondered if "it'll be easier tomorrow when it's not raining" (confirming the live-feed thesis was working). Others asked for a thicker reveal line à la GeoGuessr. Someone wanted the timer to be more visible. Someone else hit a "This Camera Is Being Serviced" placeholder screen. Another asked for miles/blocks instead of meters — and suggested *"even better: measure it in city blocks."*

Then the post got removed. "Sorry, this post has been removed by the moderators of r/nyc." Classic r/nyc anti-self-promo policy — it doesn't matter how much the community is enjoying your thing, if you made it and linked to it, it's out.

But — and this is the funny part — the post did its job in the window it had. The first ~20 hours after launch brought **713 unique visitors, 1,113 page views, and 421 of those referrals came from various Reddit domains** (reddit.com, out.reddit.com, old.reddit.com, com.reddit.frontpage) before and after the takedown. Mobile was 87% of traffic, iOS 64%, Android 23% — matching NYC demographics almost exactly.

A surprise in the referrer list: **11 visitors from news.ycombinator.com.** I hadn't posted to HN yet, so someone else had surfaced it there. A small number, but a real signal that the kind of audience I'd been drafting for had found it organically before I got around to the formal Show HN.

Reddit's own "suggested alternative communities" helpfully pointed me at r/WebGames and r/IndieGaming (subs explicitly built for this) which I hadn't considered. In retrospect, the takedown was a gift — it redirected me toward the audiences that actually wanted this kind of post.

## The bug I couldn't have found myself

Within 24 hours, some friends in India messaged me saying the game didn't work — the cameras weren't loading.

I tested on my laptop. Worked fine. I tested on cellular. Worked fine. Everything worked from New York.

Then I opened Firefox dev tools on a friend's VPN routed to Beijing and watched the network panel fill up with `NS_BINDING_ABORTED` entries for every `webcams.nyctmc.org` request. The Vercel-hosted HTML loaded. The Carto basemap tiles loaded. But every camera image request died silently — 0 bytes transferred, TLS connection reset.

**NYC DOT geo-blocks the camera endpoint.** Not a CDN policy. Not rate limiting. A hard US-only policy, enforced by the TLS layer, with no error message. My site was quietly broken for every international player.

I fixed it with a 15-line Vercel serverless function at `/api/cam/[uuid].js` that fetches the image server-side (Vercel egresses from a US IP, so the geo-block doesn't apply) and streams the JPEG back. The client-side URL got rewritten from `webcams.nyctmc.org/api/cameras/{uuid}/image` to `/api/cam/{uuid}` at runtime — `cameras.js` stayed untouched.

One detail matters here: the original code appended `?t=' + Date.now()` to bust the browser's image cache. If I'd left that through the proxy naively, every user's every refresh would invoke the function and hammer NYC DOT — wasting bandwidth and making a much bigger footprint than the old direct-hit pattern. The fix is to **quantize the timestamp** to the refresh window: `?t=' + Math.floor(Date.now() / REFRESH_MS)`. Now all viewers of the same camera within the same 2-second window request an identical URL, Vercel's edge CDN serves a cached response, and only *one* NYC DOT fetch happens per camera per 2s regardless of concurrent player count.

I don't think I would have found this bug on my own. The only thing that surfaced it was a real player saying "this doesn't work." A reminder that launches benefit from people outside your testing context even when — especially when — they break things.

## Patching up the game from Reddit feedback

The Reddit thread was a goldmine. After the takedown I went through every comment and sorted them by upvotes. A weekend's worth of polish fell out:

**The reveal screen was hidden.** Three independent complaints: "should show the line between guess & actual" / "kinda does but it's in the background and blurred, near useless" / "can't see where my guess is in relation." GeoGuessr's line-to-truth reveal is the iconic dopamine moment. I'd built it and hidden it. Fix: full split-screen reveal with the map on top (GeoGuessr-style), thicker yellow dashed line, pins bumped from 18px to 22px with floating "YOU" and "ACTUAL" labels above each one.

<img src="/images/nycguessr/reveal.png" width=700 alt="Reveal screen — top half is a dark map showing a yellow dashed line connecting a blue 'YOU' pin in midtown Manhattan to a yellow 'ACTUAL' pin further uptown near the river; bottom panel shows '1.48 mi away', '2 Ave @ 58 St', '+685 points', and a 'Next round' button">

*Reveal after a round — the dashed yellow line shows the distance between where I dropped my pin and where the camera actually was.*

**The timer was invisible until too late.** One commenter lost points from not realizing time was running out. I rewrote the timer to pulse from second one, with three tiers: yellow default (>15s), amber faster-pulse warn (≤15s), flashing red with a lower-tone sound at the critical tier (≤5s). Also bumped round length from 30s → 40s so mobile players who need to zoom/pan have more breathing room.

**Meters and kilometers were wrong for the audience.** The right fallback here is feet and miles, not meters. I almost got clever and tried to add NYC-blocks as a unit, but that rabbit hole turned out deeper than expected. Manhattan's grid is tilted ~29° from true north. Short blocks (N-S) are ~80m but avenue blocks (E-W) range from 600 to 900 feet depending on where you are. Heuristic decomposition can't match the navigational count a local does in their head ("2 streets south + 1 avenue west = 3 blocks") without genuine grid-walking logic, which is out of scope. Settled on miles + feet — clear, correct, universally understood.

**Dead cameras were ruining rounds.** One commenter hit the NYC DOT "This Camera Is Being Serviced" placeholder and lost points on it. No flag in the API response says "this is a placeholder." I had to detect it client-side. The approach I landed on: sample the first loaded frame into a tiny 30×30 offscreen canvas, measure RGB variance across the pixels. Real feeds have lots of color variation from cars, buildings, sky, people — they routinely score between 3,000 and 30,000. Flat service screens are near-monochrome and score under 700. If a camera trips the threshold, I blacklist its UUID in `localStorage` and swap in a fresh camera mid-round. The blacklist persists across sessions, so a player never sees the same dead feed twice.

**Tap-to-zoom on the camera feed.** Someone wanted higher resolution for distant bus numbers and street signs. I can't upscale what NYC DOT gives me, but I can let you zoom into it — click anywhere on the camera pane, it scales 2.2× centered on the click point. Click again to reset.

The polish pass was ~316 lines of diff — about 4 hours of work.

## What I learned about distribution

After the r/nyc takedown I drafted reposts to the subs Reddit actually pointed me at — r/WebGames, r/IndieGaming, r/newyorkcity, r/InternetIsBeautiful, r/webdev, Show HN, Twitter.

A surprisingly large number of them have automatic filters that catch what appear to be self-promo patterns. r/newyorkcity's AI pre-check caught even a carefully-worded text post where the URL was deferred to the first comment. r/InternetIsBeautiful — which I thought was an obvious fit — turns out to have an explicit **Rule 3: No Webgames.** They removed that category from the sub after the Wordle-clone flood years ago.

Both of those turned into useful data. The lesson I took away: a sub's **stated** rules are a small fraction of its **enforced** rules, and automated filters now do most of the enforcement. Fighting through them is low-ROI when there are other subs whose charter explicitly matches your thing.

Where you post matters more than how you frame it.

## Where things stand

<img src="/images/nycguessr/gameover.png" width=600 alt="Game-over screen showing 1,180 out of 25,000 points, a per-round breakdown with distances and points, and an auto-generated share card with circles indicating round quality plus Share / Download PNG / Twitter / Reddit / Copy buttons">

*Final screen — round breakdown, auto-generated PNG share card, and share buttons. The card below the score is what gets posted when you tap Share.*

The game is live. Live feeds work in every country now. The reveal screen is actually legible. The timer is hard to miss. Dead cameras auto-swap. Tap-to-zoom works.

Twitter post shipped. r/webdev shipped. Show HN drafted (someone else got there first organically, but a formal Show HN is still worth posting during a weekday-morning slot). r/WebGames still on the to-do.

Honestly, even if the game doesn't get another burst of traffic, the experience has already been worth it. Started from Morry's blog post, ended with working infrastructure I understand top to bottom: a live-image pipeline through a Vercel proxy, a variance-based placeholder detector, a canvas-generated share card, and 900-ish lines of browser code that doesn't need npm to run. Plus concrete lessons about launch mechanics that I wouldn't have gotten from reading about them.

If you play it and your score feels bad, borough-filter to your home turf and try again. Cabbies and lifers should clean up. The rest of us get to learn just how similar a random BQE stretch looks to a random Queens boulevard.

Code's open at [github.com/aldrinjenson/nycguessr](https://github.com/aldrinjenson/nycguessr). PRs welcome, especially for the dead-camera variance threshold and the route-code prettifier.

Huge thanks to [Morry Kolman](https://wttdotm.com) for both the original Traffic Cam Photobooth and the write-up that showed me how it worked. Without that blog post this wouldn't exist.
