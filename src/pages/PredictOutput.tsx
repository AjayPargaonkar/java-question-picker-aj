import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import CodeMirror from "@uiw/react-codemirror";
import { java } from "@codemirror/lang-java";
import { oneDark } from "@codemirror/theme-one-dark";

import TopBar from "../components/TopBar";
import { useAuth } from "../context/AuthContext";
import { PREDICT_OUTPUT_PUZZLES, PredictPuzzle, Difficulty } from "../data/games";
import { runJava } from "../lib/piston";
import type { ThemeMode } from "../theme";

type Props = {
  themeMode: ThemeMode;
  onToggleTheme: () => void;
};

type Verdict = "idle" | "running" | "correct" | "wrong" | "error";

type Stats = {
  attempted: number;
  correct: number;
  completed: string[]; // puzzle ids that were attempted (correct OR revealed)
};

const STATS_KEY = "predict_output_stats";
const CURRENT_KEY = "predict_output_current";

const difficultyColor: Record<Difficulty, "success" | "info" | "warning" | "error"> = {
  easy:   "success",
  medium: "info",
  hard:   "warning",
  tricky: "error",
};

function loadStats(): Stats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) return JSON.parse(raw) as Stats;
  } catch {}
  return { attempted: 0, correct: 0, completed: [] };
}
function saveStats(s: Stats) {
  localStorage.setItem(STATS_KEY, JSON.stringify(s));
}

function normalize(s: string): string {
  // Tolerant: trim trailing whitespace, normalize line endings, collapse trailing newlines.
  return s.replace(/\r\n/g, "\n").replace(/[ \t]+$/gm, "").replace(/\n+$/g, "");
}

