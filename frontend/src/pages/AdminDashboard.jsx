import { useEffect, useState } from "react";
import { Loader, AlertCircle, CheckCircle, Trash2 } from "lucide-react";
import { paymentAPI, adminAPI, leaderboardAPI } from "../services/api";
import OCRUpload from "../components/OCRUpload";
import SlotAssignment from "../components/SlotAssignment";

export default function AdminDashboard() {
  const [pendingPayments, setPendingPayments] = useState([]);
  const [slots, setSlots] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchPendingPayments();
  }, []);

  const fetchPendingPayments = async () => {
    try {
      setLoading(true);
      const res = await paymentAPI.getAllPendingPayments();
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
        pendingPayments.filter((p) => p._id !== paymentId)
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
        pendingPayments.filter((p) => p._id !== paymentId)
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
      <div className="flex justify-center items-center py-12">
        <Loader className="animate-spin text-blue-400" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">Manage payments, slots, and leaderboards</p>
      </div>

      {error && (
        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* Pending Payments */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Pending Payments ({pendingPayments.length})</h2>

        {pendingPayments.length === 0 ? (
          <div className="card text-center text-gray-400 py-8">
            No pending payments
          </div>
        ) : (
          <div className="space-y-3">
            {pendingPayments.map((payment) => (
              <div key={payment._id} className="card flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-semibold text-white">
                    {payment.userId?.username}
                  </p>
                  <p className="text-sm text-gray-400">
                    {payment.registrationId?.teamId?.name}
                  </p>
                  <p className="text-sm text-yellow-400 mt-1">
                    Amount: {payment.amount}
                  </p>
                  {payment.screenshotUrl && (
                    <a
                      href={payment.screenshotUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 text-sm hover:text-blue-300"
                    >
                      View Screenshot
                    </a>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprovePayment(payment._id)}
                    className="btn-primary flex items-center gap-2"
                    disabled={actionLoading}
                  >
                    <CheckCircle size={16} />
                    Approve
                  </button>
                  <button
                    onClick={() => handleRejectPayment(payment._id)}
                    className="btn-danger flex items-center gap-2"
                    disabled={actionLoading}
                  >
                    <Trash2 size={16} />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Slot Management */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Slot Management</h2>

        <div className="mb-4">
          <label className="label">Select Match</label>
          <select
            value={selectedMatch || ""}
            onChange={(e) => e.target.value && fetchSlots(e.target.value)}
            className="input max-w-xs"
          >
            <option value="">-- Choose a match --</option>
            {[...new Set(pendingPayments.map(p => p.registrationId?.matchId))].map((match) => (
              match && (
                <option key={match._id} value={match._id}>
                  {match.name}
                </option>
              )
            ))}
          </select>
        </div>

        {selectedMatch && slots.length > 0 && (
          <SlotAssignment
            slots={slots}
            onAssignSlot={handleAssignSlot}
            loading={actionLoading}
          />
        )}
      </section>

      {/* OCR Upload */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Upload Leaderboard</h2>
        <div className="grid md:grid-cols-1 gap-4">
          <div>
            <label className="label mb-3 block">Select Match ID</label>
            <input
              type="text"
              placeholder="Match ID"
              className="input max-w-xs mb-4"
              id="match-id-input"
            />
            <OCRUpload
              matchId={document.getElementById("match-id-input")?.value || ""}
              roundNumber={1}
              onSuccess={handleOCRUpload}
              loading={actionLoading}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
