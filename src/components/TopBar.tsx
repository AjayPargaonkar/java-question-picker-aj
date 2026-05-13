import { AppBar, Avatar, Box, Chip, IconButton, MenuItem, Select, Toolbar, Tooltip, Typography, ToggleButton, ToggleButtonGroup } from "@mui/material";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import LogoutIcon from "@mui/icons-material/Logout";
import CodeIcon from "@mui/icons-material/Code";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useLocation, useNavigate } from "react-router-dom";
import type { Topic } from "../data/questions";
import type { ThemeMode } from "../theme";

type Props = {
  topics?: Topic[];
  currentTopicId?: string;
  solvedCounts?: Record<string, number>;
  onTopicChange?: (id: string) => void;
  onShowHelp?: () => void;
  themeMode: ThemeMode;
  onToggleTheme: () => void;
  username?: string | null;
  onLogout?: () => void;
  hideTopicSelect?: boolean;
};

const themeIcon = (mode: ThemeMode) =>
  mode === "dark" ? <LightModeIcon /> : mode === "light" ? <AutoStoriesIcon /> : <DarkModeIcon />;
const themeTitle = (mode: ThemeMode) =>
  mode === "dark" ? "Switch to light" : mode === "light" ? "Switch to sepia" : "Switch to dark";

export default function TopBar({
  topics,
  currentTopicId,
  solvedCounts,
  onTopicChange,
  onShowHelp,
  themeMode,
  onToggleTheme,
  username,
  onLogout,
  hideTopicSelect,
}: Props) {
  const initial = (username || "?").trim().charAt(0).toUpperCase();
  const navigate = useNavigate();
  const location = useLocation();
  const tab = location.pathname.startsWith("/theory")
    ? "theory"
    : location.pathname.startsWith("/games")
      ? "games"
      : "practice";

  return (
    <AppBar position="static" elevation={0} sx={{ bgcolor: "background.paper", backdropFilter: "blur(14px)" }}>
      <Toolbar sx={{ gap: 2, minHeight: 56 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
          ☕ Java Practice
        </Typography>

        <ToggleButtonGroup
          size="small"
          value={tab}
          exclusive
          onChange={(_, v) => {
            if (!v) return;
            if (v === "theory") navigate("/theory");
            else if (v === "games") navigate("/games/predict");
            else navigate("/");
          }}
          sx={{
            "& .MuiToggleButton-root": {
              textTransform: "none",
              fontWeight: 600,
              px: 1.6,
              py: 0.6,
              border: 1,
              borderColor: "divider",
            },
          }}
        >
          <ToggleButton value="practice"><CodeIcon fontSize="small" sx={{ mr: 0.6 }} /> Practice</ToggleButton>
          <ToggleButton value="theory"><MenuBookIcon fontSize="small" sx={{ mr: 0.6 }} /> Theory</ToggleButton>
          <ToggleButton value="games"><SportsEsportsIcon fontSize="small" sx={{ mr: 0.6 }} /> Games</ToggleButton>
        </ToggleButtonGroup>

        {!hideTopicSelect && topics && currentTopicId && onTopicChange && (
          <Select
            size="small"
            value={currentTopicId}
            onChange={(e) => onTopicChange(e.target.value)}
            sx={{ minWidth: 240 }}
          >
            {topics.map((t) => {
              const solved = solvedCounts?.[t.id] ?? 0;
              const total = t.questions.length;
              const tick = solved === total && total > 0 ? " ✓" : "";
              return (
                <MenuItem key={t.id} value={t.id}>
                  {t.name} ({solved}/{total}){tick}
                </MenuItem>
              );
            })}
          </Select>
        )}

        <Box sx={{ flex: 1 }} />

        <Tooltip title="Admin">
          <IconButton
            onClick={() => navigate("/admin")}
            color={location.pathname.startsWith("/admin") ? "primary" : "inherit"}
          >
            <AdminPanelSettingsIcon />
          </IconButton>
        </Tooltip>
        {onShowHelp && (
          <Tooltip title="Keyboard shortcuts (?)">
            <IconButton onClick={onShowHelp} color="inherit">
              <KeyboardIcon />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title={themeTitle(themeMode)}>
          <IconButton onClick={onToggleTheme} color="inherit">
            {themeIcon(themeMode)}
          </IconButton>
        </Tooltip>
        {username && (
          <Chip
            avatar={
              <Avatar sx={{ bgcolor: "primary.main", color: "#fff !important", fontWeight: 700 }}>
                {initial}
              </Avatar>
            }
            label={username}
            onDelete={onLogout}
            deleteIcon={
              <Tooltip title="Sign out">
                <LogoutIcon fontSize="small" />
              </Tooltip>
            }
            sx={{ fontWeight: 600, bgcolor: "transparent", border: 1, borderColor: "divider" }}
          />
        )}
      </Toolbar>
    </AppBar>
  );
}
