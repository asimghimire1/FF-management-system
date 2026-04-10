import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";

import useStore from "./store/useStore";
import Navbar from "./components/Navbar";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminLogin from "./pages/AdminLogin";
import AdminSignup from "./pages/AdminSignup";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import MatchDetails from "./pages/MatchDetails";
import MyTeams from "./pages/MyTeams";
import Leaderboard from "./pages/Leaderboard";

import "./styles/globals.css";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user } = useStore();

  if (!isAuthenticated) {
    return <Navigate to={requiredRole === "admin" ? "/admin/login" : "/login"} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={requiredRole === "admin" ? "/admin/login" : "/dashboard"} replace />;
  }

  return children;
};

function AppRoutes() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-gray-900">
      {!isAdminPath && <Navbar />}
      <main className={isAdminPath ? "min-h-screen" : "container mx-auto px-4 py-8"}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole="user">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teams"
            element={
              <ProtectedRoute requiredRole="user">
                <MyTeams />
              </ProtectedRoute>
            }
          />
          <Route path="/matches/:matchId" element={<MatchDetails />} />
          <Route path="/leaderboard/:leaderboardId" element={<Leaderboard />} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={<Navigate to="/admin/dashboard" replace />}
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      useStore.setState({ user: JSON.parse(storedUser) });
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppRoutes />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
