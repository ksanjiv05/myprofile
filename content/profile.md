# Profile — source of truth for all site copy

Every string on the site comes from this file. Update here first, then propagate to
`design/profile.pen` and the built pages.

**Legend:** ✅ verified (store listing, repo, or git history) · 🟡 stated by you, not
independently checkable · ❗️TODO — still missing.

---

## Identity

| field | value | status |
|---|---|---|
| Name | Sanjiv Kumar Pandit | ✅ git author |
| GitHub | `ksanjiv05` | ✅ |
| Studio / label | Axion Labs | 🟡 inferred from bundle id `com.sanjiv.axionlabs.neuron` — confirm |
| Positioning | AI & full-stack engineer | ✅ matches your stack + shipped apps |
| Domain | `imsanjiv.in` | ✅ confirmed |
| Header wordmark | `SANJIV PANDIT` | ✅ the name, not the URL — the address bar already shows the domain |
| Location + timezone | Bengaluru · IST — *assumed* | ❗️TODO confirm |
| Public email | — | ❗️TODO |
| LinkedIn | — | ❗️TODO |
| Years of experience | — | ❗️TODO |
| Availability line | "Available for work · Q4 2026" | ❗️TODO confirm |

## Positioning

**Headline:** "I build AI products end to end — retrieval, agents, and the apps they ship in."
**Sub:** RAG pipelines, multi-agent orchestration and on-device LLMs, wired into React
Native apps and Node/Python backends. Three apps live on the App Store and Google Play.

🟡 Both lines are mine — replace with your own voice if you prefer.

## Stats strip

| stat | value | source |
|---|---|---|
| Apps live on iOS & Android | **3** | ✅ two store listings verified, third stated |
| AI systems built end to end | **4** | 🟡 your list: RAG, agent orchestration, multi-agent, on-device LLM |
| Vector stores worked with | **2** | ✅ Qdrant + hnswlib, from your stack |
| In progress | **1** | ✅ Vaani wearable |

*The previous ArogIQ-derived stats (279 operations, 64k lines) are removed along with
the project.*

## Work — six entries, ordered as you asked

### 01 · FindMyPlayer ✅
iOS · `id6742809294` · Sports · seller **Find My Player Inc**.
Subtitle: *"Connect Athletes with Coaches."* Players build a profile with stats, video
and achievements to get in front of scouts; coaches browse highlights in one place.
**Tags:** IOS · REACT NATIVE · LIVE
❗️TODO confirm React Native (inferred from your stack, not the listing) and your role
(solo, or contract for Find My Player Inc).

### 02 · Tasker AI: Day Planner & Note ✅
Android · `com.aitasker` · Productivity.
An AI day planner and note app — plans the day and keeps the notes it generates on the
same surface, instead of in two apps.
**Tags:** ANDROID · LLM · LIVE

### 03 · Neuron — on-device LLM 🟡
Android · `com.sanjiv.axionlabs.neuron` · shipped under Axion Labs.
The model runs on the handset, so chat works with no network and nothing leaves the
device.
**Tags:** ANDROID · ON-DEVICE LLM · LIVE
❗️TODO which runtime — llama.cpp, MLC, GGUF quantisation? For an on-device app that
detail is the story.

### 04 · Vaani — wearable capture ✅ *(work in progress)*
`github.com/ksanjiv05/vanni` · Kotlin.
README: *"An ESP32 wearable records audio; the Android app transcribes it via Sarvam AI,
turns it into notes, summaries and to-dos, and lets you search and chat with them using
on-device RAG."*
**Tags:** KOTLIN · ESP32 · ON-DEVICE RAG
Note: repo is `vanni`, README calls it **Vaani** — the design uses Vaani. Say if you
want the repo spelling instead.

### 05 · Lattice — calculation canvas ✅
`github.com/ksanjiv05/Lattice` · TypeScript · React 19, Vite, React Flow, Zustand, Tailwind.
README: *"Build models on an infinite whiteboard: drop nodes, give each one a formula,
wire them together, and watch values flow and recompute live."* The engine is
*"a hand-written tokenize → shunting-yard → RPN evaluator with built-in math functions,
dependency ordering, and cycle detection"* — no `eval`.
**Tags:** TYPESCRIPT · REACT FLOW · ZUSTAND

