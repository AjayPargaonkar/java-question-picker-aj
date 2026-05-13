import {
  Box,
  Button,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import { useEffect, useRef, useState } from "react";

type Props = {
  onLogin: (username: string) => void;
};

type Mode = "login" | "signup";

const QUIPS: Record<Mode, string[]> = {
  login: [
    "while (!coffee) { /* zzz */ }",
    "// it works on my machine 🤷",
    "git push --force ❌ (don't)",
    "console.log('debugging...')",
  ],
  signup: [
    "Welcome, future bug-hunter!",
    "Step 1: pick a cool handle.",
    "Step 2: write awesome code.",
    "Step 3: ??? · Step 4: profit.",
  ],
};

export default function LoginPage({ onLogin }: Props) {
  const [mode, setMode] = useState<Mode>("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [quipIdx, setQuipIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [mode]);

  useEffect(() => {
    setQuipIdx(0);
    const id = setInterval(() => {
      setQuipIdx((i) => (i + 1) % QUIPS[mode].length);
    }, 2600);
    return () => clearInterval(id);
  }, [mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = username.trim();
    if (!name) return;
    onLogin(name);
  };

  const quip = QUIPS[mode][quipIdx];
  const ctaLabel = mode === "login" ? "Log in & code" : "Sign up & code";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1.1fr 1fr" },
        bgcolor: "background.default",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* LEFT — cartoon coder scene */}
      <Box
        sx={{
          position: "relative",
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: { md: 6, lg: 10 },
          background:
            "linear-gradient(135deg, #fef3c7 0%, #fde68a 40%, #fbcfe8 100%)",
          color: "#1f2937",
          overflow: "hidden",
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center" sx={{ position: "absolute", top: 32, left: 40 }}>
          <LocalFireDepartmentIcon sx={{ color: "#f97316", fontSize: 36 }} />
          <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
            Java<span style={{ color: "#7c3aed" }}>Practice</span>
          </Typography>
        </Stack>

        <CartoonCoder quip={quip} />

        <Typography
          variant="h5"
          sx={{
            mt: 4,
            fontWeight: 800,
            textAlign: "center",
            color: "#1f2937",
          }}
        >
          {mode === "login" ? "Welcome back, hacker." : "Join the chaos."}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mt: 1,
            opacity: 0.7,
            textAlign: "center",
            maxWidth: 380,
          }}
        >
          {mode === "login"
            ? "Your progress, your answers, your snacks — all waiting."
            : "Pick a handle and start your journey from Hello World to mastery."}
        </Typography>
      </Box>

      {/* RIGHT — auth form */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: { xs: 3, md: 6 },
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 400 }}>
          <Tabs
            value={mode}
            onChange={(_, v) => setMode(v)}
            variant="fullWidth"
            sx={{
              mb: 4,
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 700,
                fontSize: "1rem",
              },
            }}
          >
            <Tab label="Log in" value="login" />
            <Tab label="Sign up" value="signup" />
          </Tabs>

          <Stack spacing={1} sx={{ mb: 4 }}>
            <Typography variant="overline" sx={{ color: "primary.main", fontWeight: 700, letterSpacing: 2 }}>
              {mode === "login" ? "SIGN IN" : "CREATE ACCOUNT"}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
              {mode === "login" ? "Welcome, dev." : "Hello, future dev!"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {mode === "login"
                ? "No password. No validation. Just type your handle and start hacking."
                : "We don't really need much. Just a handle is enough to get going."}
            </Typography>
          </Stack>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              {mode === "signup" && (
                <TextField
                  fullWidth
                  label="Email (optional)"
                  placeholder="you@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              )}
              <TextField
                inputRef={inputRef}
                fullWidth
                label="Username"
                placeholder="e.g. ajay_codes"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                InputProps={{
                  sx: {
                    fontFamily: '"Fira Code", monospace',
                    "& input::placeholder": { fontStyle: "italic", opacity: 0.5 },
                  },
                }}
              />
              {mode === "signup" && (
                <TextField
                  fullWidth
                  label="Password (optional)"
                  placeholder="hunter2"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
              )}
              <Button
                type="submit"
                fullWidth
                size="large"
                variant="contained"
                disabled={!username.trim()}
                startIcon={<LocalFireDepartmentIcon />}
                sx={{
                  py: 1.4,
                  background: "linear-gradient(135deg, #7f5af0, #ff7a2d)",
                  fontWeight: 700,
                  letterSpacing: 0.4,
                  "&:hover": {
                    background: "linear-gradient(135deg, #8b6af2, #ff8a45)",
                    boxShadow: "0 12px 32px -8px rgba(255,122,45,0.5)",
                  },
                  "&.Mui-disabled": {
                    background: "rgba(127,127,127,0.18)",
                    color: "rgba(255,255,255,0.4)",
                  },
                }}
              >
                {ctaLabel}
              </Button>
            </Stack>
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mt: 4, fontFamily: "monospace", opacity: 0.6 }}
          >
            {mode === "login"
              ? "// your progress is saved locally · no servers · no tracking"
              : "// no email verification · no captchas · we trust you"}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

/** Inline SVG cartoon — a goofy coder at a laptop with a thought bubble. */
function CartoonCoder({ quip }: { quip: string }) {
  return (
    <Box
      sx={{
        position: "relative",
        width: { md: 420, lg: 480 },
        height: { md: 320, lg: 360 },
        animation: "float 4s ease-in-out infinite",
        "@keyframes float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      }}
    >
      <svg viewBox="0 0 480 360" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        {/* Thought bubble */}
        <g>
          <rect x="230" y="20" width="240" height="80" rx="20" fill="#ffffff" stroke="#1f2937" strokeWidth="3" />
          <circle cx="240" cy="115" r="8" fill="#ffffff" stroke="#1f2937" strokeWidth="2.5" />
          <circle cx="225" cy="135" r="5" fill="#ffffff" stroke="#1f2937" strokeWidth="2" />
          <foreignObject x="240" y="30" width="220" height="65">
            <div
              style={{
                fontFamily: '"Fira Code", monospace',
                fontSize: 14,
                color: "#1f2937",
                lineHeight: 1.4,
                fontWeight: 600,
                textAlign: "center",
                paddingTop: 8,
              }}
            >
              {quip}
            </div>
          </foreignObject>
        </g>

        {/* Desk */}
        <rect x="40" y="290" width="400" height="14" rx="3" fill="#92400e" />
        <rect x="40" y="304" width="400" height="6" fill="#78350f" />

        {/* Laptop base */}
        <path d="M 120 290 L 360 290 L 380 270 L 100 270 Z" fill="#475569" stroke="#1f2937" strokeWidth="3" />
        {/* Laptop screen */}
        <rect x="130" y="170" width="220" height="100" rx="6" fill="#1e293b" stroke="#1f2937" strokeWidth="3" />
        <rect x="138" y="178" width="204" height="84" rx="3" fill="#0f172a" />
        {/* Fake code lines on screen */}
        <rect x="146" y="186" width="60" height="5" rx="2" fill="#7c3aed" />
        <rect x="146" y="198" width="100" height="5" rx="2" fill="#10b981" />
        <rect x="146" y="210" width="80" height="5" rx="2" fill="#f59e0b" />
        <rect x="146" y="222" width="120" height="5" rx="2" fill="#10b981" />
        <rect x="146" y="234" width="40" height="5" rx="2" fill="#ef4444" />
        <rect x="146" y="246" width="90" height="5" rx="2" fill="#7c3aed" />

        {/* Coder head */}
        <circle cx="100" cy="180" r="32" fill="#fcd34d" stroke="#1f2937" strokeWidth="3" />
        {/* Hair */}
        <path d="M 70 165 Q 75 145 100 145 Q 125 145 130 165 Q 120 158 100 158 Q 80 158 70 165 Z" fill="#1f2937" />
        {/* Eyes */}
        <circle cx="90" cy="180" r="3" fill="#1f2937" />
        <circle cx="110" cy="180" r="3" fill="#1f2937" />
        {/* Smile */}
        <path d="M 90 192 Q 100 200 110 192" stroke="#1f2937" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {/* Glasses */}
        <circle cx="90" cy="180" r="8" fill="none" stroke="#1f2937" strokeWidth="2" />
        <circle cx="110" cy="180" r="8" fill="none" stroke="#1f2937" strokeWidth="2" />
        <line x1="98" y1="180" x2="102" y2="180" stroke="#1f2937" strokeWidth="2" />

        {/* Body */}
        <path d="M 70 215 L 130 215 L 145 280 L 55 280 Z" fill="#7c3aed" stroke="#1f2937" strokeWidth="3" />
        {/* Shirt detail */}
        <text x="100" y="250" textAnchor="middle" fontFamily="monospace" fontSize="18" fontWeight="bold" fill="#fcd34d">
          {"</>"}
        </text>

        {/* Arm reaching to laptop */}
        <path d="M 130 230 Q 150 245 175 260" stroke="#fcd34d" strokeWidth="14" strokeLinecap="round" fill="none" />
        <path d="M 130 230 Q 150 245 175 260" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" fill="none" />

        {/* Coffee mug */}
        <rect x="370" y="250" width="34" height="36" rx="3" fill="#ef4444" stroke="#1f2937" strokeWidth="3" />
        <path d="M 404 258 Q 418 258 418 270 Q 418 282 404 282" stroke="#1f2937" strokeWidth="3" fill="none" />
        <path d="M 378 248 Q 380 240 384 248 M 388 248 Q 390 240 394 248 M 398 248 Q 400 240 404 248" stroke="#94a3b8" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    </Box>
  );
}
