import { Box, Chip, IconButton, Paper, Tooltip, Typography } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import { useState } from "react";

export type OutputState = {
  text: string;
  kind: "idle" | "running" | "ok" | "error";
  timeMs?: number;
  exitCode?: number | null;
};

type Props = { output: OutputState };

export default function OutputPanel({ output }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  const statusLabel =
    output.kind === "running" ? "running…" :
    output.kind === "ok"      ? "success" :
    output.kind === "error"   ? "error" : "idle";
  const statusColor: "default" | "info" | "success" | "error" =
    output.kind === "running" ? "info" :
    output.kind === "ok"      ? "success" :
    output.kind === "error"   ? "error" : "default";

  return (
    <Paper
      sx={{
        bgcolor: "rgba(0,0,0,0.55)",
        color: "#e5e7eb",
        border: 1,
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 1.5,
          py: 0.75,
          borderBottom: 1,
          borderColor: "rgba(255,255,255,0.08)",
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>
          Output
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          {output.timeMs != null && (
            <Typography variant="caption" sx={{ fontFamily: "monospace", opacity: 0.7 }}>
              {output.timeMs}ms
            </Typography>
          )}
          {output.exitCode != null && (
            <Typography variant="caption" sx={{ fontFamily: "monospace", opacity: 0.7 }}>
              exit {output.exitCode}
            </Typography>
          )}
          <Chip label={statusLabel} size="small" color={statusColor} variant="filled" sx={{ height: 20 }} />
          <Tooltip title={copied ? "Copied!" : "Copy output"}>
            <IconButton size="small" onClick={handleCopy} sx={{ color: "rgba(255,255,255,0.7)" }}>
              {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Box
        component="pre"
        sx={{
          m: 0,
          p: 1.5,
          fontFamily: '"Fira Code", Consolas, monospace',
          fontSize: "0.85rem",
          lineHeight: 1.55,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          flex: 1,
          overflowY: "auto",
          color: output.kind === "error" ? "#fca5a5" : "#e5e7eb",
        }}
      >
        {output.text}
      </Box>
    </Paper>
  );
}
