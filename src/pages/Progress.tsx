import { useMemo } from "react";
import {
  Box,
  Chip,
  Container,
  Divider,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import HistoryIcon from "@mui/icons-material/History";
import { useLiveQuery } from "dexie-react-hooks";

import { TOPICS } from "../data/questions";
import { questionId } from "../lib/questionId";
import { db, type AttemptRow, type ProgressRow } from "../lib/db";
import { useAuth } from "../context/AuthContext";
import TopBar from "../components/TopBar";
import type { ThemeMode } from "../theme";

type Props = {
  themeMode: ThemeMode;
  onToggleTheme: () => void;
};

/** qid -> { question text, topic name } for every question that exists now. */
function buildQuestionIndex() {
  const map = new Map<string, { text: string; topicName: string }>();
  TOPICS.forEach((t) => {
    t.questions.forEach((q) => {
      map.set(questionId(t.id, q), { text: q, topicName: t.name });
    });
  });
  return map;
}

function fmtDate(ms: number): string {
  return new Date(ms).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function firstLine(text: string): string {
  const line = text.split("\n").map((l) => l.trim()).find((l) => l.length > 0) ?? text;
  return line.length > 70 ? line.slice(0, 70) + "…" : line;
}

export default function Progress({ themeMode, onToggleTheme }: Props) {
  const { user, signOut } = useAuth();

  const qIndex = useMemo(buildQuestionIndex, []);

  const progressRaw = useLiveQuery(() => db.progress.toArray(), []);
  const attemptsRaw = useLiveQuery(
    () => db.attempts.orderBy("at").reverse().limit(30).toArray(),
    []
  );
  const progress: ProgressRow[] = useMemo(() => progressRaw ?? [], [progressRaw]);
  const attempts: AttemptRow[] = useMemo(() => attemptsRaw ?? [], [attemptsRaw]);

  // per-topic roll-up
  const topicStats = useMemo(() => {
    return TOPICS.map((t) => {
      const rows = progress.filter((p) => p.topicId === t.id);
      const solved = rows.filter((r) => r.status === "solved").length;
      const attempted = rows.filter((r) => r.status === "attempted").length;
      const total = t.questions.length;
      const lastActivity = rows.reduce((mx, r) => Math.max(mx, r.updatedAt), 0);
      return {
        id: t.id,
        name: t.name,
        total,
        solved,
        attempted,
        remaining: Math.max(0, total - solved),
        pct: total > 0 ? Math.round((solved / total) * 100) : 0,
        lastActivity,
      };
    });
  }, [progress]);

  const grandSolved = topicStats.reduce((s, t) => s + t.solved, 0);
  const grandTotal = topicStats.reduce((s, t) => s + t.total, 0);
  const grandPct = grandTotal > 0 ? Math.round((grandSolved / grandTotal) * 100) : 0;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <TopBar
        themeMode={themeMode}
        onToggleTheme={onToggleTheme}
        username={user}
        onLogout={signOut}
        hideTopicSelect
      />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={1} sx={{ mb: 4 }}>
          <Typography variant="overline" sx={{ color: "primary.main", fontWeight: 700, letterSpacing: 2 }}>
            YOUR PROGRESS
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
            {grandSolved} / {grandTotal} solved · {grandPct}%
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tracked locally in your browser (IndexedDB). Keyed by question, so it stays correct even when the question list changes.
          </Typography>
          <LinearProgress
            variant="determinate"
            value={grandPct}
            sx={{ height: 10, borderRadius: 5, mt: 1 }}
          />
        </Stack>

        {/* Per-topic breakdown */}
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
          By topic — what's remaining
        </Typography>
        <Stack spacing={1.5} sx={{ mb: 4 }}>
          {topicStats.map((t) => (
            <Paper key={t.id} variant="outlined" sx={{ p: 2.5 }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, flex: 1 }}>
                  {t.name}
                </Typography>
                {t.remaining === 0 && t.total > 0 ? (
                  <Chip size="small" color="success" icon={<CheckCircleIcon />} label="All done" />
                ) : (
                  <Chip
                    size="small"
                    variant="outlined"
                    label={`${t.remaining} remaining`}
                  />
                )}
                <Typography variant="body2" color="text.secondary" sx={{ minWidth: 88, textAlign: "right" }}>
                  {t.solved}/{t.total} · {t.pct}%
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={t.pct}
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  {t.attempted} attempted, not solved
                </Typography>
                <Box sx={{ flex: 1 }} />
                <Typography variant="caption" color="text.secondary">
                  {t.lastActivity > 0 ? `Last activity: ${fmtDate(t.lastActivity)}` : "No activity yet"}
                </Typography>
              </Stack>
            </Paper>
          ))}
        </Stack>

        {/* Recent activity */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
          <HistoryIcon fontSize="small" color="action" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Recent activity
          </Typography>
        </Stack>
        <Paper variant="outlined">
          {attempts.length === 0 ? (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                No attempts yet. Run or solve a question and it'll show up here with a timestamp.
              </Typography>
            </Box>
          ) : (
            attempts.map((a, i) => {
              const meta = qIndex.get(a.qid);
              return (
                <Box key={a.id ?? i}>
                  {i > 0 && <Divider />}
                  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ px: 2, py: 1.25 }}>
                    {a.kind === "solved" ? (
                      <CheckCircleIcon fontSize="small" sx={{ color: "success.main" }} />
                    ) : (
                      <PlayArrowIcon fontSize="small" color="action" />
                    )}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                        {meta ? firstLine(meta.text) : "(question no longer in the list)"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {meta?.topicName ?? a.topicId} · {a.kind === "solved" ? "Marked solved" : "Ran code"}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
                      {fmtDate(a.at)}
                    </Typography>
                  </Stack>
                </Box>
              );
            })
          )}
        </Paper>
      </Container>
    </Box>
  );
}
