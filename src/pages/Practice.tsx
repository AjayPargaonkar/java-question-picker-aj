import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { useLiveQuery } from "dexie-react-hooks";
import { Allotment } from "allotment";
import "allotment/dist/style.css";

import { TOPICS } from "../data/questions";
import { boilerplate, getJavaVersion, runJava } from "../lib/piston";
import { questionId } from "../lib/questionId";
import { inferDifficulty, DIFFICULTIES, type Difficulty } from "../lib/difficulty";
import { db, recordAttempt, recordSolved, resetTopic } from "../lib/db";
import { useAuth } from "../context/AuthContext";
import type { ThemeMode } from "../theme";

import TopBar from "../components/TopBar";
import StatsRow from "../components/StatsRow";
import QuestionCard from "../components/QuestionCard";
import OutputPanel, { OutputState } from "../components/OutputPanel";
import ActionButtons from "../components/ActionButtons";
import CodeEditor from "../components/CodeEditor";
import ShortcutsDialog from "../components/ShortcutsDialog";

const TOPIC_KEY  = "java_practice_current_topic";
const DIFF_KEY   = "java_practice_difficulty_filter";
const currentKey = (id: string) => `java_practice_current_${id}`;
const codeKey    = (topicId: string, qid: number) => `java_practice_code_${topicId}_${qid}`;

/** Synthetic topic id for "practice across every topic at once". */
export const ALL_TOPIC_ID = "all";

type Props = {
  themeMode: ThemeMode;
  onToggleTheme: () => void;
};

