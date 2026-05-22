/**
 * Stable identifier for a question.
 *
 * Progress is keyed by this id — NOT by array position — so reordering,
 * inserting, or removing questions in `questions.ts` never corrupts a
 * user's history. The id is a djb2 hash of the topic id + question text.
 */
export function questionId(topicId: string, text: string): string {
  const input = `${topicId}::${text.trim()}`;
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) + hash + input.charCodeAt(i)) | 0;
  }
  return `${topicId}_${(hash >>> 0).toString(36)}`;
}
