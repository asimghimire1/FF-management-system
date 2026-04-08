import { useEffect, useState } from "react";
import { Loader, AlertCircle, CheckCircle, Trash2, Zap, Users, Shield, TrendingUp, Flame, Target } from "lucide-react";
import { paymentAPI, adminAPI, leaderboardAPI } from "../services/api";
import OCRUpload from "../components/OCRUpload";
import SlotAssignment from "../components/SlotAssignment";
import "../styles/admin-animations.css";

export default function AdminDashboard() {
  const [pendingPayments, setPendingPayments] = useState([]);
  const [slots, setSlots] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("payments");

  useEffect(() => {
    fetchPendingPayments();
  }, []);

  const fetchPendingPayments = async () => {
    try {
      setLoading(true);
      const res = await paymentAPI.getPendingPayments();
      setPendingPayments(res.data.payments || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  const fetchSlots = async (matchId) => {
    try {
      const res = await adminAPI.getMatchSlots(matchId);
      setSlots(res.data.slots || []);
      setSelectedMatch(matchId);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load slots");
    }
  };

  const handleApprovePayment = async (paymentId) => {
    try {
      setActionLoading(true);
      await adminAPI.approvePayment(paymentId);
      setPendingPayments(
        pendingPayments.filter((p) => p.id !== paymentId)
      );
    } catch (err) {
      setError(err.response?.data?.message || "Approval failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectPayment = async (paymentId) => {
    const reason = prompt("Rejection reason (optional):");
    if (reason === null) return;

    try {
      setActionLoading(true);
      await adminAPI.rejectPayment(paymentId, reason);
      setPendingPayments(
        pendingPayments.filter((p) => p.id !== paymentId)
      );
    } catch (err) {
      setError(err.response?.data?.message || "Rejection failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssignSlot = async (registrationId, slotNumber) => {
    try {
      setActionLoading(true);
      await adminAPI.assignSlot(registrationId, slotNumber);
      if (selectedMatch) {
        fetchSlots(selectedMatch);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Slot assignment failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleOCRUpload = async (file, matchId, roundNumber) => {
    try {
      await leaderboardAPI.uploadLeaderboard(matchId, roundNumber, file);
      alert("Leaderboard processed successfully!");
    } catch (err) {
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-900 to-gray-900 flex items-center justify-center">
        <Loader className="animate-spin text-orange-500" size={60} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 relative overflow-hidden pb-20 hex-bg">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 right-20 w-96 h-96 bg-orange-500 rounded-full mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-red-600 rounded-full mix-blend-screen animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Character Assets - Top Right Corner */}
      <div className="absolute top-20 right-10 z-5 pointer-events-none animate-float">
        <div className="character-slot opacity-60">
          <div className="character-asset breathing">🔫</div>
        </div>
      </div>

      {/* Decorative Corner */}
      <div className="absolute bottom-32 left-8 corner-accent opacity-30"></div>
      <div className="absolute top-32 right-8 corner-accent opacity-30"></div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b-4 animate-border-glow backdrop-blur-lg bg-black/60 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: "linear-gradient(45deg, rgba(249,115,22,0.1) 25%, transparent 25%, transparent 50%, rgba(249,115,22,0.1) 50%, rgba(249,115,22,0.1) 75%, transparent 75%, transparent)",
              backgroundSize: "40px 40px"
            }}></div>
          </div>
          <div className="container mx-auto px-4 py-6 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="animate-rotate-glow">
                  <Shield size={45} className="text-orange-500 drop-shadow-lg" />
                </div>
                <div>
                  <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-red-500 to-yellow-300 animate-text-glow drop-shadow-lg">
                    ADMIN COMMAND CENTER
                  </h1>
                  <p className="text-orange-300 text-sm font-bold flex items-center gap-2 mt-1">
                    <Flame size={16} className="animate-bounce" /> Free Fire Tournament Master
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end gap-2 mb-2">
                  <div className="status-indicator"></div>
                  <p className="text-orange-400 font-bold text-lg animate-glow-pulse">ONLINE</p>
                </div>
                <p className="text-gray-400 text-xs bg-gradient-to-r from-orange-600/20 to-red-600/20 px-3 py-1 rounded-full">ACTIVE SESSION</p>
              </div>
            </div>
          </div>
        </header>

        {/* Error Alert */}
        {error && (
          <div className="container mx-auto px-4 mt-6 animate-fade-slide-in">
            <div className="bg-red-900/80 border-2 border-red-500 text-red-200 px-6 py-4 rounded-lg flex items-start gap-3 backdrop-blur-md shadow-2xl shadow-red-500/20 animate-warning-blink">
              <AlertCircle size={24} className="flex-shrink-0 mt-0.5 text-red-400 animate-bounce" />
              <div>
                <p className="font-bold text-lg">⚠ CRITICAL ALERT</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="container mx-auto px-4 mt-12">
          <div className="flex gap-4 mb-8 flex-wrap">
            {[
              { id: "payments", label: "💰 Payment Control", icon: <Zap size={20} /> },
              { id: "slots", label: "🎯 Slot Assignment", icon: <Target size={20} /> },
              { id: "leaderboard", label: "🏆 OCR Upload", icon: <TrendingUp size={20} /> },
            ].map((tab, idx) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-8 py-3 rounded-lg font-bold transition-all transform duration-300 game-button ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-orange-500 via-red-600 to-yellow-500 text-white shadow-2xl shadow-orange-500/50 border-2 border-yellow-300 animate-glow-pulse scale-105"
                    : "bg-gray-800/80 text-gray-300 border-2 border-gray-700 hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/30"
                }`}
                style={{
                  animation: activeTab === tab.id ? "slideInRight 0.4s ease-out" : "none",
                  transitionDelay: `${idx * 50}ms`
                }}
              >
                <span className="flex items-center gap-2">
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <div className="container mx-auto px-4 space-y-8">
          {/* Payment Control Tab */}
          {activeTab === "payments" && (
            <section className="game-panel animate-fade-slide-in hover:border-yellow-400 transition-all">
              <div className="relative p-8">
                <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300 mb-6 flex items-center gap-3 animate-text-glow">
                  <div className="animate-glow-pulse">
                    <Zap size={32} className="text-orange-500" />
                  </div>
                  PENDING PAYMENTS ({pendingPayments.length})
                </h2>

                {pendingPayments.length === 0 ? (
                  <div className="text-center py-16 bg-gradient-to-b from-gray-900/80 to-gray-800/80 rounded-lg border-2 border-dashed border-gray-600 animate-fade-slide-in">
                    <p className="text-2xl text-gray-300 font-black">✓ ALL CLEAR</p>
                    <p className="text-gray-500 text-sm mt-3">No pending payments to process</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {pendingPayments.map((payment, idx) => (
                      <div
                        key={payment.id}
                        className="payment-card-shimmer border-l-4 border-orange-500 p-6 rounded-lg transform hover:scale-102 transition-all hover:shadow-2xl hover:shadow-orange-500/20 hover:border-yellow-400 animate-fade-slide-in"
                        style={{ animationDelay: `${idx * 50}ms` }}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="status-indicator pending"></div>
                              <p className="font-bold text-orange-300 text-lg">► {payment.userId?.username || "Unknown"}</p>
                            </div>
                            <p className="text-sm text-gray-400 ml-6">{payment.registrationId?.teamId?.name || "Team"}</p>
                            <p className="text-yellow-400 font-bold mt-3 ml-6 text-lg">💰 {payment.amount}</p>
                            {payment.screenshotUrl && (
                              <a
                                href={payment.screenshotUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 text-sm hover:underline mt-2 ml-6 block animate-bounce"
                              >
                                📸 View Screenshot
                              </a>
                            )}
                          </div>

                          <div className="flex gap-2 flex-col">
                            <button
                              onClick={() => handleApprovePayment(payment.id)}
                              className="game-button bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:opacity-50 flex items-center gap-2 whitespace-nowrap font-bold py-2 px-4 rounded-lg text-white transition-all"
                              disabled={actionLoading}
                            >
                              <CheckCircle size={18} />
                              APPROVE
                            </button>
                            <button
                              onClick={() => handleRejectPayment(payment.id)}
                              className="game-button bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:opacity-50 flex items-center gap-2 whitespace-nowrap font-bold py-2 px-4 rounded-lg text-white transition-all"
                              disabled={actionLoading}
                            >
                              <Trash2 size={18} />
                              REJECT
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Slot Assignment Tab */}
          {activeTab === "slots" && (
            <section className="game-panel animate-fade-slide-in">
              <div className="relative p-8">
                <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300 mb-8 flex items-center gap-3 animate-text-glow">
                  <div className="animate-glow-pulse">
                    <Users size={32} className="text-orange-500" />
                  </div>
                  SLOT COMMANDER
                </h2>

                <div className="mb-8 p-6 bg-gradient-to-r from-gray-800/40 to-gray-700/40 rounded-lg border border-orange-500/30">
                  <label className="text-orange-300 font-bold text-lg mb-3 block flex items-center gap-2">
                    <Target size={20} /> SELECT MATCH
                  </label>
                  <select
                    value={selectedMatch || ""}
                    onChange={(e) => e.target.value && fetchSlots(e.target.value)}
                    className="w-full bg-gray-800 border-2 border-orange-600 text-white focus:border-yellow-400 focus:outline-none px-4 py-3 rounded-lg font-semibold transition-all hover:border-orange-500"
                  >
                    <option value="">-- CHOOSE MATCH --</option>
                    {[...new Set(pendingPayments.map(p => p.registrationId?.matchId))].map((match) => (
                      match && (
                        <option key={match.id} value={match.id}>
                          {match.name}
                        </option>
                      )
                    ))}
                  </select>
                </div>

                {selectedMatch && slots.length > 0 && (
                  <div className="animate-fade-slide-in">
                    <SlotAssignment
                      slots={slots}
                      onAssignSlot={handleAssignSlot}
                      loading={actionLoading}
                    />
                  </div>
                )}
              </div>
            </section>
          )}

          {/* OCR Upload Tab */}
          {activeTab === "leaderboard" && (
            <section className="game-panel animate-fade-slide-in">
              <div className="relative p-8">
                <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300 mb-8 flex items-center gap-3 animate-text-glow">
                  <div className="animate-glow-pulse">
                    <TrendingUp size={32} className="text-orange-500" />
                  </div>
                  LEADERBOARD OCR PROCESSOR
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="p-6 bg-gradient-to-r from-gray-800/40 to-gray-700/40 rounded-lg border border-orange-500/30 animate-fade-slide-in">
                    <label className="text-orange-300 font-bold text-lg mb-4 block">Match ID Input:</label>
                    <input
                      type="text"
                      placeholder="Enter Match ID"
                      className="w-full bg-gray-800 border-2 border-orange-600 text-white focus:border-yellow-400 focus:outline-none px-4 py-3 rounded-lg transition-all"
                      id="match-id-input"
                    />
                  </div>
                  <div className="p-6 bg-gradient-to-r from-gray-800/40 to-gray-700/40 rounded-lg border border-orange-500/30 animate-fade-slide-in" style={{animationDelay: "100ms"}}>
                    <label className="text-orange-300 font-bold text-lg mb-4 block">Upload Leaderboard:</label>
                    <OCRUpload
                      matchId={document.getElementById("match-id-input")?.value || ""}
                      roundNumber={1}
                      onSuccess={handleOCRUpload}
                      loading={actionLoading}
                    />
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Footer Stats */}
        <div className="container mx-auto px-4 mt-16 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "PENDING", value: pendingPayments.length, color: "from-yellow-600 to-orange-600", icon: "⏳" },
              { label: "APPROVED", value: "∞", color: "from-green-600 to-emerald-600", icon: "✓" },
              { label: "SYSTEM", value: "ONLINE", color: "from-blue-600 to-cyan-600", icon: "🔷" },
            ].map((stat, i) => (
              <div
                key={i}
                className={`bg-gradient-to-r ${stat.color} border-2 border-white/20 rounded-lg p-6 text-center hover:border-yellow-300 transition-all transform hover:scale-105 animate-fade-slide-in slot-grid-item relative overflow-hidden group`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white/20 transition-opacity"></div>
                <div className="relative">
                  <p className="text-white text-sm font-bold opacity-80 mb-2">{stat.label}</p>
                  <p className="text-white text-4xl font-black drop-shadow-lg">{stat.icon} {stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Decorative Character */}
        <div className="absolute bottom-8 right-8 opacity-40 pointer-events-none animate-float">
          <div className="character-slot">
            <div className="character-asset breathing text-6xl">💨</div>
          </div>
        </div>
      </div>
    </div>
  );
}
