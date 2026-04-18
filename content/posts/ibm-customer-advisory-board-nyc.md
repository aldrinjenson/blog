---
title: "I repped Athena at IBM's Customer Advisory Board in NYC"
date: 2026-03-31T18:00:00-04:00
description: "A day at IBM's Customer Advisory Board as the solo Athena rep — and what enterprise AI actually looks like from the inside of that room."
tags: ["ibm", "athena", "enterprise-ai", "nyc", "advisory-board", "agents", "public-speaking"]
categories: ["Personal"]
draft: false
---

<center>
  <image src="/images/ibm-cab/cab-sign-full.jpg" alt="In front of the IBM Customer Advisory Board sign"/>
  <p class='caption'>IBM HQ, NYC — March 31, 2026</p>
</center>

## Introduction

On March 31st I spent the day at IBM's Customer Advisory Board in New York, representing [Athena Intelligence](https://athenaintelligence.ai/). The CAB is an invite-only session at IBM HQ where a small group of enterprise customers and partners get to poke at IBM's roadmap and swap war stories with product leadership.

I've been to a lot of student hackathons and conferences over the years. This was my first time walking into a room where the name cards all said things like *VP, AI Transformation* and *Chief Data Officer*. It was a different kind of nervous.

## The table setup

I walked in, found my name on the table, and briefly stared at it.

*Aldrin Jenson · Athena Intelligence · IBM Customer Advisory Board.*

A personalized Moleskine, a glass water bottle, a silicone sleeve — IBM does welcome packs right.

<center>
  <image src="/images/ibm-cab/cab-table-nameplate.jpg" alt="IBM Customer Advisory Board table setup with my nameplate"/>
  <p class='caption'>Moleskine + h2go bottle + a small "wait, I actually belong here?" moment.</p>
</center>

## What I learned

A few things stood out from the day's sessions — sharing the ones that genuinely shifted how I think about the enterprise AI market.

### 1. The agent problem has flipped

A year ago, enterprises were asking *"how do I build agents?"*. Today most of them already have dozens of agents running — built by different teams, on different platforms, with no shared visibility. The new question is: **how do I manage the hundreds of agents already in production?**

IBM Orchestrate is being repositioned accordingly — from an agent-building tool into an **agent control plane**. Telemetry, governance, evaluation, lifecycle management — but across agents you didn't build. That framing made a lot of sense. The enterprise doesn't want another framework; it wants a single pane of glass for the agent sprawl that has already happened.

### 2. Identity is the real governance primitive

One of the clarifying comments of the day: when agents are autonomous, the only real control lever is **identity**. Not prompts, not policies — identity. If an agent misbehaves, you revoke its identity and it becomes useless in the environment. Same way you'd reset a compromised employee's password and lock them out of every system at once. Everything else downstream (RBAC, audit, access boundaries) falls out of that one primitive.

Obvious in retrospect, surprisingly rare in how people talk about agent safety.

### 3. 90% of enterprise data is unstructured — and almost none of it is in LLMs

Less than 1% of the world's unstructured enterprise data is represented in language models today. That's the whole opportunity for open RAG stacks. IBM walked through their OpenRAG approach — **Dockling** (IBM Research, now donated to the Linux Foundation) for parsing unstructured docs, **OpenSearch** for retrieval, **Langflow** to tie it together.

The case study they shared was striking: ~90% token reduction, queries from minutes to seconds, and — the part I liked most — **cross-user learning**, where the successful query path one analyst finds automatically benefits the next analyst asking a related question.

My takeaway: the semantic layer — the ontology that knows *"what revenue means to FP&A vs. what it means to sales"* — is the most important and least-built piece of infrastructure in enterprise AI right now.

### 4. Governance is accelerating AI, not slowing it down

Counter-intuitive one. Insurance companies using AI-first governance approaches are compressing 2-3 years of data governance work into 6 months. GenAI is good at the parts that used to require giant manual taxonomies: metadata discovery, semantic understanding, ontology building.

The **shift-left governance** framing — apply controls at the data source, let them percolate downstream — also makes more sense once you accept that agents will amplify any error at the data layer into a user-facing failure.

### 5. The market is not slowing down

A few numbers that stuck with me:

- US VC hit **$339B in 2025** — surpassing all of 2024 ($104B) in just H1.
- **42% of enterprises** are using AI now, up from 26% last year.
- Corporate investors make up **68% of deal value**.
- IBM Ventures is investing out of a **$500M AI fund** (plus a separate quantum fund), with a 90% portfolio collaboration rate — versus an industry benchmark of 50%.

This is not a hype cycle. The money is following actual usage.

## Talking about Athena

I didn't get to do a live demo, but I talked about Athena's spreadsheet agent with a few folks — the piece that writes formulas, respects formatting, and generates multiple document types from a single data entry. Planted the idea more than I showed it.

The shape that seemed to resonate most in conversations was *"the humans describe what they need in one place; agents produce the five artifacts downstream"* — which is roughly what larger enterprises want right now.

## Meeting Chad

<center>
  <image src="/images/ibm-cab/cab-with-chad.jpg" alt="With Chad Jennings from IBM"/>
  <p class='caption'>With Chad Jennings — Global Head of Customer Voice and Product Experience, Data and AI, IBM Software.</p>
</center>

One of the best parts of the day was finally meeting Chad Jennings in person. Chad leads Customer Voice and Product Experience for IBM Software — effectively the person who architects conversations like the CAB itself. He was generous with his time and gave me a sharper mental model of how IBM thinks about customer feedback loops than anything I'd picked up online.

## Going solo

Honestly, the most unexpected part of the day wasn't the content — it was the feeling. Walking in as the youngest person in the room, name card next to people from Fortune 500 financial firms, retail giants, airlines. Realizing that "the company" in the room was me, for that day.

I kept waiting for the moment where someone would ask a question I couldn't answer — and when a few of those moments came, I just said *"I don't know, let me find out and get back to you."* Which is, it turns out, exactly what everyone else in that room also says, just with more gray hair.

<center>
  <image src="/images/ibm-cab/cab-sign-selfie.jpg" alt="Selfie in front of the CAB sign"/>
  <p class='caption'>Small quiet moment of "okay, this is actually happening."</p>
</center>

## Afterthoughts

- **Enterprise AI is less about models and more about plumbing.** Orchestration, governance, semantic layers, agent identity — that's where the next two years of enterprise value get captured. The companies that win the application layer will be the ones that thought hardest about the boring parts.
- **Customer feedback is a product.** The CAB itself is an artifact of IBM treating customer voice as something you invest in deliberately — not something that happens by accident. Most startups (including the ones I've worked at) underinvest here.
- **Showing up counts.** I nearly hesitated on the trip because of imposter-flavored anxiety. I'm glad I didn't. You learn more in one day of being in the room than in six months of reading about what happens in the room.
