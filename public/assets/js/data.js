/* Site content. Mirrors content/profile.md — update that file first. */
window.DATA = {
  identity: {
    name: "Sanjiv Kumar Pandit",
    wordmark: "SANJIV PANDIT",
    domain: "imsanjiv.in",
    url: "https://imsanjiv.in",
    github: "https://github.com/ksanjiv05",
    role: "AI & full-stack engineer",
    availability: "AVAILABLE FOR WORK  ·  Q4 2026  ·  REMOTE / BENGALURU",
    headline: "I build AI products end to end: retrieval, agents, and the apps they ship in.",
    sub: "RAG pipelines, multi-agent orchestration and on-device LLMs — wired into React Native apps and Node/Python backends. Three apps live on the App Store and Google Play."
  },

  ticker: ["PYTHON", "TYPESCRIPT", "LANGCHAIN", "LANGGRAPH", "MCP", "QDRANT", "POSTGRES", "REACT NATIVE", "FASTIFY", "ON-DEVICE RAG"],

  stats: [
    { value: 3, suffix: "", label: "APPS LIVE ON IOS & ANDROID" },
    { value: 4, suffix: "", label: "AI SYSTEMS BUILT END TO END" },
    { value: 2, suffix: "", label: "VECTOR STORES · QDRANT, HNSWLIB" },
    { value: 1, suffix: "", label: "IN PROGRESS · VAANI WEARABLE" }
  ],

  projects: [
    {
      idx: "01", meta: "2026 · MOBILE / IOS", title: "FindMyPlayer",
      desc: "Connect athletes with coaches. Players build a profile of stats, video and achievements to get in front of scouts; coaches browse highlights in one place to find talent.",
      tags: ["IOS", "REACT NATIVE", "LIVE"],
      href: "https://apps.apple.com/us/app/findmyplayer/id6742809294",
      cta: "OPEN ON THE APP STORE",
      pattern: { pitch: 11, maxDot: 8, direction: "right", gamma: 1.7 },
      filters: ["mobile"]
    },
    {
      idx: "02", meta: "2026 · MOBILE / AI", title: "Tasker AI — Day Planner & Note",
      desc: "An AI day planner and note app on Google Play. Plans the day and keeps the notes it generates on the same surface, instead of in two apps.",
      tags: ["ANDROID", "LLM", "LIVE"],
      href: "https://play.google.com/store/apps/details?id=com.aitasker",
      cta: "OPEN ON GOOGLE PLAY",
      pattern: { pitch: 11, maxDot: 8, direction: "radial", gamma: 1.4 },
      filters: ["mobile", "ai"]
    },
    {
      idx: "03", meta: "2026 · MOBILE / AI", title: "Neuron — on-device LLM",
      desc: "A local-LLM Android app shipped under Axion Labs. The model runs on the handset, so chat works with no network and nothing leaves the device.",
      tags: ["ANDROID", "ON-DEVICE LLM", "LIVE"],
      href: "https://play.google.com/store/apps/details?id=com.sanjiv.axionlabs.neuron",
      cta: "OPEN ON GOOGLE PLAY",
      pattern: { pitch: 14, maxDot: 6, direction: "down", gamma: 2.2 },
      filters: ["mobile", "ai"]
    },
    {
      idx: "04", meta: "IN PROGRESS · WEARABLE", title: "Vaani — wearable capture",
      desc: "An ESP32 wearable records audio; a Kotlin Android app transcribes it with Sarvam AI, turns it into notes, summaries and to-dos, then answers questions over them with on-device RAG.",
      tags: ["KOTLIN", "ESP32", "ON-DEVICE RAG"],
      href: "https://github.com/ksanjiv05/vanni",
      cta: "VIEW ON GITHUB",
      pattern: { pitch: 10, maxDot: 7, direction: "up", gamma: 1.5 },
      filters: ["ai", "hardware", "mobile"]
    },
    {
      idx: "05", meta: "2026 · WEB / TOOLING", title: "Lattice — calculation canvas",
      desc: "A node-based whiteboard for models: drop nodes, give each a formula, wire them together and watch values recompute live. Hand-written tokeniser, shunting-yard and RPN evaluator — no eval, with cycle detection.",
      tags: ["TYPESCRIPT", "REACT FLOW", "ZUSTAND"],
      href: "https://github.com/ksanjiv05/Lattice",
      cta: "VIEW ON GITHUB",
      pattern: { pitch: 16, maxDot: 9, direction: "left", gamma: 1.3 },
      filters: ["web"]
    },
    {
      idx: "06", meta: "AWAITING LINK", title: "WishperWave",
      desc: "The repository is private or renamed. Send a public link and one line of summary and this card fills itself.",
      tags: ["TBD"], href: null, cta: "TO BE FILLED",
      pattern: null, muted: true, filters: []
    }
  ],

  habits: [
    { key: "A / RETRIEVAL", title: "Context beats parameters",
      body: "Chunking, embeddings and reranking decide answer quality long before the choice of model does." },
    { key: "B / AGENTS", title: "Deterministic edges",
      body: "Graph the workflow, keep tools typed and side effects explicit. A loop you cannot trace is a loop you cannot fix." },
    { key: "C / DELIVERY", title: "Ship it observable",
      body: "A feature is not done at merge. It is done when a trace proves it behaved in production." }
  ],

  about: [
    "I build LLM applications end to end: RAG retrieval, agent and multi-agent orchestration with LangChain and LangGraph, MCP servers, and local-LLM applications that run models directly on the handset instead of relying on a server. I’m comfortable under the hood — tokenization, vector embeddings, attention, and transformer mathematics — not just at the SDK layer. That depth is often what separates a demo from something that holds up when faced with real questions.",
    "The other half is shipping. Three apps are live across the App Store and Google Play, a wearable is in progress that captures audio and answers questions about it entirely on-device, and a node-based calculation canvas has a formula engine written from scratch. Underneath it all is a long stretch of MERN and Fastify backend work."
  ],

  history: [
    { idx: "01", title: "WEO Global Inc.", when: "OCT 2023 — NOW",
      desc: "Software Developer, Michigan City. Scalable Node.js backends, cross-platform mobile apps in React Native, and responsive web applications." },
    { idx: "02", title: "Qioseon Labs LLP", when: "SEP 2022 — OCT 2023",
      desc: "Software Developer, Mumbai. Designed and maintained Node.js backend systems and high-performance React web applications." },
    { idx: "03", title: "Innobuz", when: "MAR 2021 — SEP 2022",
      desc: "Software Developer, Delhi. Robust Node.js backends and responsive React front ends, with an eye on integration and deployment." },
    { idx: "04", title: "Invatu Technology Pvt Ltd", when: "FROM NOV 2019",
      desc: "Software Developer, Delhi. Scalable Node.js backends with secure API design, efficient database access and optimised performance." }
  ],
  toolbox: [
    { group: "LANGUAGES", items: ["JAVASCRIPT / TS", "PYTHON", "RUST (BASIC)", "C++ (BASIC)", "SQL"] },
    { group: "AI & LLM", items: ["LANGCHAIN", "LANGGRAPH", "MCP", "QDRANT", "HNSWLIB", "RAG"] },
    { group: "BACKEND", items: ["NODE", "EXPRESS", "FASTIFY", "FASTAPI"] },
    { group: "FRONTEND & MOBILE", items: ["REACT", "REACT NATIVE", "NEXT.JS", "TANSTACK"] },
    { group: "DATA & DEVOPS", items: ["POSTGRES", "MONGODB", "AWS", "DOCKER"] }
  ],

  // Elsewhere. An entry with an empty href is SKIPPED at render time, so a
  // placeholder never ships as a dead link — paste a URL to switch one on.
  social: [
    { label: "GitHub",      href: "https://github.com/ksanjiv05" },
    { label: "App Store",   href: "https://apps.apple.com/us/app/findmyplayer/id6742809294" },
    { label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.aitasker" },
    { label: "LinkedIn",    href: "https://www.linkedin.com/in/sanjiv-kumar-pandit-318b24346" },
    { label: "Instagram",   href: "https://www.instagram.com/ksanjiv0005" },
    { label: "Email",       href: "" }    // TODO  e.g. "mailto:hello@imsanjiv.in"
  ]
};
