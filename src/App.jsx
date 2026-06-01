import {
  BrowserRouter,
  HashRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Habits from "./pages/Habits";
import Calendar from "./pages/Calendar";
import Settings from "./pages/Settings";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import { getSession } from "./utils/auth";

import "./App.css";

// PROTECTED ROUTE
function ProtectedRoute({ children }) {
  const session = getSession();

  return session ? (
    children
  ) : (
    <Navigate to="/login" />
  );
}

// ROUTES COMPONENT
function AppRoutes() {
  const navigate = useNavigate();

  return (
    <Routes>
      {/* LOGIN */}
      <Route
        path="/login"
        element={
          <Login
            onSuccess={() =>
              navigate("/dashboard")
            }
            onSignup={() =>
              navigate("/signup")
            }
          />
        }
      />

      {/* SIGNUP */}
      <Route
        path="/signup"
        element={
          <Signup
            onSuccess={() =>
              navigate("/dashboard")
            }
            onLogin={() =>
              navigate("/login")
            }
          />
        }
      />

      {/* DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* HABITS */}
      <Route
        path="/habits"
        element={
          <ProtectedRoute>
            <Habits />
          </ProtectedRoute>
        }
      />

      {/* CALENDAR */}
      <Route
        path="/calendar"
        element={
          <ProtectedRoute>
            <Calendar />
          </ProtectedRoute>
        }
      />

      {/* SETTINGS — onLogout clears navigation back to /login */}
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings onLogout={() => navigate("/login", { replace: true })} />
          </ProtectedRoute>
        }
      />

      {/* DEFAULT ROUTE */}
      <Route
        path="*"
        element={
          <Navigate
            to={
              getSession()
                ? "/dashboard"
                : "/login"
            }
          />
        }
      />
    </Routes>
  );
}

// MAIN APP
export default function App() {
  return (
    <HashRouter>
      <div
        className="
          min-h-screen
          bg-black
          text-white
        "
      >
        <AppRoutes />
      </div>
    </HashRouter>
  );
}