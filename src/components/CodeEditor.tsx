import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import RestoreIcon from "@mui/icons-material/Restore";
import CodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { java } from "@codemirror/lang-java";
import { oneDark } from "@codemirror/theme-one-dark";
import { keymap } from "@codemirror/view";
import { useMemo, useRef } from "react";

type Props = {
  code: string;
  onChange: (next: string) => void;
  onRun: () => void;
  onResetCode: () => void;
  javaVersion: string;
  isRunning: boolean;
  themeMode: "dark" | "light" | "sepia";
};

const FLAME_COLORS = ["#ffd166", "#ff7a2d", "#ef4444", "#fb923c", "#fde047"];

function spawnFlameAt(host: HTMLElement, x: number, y: number) {
  const count = 5 + Math.floor(Math.random() * 3);
  for (let i = 0; i < count; i++) {
    const p = document.createElement("span");
    p.className = "flame-particle";
    const dx = (Math.random() - 0.5) * 26;
    const dy = -(20 + Math.random() * 36);
    const size = 4 + Math.random() * 6;
    const color = FLAME_COLORS[Math.floor(Math.random() * FLAME_COLORS.length)];
    const dur = 600 + Math.random() * 400;
    p.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: radial-gradient(circle, ${color} 0%, ${color}aa 60%, transparent 100%);
      pointer-events: none;
      box-shadow: 0 0 8px ${color}, 0 0 14px ${color}88;
      transform: translate(-50%, -50%);
      filter: blur(0.5px);
      z-index: 9;
    `;
    host.appendChild(p);
    p.animate(
      [
        { transform: "translate(-50%, -50%) scale(1)", opacity: 1 },
        {
          transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.2)`,
          opacity: 0,
        },
      ],
      { duration: dur, easing: "cubic-bezier(0.2,0.7,0.2,1)" }
    ).onfinish = () => p.remove();
  }
}

export default function CodeEditor({
  code,
  onChange,
  onRun,
  onResetCode,
  javaVersion,
  isRunning,
  themeMode,
}: Props) {
  const cmRef = useRef<ReactCodeMirrorRef>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const prevLen = useRef<number>(code.length);

  const extensions = useMemo(
    () => [
      java(),
      keymap.of([
        {
          key: "Mod-Enter",
          run: () => {
            onRun();
            return true;
          },
        },
      ]),
    ],
    [onRun]
  );

  const handleChange = (next: string) => {
    const grew = next.length > prevLen.current;
    prevLen.current = next.length;
    onChange(next);
    if (!grew) return;
    const view = cmRef.current?.view;
    const host = hostRef.current;
    if (!view || !host) return;
    const pos = view.state.selection.main.head;
    const coords = view.coordsAtPos(pos);
    if (!coords) return;
    const rect = host.getBoundingClientRect();
    spawnFlameAt(host, coords.left - rect.left, coords.top - rect.top + 8);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        sx={{ px: 2, py: 1, borderBottom: 1, borderColor: "divider", bgcolor: "background.paper" }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          💻 Java Solution
        </Typography>
        <Chip label={`Java ${javaVersion || "…"}`} size="small" variant="outlined" />
        <Box sx={{ flex: 1 }} />
        <Button size="small" variant="outlined" onClick={onResetCode} startIcon={<RestoreIcon />}>
          Reset
        </Button>
        <Button
          size="small"
          variant="contained"
          color="secondary"
          onClick={onRun}
          disabled={isRunning}
          startIcon={<PlayArrowIcon />}
        >
          {isRunning ? "Running…" : "Run"}
        </Button>
      </Stack>
      <Box
        ref={hostRef}
        sx={{
          flex: 1,
          minHeight: 0,
          position: "relative",
          overflow: "hidden",
          "& .cm-editor": { height: "100%" },
          "& .cm-editor.cm-focused .cm-cursor": {
            boxShadow: "0 0 8px #ff7a2d, 0 0 14px rgba(255,122,45,0.6)",
            borderColor: "#ff7a2d",
          },
        }}
      >
        <CodeMirror
          ref={cmRef}
          value={code}
          height="100%"
          theme={themeMode === "dark" ? oneDark : "light"}
          extensions={extensions}
          onChange={handleChange}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLine: true,
            indentOnInput: true,
            bracketMatching: true,
            closeBrackets: true,
          }}
        />
      </Box>
    </Box>
  );
}
