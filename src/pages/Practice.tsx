import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { useLiveQuery } from "dexie-react-hooks";
import { Allotment } from "allotment";
import "allotment/dist/style.css";

import { TOPICS } from "../data/questions";
import { boilerplate, getJavaVersion, runJava } from "../lib/piston";
import { questionId } from "../lib/questionId";
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
const currentKey = (id: string) => `java_practice_current_${id}`;
const codeKey    = (topicId: string, qid: number) => `java_practice_code_${topicId}_${qid}`;

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
  const currentTopic = TOPICS.find((t) => t.id === currentTopicId) ?? TOPICS[0];

  // stable id for each question in the current topic — survives reordering
  const qids = useMemo(
    () => currentTopic.questions.map((q) => questionId(currentTopicId, q)),
    [currentTopicId, currentTopic.questions]
  );

  // ---- progress (IndexedDB via Dexie) -------------------------------------
  const progressRows = useLiveQuery(
    () => db.progress.where("topicId").equals(currentTopicId).toArray(),
    [currentTopicId]
  );
  // solved questions of the current topic, expressed as array indices
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
    // keep the current topic exact (only counts questions that still exist)
    out[currentTopicId] = solvedIds.size;
    return out;
  }, [allSolved, currentTopicId, solvedIds]);

  // ---- session state ------------------------------------------------------
  const [currentId, setCurrentId] = useState<number | null>(() => {
    const raw = localStorage.getItem(currentKey(currentTopicId));
    return raw !== null ? Number(raw) : null;
  });

  const [code, setCode] = useState<string>(() => {
    if (currentId === null) return boilerplate("Pick a question to get started");
    const saved = localStorage.getItem(codeKey(currentTopicId, currentId));
    return saved ?? boilerplate(currentTopic.questions[currentId] ?? "");
  });

  const [output, setOutput] = useState<OutputState>({ text: "// Output will appear here after you Run.", kind: "idle" });
  const [isRunning, setIsRunning] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [javaVersion, setJavaVersion] = useState<string>("");

  // self-heal: drop a stored question index that no longer exists
  useEffect(() => {
    if (currentId !== null && currentId >= currentTopic.questions.length) {
      setCurrentId(null);
      setCode(boilerplate("Pick a question to get started"));
    }
  }, [currentId, currentTopic.questions.length]);

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

  const total = currentTopic.questions.length;
  const allDone = total > 0 && solvedIds.size === total;
  const alreadySolved = currentId !== null && solvedIds.has(currentId);
  const currentQuestion = currentId !== null ? currentTopic.questions[currentId] : null;

  const loadCodeFor = useCallback(
    (qid: number | null) => {
      if (qid === null) {
        setCode(boilerplate("Pick a question to get started"));
        return;
      }
      const saved = localStorage.getItem(codeKey(currentTopicId, qid));
      setCode(saved ?? boilerplate(currentTopic.questions[qid] ?? ""));
    },
    [currentTopicId, currentTopic.questions]
  );

  // remembers the last few picked indices so the picker doesn't keep
  // cycling the same questions; reset on topic switch / progress reset.
  const recentRef = useRef<number[]>([]);

  const pickRandomFromSet = useCallback(
    (skipSolved: Set<number>) => {
      const n = currentTopic.questions.length;
      const unsolved: number[] = [];
      for (let i = 0; i < n; i++) {
        if (!skipSolved.has(i)) unsolved.push(i);
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
      const cap = Math.min(5, Math.max(0, unsolved.length - 1));
      recentRef.current = [idx, ...recentRef.current.filter((i) => i !== idx)].slice(0, cap);

      setCurrentId(idx);
      loadCodeFor(idx);
      setOutput({ text: "// Output will appear here after you Run.", kind: "idle" });
    },
    [currentTopic.questions, currentId, loadCodeFor]
  );

  const pickRandom = useCallback(() => pickRandomFromSet(solvedIds), [pickRandomFromSet, solvedIds]);

  const markSolved = useCallback(() => {
    if (currentId === null) return;
    const qid = qids[currentId];
    if (!qid) return;
    const next = new Set(solvedIds);
    next.add(currentId);
    void recordSolved(qid, currentTopicId);
    pickRandomFromSet(next);
  }, [currentId, qids, solvedIds, currentTopicId, pickRandomFromSet]);

  const resetAll = useCallback(() => {
    if (!window.confirm(`Reset progress for "${currentTopic.name}"?`)) return;
    void resetTopic(currentTopicId);
    setCurrentId(null);
    recentRef.current = [];
    loadCodeFor(null);
  }, [currentTopic.name, currentTopicId, loadCodeFor]);

  const switchTopic = useCallback((id: string) => {
    const next = TOPICS.find((t) => t.id === id);
    if (!next) return;
    setCurrentTopicId(id);
    recentRef.current = [];
    const rawCurrent = localStorage.getItem(currentKey(id));
    const parsed = rawCurrent !== null ? Number(rawCurrent) : null;
    const nextCurrent =
      parsed !== null && parsed >= 0 && parsed < next.questions.length ? parsed : null;
    setCurrentId(nextCurrent);
    const savedCode =
      nextCurrent !== null ? localStorage.getItem(codeKey(id, nextCurrent)) : null;
    setCode(savedCode ?? boilerplate(nextCurrent !== null ? next.questions[nextCurrent] ?? "" : "Pick a question"));
    setOutput({ text: "// Output will appear here after you Run.", kind: "idle" });
  }, []);

  const resetCode = useCallback(() => {
    if (currentId === null) {
      setCode(boilerplate("Pick a question to get started"));
      return;
    }
    if (!window.confirm("Reset this question's code to the starter template?")) return;
    localStorage.removeItem(codeKey(currentTopicId, currentId));
    setCode(boilerplate(currentTopic.questions[currentId] ?? ""));
  }, [currentId, currentTopicId, currentTopic.questions]);

  const handleRun = useCallback(async () => {
    if (!code.trim() || isRunning) return;
    setIsRunning(true);
    setOutput({ text: "Sending to local Piston…", kind: "running" });
    if (currentId !== null && qids[currentId]) {
      void recordAttempt(qids[currentId], currentTopicId, "run");
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
  }, [code, isRunning, currentId, qids, currentTopicId]);

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
        topicName={currentTopic.name}
        alreadySolved={alreadySolved}
        allDone={allDone && currentQuestion === null}
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
