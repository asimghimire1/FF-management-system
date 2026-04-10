import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, AlertCircle, Loader } from "lucide-react";
import useStore from "../store/useStore";
import { authAPI } from "../services/api";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useStore();

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.adminLogin(email, password);
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      login(user, token);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Admin login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-orange-600 bg-gray-900 p-8">
        <h1 className="text-3xl font-black text-orange-400 mb-6 flex items-center gap-2">
          <ShieldCheck size={30} /> Admin Login
        </h1>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500 bg-red-900/40 p-3 text-sm text-red-200 flex gap-2">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3"
            placeholder="admin@example.com"
            required
            disabled={loading}
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3"
            placeholder="Password"
            required
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-orange-600 px-4 py-3 font-bold hover:bg-orange-500 disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {loading ? <Loader size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
            Enter Admin Dashboard
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-400">
          Need an admin account? <Link to="/admin/signup" className="text-orange-400">Create admin account</Link>
        </p>
      </div>
    </div>
  );
}
