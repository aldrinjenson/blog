---
title: "ApplyWiz — auto-applying to LinkedIn Easy Apply jobs while you watch"
weight: 999
date: 2023-08-17T12:00:00-04:00
draft: false
description: "The story of ApplyWiz — a Chrome extension that automated LinkedIn's Easy Apply flow end to end. A Manifest-V3 automation engine, a Next.js + Stripe + Supabase web app, and a lot of DOM choreography to make an undocumented, ever-shifting modal behave deterministically. Launched on Product Hunt in Aug 2023."
tags: ["tech", "typescript", "chrome-extension", "automation", "web-scraping", "nextjs", "supabase", "stripe", "side-project", "launch"]
categories: ["Automation"]
---

> **Code:** [github.com/aldrinjenson/applywiz-chrome-extension](https://github.com/aldrinjenson/applywiz-chrome-extension) · **Launched:** Product Hunt, Aug 17 2023

ApplyWiz auto-applies to LinkedIn "Easy Apply" jobs while you watch. You open a job search, hit go, and the extension walks through the listings one by one — opening each job, stepping through the multi-page application modal, filling the fields, and submitting — while you sit back and watch the counter climb. This is the story of building it, and of the one hard problem that made the whole thing interesting.

One honest note up front: this automated LinkedIn, which is against their Terms of Service. I'm writing it up as a past technical project, not a product I'd point people at today. The repo is public now, and the engineering is the part worth keeping.

## Three moving parts

ApplyWiz was three pieces that had to work together:

- A **Manifest-V3 Chrome extension** — the actual automation engine that drives the browser.
- A **Next.js web app** — auth, the dashboard, Stripe subscriptions, and the analytics that showed you how many jobs you'd applied to.
- A **Supabase Postgres backend** — the data layer tying users, subscriptions, and stats together.

The web app was the boring-but-necessary scaffolding: Chakra/Tailwind on the front, Stripe for the subscription billing, Supabase holding state. Standard stuff, and it shipped. The interesting part lived in the extension.

## The hard part: choreographing a UI that fights back

LinkedIn's Easy Apply has no API. There's no documented endpoint you can POST an application to. All you get is a multi-step modal — Continue, then maybe a few question pages, then Review, then Submit — rendered by a single-page app that lazily injects DOM nodes whenever it feels like it. And LinkedIn changes that markup constantly. So the entire automation is **DOM choreography**: pretend to be a human, but reliably, thousands of times.

The foundation is a tiny `waitForElement` primitive that polls the DOM every **75ms** until a selector shows up (or times out). Because the SPA renders lazily, you can't assume anything is on screen when you look for it — you have to wait for it the way a human's eyes wait for the page to settle. Everything else is built on top of this.

On top of that sits the real engine: a **multi-step modal state machine** (`applyToJobs`). The modal doesn't tell you what state it's in, so the machine infers it from the buttons present — distinguishing **Continue** vs. **Review** vs. **Submit** by their `aria-label`. To detect when a form is stuck or looping (you hit Continue and nothing advances), it reads LinkedIn's own **completeness progress meter** — the little "your application is 60% complete" indicator — and bails out of jobs that aren't making forward progress instead of spinning forever.

The cleverest piece is the autofill. When a step has unanswered required fields, an **intelligent autofill cascade** (`handleAnyUnfilledColumns`) kicks in. It finds the error-flagged fields, reads each field's label, and tries to fill it through a priority order:

1. An **experience-by-skill map** — if the question is "how many years of React?", it looks up React.
2. The user's **"advanced tags"** — custom answers the user pre-configured.
3. **Generic profile keys** — name, phone, the usual.
4. **Dropdown / checkbox fallbacks** for anything that's a select or a yes/no.

Crucially, it dispatches **React-friendly `input` and `change` events** after setting values — because just setting `.value` doesn't register with React's controlled inputs; the framework needs to see the event to update its own state. And if a field genuinely can't be answered honestly — a question the cascade has no real answer for — it **gracefully discards the job** rather than submitting a made-up answer. That restraint mattered to me. The tool shouldn't lie on your behalf.

Around all of that is the unglamorous robustness work that makes an automation actually survive a real session: lazy-load scrolling to force listings to render, pagination to walk through pages of results, error-toast detection with retry, already-applied detection so it skips jobs you've done, and resume selection.

The whole extension was TypeScript on Webpack 5, MV3, styled with Sass, tested with Mocha and c8 coverage, and built in CI with GitHub Actions.

## What I took away from it

This was one of the most complex solo automation builds I've done. Not because any single piece was hard, but because the target actively resisted being automated — an undocumented, lazily-rendered, frequently-changing UI with no contract you could rely on. The real lesson was about **making an unreliable, undocumented UI behave deterministically**: poll instead of assume, infer state from observable signals instead of trusting the page to tell you, and always have a graceful exit for the cases you can't handle honestly.

That mindset — treat the messy interface as the thing you have, not the thing you wish you had, and build certainty on top of it — is something I've carried into everything I've built since.

Code's open at [github.com/aldrinjenson/applywiz-chrome-extension](https://github.com/aldrinjenson/applywiz-chrome-extension).
