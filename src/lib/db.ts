import Dexie, { type Table } from "dexie";

/**
 * IndexedDB-backed progress tracking (via Dexie).
 *
 * Two stores:
 *  - progress: one row per question the user has touched (status + dates)
 *  - attempts: an append-only log — every run / solve, with a timestamp
 *
 * Everything is keyed by the stable `qid` from questionId.ts.
 */

export type QStatus = "attempted" | "solved";
export type AttemptKind = "run" | "solved";

export interface ProgressRow {
  qid: string;          // primary key — stable question id
  topicId: string;
  status: QStatus;
  solvedAt: number | null;
  firstSeenAt: number;
  updatedAt: number;
}

export interface AttemptRow {
  id?: number;          // auto-increment primary key
  qid: string;
  topicId: string;
  at: number;           // epoch ms
  kind: AttemptKind;
}

class PracticeDB extends Dexie {
  progress!: Table<ProgressRow, string>;
  attempts!: Table<AttemptRow, number>;

  constructor() {
    super("JavaPracticeDB");
    this.version(1).stores({
      progress: "qid, topicId, status, solvedAt, updatedAt",
      attempts: "++id, qid, topicId, at, kind",
    });
  }
}

export const db = new PracticeDB();

/** Log an attempt and upsert the question's progress row. */
export async function recordAttempt(
  qid: string,
  topicId: string,
  kind: AttemptKind
): Promise<void> {
  const now = Date.now();
  await db.attempts.add({ qid, topicId, at: now, kind });

  const existing = await db.progress.get(qid);
  if (!existing) {
    await db.progress.put({
      qid,
      topicId,
      status: kind === "solved" ? "solved" : "attempted",
      solvedAt: kind === "solved" ? now : null,
      firstSeenAt: now,
      updatedAt: now,
    });
    return;
  }

  await db.progress.put({
    ...existing,
    status: kind === "solved" ? "solved" : existing.status,
    solvedAt:
      kind === "solved" ? existing.solvedAt ?? now : existing.solvedAt,
    updatedAt: now,
  });
}

/** Mark a question solved (also logged as an attempt). */
export async function recordSolved(qid: string, topicId: string): Promise<void> {
  await recordAttempt(qid, topicId, "solved");
}

/** Wipe all progress + attempts for one topic. */
export async function resetTopic(topicId: string): Promise<void> {
  await db.transaction("rw", db.progress, db.attempts, async () => {
    await db.progress.where("topicId").equals(topicId).delete();
    await db.attempts.where("topicId").equals(topicId).delete();
  });
}
