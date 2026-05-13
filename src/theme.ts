import { createTheme } from "@mui/material/styles";

export type ThemeMode = "dark" | "light" | "sepia";

export const buildTheme = (mode: ThemeMode) => {
  const isDark   = mode === "dark";
  const isSepia  = mode === "sepia";
  const muiMode: "dark" | "light" = isDark ? "dark" : "light";

  // Eye-friendly sepia palette — warm cream bg, dark brown text, lower contrast.
  const sepiaBg     = "#f4ecd8";
  const sepiaPaper  = "#fbf6e6";
  const sepiaText   = "#3a2f23";
  const sepiaText2  = "#6b5a44";
  const sepiaAccent = "#a8703f";

  return createTheme({
    palette: {
      mode: muiMode,
      primary: isSepia
        ? { main: sepiaAccent, light: "#c98e5e", dark: "#7a4f25", contrastText: "#fff" }
        : { main: "#7f5af0", light: "#a78bfa", dark: "#5b3fd4", contrastText: "#fff" },
      secondary: isSepia
        ? { main: "#5b8a72", light: "#7caa92", dark: "#3f6151", contrastText: "#fff" }
        : { main: "#10b981", light: "#34d399", dark: "#059669", contrastText: "#fff" },
      error:    { main: "#ef4444", light: "#f87171", dark: "#b91c1c" },
      warning:  { main: "#f59e0b", light: "#fbbf24", dark: "#b45309" },
      info:     { main: "#3b82f6", light: "#60a5fa", dark: "#1d4ed8" },
      success:  { main: "#10b981", light: "#34d399", dark: "#059669" },
      background: isDark
        ? { default: "#0b0d12", paper: "#13161d" }
        : isSepia
          ? { default: sepiaBg, paper: sepiaPaper }
          : { default: "#fafafa", paper: "#ffffff" },
      text: isDark
        ? { primary: "#e6e8ee", secondary: "#9aa3b2", disabled: "#5b6473" }
        : isSepia
          ? { primary: sepiaText, secondary: sepiaText2, disabled: "#a08e76" }
          : { primary: "#0f172a", secondary: "#475569", disabled: "#94a3b8" },
      divider: isDark
        ? "rgba(255,255,255,0.08)"
        : isSepia
          ? "rgba(58,47,35,0.12)"
          : "rgba(15,23,42,0.08)",
    },
    shape: { borderRadius: 10 },
    typography: {
      fontFamily:
        '"Inter", "Segoe UI", system-ui, -apple-system, "Helvetica Neue", sans-serif',
      h6:        { fontWeight: 700, letterSpacing: -0.2 },
      subtitle2: { fontWeight: 600 },
      button:    { fontWeight: 600, textTransform: "none", letterSpacing: 0 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundImage: isDark
              ? "radial-gradient(at 20% 0%, rgba(127,90,240,0.10) 0px, transparent 50%), radial-gradient(at 80% 100%, rgba(16,185,129,0.06) 0px, transparent 50%)"
              : isSepia
                ? "none"
                : "radial-gradient(at 20% 0%, rgba(127,90,240,0.06) 0px, transparent 50%)",
            backgroundAttachment: "fixed",
          },
          "::-webkit-scrollbar": { width: 10, height: 10 },
          "::-webkit-scrollbar-thumb": {
            background: isDark ? "rgba(255,255,255,0.12)" : "rgba(15,23,42,0.18)",
            borderRadius: 8,
          },
          "::-webkit-scrollbar-thumb:hover": {
            background: isDark ? "rgba(255,255,255,0.2)" : "rgba(15,23,42,0.3)",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            border: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(15,23,42,0.06)",
            boxShadow: isDark
              ? "0 1px 2px rgba(0,0,0,0.4)"
              : "0 1px 2px rgba(15,23,42,0.04)",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? "rgba(19,22,29,0.85)" : "rgba(255,255,255,0.85)",
            backdropFilter: "saturate(140%) blur(14px)",
            borderBottom: isDark
              ? "1px solid rgba(255,255,255,0.06)"
              : "1px solid rgba(15,23,42,0.06)",
            boxShadow: "none",
            color: isDark ? "#e6e8ee" : "#0f172a",
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { borderRadius: 8, paddingInline: 14 },
          containedPrimary: {
            "&:hover": { boxShadow: "0 6px 14px -6px rgba(127,90,240,0.55)" },
          },
          containedSecondary: {
            "&:hover": { boxShadow: "0 6px 14px -6px rgba(16,185,129,0.55)" },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 600 },
          colorPrimary:   { backgroundColor: "rgba(127,90,240,0.15)", color: "#a78bfa" },
          colorSecondary: { backgroundColor: "rgba(16,185,129,0.15)", color: "#34d399" },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            height: 6,
            borderRadius: 999,
            backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.06)",
          },
          bar: {
            borderRadius: 999,
            background: "linear-gradient(90deg,#7f5af0,#10b981)",
          },
        },
      },
      MuiSelect: {
        styleOverrides: { outlined: { borderRadius: 8 } },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          notchedOutline: {
            borderColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(15,23,42,0.16)",
          },
        },
      },
      MuiTooltip: {
        styleOverrides: { tooltip: { fontSize: 12, fontWeight: 500 } },
      },
      MuiDialog: {
        styleOverrides: { paper: { borderRadius: 14 } },
      },
    },
  });
};
