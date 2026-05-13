import { useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  IconButton,
  Paper,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DescriptionIcon from "@mui/icons-material/Description";
import DataObjectIcon from "@mui/icons-material/DataObject";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TopBar from "../components/TopBar";
import type { ThemeMode } from "../theme";
import { useAuth } from "../context/AuthContext";

type Props = {
  themeMode: ThemeMode;
  onToggleTheme: () => void;
};

type Format = "csv" | "json";

const CSV_SAMPLE = `topicId,title,body,difficulty,tags
arrays,"Find max element","Given int[] arr, return the largest value.",easy,"array;loop"
strings,"Valid palindrome","Check if a string reads the same backward.",easy,"string;two-pointer"
`;

const JSON_SAMPLE = `[
  {
    "topicId": "arrays",
    "title": "Find max element",
    "body": "Given int[] arr, return the largest value.",
    "difficulty": "easy",
    "tags": ["array", "loop"]
  },
  {
    "topicId": "strings",
    "title": "Valid palindrome",
    "body": "Check if a string reads the same backward.",
    "difficulty": "easy",
    "tags": ["string", "two-pointer"]
  }
]
`;

export default function Admin({ themeMode, onToggleTheme }: Props) {
  const { user, signOut } = useAuth();
  const [format, setFormat] = useState<Format>("csv");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [dragOver, setDragOver] = useState(false);
  const [imported, setImported] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const accept = format === "csv" ? ".csv,text/csv" : ".json,application/json";

  const handleFile = async (f: File) => {
    setFile(f);
    setImported(false);
    const text = await f.text();
    setPreview(text.slice(0, 4000));
  };

  const onPick = () => inputRef.current?.click();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const clear = () => {
    setFile(null);
    setPreview("");
    setImported(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const fakeImport = () => {
    setImported(true);
  };

  const downloadSample = () => {
    const blob = new Blob([format === "csv" ? CSV_SAMPLE : JSON_SAMPLE], {
      type: format === "csv" ? "text/csv" : "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `questions-sample.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const lineCount = preview ? preview.split(/\r?\n/).filter(Boolean).length : 0;

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
            ADMIN · QUESTION BANK
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
            Upload questions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Drop a <strong>.csv</strong> or <strong>.json</strong> file with new questions. (UI only — import wiring comes later.)
          </Typography>
        </Stack>

        <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
          <Tabs
            value={format}
            onChange={(_, v) => {
              setFormat(v);
              clear();
            }}
            sx={{ mb: 3 }}
          >
            <Tab icon={<DescriptionIcon />} iconPosition="start" label="CSV" value="csv" />
            <Tab icon={<DataObjectIcon />} iconPosition="start" label="JSON" value="json" />
          </Tabs>

          <Box
            onClick={!file ? onPick : undefined}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            sx={{
              border: "2px dashed",
              borderColor: dragOver ? "primary.main" : "divider",
              bgcolor: dragOver ? "action.hover" : "transparent",
              borderRadius: 2,
              p: 5,
              textAlign: "center",
              cursor: file ? "default" : "pointer",
              transition: "all 0.2s",
              "&:hover": file ? {} : { borderColor: "primary.main", bgcolor: "action.hover" },
            }}
          >
            <input
              ref={inputRef}
              type="file"
              accept={accept}
              hidden
              onChange={onChange}
            />

            {!file ? (
              <Stack spacing={1.5} alignItems="center">
                <CloudUploadIcon sx={{ fontSize: 56, color: "primary.main", opacity: 0.7 }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Drop a {format.toUpperCase()} file here
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  or click anywhere in this box to browse
                </Typography>
                <Chip
                  size="small"
                  label={format === "csv" ? "Accepted: .csv" : "Accepted: .json"}
                  sx={{ mt: 1 }}
                />
              </Stack>
            ) : (
              <Stack spacing={2} alignItems="center">
                <CheckCircleIcon sx={{ fontSize: 48, color: "success.main" }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {file.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {(file.size / 1024).toFixed(1)} KB · {lineCount} lines (preview)
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Button variant="outlined" size="small" onClick={onPick}>
                    Choose another
                  </Button>
                  <Tooltip title="Remove file">
                    <IconButton size="small" onClick={clear}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>
            )}
          </Box>

          {imported && (
            <Alert severity="success" sx={{ mt: 2 }}>
              File received. Import logic not yet wired — questions are not actually saved.
            </Alert>
          )}

          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button
              variant="contained"
              size="large"
              disabled={!file}
              onClick={fakeImport}
              sx={{
                background: "linear-gradient(135deg, #7f5af0, #ff7a2d)",
                fontWeight: 700,
                "&:hover": {
                  background: "linear-gradient(135deg, #8b6af2, #ff8a45)",
                },
                "&.Mui-disabled": {
                  background: "rgba(127,127,127,0.2)",
                },
              }}
            >
              Import questions
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={downloadSample}
            >
              Download sample {format.toUpperCase()}
            </Button>
          </Stack>
        </Paper>

        {preview && (
          <Paper variant="outlined" sx={{ p: 0, mb: 3, overflow: "hidden" }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: "divider" }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Preview
              </Typography>
              <Chip size="small" label={`first ${preview.length} chars`} variant="outlined" />
            </Stack>
            <Box
              component="pre"
              sx={{
                m: 0,
                p: 2,
                maxHeight: 320,
                overflow: "auto",
                fontFamily: '"Fira Code", "JetBrains Mono", monospace',
                fontSize: 13,
                lineHeight: 1.55,
                bgcolor: "background.paper",
              }}
            >
              {preview}
            </Box>
          </Paper>
        )}

        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
            Expected schema
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Each row / object should describe one question:
          </Typography>
          <Box
            component="pre"
            sx={{
              m: 0,
              p: 2,
              borderRadius: 1,
              bgcolor: "action.hover",
              fontFamily: '"Fira Code", monospace',
              fontSize: 13,
              lineHeight: 1.6,
              overflow: "auto",
            }}
          >
{`topicId    string   one of: basics, arrays, strings, recursion, streams, design, stack
title      string   short title
body       string   full problem statement (multi-line ok)
difficulty enum     easy | medium | hard
tags       array    e.g. ["array", "two-pointer"]`}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