### 06 · WishperWave ❗️TODO
`github.com/ksanjiv05/WishperWave` **returns 404 publicly** — private, renamed, or a
different spelling. Card is drawn in the "awaiting copy" state.

### Removed
- **ArogIQ API Server** — removed at your request.
- **Aarogya Web App** — removed alongside it; the two are halves of the same platform.
  Say the word and it goes back in.

## Links — `public/assets/js/data.js` → `social`

An entry with an empty `href` is skipped at render time, so a placeholder never ships
as a dead link. Paste a URL to switch one on.

| label | href | status |
|---|---|---|
| GitHub | https://github.com/ksanjiv05 | ✅ live |
| App Store | https://apps.apple.com/us/app/findmyplayer/id6742809294 | ✅ live |
| Google Play | https://play.google.com/store/apps/details?id=com.aitasker | ✅ live |
| LinkedIn | — | ❗️TODO send the profile URL |
| X | — | ❗️TODO or delete the entry if you do not use it |
| Email | — | ❗️TODO `mailto:hello@imsanjiv.in` once the mailbox exists |

Other links held elsewhere:
- https://play.google.com/store/apps/details?id=com.sanjiv.axionlabs.neuron 🟡 unverified
- https://github.com/ksanjiv05/vanni ✅ · https://github.com/ksanjiv05/Lattice ✅
- https://github.com/ksanjiv05/WishperWave ❗️404

## "How I work" — three habits 🟡

These are my words, rewritten to match AI work. Confirm or replace:

- **A / RETRIEVAL — "Context beats parameters."** Chunking, embeddings and reranking
  decide answer quality long before model choice does.
- **B / AGENTS — "Deterministic edges."** Graph the workflow, keep tools typed and side
  effects explicit. A loop you cannot trace is a loop you cannot fix.
- **C / DELIVERY — "Ship it observable."** A feature is not done at merge; it is done
  when a trace proves it behaved in production.

## About — narrative ✅ your words

Heading: **I like problems that stay solved.**

Para 1: I build LLM applications end to end: RAG retrieval, agent and multi-agent orchestration with LangChain and LangGraph, MCP servers, and local-LLM applications that run models directly on the handset instead of relying on a server. I’m comfortable under the hood — tokenization, vector embeddings, attention, and transformer mathematics — not just at the SDK layer. That depth is often what separates a demo from something that holds up when faced with real questions.

Para 2: The other half is shipping. Three apps are live across the App Store and Google Play, a wearable is in progress that captures audio and answers questions about it entirely on-device, and a node-based calculation canvas has a formula engine written from scratch. Underneath it all is a long stretch of MERN and Fastify backend work.

## Working history

| # | role | org | dates | status |
|---|---|---|---|---|
| 01 | Independent — mobile & AI apps | Axion Labs | — | 🟡 ❗️TODO dates |
| 02 | Vaani & Lattice — in progress | self | 2026 → now | ✅ |
| 03 | MERN & Fastify backends | — | — | ❗️TODO dates + orgs |
| 04 | — | — | — | ❗️TODO |

## Toolbox ✅ (from your file)

- **Languages:** JavaScript / TypeScript · Python · Rust *(basic)* · C++ *(basic)* · SQL
- **AI & LLM:** LangChain · LangGraph · MCP · RAG · Qdrant · hnswlib
- **Backend:** Node · Express · Fastify · FastAPI
- **Frontend & mobile:** React · React Native · Next.js · TanStack
- **Data & DevOps:** Postgres · MongoDB · AWS · Docker
- **Depth:** tokens, vendor embeddings, attention, transformer internals

## Ticker strip ✅

PYTHON · TYPESCRIPT — LANGCHAIN · LANGGRAPH · MCP — QDRANT · POSTGRES

## Colophon ✅

Geist · Inter · IBM Plex Mono — Paper `#FAF9F6` · Ink `#14130F` — corner radius 0px.
