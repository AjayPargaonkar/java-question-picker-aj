import { useMemo } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { useLocalStorage } from "./hooks/useLocalStorage";
import { buildTheme, ThemeMode } from "./theme";
import { AuthProvider } from "./context/AuthContext";

import LoginRoute from "./pages/LoginRoute";
import Practice from "./pages/Practice";
import Theory from "./pages/Theory";
import PredictOutput from "./pages/PredictOutput";
import Admin from "./pages/Admin";
import RequireAuth from "./components/RequireAuth";

export default function App() {
  const [themeMode, setThemeMode] = useLocalStorage<ThemeMode>("java_practice_theme", "dark");
  const theme = useMemo(() => buildTheme(themeMode), [themeMode]);

  const cycleTheme = () => {
    const order: ThemeMode[] = ["dark", "light", "sepia"];
    const next = order[(order.indexOf(themeMode) + 1) % order.length];
    setThemeMode(next);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <Routes>
            <Route path="/login" element={<LoginRoute />} />
            <Route
              path="/"
              element={
                <RequireAuth>
                  <Practice themeMode={themeMode} onToggleTheme={cycleTheme} />
                </RequireAuth>
              }
            />
            <Route
              path="/theory"
              element={
                <RequireAuth>
                  <Theory themeMode={themeMode} onToggleTheme={cycleTheme} />
                </RequireAuth>
              }
            />
            <Route
              path="/games/predict"
              element={
                <RequireAuth>
                  <PredictOutput themeMode={themeMode} onToggleTheme={cycleTheme} />
                </RequireAuth>
              }
            />
            <Route path="/games" element={<Navigate to="/games/predict" replace />} />
            <Route
              path="/admin"
              element={
                <RequireAuth>
                  <Admin themeMode={themeMode} onToggleTheme={cycleTheme} />
                </RequireAuth>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
