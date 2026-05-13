# Storage Notes (IndexedDB)

Browser-only, non-relational, accessed directly from the React app.

## Capacity

| Browser | Per-origin limit |
|---|---|
| Chrome / Edge (desktop & Android) | up to ~60% of free disk (multi-GB) |
| Firefox | up to ~50% of free disk, capped ~10 GB per group |
| Safari (macOS / iOS) | ~1 GB by default, more on user prompt |
| iOS (any browser) | All browsers use WebKit → Safari limits apply |

Check at runtime:
```js
const { quota, usage } = await navigator.storage.estimate();
```

## Persistence — important

By default, storage is **best-effort** and can be evicted:
- Safari evicts after 7 days of inactivity
- Any browser may evict under disk pressure

Request persistent storage on first load:
```js
await navigator.storage.persist();
```
- Chrome/Edge: granted silently for installed/frequently-used sites
- Firefox: prompts the user
- Safari: largely ignores, but installing as a PWA helps

## What erases IndexedDB
- User clears browser data
- Incognito tab close
- Switching browsers (Chrome data ≠ Firefox data)
- iOS 7-day inactivity eviction
- Disk-pressure eviction (non-persistent only)

## Mitigations
1. Call `navigator.storage.persist()` early.
2. Provide **Export to JSON** + **Import from JSON** buttons so users can back up.
3. Consider adding cloud sync (Firebase) later if data loss becomes a real risk.
4. Ship as a PWA for better persistence on mobile.

## Sizing for this app
- One answer (code + notes): ~2–5 KB
- 500 answers: ~2 MB
- 500 answers + one screenshot each (~50 KB): ~25 MB

Conclusion: storage will not be the bottleneck.

## What IndexedDB is NOT
- Not a server you can connect to from outside the browser.
- Not accessible from a backend, DB client, or another origin.
- Not shared across devices or browsers.

If any of those matter → use Firestore or Supabase instead.