export default function PredictOutput({ themeMode, onToggleTheme }: Props) {
  const { user, signOut } = useAuth();
  const [idx, setIdx] = useState<number>(() => {
    const raw = localStorage.getItem(CURRENT_KEY);
    const n = raw !== null ? Number(raw) : 0;
    return Number.isFinite(n) && n >= 0 && n < PREDICT_OUTPUT_PUZZLES.length ? n : 0;
  });
  const [stats, setStats] = useState<Stats>(loadStats);
  const [prediction, setPrediction] = useState("");
  const [verdict, setVerdict] = useState<Verdict>("idle");
  const [actualOutput, setActualOutput] = useState<string>("");
  const [revealed, setRevealed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [error, setError] = useState<string>("");

  const puzzle: PredictPuzzle = PREDICT_OUTPUT_PUZZLES[idx];

  useEffect(() => { localStorage.setItem(CURRENT_KEY, String(idx)); }, [idx]);
  useEffect(() => { saveStats(stats); }, [stats]);

  const resetCardState = useCallback(() => {
    setPrediction("");
    setVerdict("idle");
    setActualOutput("");
    setRevealed(false);
    setShowHint(false);
    setError("");
  }, []);

  const goNext = useCallback(() => {
    setIdx((i) => (i + 1) % PREDICT_OUTPUT_PUZZLES.length);
    resetCardState();
  }, [resetCardState]);

  const goPrev = useCallback(() => {
    setIdx((i) => (i - 1 + PREDICT_OUTPUT_PUZZLES.length) % PREDICT_OUTPUT_PUZZLES.length);
    resetCardState();
  }, [resetCardState]);

  const submit = useCallback(async () => {
    if (verdict === "running") return;
    setVerdict("running");
    setError("");
    try {
      const result = await runJava(puzzle.code);
      const got = result.output;
      setActualOutput(got);
      const ok = normalize(prediction) === normalize(got);
      const isFirstAttempt = !stats.completed.includes(puzzle.id);
      setStats((prev) => ({
        attempted: prev.attempted + (isFirstAttempt ? 1 : 0),
        correct: prev.correct + (ok && isFirstAttempt ? 1 : 0),
        completed: isFirstAttempt ? [...prev.completed, puzzle.id] : prev.completed,
      }));
      setVerdict(ok ? "correct" : "wrong");
    } catch (e: any) {
      setVerdict("error");
      setError(e?.message || "Failed to run the puzzle. Is Piston up?");
    }
  }, [puzzle, prediction, verdict, stats.completed]);

  const reveal = useCallback(() => {
    setRevealed(true);
    setActualOutput(puzzle.expected);
    if (!stats.completed.includes(puzzle.id)) {
      setStats((prev) => ({
        attempted: prev.attempted + 1,
        correct: prev.correct,
        completed: [...prev.completed, puzzle.id],
      }));
    }
  }, [puzzle, stats.completed]);

  const resetProgress = useCallback(() => {
    if (!window.confirm("Reset Predict-the-Output progress?")) return;
    setStats({ attempted: 0, correct: 0, completed: [] });
    setIdx(0);
    resetCardState();
  }, [resetCardState]);

  // keyboard: Ctrl+Enter submits, → next, ← prev
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const tag = target.tagName;
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        submit();
        return;
      }
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.code === "ArrowRight") goNext();
      if (e.code === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [submit, goNext, goPrev]);

  const accuracy = useMemo(() => {
    if (stats.attempted === 0) return 0;
    return Math.round((stats.correct / stats.attempted) * 100);
  }, [stats]);

  const total = PREDICT_OUTPUT_PUZZLES.length;
  const progressPct = total === 0 ? 0 : Math.round((stats.completed.length / total) * 100);

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
        <Box sx={{ maxWidth: 920, mx: "auto", px: { xs: 2, md: 4 }, py: { xs: 3, md: 4 } }}>
          {/* Header */}
          <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ sm: "flex-end" }} spacing={2} sx={{ mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 2 }}>
                GAMES · PREDICT THE OUTPUT
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
                What does this print?
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                Read the code. Type your guess. Run it. No half-credit.
              </Typography>
            </Box>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ pb: 0.5 }}>
              <Stat label="Score" value={`${stats.correct}/${stats.attempted}`} />
              <Stat label="Accuracy" value={`${accuracy}%`} />
              <Stat label="Done" value={`${stats.completed.length}/${total}`} />
            </Stack>
          </Stack>

          <LinearProgress variant="determinate" value={progressPct} sx={{ height: 6, borderRadius: 999, mb: 3 }} />

          {/* Puzzle card */}
          <Paper sx={{ p: { xs: 2, md: 3 } }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5, flexWrap: "wrap" }}>
              <Chip
                size="small"
                color={difficultyColor[puzzle.difficulty]}
                label={puzzle.difficulty.toUpperCase()}
                sx={{ fontWeight: 700, letterSpacing: 0.5 }}
              />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {idx + 1}. {puzzle.title}
              </Typography>
              <Box sx={{ flex: 1 }} />
              <Typography variant="caption" color="text.secondary">
                Puzzle {idx + 1} of {total}
              </Typography>
              {puzzle.hint && (
                <Tooltip title={showHint ? "Hide hint" : "Show hint"}>
                  <IconButton size="small" onClick={() => setShowHint((v) => !v)} color={showHint ? "warning" : "default"}>
                    <LightbulbIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>

            {showHint && puzzle.hint && (
              <Alert severity="warning" icon={<LightbulbIcon />} sx={{ mb: 2 }}>
                {puzzle.hint}
              </Alert>
            )}

            {/* Read-only code */}
            <Box sx={{ borderRadius: 1, overflow: "hidden", border: 1, borderColor: "divider", mb: 2 }}>
              <CodeMirror
                value={puzzle.code}
                editable={false}
                readOnly
                theme={themeMode === "dark" ? oneDark : "light"}
                extensions={[java()]}
                basicSetup={{
                  lineNumbers: true,
                  highlightActiveLine: false,
                  foldGutter: false,
                  indentOnInput: false,
                }}
              />
            </Box>

            {/* User prediction */}
            <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1.5 }}>
              Your prediction
            </Typography>
            <TextField
              multiline
              fullWidth
              minRows={3}
              maxRows={10}
              placeholder="Type exactly what stdout will be."
              value={prediction}
              onChange={(e) => setPrediction(e.target.value)}
              disabled={verdict === "running" || revealed}
              InputProps={{
                sx: {
                  fontFamily: '"Fira Code", Consolas, monospace',
                  fontSize: "0.92rem",
                },
              }}
              sx={{ mt: 1, mb: 2 }}
            />

            {/* Actions */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<PlayArrowIcon />}
                onClick={submit}
                disabled={!prediction.trim() || verdict === "running" || revealed}
              >
                {verdict === "running" ? "Running…" : "Run & Compare"}
              </Button>
              <Button
                variant="outlined"
                startIcon={<VisibilityIcon />}
                onClick={reveal}
                disabled={revealed || verdict === "correct"}
              >
                Reveal
              </Button>
              <Box sx={{ flex: 1 }} />
              <Button startIcon={<SkipNextIcon />} onClick={goNext}>
                Skip
              </Button>
            </Stack>

            {/* Verdict & comparison */}
            {(verdict === "correct" || verdict === "wrong" || revealed || verdict === "error") && (
              <>
                <Divider sx={{ my: 3 }} />
                {verdict === "correct" && (
                  <Alert severity="success" icon={<CheckCircleOutlineIcon />} sx={{ mb: 2 }}>
                    Nailed it. Output matched exactly.
                  </Alert>
                )}
                {verdict === "wrong" && !revealed && (
                  <Alert severity="error" icon={<HighlightOffIcon />} sx={{ mb: 2 }}>
                    Not quite. Compare your guess with what it actually printed.
                  </Alert>
                )}
                {verdict === "error" && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    Couldn't run the puzzle: {error}
                  </Alert>
                )}

                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <DiffPane label="Your prediction" text={prediction} />
                  <DiffPane label="Actual output" text={actualOutput} highlight />
                </Stack>

                {puzzle.explanation && (revealed || verdict === "correct" || verdict === "wrong") && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="overline" color="secondary.main" sx={{ letterSpacing: 1.5, fontWeight: 700 }}>
                      Why
                    </Typography>
                    <Typography sx={{ mt: 0.5, lineHeight: 1.7 }}>{puzzle.explanation}</Typography>
                  </Box>
                )}
              </>
            )}
          </Paper>

          {/* Footer nav */}
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Button onClick={goPrev}>← Previous</Button>
            <Box sx={{ flex: 1 }} />
            <Button size="small" startIcon={<RestartAltIcon />} color="error" onClick={resetProgress}>
              Reset progress
            </Button>
            <Box sx={{ flex: 1 }} />
            <Button onClick={goNext}>Next →</Button>
          </Stack>

          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 3, textAlign: "center", opacity: 0.7 }}>
            Tip: <kbd style={kbdStyle}>Ctrl</kbd>+<kbd style={kbdStyle}>Enter</kbd> to submit · <kbd style={kbdStyle}>←</kbd>/<kbd style={kbdStyle}>→</kbd> to navigate
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ textAlign: "center", minWidth: 70 }}>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block", textTransform: "uppercase", letterSpacing: 1 }}>
        {label}
      </Typography>
      <Typography sx={{ fontWeight: 700, fontFamily: "monospace" }}>{value}</Typography>
    </Box>
  );
}

function DiffPane({ label, text, highlight }: { label: string; text: string; highlight?: boolean }) {
  return (
    <Box sx={{ flex: 1 }}>
      <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1.5 }}>
        {label}
      </Typography>
      <Box
        component="pre"
        sx={{
          m: 0,
          mt: 0.5,
          p: 1.5,
          minHeight: 80,
          borderRadius: 1,
          border: 1,
          borderColor: highlight ? "secondary.main" : "divider",
          bgcolor: highlight ? "rgba(16,185,129,0.08)" : "rgba(127,127,127,0.06)",
          fontFamily: '"Fira Code", Consolas, monospace',
          fontSize: "0.9rem",
          lineHeight: 1.55,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {text || "(empty)"}
      </Box>
    </Box>
  );
}

const kbdStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "1px 6px",
  border: "1px solid currentColor",
  borderRadius: 4,
  fontFamily: "monospace",
  fontSize: "0.72rem",
  opacity: 0.8,
};
