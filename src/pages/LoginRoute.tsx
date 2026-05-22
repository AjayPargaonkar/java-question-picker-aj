import { Navigate, useLocation, useNavigate } from "react-router-dom";
import LoginPage from "../components/LoginPage";
import { useAuth } from "../context/AuthContext";

export default function LoginRoute() {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: { pathname?: string } } };

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = (name: string, email?: string) => {
    signIn(name, email);
    const dest = location.state?.from?.pathname || "/";
    navigate(dest, { replace: true });
  };

  return <LoginPage onLogin={handleLogin} />;
}
