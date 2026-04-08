import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader, AlertCircle, Flame, Trophy, Users } from "lucide-react";
import useStore from "../store/useStore";
import { matchAPI, registrationAPI } from "../services/api";
import MatchCard from "../components/MatchCard";

export default function Dashboard() {
  const { user } = useStore();
  const [matches, setMatches] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [matchesRes, regsRes] = await Promise.all([
          matchAPI.getAllMatches(),
          registrationAPI.getMyRegistrations(),
        ]);
        setMatches(matchesRes.data.matches || []);
        setRegistrations(regsRes.data.registrations || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const myRegIds = registrations.map((r) => r.matchId?._id);
  const availableMatches = matches.filter((m) => !myRegIds.includes(m._id));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 flex justify-center items-center">
        <Loader className="animate-spin text-orange-400" size={60} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 relative overflow-hidden pb-20">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 right-20 w-96 h-96 bg-orange-500 rounded-full mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-red-600 rounded-full mix-blend-screen animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b-4 border-orange-600 backdrop-blur-sm bg-black/50 sticky top-0 z-20">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Trophy size={40} className="text-orange-500" />
                <div>
                  <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-yellow-400">
                    PLAYER BATTLEGROUND
                  </h1>
                  <p className="text-orange-300 text-sm font-bold">Welcome, {user?.username}!</p>
                </div>
              </div>
              <div className="text-right hidden md:block">
                <p className="text-orange-500 text-2xl font-bold">●</p>
                <p className="text-gray-400 text-xs">CONNECTED</p>
              </div>
            </div>
          </div>
        </header>

        {/* Error Alert */}
        {error && (
          <div className="container mx-auto px-4 mt-6">
            <div className="bg-red-900/80 border-2 border-red-500 text-red-200 px-6 py-4 rounded-lg flex items-start gap-3 backdrop-blur">
              <AlertCircle size={24} className="flex-shrink-0 mt-0.5 text-red-400" />
              <div>
                <p className="font-bold">ERROR LOADING DATA</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="container mx-auto px-4 py-8 space-y-8">
          {/* Your Registrations */}
          <section>
            <div className="mb-6">
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300 flex items-center gap-3 mb-2">
                <Flame size={32} /> YOUR BATTLES
              </h2>
              <p className="text-gray-400 text-sm">Active registrations and tournament status</p>
            </div>

            {registrations.length === 0 ? (
              <div className="bg-black/40 border-2 border-orange-600 rounded-xl p-8 backdrop-blur-sm text-center">
                <Trophy size={48} className="mx-auto text-gray-600 mb-4" />
                <p className="text-gray-300 text-lg font-bold mb-2">NO ACTIVE BATTLES YET</p>
                <p className="text-gray-400 mb-6">Register for tournaments to see your battles here</p>
                <Link
                  to="#available"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white font-black py-3 px-8 rounded-lg hover:shadow-xl hover:shadow-orange-500/50 transition-all transform hover:scale-105 border-2 border-yellow-300"
                >
                  <Flame size={20} />
                  FIND TOURNAMENTS
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {registrations.map((reg) => (
                  <div
                    key={reg.id}
                    className="bg-black/40 border-2 border-orange-600 rounded-lg p-6 backdrop-blur-sm hover:border-yellow-400 transition-all transform hover:scale-105 hover:shadow-xl hover:shadow-orange-500/20"
                  >
                    <h3 className="text-lg font-black text-orange-300 mb-3">
                      {reg.matchId?.name || "Unknown Match"}
                    </h3>
                    <div className="space-y-2 mb-4 text-sm">
                      <p className="text-gray-300">
                        Squad: <span className="text-yellow-300 font-bold">{reg.teamId?.name}</span>
                      </p>
                      <p className="text-gray-300">
                        Status:{" "}
                        <span
                          className={`font-bold ${
                            reg.status === "approved"
                              ? "text-green-400"
                              : reg.status === "rejected"
                              ? "text-red-400"
                              : "text-yellow-400"
                          }`}
                        >
                          {reg.status.toUpperCase()}
                        </span>
                      </p>
                      {reg.slotNumber && (
                        <p className="text-gray-300">
                          Slot: <span className="text-blue-300 font-bold">#{reg.slotNumber}</span>
                        </p>
                      )}
                    </div>
                    <Link
                      to={`/matches/${reg.matchId?.id}`}
                      className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold py-2 px-4 rounded text-center hover:shadow-lg hover:shadow-orange-500/30 transition-all transform hover:scale-105"
                    >
                      VIEW BATTLE
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Available Matches */}
          <section id="available">
            <div className="mb-6">
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300 flex items-center gap-3 mb-2">
                <Flame size={32} /> AVAILABLE TOURNAMENTS
              </h2>
              <p className="text-gray-400 text-sm">All active matches available for registration</p>
            </div>

            {availableMatches.length === 0 ? (
              <div className="bg-black/40 border-2 border-orange-600 rounded-xl p-8 backdrop-blur-sm text-center">
                <Trophy size={48} className="mx-auto text-gray-600 mb-4" />
                <p className="text-gray-300 text-lg font-bold">NO TOURNAMENTS AVAILABLE</p>
                <p className="text-gray-400">Check back soon for new battles!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableMatches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            )}
          </section>

          {/* Quick Actions */}
          <section className="flex gap-4 flex-wrap justify-center py-8">
            <Link
              to="/teams"
              className="bg-gradient-to-r from-orange-500 to-red-600 text-white font-black py-4 px-8 rounded-lg flex items-center gap-2 hover:shadow-xl hover:shadow-orange-500/50 transition-all transform hover:scale-105 border-2 border-yellow-300"
            >
              <Users size={20} />
              MANAGE SQUADS
            </Link>
            <Link
              to="/"
              className="bg-gray-800 border-2 border-orange-500 text-orange-300 hover:border-yellow-400 font-black py-4 px-8 rounded-lg transition-all transform hover:scale-105"
            >
              BACK TO HOME
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