export default function Practice({ themeMode, onToggleTheme }: Props) {
  const { user, signOut } = useAuth();
  const isNarrow = useMediaQuery("(max-width: 700px)");

  const [currentTopicId, setCurrentTopicId] = useState<string>(
    () => localStorage.getItem(TOPIC_KEY) || TOPICS[0].id
  );
  const isAll = currentTopicId === ALL_TOPIC_ID;
  const realTopic = TOPICS.find((t) => t.id === currentTopicId);

  // flat list of every question across all topics — used in mixed mode
  const flatAll = useMemo(() => {
    const out: { text: string; topicId: string }[] = [];
    TOPICS.forEach((t) => t.questions.forEach((q) => out.push({ text: q, topicId: t.id })));
    return out;
  }, []);

  // active question list + a parallel array of each question's REAL topic id
  const questions = useMemo<string[]>(
    () => (isAll ? flatAll.map((q) => q.text) : realTopic?.questions ?? TOPICS[0].questions),
    [isAll, flatAll, realTopic]
  );
  const questionTopicIds = useMemo<string[]>(() => {
    if (isAll) return flatAll.map((q) => q.topicId);
    const t = realTopic ?? TOPICS[0];
    return t.questions.map(() => t.id);
  }, [isAll, flatAll, realTopic]);

  // stable id per question — survives reordering; recorded under the real topic
  const qids = useMemo(
    () => questions.map((text, i) => questionId(questionTopicIds[i], text)),
    [questions, questionTopicIds]
  );

  // inferred difficulty per question (parallel to `questions`)
  const difficulties = useMemo<Difficulty[]>(
    () => questions.map((text, i) => inferDifficulty(questionTopicIds[i], text)),
    [questions, questionTopicIds]
  );

  const topicName = isAll ? "All Topics" : realTopic?.name ?? TOPICS[0].name;
  const total = questions.length;

  // ---- progress (IndexedDB via Dexie) -------------------------------------
  const progressRows = useLiveQuery(
    () =>
      isAll
        ? db.progress.toArray()
        : db.progress.where("topicId").equals(currentTopicId).toArray(),
    [isAll, currentTopicId]
  );
  const solvedIds = useMemo(() => {
    const solvedQids = new Set(
      (progressRows ?? []).filter((r) => r.status === "solved").map((r) => r.qid)
    );
    const set = new Set<number>();
    qids.forEach((qid, i) => {
      if (solvedQids.has(qid)) set.add(i);
    });
    return set;
  }, [progressRows, qids]);

  const allSolved = useLiveQuery(
    () => db.progress.where("status").equals("solved").toArray(),
    []
  );
  const solvedCounts = useMemo(() => {
    const out: Record<string, number> = {};
    TOPICS.forEach((t) => { out[t.id] = 0; });
    (allSolved ?? []).forEach((r) => {
      if (out[r.topicId] !== undefined) out[r.topicId] += 1;
    });
    if (!isAll) out[currentTopicId] = solvedIds.size;
    out[ALL_TOPIC_ID] = isAll ? solvedIds.size : (allSolved ?? []).length;
    return out;
  }, [allSolved, currentTopicId, isAll, solvedIds]);

  // ---- session state ------------------------------------------------------
  const [currentId, setCurrentId] = useState<number | null>(() => {
    const raw = localStorage.getItem(currentKey(currentTopicId));
    return raw !== null ? Number(raw) : null;
  });

  const [code, setCode] = useState<string>(() => {
    if (currentId === null) return boilerplate("Pick a question to get started");
    const saved = localStorage.getItem(codeKey(currentTopicId, currentId));
    return saved ?? boilerplate(questions[currentId] ?? "");
  });

  const [output, setOutput] = useState<OutputState>({ text: "// Output will appear here after you Run.", kind: "idle" });
  const [isRunning, setIsRunning] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [javaVersion, setJavaVersion] = useState<string>("");

  // which difficulties the picker draws from (defaults to all three)
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty[]>(() => {
    try {
      const raw = localStorage.getItem(DIFF_KEY);
      if (raw) {
        const parsed = (JSON.parse(raw) as Difficulty[]).filter((d) =>
          DIFFICULTIES.includes(d)
        );
        if (parsed.length) return parsed;
      }
    } catch {}
    return [...DIFFICULTIES];
  });
  useEffect(() => {
    localStorage.setItem(DIFF_KEY, JSON.stringify(difficultyFilter));
  }, [difficultyFilter]);

  const toggleDifficulty = useCallback((d: Difficulty) => {
    setDifficultyFilter((prev) => {
      if (prev.includes(d)) {
        if (prev.length === 1) return prev; // keep at least one selected
        return prev.filter((x) => x !== d);
      }
      // keep canonical easy → medium → hard order
      return DIFFICULTIES.filter((x) => prev.includes(x) || x === d);
    });
  }, []);

  // self-heal: drop a stored question index that no longer exists
  useEffect(() => {
    if (currentId !== null && currentId >= total) {
      setCurrentId(null);
      setCode(boilerplate("Pick a question to get started"));
    }
  }, [currentId, total]);

  const saveTimer = useRef<number | null>(null);
  useEffect(() => {
    if (currentId === null) return;
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      localStorage.setItem(codeKey(currentTopicId, currentId), code);
    }, 400);
  }, [code, currentTopicId, currentId]);

  useEffect(() => {
    getJavaVersion().then(setJavaVersion).catch(() => {});
  }, []);

  useEffect(() => { localStorage.setItem(TOPIC_KEY, currentTopicId); }, [currentTopicId]);
  useEffect(() => {
    const k = currentKey(currentTopicId);
    if (currentId === null) localStorage.removeItem(k);
    else localStorage.setItem(k, String(currentId));
  }, [currentId, currentTopicId]);

  const allDone = total > 0 && solvedIds.size === total;
  const alreadySolved = currentId !== null && solvedIds.has(currentId);
  const currentQuestion = currentId !== null ? questions[currentId] ?? null : null;
  // in mixed mode, show the real topic of the question on screen
  const displayTopicName =
    isAll && currentId !== null
      ? TOPICS.find((t) => t.id === questionTopicIds[currentId])?.name ?? topicName
      : topicName;

  const loadCodeFor = useCallback(
    (qid: number | null) => {
      if (qid === null) {
        setCode(boilerplate("Pick a question to get started"));
        return;
      }
      const saved = localStorage.getItem(codeKey(currentTopicId, qid));
      setCode(saved ?? boilerplate(questions[qid] ?? ""));
    },
    [currentTopicId, questions]
  );

  // remembers the last few picked indices so the picker doesn't keep
  // cycling the same questions; reset on topic switch / progress reset.
  const recentRef = useRef<number[]>([]);

  const pickRandomFromSet = useCallback(
    (skipSolved: Set<number>) => {
      const n = questions.length;
      const allowed = new Set(difficultyFilter);
      const unsolved: number[] = [];
      for (let i = 0; i < n; i++) {
        if (!skipSolved.has(i) && allowed.has(difficulties[i])) unsolved.push(i);
      }
      if (unsolved.length === 0) {
        setCurrentId(null);
        recentRef.current = [];
        return;
      }

      // never re-pick the question already on screen…
      let pool = unsolved.filter((i) => i !== currentId);
      if (pool.length === 0) pool = unsolved; // …unless it's the only one left

      // …and avoid recently shown questions, while keeping the pool non-empty
      const fresh = pool.filter((i) => !recentRef.current.includes(i));
      const finalPool = fresh.length > 0 ? fresh : pool;

      const idx = finalPool[Math.floor(Math.random() * finalPool.length)];

      // cap history so it can never swallow the whole pool
      const cap = Math.min(8, Math.max(0, unsolved.length - 1));
      recentRef.current = [idx, ...recentRef.current.filter((i) => i !== idx)].slice(0, cap);

      setCurrentId(idx);
      loadCodeFor(idx);
      setOutput({ text: "// Output will appear here after you Run.", kind: "idle" });
    },
    [questions, difficulties, difficultyFilter, currentId, loadCodeFor]
  );

  const pickRandom = useCallback(() => pickRandomFromSet(solvedIds), [pickRandomFromSet, solvedIds]);

  const markSolved = useCallback(() => {
    if (currentId === null) return;
    const qid = qids[currentId];
    if (!qid) return;
    const next = new Set(solvedIds);
    next.add(currentId);
    void recordSolved(qid, questionTopicIds[currentId]);
    pickRandomFromSet(next);
  }, [currentId, qids, questionTopicIds, solvedIds, pickRandomFromSet]);

  const resetAll = useCallback(() => {
    if (isAll) {
      if (!window.confirm("Reset progress for ALL topics? This cannot be undone.")) return;
      void Promise.all(TOPICS.map((t) => resetTopic(t.id)));
    } else {
      if (!window.confirm(`Reset progress for "${topicName}"?`)) return;
      void resetTopic(currentTopicId);
    }
    setCurrentId(null);
    recentRef.current = [];
    loadCodeFor(null);
  }, [isAll, topicName, currentTopicId, loadCodeFor]);

  const switchTopic = useCallback((id: string) => {
    const nextIsAll = id === ALL_TOPIC_ID;
    const next = TOPICS.find((t) => t.id === id);
    if (!nextIsAll && !next) return;
    setCurrentTopicId(id);
    recentRef.current = [];
    const nextQuestions = nextIsAll
      ? TOPICS.flatMap((t) => t.questions)
      : next!.questions;
    const rawCurrent = localStorage.getItem(currentKey(id));
    const parsed = rawCurrent !== null ? Number(rawCurrent) : null;
    const nextCurrent =
      parsed !== null && parsed >= 0 && parsed < nextQuestions.length ? parsed : null;
    setCurrentId(nextCurrent);
    const savedCode =
      nextCurrent !== null ? localStorage.getItem(codeKey(id, nextCurrent)) : null;
    setCode(savedCode ?? boilerplate(nextCurrent !== null ? nextQuestions[nextCurrent] ?? "" : "Pick a question"));
    setOutput({ text: "// Output will appear here after you Run.", kind: "idle" });
  }, []);

  const resetCode = useCallback(() => {
    if (currentId === null) {
      setCode(boilerplate("Pick a question to get started"));
      return;
    }
    if (!window.confirm("Reset this question's code to the starter template?")) return;
    localStorage.removeItem(codeKey(currentTopicId, currentId));
    setCode(boilerplate(questions[currentId] ?? ""));
  }, [currentId, currentTopicId, questions]);

  const handleRun = useCallback(async () => {
    if (!code.trim() || isRunning) return;
    setIsRunning(true);
    setOutput({ text: "Sending to local Piston…", kind: "running" });
    if (currentId !== null && qids[currentId]) {
      void recordAttempt(qids[currentId], questionTopicIds[currentId], "run");
    }
    try {
      const result = await runJava(code);
      setOutput({ text: result.output, kind: result.kind, timeMs: result.timeMs, exitCode: result.exitCode });
    } catch (e: any) {
      setOutput({
        text: `Local Piston error: ${e.message}\n\nMake sure the container is running:\n  docker start piston`,
        kind: "error",
      });
    } finally {
      setIsRunning(false);
    }
  }, [code, isRunning, currentId, qids, questionTopicIds]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && helpOpen) {
        setHelpOpen(false);
        return;
      }
      const target = e.target as HTMLElement;
      const inEditor = target.closest(".cm-editor");
      if (!inEditor && e.key === "?") {
        e.preventDefault();
        setHelpOpen((v) => !v);
        return;
      }
      if (inEditor) return;
      const tag = target.tagName;
      if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;
      if (e.code === "Space") {
        e.preventDefault();
        pickRandom();
      } else if (e.code === "Enter") {
        if (currentId !== null && !alreadySolved && !allDone) markSolved();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pickRandom, markSolved, currentId, alreadySolved, allDone, helpOpen]);

  const leftPane = (
    <Box sx={{ height: "100%", overflowY: "auto", p: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
      <StatsRow total={total} solved={solvedIds.size} />
      <QuestionCard
        question={currentQuestion}
        index={currentId}
        total={total}
        topicName={displayTopicName}
        alreadySolved={alreadySolved}
        allDone={allDone && currentQuestion === null}
        difficulty={currentId !== null ? difficulties[currentId] : null}
      />
      <Box sx={{ mt: "auto" }}>
        <ActionButtons
          onPick={pickRandom}
          onSolved={markSolved}
          onReset={resetAll}
          solvedDisabled={currentId === null || alreadySolved}
        />
      </Box>
    </Box>
  );

  const rightPane = (
    <Allotment vertical defaultSizes={[65, 35]}>
      <Allotment.Pane minSize={200}>
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <CodeEditor
            code={code}
            onChange={setCode}
            onRun={handleRun}
            onResetCode={resetCode}
            javaVersion={javaVersion}
            isRunning={isRunning}
            themeMode={themeMode}
          />
        </Box>
      </Allotment.Pane>
      <Allotment.Pane minSize={120}>
        <Box sx={{ height: "100%", p: 1, display: "flex", flexDirection: "column" }}>
          <OutputPanel output={output} />
        </Box>
      </Allotment.Pane>
    </Allotment>
  );

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <TopBar
        topics={TOPICS}
        currentTopicId={currentTopicId}
        solvedCounts={solvedCounts}
        onTopicChange={switchTopic}
        onShowHelp={() => setHelpOpen(true)}
        themeMode={themeMode}
        onToggleTheme={onToggleTheme}
        username={user}
        onLogout={signOut}
        difficultyFilter={difficultyFilter}
        onToggleDifficulty={toggleDifficulty}
      />
      <Box sx={{ flex: 1, minHeight: 0 }}>
        {isNarrow ? (
          <Box sx={{ height: "100%", overflowY: "auto" }}>
            {leftPane}
            <Box sx={{ height: "70vh", borderTop: 1, borderColor: "divider" }}>{rightPane}</Box>
          </Box>
        ) : (
          <Allotment defaultSizes={[42, 58]}>
            <Allotment.Pane minSize={300}>{leftPane}</Allotment.Pane>
            <Allotment.Pane minSize={300}>{rightPane}</Allotment.Pane>
          </Allotment>
        )}
      </Box>
      <ShortcutsDialog open={helpOpen} onClose={() => setHelpOpen(false)} />
    </Box>
  );
}
