import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CasinoIcon from "@mui/icons-material/Casino";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import TopBar from "../components/TopBar";
import { THEORY_TOPICS } from "../data/theory";
import { useAuth } from "../context/AuthContext";
import type { ThemeMode } from "../theme";

const TOPIC_KEY      = "theory_current_topic";
const reviewedKey    = (id: string) => `theory_reviewed_${id}`;
const currentCardKey = (id: string) => `theory_current_${id}`;

function readSet(key: string): Set<string> {
  try {
    const raw = localStorage.getItem(key);
    return raw ? new Set<string>(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}
function writeSet(key: string, set: Set<string>) {
  localStorage.setItem(key, JSON.stringify(Array.from(set)));
}

type Props = {
  themeMode: ThemeMode;
  onToggleTheme: () => void;
};

export default function Theory({ themeMode, onToggleTheme }: Props) {
  const { user, signOut } = useAuth();

  const [currentTopicId, setCurrentTopicId] = useState<string>(
    () => localStorage.getItem(TOPIC_KEY) || THEORY_TOPICS[0].id
  );
  const currentTopic = THEORY_TOPICS.find((t) => t.id === currentTopicId) ?? THEORY_TOPICS[0];

  const [reviewed, setReviewed] = useState<Set<string>>(() => readSet(reviewedKey(currentTopicId)));
  const [cardIdx, setCardIdx] = useState<number>(() => {
    const raw = localStorage.getItem(currentCardKey(currentTopicId));
    return raw !== null ? Math.max(0, Math.min(currentTopic.cards.length - 1, Number(raw))) : 0;
  });
  const [revealed, setRevealed] = useState(false);

  useEffect(() => { localStorage.setItem(TOPIC_KEY, currentTopicId); }, [currentTopicId]);
  useEffect(() => { writeSet(reviewedKey(currentTopicId), reviewed); }, [reviewed, currentTopicId]);
  useEffect(() => { localStorage.setItem(currentCardKey(currentTopicId), String(cardIdx)); }, [cardIdx, currentTopicId]);

  const card = currentTopic.cards[cardIdx];
  const total = currentTopic.cards.length;
  const reviewedCount = reviewed.size;
  const pct = total === 0 ? 0 : Math.round((reviewedCount / total) * 100);
  const alreadyReviewed = card ? reviewed.has(card.id) : false;

  const next = useCallback(() => {
    if (total === 0) return;
    setCardIdx((i) => (i + 1) % total);
    setRevealed(false);
  }, [total]);

  const prev = useCallback(() => {
    if (total === 0) return;
    setCardIdx((i) => (i - 1 + total) % total);
    setRevealed(false);
  }, [total]);

  const random = useCallback(() => {
    if (total <= 1) return;
    let pick = cardIdx;
    while (pick === cardIdx) pick = Math.floor(Math.random() * total);
    setCardIdx(pick);
    setRevealed(false);
  }, [cardIdx, total]);

  const markReviewed = useCallback(() => {
    if (!card) return;
    setReviewed((prev) => {
      const n = new Set(prev);
      n.add(card.id);
      return n;
    });
    setTimeout(next, 0);
  }, [card, next]);

  const resetReviewed = useCallback(() => {
    if (!window.confirm(`Reset reviewed cards for "${currentTopic.name}"?`)) return;
    setReviewed(new Set());
  }, [currentTopic.name]);

  const switchTopic = useCallback((id: string) => {
    const t = THEORY_TOPICS.find((t) => t.id === id);
    if (!t) return;
    setCurrentTopicId(id);
    setReviewed(readSet(reviewedKey(id)));
    const raw = localStorage.getItem(currentCardKey(id));
    setCardIdx(raw !== null ? Math.max(0, Math.min(t.cards.length - 1, Number(raw))) : 0);
    setRevealed(false);
  }, []);

  const copyAll = useCallback(async () => {
    if (!card) return;
    try {
      await navigator.clipboard.writeText(`Q: ${card.question}\n\nA: ${card.answer}`);
    } catch {}
  }, [card]);

  // Keyboard: Space reveals/next, R = random, Enter = mark reviewed
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const tag = target.tagName;
      if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;
      if (e.code === "Space") {
        e.preventDefault();
        if (!revealed) setRevealed(true);
        else next();
      } else if (e.key.toLowerCase() === "r") {
        random();
      } else if (e.code === "ArrowRight") {
        next();
      } else if (e.code === "ArrowLeft") {
        prev();
      } else if (e.code === "Enter") {
        if (revealed && !alreadyReviewed) markReviewed();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [revealed, next, prev, random, alreadyReviewed, markReviewed]);

  const readingFontStack = useMemo(
    () =>
      themeMode === "sepia"
        ? '"Lora", "Iowan Old Style", Georgia, serif'
        : '"Inter", "Segoe UI", system-ui, -apple-system, sans-serif',
    [themeMode]
  );

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <TopBar
        themeMode={themeMode}
        onToggleTheme={onToggleTheme}
        username={user}
        onLogout={signOut}
        hideTopicSelect
      />

      <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
        <Box sx={{ maxWidth: 820, mx: "auto", px: { xs: 2, md: 4 }, py: { xs: 3, md: 5 } }}>
          {/* Topic + progress header */}
          <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ sm: "center" }} spacing={2} sx={{ mb: 3 }}>
            <Box>
              <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 2 }}>
                THEORY · FLASH CARDS
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
                {currentTopic.name}
              </Typography>
              {currentTopic.description && (
                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                  {currentTopic.description}
                </Typography>
              )}
            </Box>
            <Box sx={{ flex: 1 }} />
            <Select
              size="small"
              value={currentTopicId}
              onChange={(e) => switchTopic(e.target.value)}
              sx={{ minWidth: 220 }}
            >
              {THEORY_TOPICS.map((t) => (
                <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
              ))}
            </Select>
          </Stack>

          {/* Progress */}
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
            <Box sx={{ flex: 1 }}>
              <LinearProgress variant="determinate" value={pct} sx={{ height: 6, borderRadius: 999 }} />
            </Box>
            <Typography variant="body2" color="text.secondary">
              {reviewedCount}/{total} reviewed · {pct}%
            </Typography>
          </Stack>

          {/* Card */}
          {!card ? (
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <Typography color="text.secondary">No cards yet for this topic.</Typography>
            </Paper>
          ) : (
            <Paper
              sx={{
                p: { xs: 3, md: 5 },
                position: "relative",
                bgcolor: "background.paper",
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2.5 }}>
                <Chip
                  size="small"
                  label={`Card ${cardIdx + 1} of ${total}`}
                  variant="outlined"
                />
                {alreadyReviewed && (
                  <Chip size="small" color="secondary" label="Reviewed" />
                )}
                {card.tags?.map((t) => (
                  <Chip key={t} size="small" label={t} sx={{ bgcolor: "transparent", border: 1, borderColor: "divider" }} />
                ))}
                <Box sx={{ flex: 1 }} />
                <Tooltip title="Copy Q&A">
                  <IconButton size="small" onClick={copyAll}><ContentCopyIcon fontSize="small" /></IconButton>
                </Tooltip>
              </Stack>

              <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1.5 }}>
                Question
              </Typography>
              <Typography
                component="pre"
                sx={{
                  fontFamily: readingFontStack,
                  fontSize: { xs: "1.1rem", md: "1.35rem" },
                  lineHeight: 1.6,
                  fontWeight: 500,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  m: 0,
                  mt: 0.5,
                  mb: 3,
                  letterSpacing: themeMode === "sepia" ? 0.1 : 0,
                }}
              >
                {card.question}
              </Typography>

              <Divider sx={{ my: 3 }} />

              {!revealed ? (
                <Box sx={{ textAlign: "center", py: 3 }}>
                  <Typography color="text.secondary" sx={{ mb: 2 }}>
                    Take a moment to think before revealing.
                  </Typography>
                  <Button
                    size="large"
                    variant="contained"
                    onClick={() => setRevealed(true)}
                    startIcon={<VisibilityIcon />}
                    sx={{ minWidth: 200 }}
                  >
                    Reveal Answer
                  </Button>
                  <Typography variant="caption" display="block" sx={{ mt: 2, opacity: 0.6 }}>
                    Press <kbd style={kbdStyle}>Space</kbd> to reveal · <kbd style={kbdStyle}>R</kbd> for random
                  </Typography>
                </Box>
              ) : (
                <>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <Typography variant="overline" color="secondary.main" sx={{ letterSpacing: 1.5, fontWeight: 700 }}>
                      Answer
                    </Typography>
                    <Box sx={{ flex: 1 }} />
                    <Tooltip title="Hide answer">
                      <IconButton size="small" onClick={() => setRevealed(false)}>
                        <VisibilityOffIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                  <Typography
                    component="pre"
                    sx={{
                      fontFamily: readingFontStack,
                      fontSize: { xs: "1rem", md: "1.1rem" },
                      lineHeight: 1.85,
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      m: 0,
                      letterSpacing: themeMode === "sepia" ? 0.1 : 0,
                      color: "text.primary",
                    }}
                  >
                    {card.answer}
                  </Typography>
                </>
              )}
            </Paper>
          )}

          {/* Actions */}
          <Stack direction="row" spacing={1} sx={{ mt: 3, flexWrap: "wrap" }}>
            <Button startIcon={<NavigateBeforeIcon />} onClick={prev} disabled={total <= 1}>
              Previous
            </Button>
            <Button startIcon={<CasinoIcon />} variant="outlined" onClick={random} disabled={total <= 1}>
              Random
            </Button>
            <Box sx={{ flex: 1 }} />
            <Button
              variant="contained"
              color="secondary"
              startIcon={<CheckCircleIcon />}
              onClick={markReviewed}
              disabled={!card || alreadyReviewed}
            >
              Mark Reviewed
            </Button>
            <Button endIcon={<NavigateNextIcon />} onClick={next} disabled={total <= 1}>
              Next
            </Button>
          </Stack>

          <Stack direction="row" sx={{ mt: 2 }}>
            <Button size="small" startIcon={<RestartAltIcon />} color="error" onClick={resetReviewed}>
              Reset progress
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

const kbdStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "2px 6px",
  border: "1px solid currentColor",
  borderRadius: 4,
  fontFamily: "monospace",
  fontSize: "0.75rem",
  opacity: 0.8,
};
