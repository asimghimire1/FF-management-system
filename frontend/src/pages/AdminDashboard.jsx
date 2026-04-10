import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle,
  Loader,
  Shield,
  Swords,
  Trophy,
  Upload,
} from "lucide-react";
import { adminAPI, leaderboardAPI, matchAPI, paymentAPI } from "../services/api";

const defaultTournament = {
  name: "",
  type: "tournament",
  entryFee: 100,
  maxTeams: 12,
  startDate: "",
  endDate: "",
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("tournaments");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [pendingPayments, setPendingPayments] = useState([]);
  const [matches, setMatches] = useState([]);
  const [slots, setSlots] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState("");

  const [tournamentForm, setTournamentForm] = useState(defaultTournament);

  const [leaderboardFile, setLeaderboardFile] = useState(null);
  const [leaderboardRound, setLeaderboardRound] = useState(1);
  const [currentLeaderboard, setCurrentLeaderboard] = useState(null);
  const [entriesText, setEntriesText] = useState("[]");

  const selectedMatchName = useMemo(() => {
    const match = matches.find((m) => m.id === selectedMatch);
    return match?.name || "";
  }, [matches, selectedMatch]);

  useEffect(() => {
    initializeAdminData();
  }, []);

  const initializeAdminData = async () => {
    try {
      setLoading(true);
      const [paymentsRes, matchesRes] = await Promise.all([
        paymentAPI.getPendingPayments(),
        matchAPI.getAllMatches(),
      ]);

      const allMatches = matchesRes.data.matches || [];
      setPendingPayments(paymentsRes.data.payments || []);
      setMatches(allMatches);

      if (allMatches.length > 0) {
        setSelectedMatch(allMatches[0].id);
      }
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const fetchSlots = async (matchId) => {
    if (!matchId) return;
    try {
      const res = await adminAPI.getMatchSlots(matchId);
      setSlots(res.data.slots || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load match slots");
    }
  };

  const fetchLeaderboard = async (matchId) => {
    if (!matchId) return;
    try {
      const res = await leaderboardAPI.getLeaderboardByMatch(matchId);
      const lb = res.data.leaderboard;
      setCurrentLeaderboard(lb);
      setEntriesText(JSON.stringify(lb.entries || [], null, 2));
      setLeaderboardRound(lb.roundNumber || 1);
      setError("");
    } catch (err) {
      setCurrentLeaderboard(null);
      setEntriesText("[]");
      const status = err.response?.status;
      if (status !== 404) {
        setError(err.response?.data?.message || "Failed to load leaderboard");
      }
    }
  };

  const handleApprovePayment = async (paymentId) => {
    try {
      setActionLoading(true);
      await adminAPI.approvePayment(paymentId);
      setPendingPayments((prev) => prev.filter((p) => p.id !== paymentId));
      setSuccess("Payment approved");
    } catch (err) {
      setError(err.response?.data?.message || "Approval failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectPayment = async (paymentId) => {
    const reason = window.prompt("Rejection reason (optional):") || "";
    try {
      setActionLoading(true);
      await adminAPI.rejectPayment(paymentId, reason);
      setPendingPayments((prev) => prev.filter((p) => p.id !== paymentId));
      setSuccess("Payment rejected");
    } catch (err) {
      setError(err.response?.data?.message || "Rejection failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleTournamentCreate = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      const payload = {
        ...tournamentForm,
        entryFee: Number(tournamentForm.entryFee),
        maxTeams: Number(tournamentForm.maxTeams),
      };
      await matchAPI.createMatch(payload);
      setTournamentForm(defaultTournament);
      setSuccess("Tournament hosted successfully");
      await initializeAdminData();
    } catch (err) {
      setError(err.response?.data?.message || "Tournament creation failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateStatus = async (matchId, status) => {
    try {
      setActionLoading(true);
      await matchAPI.updateStatus(matchId, status);
      setSuccess("Match status updated");
      await initializeAdminData();
    } catch (err) {
      setError(err.response?.data?.message || "Status update failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUploadLeaderboard = async (e) => {
    e.preventDefault();
    if (!selectedMatch || !leaderboardFile) {
      setError("Select a match and file first");
      return;
    }

    try {
      setActionLoading(true);
      await leaderboardAPI.uploadLeaderboard(selectedMatch, leaderboardRound, leaderboardFile);
      setSuccess("Leaderboard uploaded and processed");
      setLeaderboardFile(null);
      await fetchLeaderboard(selectedMatch);
    } catch (err) {
      setError(err.response?.data?.message || "Leaderboard upload failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateLeaderboard = async () => {
    if (!currentLeaderboard?.id) {
      setError("No leaderboard loaded for this match");
      return;
    }

    let parsedEntries;
    try {
      parsedEntries = JSON.parse(entriesText);
      if (!Array.isArray(parsedEntries)) {
        throw new Error("Entries must be a JSON array");
      }
    } catch (parseError) {
      setError(parseError.message || "Invalid JSON in entries");
      return;
    }

    try {
      setActionLoading(true);
      await leaderboardAPI.updateLeaderboard(currentLeaderboard.id, {
        entries: parsedEntries,
        roundNumber: Number(leaderboardRound),
      });
      setSuccess("Leaderboard updated successfully");
      await fetchLeaderboard(selectedMatch);
    } catch (err) {
      setError(err.response?.data?.message || "Leaderboard update failed");
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "slots" && selectedMatch) {
      fetchSlots(selectedMatch);
    }

    if (activeTab === "leaderboard" && selectedMatch) {
      fetchLeaderboard(selectedMatch);
    }
  }, [activeTab, selectedMatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader className="animate-spin text-orange-500" size={56} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8 md:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-wrap justify-between items-center gap-4 border border-orange-700 rounded-xl p-6 bg-gray-900">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-orange-400 flex items-center gap-3">
              <Shield size={34} /> Admin Dashboard
            </h1>
            <p className="text-gray-400 mt-2">Dedicated control center for tournaments, slots, payments, and leaderboard updates.</p>
          </div>
          <a href="/admin/login" className="text-sm text-orange-300 hover:text-orange-200">Switch admin account</a>
        </header>

        {error && (
          <div className="rounded-lg border border-red-600 bg-red-900/30 p-4 flex items-start gap-2">
            <AlertCircle size={18} className="mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="rounded-lg border border-green-600 bg-green-900/30 p-4 flex items-start gap-2">
            <CheckCircle size={18} className="mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          {[
            ["tournaments", "Host Tournament"],
            ["payments", "Review Payments"],
            ["slots", "Manage Slots"],
            ["leaderboard", "Update Leaderboard"],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => {
                setActiveTab(id);
                setError("");
                setSuccess("");
              }}
              className={`px-4 py-2 rounded-lg font-semibold ${
                activeTab === id
                  ? "bg-orange-600 text-white"
                  : "bg-gray-800 text-gray-200 border border-gray-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5 space-y-5">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Selected Match</label>
            <select
              value={selectedMatch}
              onChange={(e) => setSelectedMatch(e.target.value)}
              className="w-full max-w-xl rounded-lg bg-gray-800 border border-gray-700 px-3 py-2"
            >
              {matches.length === 0 && <option value="">No matches found</option>}
              {matches.map((m) => (
                <option key={m.id} value={m.id}>{m.name} ({m.status})</option>
              ))}
            </select>
          </div>

          {activeTab === "tournaments" && (
            <div className="grid md:grid-cols-2 gap-6">
              <form onSubmit={handleTournamentCreate} className="space-y-3">
                <h2 className="font-bold text-xl text-orange-300 flex items-center gap-2">
                  <Swords size={22} /> Host New Tournament
                </h2>
                <input
                  value={tournamentForm.name}
                  onChange={(e) => setTournamentForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2"
                  placeholder="Tournament name"
                  required
                />
                <select
                  value={tournamentForm.type}
                  onChange={(e) => setTournamentForm((prev) => ({ ...prev, type: e.target.value }))}
                  className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2"
                >
                  <option value="tournament">Tournament</option>
                  <option value="scrim">Scrim</option>
                </select>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    value={tournamentForm.entryFee}
                    onChange={(e) => setTournamentForm((prev) => ({ ...prev, entryFee: e.target.value }))}
                    className="rounded-lg bg-gray-800 border border-gray-700 px-3 py-2"
                    placeholder="Entry fee"
                    min="0"
                    required
                  />
                  <input
                    type="number"
                    value={tournamentForm.maxTeams}
                    onChange={(e) => setTournamentForm((prev) => ({ ...prev, maxTeams: e.target.value }))}
                    className="rounded-lg bg-gray-800 border border-gray-700 px-3 py-2"
                    placeholder="Max teams"
                    min="1"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    value={tournamentForm.startDate}
                    onChange={(e) => setTournamentForm((prev) => ({ ...prev, startDate: e.target.value }))}
                    className="rounded-lg bg-gray-800 border border-gray-700 px-3 py-2"
                  />
                  <input
                    type="date"
                    value={tournamentForm.endDate}
                    onChange={(e) => setTournamentForm((prev) => ({ ...prev, endDate: e.target.value }))}
                    className="rounded-lg bg-gray-800 border border-gray-700 px-3 py-2"
                  />
                </div>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="rounded-lg bg-orange-600 px-4 py-2 font-bold hover:bg-orange-500 disabled:opacity-50"
                >
                  Host Tournament
                </button>
              </form>

              <div className="space-y-3">
                <h2 className="font-bold text-xl text-orange-300">Existing Matches</h2>
                <div className="max-h-96 overflow-auto space-y-2">
                  {matches.map((m) => (
                    <div key={m.id} className="border border-gray-700 rounded-lg p-3">
                      <div className="font-semibold">{m.name}</div>
                      <div className="text-sm text-gray-400">{m.type} | {m.status} | Entry: {m.entryFee}</div>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {[
                          "registration_open",
                          "registration_closed",
                          "ongoing",
                          "completed",
                        ].map((status) => (
                          <button
                            key={status}
                            onClick={() => handleUpdateStatus(m.id, status)}
                            className="text-xs rounded bg-gray-800 border border-gray-700 px-2 py-1 hover:border-orange-500"
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "payments" && (
            <div>
              <h2 className="font-bold text-xl text-orange-300 mb-4">Pending Payments</h2>
              <div className="space-y-2">
                {pendingPayments.length === 0 && <p className="text-gray-400">No pending payments.</p>}
                {pendingPayments.map((payment) => (
                  <div key={payment.id} className="border border-gray-700 rounded-lg p-3 flex justify-between gap-3 items-start">
                    <div>
                      <div className="font-semibold">User: {payment.userId?.username || "Unknown"}</div>
                      <div className="text-sm text-gray-400">Amount: {payment.amount}</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprovePayment(payment.id)}
                        disabled={actionLoading}
                        className="rounded bg-green-700 px-3 py-1 text-sm hover:bg-green-600 disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectPayment(payment.id)}
                        disabled={actionLoading}
                        className="rounded bg-red-700 px-3 py-1 text-sm hover:bg-red-600 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "slots" && (
            <div>
              <h2 className="font-bold text-xl text-orange-300 mb-2">Slot Management</h2>
              <button
                onClick={() => fetchSlots(selectedMatch)}
                className="rounded bg-orange-600 px-4 py-2 text-sm font-semibold hover:bg-orange-500"
              >
                Refresh Slots for {selectedMatchName || "selected match"}
              </button>

              <div className="mt-4 space-y-2">
                {slots.length === 0 && <p className="text-gray-400">No slots found for selected match.</p>}
                {slots.map((reg) => (
                  <div key={reg.id} className="border border-gray-700 rounded-lg p-3 flex justify-between items-center gap-3">
                    <div>
                      <div className="font-semibold">{reg.teamId?.name || "Team"}</div>
                      <div className="text-sm text-gray-400">Current slot: {reg.slotNumber || "Unassigned"}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max="12"
                        defaultValue={reg.slotNumber || 1}
                        id={`slot-${reg.id}`}
                        className="w-20 rounded bg-gray-800 border border-gray-700 px-2 py-1"
                      />
                      <button
                        onClick={() => {
                          const input = document.getElementById(`slot-${reg.id}`);
                          const slotNumber = Number(input?.value);
                          if (!slotNumber) {
                            setError("Please enter a valid slot number");
                            return;
                          }
                          adminAPI.assignSlot(reg.id, slotNumber)
                            .then(() => {
                              setSuccess("Slot assigned");
                              fetchSlots(selectedMatch);
                            })
                            .catch((err) => setError(err.response?.data?.message || "Failed to assign slot"));
                        }}
                        className="rounded bg-blue-700 px-3 py-1 text-sm hover:bg-blue-600"
                      >
                        Assign
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "leaderboard" && (
            <div className="space-y-4">
              <h2 className="font-bold text-xl text-orange-300 flex items-center gap-2">
                <Trophy size={22} /> Upload and Update Leaderboard
              </h2>

              <form onSubmit={handleUploadLeaderboard} className="space-y-3 border border-gray-700 rounded-lg p-4">
                <h3 className="font-semibold">Upload OCR Image</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <input
                    type="number"
                    min="1"
                    value={leaderboardRound}
                    onChange={(e) => setLeaderboardRound(e.target.value)}
                    className="rounded-lg bg-gray-800 border border-gray-700 px-3 py-2"
                    placeholder="Round"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setLeaderboardFile(e.target.files?.[0] || null)}
                    className="rounded-lg bg-gray-800 border border-gray-700 px-3 py-2"
                  />
                </div>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="rounded bg-orange-600 px-4 py-2 font-semibold hover:bg-orange-500 disabled:opacity-50 flex items-center gap-2"
                >
                  <Upload size={16} /> Upload Leaderboard
                </button>
              </form>

              <div className="border border-gray-700 rounded-lg p-4 space-y-3">
                <div className="flex flex-wrap gap-2 items-center justify-between">
                  <h3 className="font-semibold">Manual Leaderboard Update</h3>
                  <button
                    onClick={() => fetchLeaderboard(selectedMatch)}
                    className="rounded bg-gray-800 border border-gray-700 px-3 py-1 text-sm"
                  >
                    Refresh Leaderboard
                  </button>
                </div>

                {!currentLeaderboard && (
                  <p className="text-gray-400">No leaderboard exists for this match yet. Upload first, then edit.</p>
                )}

                <textarea
                  value={entriesText}
                  onChange={(e) => setEntriesText(e.target.value)}
                  rows={12}
                  className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 font-mono text-sm"
                  placeholder='[ { "teamName": "Team A", "kills": 10, "placement": 1, "points": 22 } ]'
                />
                <button
                  onClick={handleUpdateLeaderboard}
                  disabled={actionLoading || !currentLeaderboard}
                  className="rounded bg-blue-700 px-4 py-2 font-semibold hover:bg-blue-600 disabled:opacity-50"
                >
                  Save Leaderboard Updates
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
