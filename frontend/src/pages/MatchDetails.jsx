import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader, AlertCircle, Upload } from "lucide-react";
import useStore from "../store/useStore";
import {
  matchAPI,
  registrationAPI,
  paymentAPI,
  teamAPI,
} from "../services/api";

export default function MatchDetails() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const { user } = useStore();

  const [match, setMatch] = useState(null);
  const [userTeams, setUserTeams] = useState([]);
  const [registration, setRegistration] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [registering, setRegistering] = useState(false);
  const [uploadingPayment, setUploadingPayment] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const matchRes = await matchAPI.getMatchById(matchId);
        setMatch(matchRes.data.match);

        const teamsRes = await teamAPI.getMyTeams();
        setUserTeams(teamsRes.data.teams || []);

        // Check if user already registered
        const regsRes = await registrationAPI.getMyRegistrations();
        const userReg = regsRes.data.registrations?.find(
          (r) => r.matchId?._id === matchId
        );
        if (userReg) {
          setRegistration(userReg);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load match details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [matchId]);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!selectedTeam) {
      setError("Please select a team");
      return;
    }

    try {
      setRegistering(true);
      const res = await registrationAPI.registerForMatch(
        selectedTeam,
        matchId
      );
      setRegistration(res.data.registration);
      setError("");
      alert("Registered! Please upload payment screenshot.");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setRegistering(false);
    }
  };

  const handlePaymentUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !registration?.paymentId) return;

    try {
      setUploadingPayment(true);
      await paymentAPI.uploadScreenshot(registration.paymentId, file);
      setError("");
      alert("Payment screenshot uploaded! Waiting for admin approval.");
      // Refresh registration
      const regsRes = await registrationAPI.getMyRegistrations();
      const updated = regsRes.data.registrations?.find(
        (r) => r._id === registration._id
      );
      if (updated) setRegistration(updated);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setUploadingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader className="animate-spin text-blue-400" size={40} />
      </div>
    );
  }

  if (!match) {
    return (
      <div className="card text-center text-red-400">
        Match not found
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {error && (
        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* Match Info */}
      <div className="card">
        <h1 className="text-3xl font-bold mb-4">{match.name}</h1>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-gray-400 text-sm">Type</p>
            <p className="text-lg font-semibold text-white capitalize">
              {match.type}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Status</p>
            <p className={`text-lg font-semibold capitalize ${
              match.status === "registration_open"
                ? "text-green-400"
                : "text-red-400"
            }`}>
              {match.status}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Entry Fee</p>
            <p className="text-lg font-semibold text-yellow-400">
              {match.entryFee}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Team Slots</p>
            <p className="text-lg font-semibold text-blue-400">
              {match.registrations?.length || 0} / {match.maxTeams || 12}
            </p>
          </div>
        </div>

        <div className="w-full bg-gray-700 rounded h-2">
          <div
            className="bg-blue-500 h-full rounded transition-all"
            style={{
              width: `${((match.registrations?.length || 0) / (match.maxTeams || 12)) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Registration Status or Form */}
      {registration ? (
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Your Registration</h2>

          <div className="space-y-3 mb-4">
            <div>
              <p className="text-gray-400 text-sm">Team</p>
              <p className="text-lg font-semibold text-white">
                {registration.teamId?.name}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Status</p>
              <p
                className={`text-lg font-semibold capitalize ${
                  registration.status === "approved"
                    ? "text-green-400"
                    : registration.status === "rejected"
                    ? "text-red-400"
                    : "text-yellow-400"
                }`}
              >
                {registration.status}
              </p>
            </div>

            {registration.slotNumber && (
              <div>
                <p className="text-gray-400 text-sm">Assigned Slot</p>
                <p className="text-lg font-semibold text-blue-400">
                  Slot #{registration.slotNumber}
                </p>
              </div>
            )}
          </div>

          {registration.status === "pending" && (
            <div className="bg-yellow-900 bg-opacity-30 border border-yellow-800 rounded p-4">
              <h3 className="font-semibold text-yellow-300 mb-2">
                Payment Required
              </h3>
              <p className="text-sm text-yellow-200 mb-4">
                Upload your payment screenshot to complete registration.
              </p>
              <label className="flex items-center gap-2 cursor-pointer">
                <Upload size={20} />
                <span>Choose Screenshot</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePaymentUpload}
                  disabled={uploadingPayment}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>
      ) : (
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Register for Match</h2>

          {match.status !== "registration_open" ? (
            <p className="text-red-400">Registration is closed for this match</p>
          ) : userTeams.length === 0 ? (
            <p className="text-gray-400">
              You need to create a team first.{" "}
              <a href="/teams" className="text-blue-400 hover:text-blue-300">
                Go to Teams
              </a>
            </p>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="label">Select Team</label>
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="input"
                  disabled={registering}
                >
                  <option value="">-- Choose a team --</option>
                  {userTeams.map((team) => (
                    <option key={team._id} value={team._id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="btn-primary w-full"
                disabled={registering}
              >
                {registering ? "Registering..." : "Register Now"}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
