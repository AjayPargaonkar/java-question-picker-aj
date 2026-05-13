# Data Model

Three views of the same data: **IndexedDB (what we use)**, plus **Firestore** and **Relational** sketches kept for reference if/when a backend is added.

---

## 1. IndexedDB (current plan, via Dexie)

Non-relational, key-value-with-indexes. Lives in the browser per origin.

### Stores

```
db: JavaQuestionPicker (version 1)

answers
  ++id            auto-increment primary key
  questionId      indexed
  language        "java" | "pseudocode" | ...
  code            string
  notes           string
  updatedAt       number (epoch ms), indexed

progress
  questionId      primary key
  status          "attempted" | "solved"
  solvedAt        number | null

bookmarks
  questionId      primary key
  createdAt       number

attachments       (optional, if storing files/images)
  ++id
  questionId      indexed
  filename
  blob            Blob
  createdAt
```

### Notes
- Questions themselves are **not** stored here — they come from `src/data/questions.ts`.
- IndexedDB has no joins; correlate by `questionId` in JS.
- Storage budget: GBs on desktop, ~1 GB on iOS. See [storage.md](./storage.md).

---

## 2. Firestore (if cloud sync added later)

Document store; denormalize for read performance.

```
topics/{topicId}
  name, order, questionCount

questions/{questionId}
  topicId, title, body, difficulty, tags[],
  approaches[ { name, time, space } ],
  createdAt, updatedAt

answers/{answerId}
  questionId, userId, language, code, explanation,
  isOfficial, upvotes, createdAt

users/{uid}
  displayName, email, solvedCount
  └─ progress/{questionId}
       status, solvedAt, notes
```

### Notes
- `questions` collection is flat (not nested under topics) so cross-topic queries work.
- `approaches` is embedded — no join needed.
- Security rules required before going public.

---

## 3. Relational (if Spring Boot / Supabase added later)

Normalized SQL schema.

```
topics(id PK, slug UNIQUE, name, order_no, created_at)

questions(id PK, topic_id FK→topics, title, body,
          difficulty ENUM, created_at, updated_at)

approaches(id PK, question_id FK→questions, name,
           time_cx, space_cx)

tags(id PK, name UNIQUE)
question_tags(question_id FK, tag_id FK, PK(question_id,tag_id))

users(id PK, email UNIQUE, display_name, created_at)

answers(id PK, question_id FK→questions, user_id FK→users NULL,
        language, code, explanation, is_official BOOL,
        upvotes INT, created_at)

user_progress(user_id FK, question_id FK, status ENUM,
              solved_at, notes,
              PK(user_id, question_id))
```

### Notes
- Use junction table for many-to-many tags.
- `answers.user_id` nullable to allow "official" answers without an owner.

---

## Comparison

| Concern | IndexedDB | Firestore | Relational |
|---|---|---|---|
| Where it runs | Browser | Cloud (Google) | Server (Postgres/MySQL) |
| Joins | No — stitch in JS | No — denormalize | Yes |
| Schema enforced | No | No | Yes |
| Cross-device | No | Yes | Yes |
| Free tier | Unlimited (local) | Generous | Depends on host |
| Best fit today | ✅ | Later, for sync | Later, for backend practice |
