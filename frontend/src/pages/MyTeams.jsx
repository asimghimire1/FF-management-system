import { useEffect, useState } from "react";
import { Users, Loader, AlertCircle, Trash2, Plus, Crown } from "lucide-react";
import { teamAPI } from "../services/api";
import TeamForm from "../components/TeamForm";

export default function MyTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await teamAPI.getMyTeams();
      setTeams(response.data.teams || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load teams");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (teamData) => {
    try {
      await teamAPI.createTeam(teamData.name, teamData.leaderName, teamData.players);
      setShowForm(false);
      fetchTeams();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create team");
    }
  };

  const handleDeleteTeam = async (teamId) => {
    if (!confirm("Are you sure you want to delete this squad? This cannot be undone.")) return;

    try {
      await teamAPI.deleteTeam(teamId);
      fetchTeams();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete team");
    }
  };

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
                <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg border-2 border-yellow-400">
                  <Users size={32} className="text-yellow-300" />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-yellow-400">
                    SQUAD MANAGEMENT
                  </h1>
                  <p className="text-orange-300 text-sm font-bold">Build and manage your teams</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 space-y-8">
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

          {/* Team Form or Create Button */}
          {showForm ? (
            <div>
              <TeamForm
                onSubmit={handleCreateTeam}
                loading={loading}
              />
              <button
                onClick={() => setShowForm(false)}
                className="mt-4 bg-gray-800 border-2 border-orange-500 text-orange-300 hover:border-yellow-400 font-bold py-2 px-6 rounded-lg transition-all"
              >
                CANCEL
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-orange-500 to-red-600 text-white font-black py-3 px-8 rounded-lg flex items-center gap-2 hover:shadow-xl hover:shadow-orange-500/50 transition-all transform hover:scale-105 border-2 border-yellow-300"
            >
              <Plus size={20} />
              CREATE NEW SQUAD
            </button>
          )}

          {/* Teams Grid */}
          {teams.length === 0 ? (
            <div className="bg-black/40 border-2 border-orange-600 rounded-xl p-12 backdrop-blur-sm text-center">
              <Users size={64} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-300 text-lg font-bold mb-2">NO SQUADS YET</p>
              <p className="text-gray-400 mb-8">Create your first squad to start competing in tournaments</p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white font-black py-3 px-8 rounded-lg hover:shadow-xl hover:shadow-orange-500/50 transition-all transform hover:scale-105 border-2 border-yellow-300"
              >
                <Plus size={20} />
                CREATE YOUR FIRST SQUAD
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className="bg-black/40 border-2 border-orange-600 rounded-lg p-6 backdrop-blur-sm hover:border-yellow-400 transition-all transform hover:scale-105 hover:shadow-xl hover:shadow-orange-500/20"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-black text-orange-300">
                        {team.name}
                      </h3>
                      <p className="text-sm text-gray-400 mt-2 flex items-center gap-2">
                        <Crown size={14} className="text-yellow-400" />
                        Led by: <span className="text-yellow-300 font-bold">{team.leaderName}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteTeam(team.id)}
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition-all transform hover:scale-110"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="mb-4 bg-black/50 rounded-lg p-4">
                    <p className="text-sm font-bold text-orange-300 mb-3 flex items-center gap-2">
                      <Users size={14} />
                      PLAYERS ({team.players?.length || 0})
                    </p>
                    <div className="space-y-2">
                      {team.players && team.players.length > 0 ? (
                        team.players.map((player, idx) => (
                          <p
                            key={idx}
                            className="text-sm text-gray-300 pl-3 border-l-2 border-orange-500"
                          >
                            {player.name}
                            {player.role && (
                              <span className="text-gray-500 text-xs ml-2">({player.role})</span>
                            )}
                          </p>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 italic">No players added yet</p>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 border-t border-orange-600 pt-3">
                    Created: {new Date(team.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
