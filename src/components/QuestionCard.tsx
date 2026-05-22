import { Box, Chip, IconButton, Paper, Tooltip, Typography } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import { useState } from "react";
import { DIFFICULTY_COLOR, type Difficulty } from "../lib/difficulty";

type Props = {
  question: string | null;
  index: number | null;
  total: number;
  topicName: string;
  alreadySolved: boolean;
  allDone: boolean;
  difficulty?: Difficulty | null;
};

export default function QuestionCard({ question, index, total, topicName, alreadySolved, allDone, difficulty }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!question) return;
    try {
      await navigator.clipboard.writeText(question);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  const badgeLabel = allDone
    ? "All Done"
    : question === null
      ? "Ready"
      : alreadySolved
        ? "Already Solved"
        : "Solve Me";
  const badgeColor: "primary" | "secondary" = allDone || alreadySolved ? "secondary" : "primary";

  return (
    <Paper sx={{ p: 2, border: 1, borderColor: "divider" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5, gap: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Chip label={badgeLabel} color={badgeColor} size="small" />
          {question !== null && difficulty && (
            <Chip
              label={difficulty[0].toUpperCase() + difficulty.slice(1)}
              size="small"
              sx={{
                fontWeight: 700,
                color: "#fff",
                bgcolor: DIFFICULTY_COLOR[difficulty],
              }}
            />
          )}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {question !== null && index !== null && (
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              Q #{index + 1} of {total} · {topicName}
            </Typography>
          )}
          <Tooltip title={copied ? "Copied!" : "Copy question"}>
            <span>
              <IconButton size="small" onClick={handleCopy} disabled={!question}>
                {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Box>
      <Box sx={{ minHeight: 80 }}>
        {question === null ? (
          <Typography variant="body2" sx={{ opacity: 0.7, textAlign: "center", py: 3 }}>
            {allDone
              ? `🎉 You've solved every question in ${topicName}! Hit Reset or switch topic.`
              : "Click Pick a Question to start practicing 🚀"}
          </Typography>
        ) : (
          <Typography
            component="pre"
            sx={{
              fontFamily: "inherit",
              fontSize: "1rem",
              lineHeight: 1.65,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              m: 0,
            }}
          >
            {question}
          </Typography>
        )}
      </Box>
    </Paper>
  );
}
