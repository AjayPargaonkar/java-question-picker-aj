# Architecture

## Overview
A React + TypeScript single-page app that lets the user pick Java practice questions by topic. Questions are static data bundled with the app. The app runs entirely in the browser — no backend.

## Tech stack
| Layer | Choice | Reason |
|---|---|---|
| UI | React + TypeScript (CRA) | Already in place |
| Styling | CSS / theme module | Already in place |
| Question data | Static TS file (`src/data/questions.ts`) | No backend needed; trivial to edit |
| User data (answers, notes, progress) | IndexedDB via Dexie | Local, free, offline, GB-scale storage |
| Hosting | Static host (Vercel / Netlify / GitHub Pages) | Zero cost |

## Why no backend
- Questions are static — they ship with the build.
- Answers/notes are personal — single-user, single-device usage today.
- Avoids server cost, auth complexity, and deployment overhead.

## When to add a backend
Add one only if a real need appears:

| Need | Trigger to add backend |
|---|---|
| Cross-device sync (laptop ↔ phone) | Add Firebase or Supabase |
| Sharing answers with others | Add cloud DB + auth |
| Admin editing of questions at runtime | Add cloud DB |
| Backups beyond browser export/import | Add cloud DB |

Recommended path when needed: **Firebase Firestore** (fastest) or **Supabase** (if relational SQL is preferred).

## Deployment
- Build: `npm run build`
- Output: `build/` static assets
- Deploy: any static host

## Related docs
- [data-model.md](./data-model.md) — schemas for IndexedDB, Firestore, and relational
- [storage.md](./storage.md) — IndexedDB limits, persistence, mobile notes
