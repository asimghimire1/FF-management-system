import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogIn, AlertCircle, Loader, Flame } from "lucide-react";
import useStore from "../store/useStore";
import { authAPI } from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    try {
      console.log("Sending login request with email:", email);
      const response = await authAPI.login(email, password);
      console.log("Login response:", response.data);

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      login(user, token);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Login failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-orange-500 rounded-full mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-red-600 rounded-full mix-blend-screen animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-black/60 border-2 border-orange-600 rounded-xl p-8 backdrop-blur-sm shadow-xl shadow-orange-500/30">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg border-2 border-yellow-400">
              <LogIn size={32} className="text-yellow-300" />
            </div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300">
              SIGN IN
            </h1>
          </div>

          {error && (
            <div className="bg-red-900/80 border-2 border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4 flex items-start gap-3">
              <AlertCircle size={24} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">ERROR</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-orange-300 font-bold mb-2">EMAIL ADDRESS</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-800 border-2 border-orange-600 text-white px-4 py-3 rounded-lg focus:border-yellow-400 focus:outline-none transition"
                placeholder="you@example.com"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-orange-300 font-bold mb-2">PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-800 border-2 border-orange-600 text-white px-4 py-3 rounded-lg focus:border-yellow-400 focus:outline-none transition"
                placeholder="••••••••"
                disabled={loading}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-black py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-orange-500/50 transition-all transform hover:scale-105 border-2 border-yellow-300 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  SIGNING IN...
                </>
              ) : (
                <>
                  <Flame size={20} />
                  ENTER ARENA
                </>
              )}
            </button>
          </form>

          <div className="text-center text-gray-300 mt-6 border-t border-orange-600 pt-6">
            <p>
              No account yet?{" "}
              <Link to="/signup" className="text-orange-400 hover:text-yellow-300 font-black transition">
                CREATE ONE NOW
              </Link>
            </p>
            <p className="mt-2 text-sm">
              Admin access?{" "}
              <Link to="/admin/login" className="text-orange-400 hover:text-yellow-300 font-black transition">
                OPEN ADMIN LOGIN
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

