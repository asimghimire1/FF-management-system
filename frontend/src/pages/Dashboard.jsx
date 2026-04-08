import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader, AlertCircle } from "lucide-react";
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
      <div className="flex justify-center items-center py-12">
        <Loader className="animate-spin text-blue-400" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome, {user?.username}!</h1>
        <p className="text-gray-400">Manage your teams and tournament registrations</p>
      </div>

      {error && (
        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* Your Registrations */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Your Registrations</h2>
        </div>

        {registrations.length === 0 ? (
          <div className="card text-center text-gray-400 py-8">
            <p>No registrations yet.</p>
            <Link to="#available" className="text-blue-400 hover:text-blue-300">
              Browse available matches
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {registrations.map((reg) => (
              <div key={reg._id} className="card">
                <h3 className="text-lg font-semibold mb-2">
                  {reg.matchId?.name}
                </h3>
                <p className="text-sm text-gray-400 mb-3">
                  Team: {reg.teamId?.name}
                </p>
                <div className="space-y-2 text-sm">
                  <p>
                    Status:{" "}
                    <span
                      className={`font-semibold ${
                        reg.status === "approved"
                          ? "text-green-400"
                          : reg.status === "rejected"
                          ? "text-red-400"
                          : "text-yellow-400"
                      }`}
                    >
                      {reg.status}
                    </span>
                  </p>
                  {reg.slotNumber && (
                    <p>
                      Slot:{" "}
                      <span className="text-blue-400 font-semibold">
                        #{reg.slotNumber}
                      </span>
                    </p>
                  )}
                </div>
                <Link
                  to={`/matches/${reg.matchId?._id}`}
                  className="btn-secondary mt-4 w-full text-center"
                >
                  View Match
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Available Matches */}
      <section id="available">
        <h2 className="text-2xl font-bold mb-4">Available Matches</h2>

        {availableMatches.length === 0 ? (
          <div className="card text-center text-gray-400 py-8">
            No available matches at this time.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableMatches.map((match) => (
              <MatchCard key={match._id} match={match} />
            ))}
          </div>
        )}
      </section>

      {/* Quick Links */}
      <section className="flex gap-4">
        <Link to="/teams" className="btn-primary">
          Manage Teams
        </Link>
        <Link to="/" className="btn-secondary">
          Back to Home
        </Link>
      </section>
    </div>
  );
}
