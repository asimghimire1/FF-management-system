import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader, AlertCircle, Upload, Flame, Target } from "lucide-react";
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
          (r) => r.matchId?.id === matchId
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
      setError("Please select a squad");
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
      alert("Squad registered! Now upload your payment screenshot.");
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
      alert("Payment screenshot received! Admin will verify shortly.");
      // Refresh registration
      const regsRes = await registrationAPI.getMyRegistrations();
      const updated = regsRes.data.registrations?.find(
        (r) => r.id === registration.id
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 flex justify-center items-center">
        <Loader className="animate-spin text-orange-400" size={60} />
      </div>
    );
  }

  if (!match) {
    return (
      <div className="bg-black/40 border-2 border-red-600 rounded-xl p-8 backdrop-blur-sm text-center">
        <AlertCircle className="mx-auto mb-4 text-red-400" size={48} />
        <p className="text-red-400 font-bold">TOURNAMENT NOT FOUND</p>
      </div>
    );
  }

  const slotsFilled = match.registrations?.length || 0;
  const maxSlots = match.maxTeams || 12;
  const slotProgress = (slotsFilled / maxSlots) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 relative overflow-hidden pb-20">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-orange-500 rounded-full mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-red-600 rounded-full mix-blend-screen animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <header className="bg-black/40 border-2 border-orange-600 rounded-xl p-8 backdrop-blur-sm">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-orange-400 hover:text-yellow-300 font-bold mb-4 flex items-center gap-2"
          >
            ← BACK TO DASHBOARD
          </button>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-yellow-400 mb-4">
            {match.name}
          </h1>
          <p className="text-gray-300">
            <span className="text-orange-300 font-bold">{match.type.toUpperCase()}</span> • {match.status === "registration_open" ? "🟢 REGISTRATION OPEN" : "🔴 REGISTRATION CLOSED"}
          </p>
        </header>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-900/80 border-2 border-red-500 text-red-200 px-6 py-4 rounded-lg flex items-start gap-3 backdrop-blur">
            <AlertCircle size={24} className="flex-shrink-0 mt-0.5 text-red-400" />
            <div>
              <p className="font-bold">ERROR</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Match Info */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-black/40 border-2 border-orange-600 rounded-lg p-4 backdrop-blur-sm">
            <p className="text-gray-400 text-xs font-bold mb-1">ENTRY FEE</p>
            <p className="text-2xl font-black text-yellow-300">{match.entryFee}</p>
          </div>
          <div className="bg-black/40 border-2 border-orange-600 rounded-lg p-4 backdrop-blur-sm">
            <p className="text-gray-400 text-xs font-bold mb-1">SQUADS JOINED</p>
            <p className="text-2xl font-black text-blue-300">{slotsFilled}/{maxSlots}</p>
          </div>
          <div className="bg-black/40 border-2 border-orange-600 rounded-lg p-4 backdrop-blur-sm">
            <p className="text-gray-400 text-xs font-bold mb-1">SLOTS AVAILABLE</p>
            <p className="text-2xl font-black text-green-300">{maxSlots - slotsFilled}</p>
          </div>
          <div className="bg-black/40 border-2 border-orange-600 rounded-lg p-4 backdrop-blur-sm">
            <p className="text-gray-400 text-xs font-bold mb-1">PRIZE POOL</p>
            <p className="text-2xl font-black text-red-300">{slotsFilled * match.entryFee}</p>
          </div>
        </div>

        {/* Slots Progress Bar */}
        <div className="bg-black/40 border-2 border-orange-600 rounded-lg p-4 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-3">
            <p className="text-orange-300 font-bold">SLOT CAPACITY</p>
            <p className="text-gray-300 text-sm">{Math.round(slotProgress)}%</p>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3 border-2 border-orange-600">
            <div
              className="bg-gradient-to-r from-orange-500 to-red-600 h-full rounded-full transition-all"
              style={{width: `${slotProgress}%`}}
            />
          </div>
        </div>

        {/* Registration Status or Form */}
        {registration ? (
          <div className="bg-black/40 border-2 border-orange-600 rounded-xl p-8 backdrop-blur-sm">
            <h2 className="text-2xl font-black text-orange-300 mb-6 flex items-center gap-2">
              <Target size={28} /> YOUR BATTLE STATUS
            </h2>

            <div className="space-y-4 mb-6">
              <div className="bg-black/50 rounded-lg p-4">
                <p className="text-gray-400 text-xs font-bold mb-1">SQUAD</p>
                <p className="text-lg font-bold text-yellow-300">
                  {registration.teamId?.name}
                </p>
              </div>

              <div className="bg-black/50 rounded-lg p-4">
                <p className="text-gray-400 text-xs font-bold mb-1">STATUS</p>
                <p
                  className={`text-lg font-bold ${
                    registration.status === "approved"
                      ? "text-green-400"
                      : registration.status === "rejected"
                      ? "text-red-400"
                      : "text-yellow-400"
                  }`}
                >
                  {registration.status.toUpperCase()}
                </p>
              </div>

              {registration.slotNumber && (
                <div className="bg-black/50 rounded-lg p-4">
                  <p className="text-gray-400 text-xs font-bold mb-1">SLOT ASSIGNMENT</p>
                  <p className="text-lg font-bold text-blue-300">
                    SLOT #{registration.slotNumber}
                  </p>
                </div>
              )}
            </div>

            {registration.status === "pending" && (
              <div className="bg-yellow-900/40 border-2 border-yellow-600 rounded-lg p-6">
                <h3 className="font-black text-yellow-300 mb-2 flex items-center gap-2 text-lg">
                  <Flame size={20} /> PAYMENT VERIFICATION REQUIRED
                </h3>
                <p className="text-yellow-200 text-sm mb-4 font-semibold">
                  Upload your payment screenshot to complete your registration and secure your slot.
                </p>
                <label className="inline-flex items-center gap-3 cursor-pointer bg-gradient-to-r from-orange-600 to-red-600 text-white font-black py-3 px-6 rounded-lg hover:shadow-lg hover:shadow-orange-500/30 transition-all border-2 border-yellow-300">
                  <Upload size={20} />
                  <span>UPLOAD PAYMENT PROOF</span>
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
          <div className="bg-black/40 border-2 border-orange-600 rounded-xl p-8 backdrop-blur-sm">
            <h2 className="text-2xl font-black text-orange-300 mb-6 flex items-center gap-2">
              <Flame size={28} /> REGISTER FOR BATTLE
            </h2>

            {match.status !== "registration_open" ? (
              <div className="text-center p-8 bg-red-900/30 border-2 border-red-600 rounded-lg">
                <AlertCircle size={48} className="mx-auto mb-4 text-red-400" />
                <p className="text-red-300 font-bold text-lg">REGISTRATION CLOSED</p>
                <p className="text-red-200 mt-2">This tournament is no longer accepting registrations.</p>
              </div>
            ) : userTeams.length === 0 ? (
              <div className="text-center p-8 bg-blue-900/30 border-2 border-blue-600 rounded-lg">
                <AlertCircle size={48} className="mx-auto mb-4 text-blue-400" />
                <p className="text-blue-300 font-bold text-lg">NO SQUAD FOUND</p>
                <p className="text-blue-200 mt-2 mb-6">You need to create a squad first before registering.</p>
                <a href="/teams" className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg">
                  GO TO SQUAD MANAGEMENT
                </a>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-6">
                <div>
                  <label className="block text-orange-300 font-black mb-3">SELECT YOUR SQUAD</label>
                  <select
                    value={selectedTeam}
                    onChange={(e) => setSelectedTeam(e.target.value)}
                    className="w-full bg-gray-800 border-2 border-orange-600 text-white px-4 py-3 rounded-lg focus:border-yellow-400 focus:outline-none transition font-semibold"
                    disabled={registering}
                  >
                    <option value="">-- CHOOSE A SQUAD --</option>
                    {userTeams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name} ({team.players?.length || 0} players)
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-black py-4 px-6 rounded-lg flex items-center justify-center gap-3 hover:shadow-xl hover:shadow-orange-500/50 transition-all transform hover:scale-105 border-2 border-yellow-300 disabled:opacity-50"
                  disabled={registering}
                >
                  {registering ? (
                    <>
                      <Loader size={20} className="animate-spin" />
                      REGISTERING...
                    </>
                  ) : (
                    <>
                      <Flame size={20} />
                      JOIN BATTLE NOW
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
