import { useEffect, useState } from "react";
import { Users, Loader, AlertCircle, Trash2 } from "lucide-react";
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
    if (!confirm("Are you sure you want to delete this team?")) return;

    try {
      await teamAPI.deleteTeam(teamId);
      fetchTeams();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete team");
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
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Users size={32} />
          My Teams
        </h1>
        <p className="text-gray-400">Manage your esports teams</p>
      </div>

      {error && (
        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {showForm && (
        <TeamForm
          onSubmit={handleCreateTeam}
          loading={loading}
        />
      )}

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary"
        >
          Create New Team
        </button>
      )}

      {teams.length === 0 ? (
        <div className="card text-center text-gray-400 py-12">
          <p className="mb-4">No teams created yet.</p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
          >
            Create Your First Team
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {teams.map((team) => (
            <div key={team._id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {team.name}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Led by: {team.leaderName}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteTeam(team._id)}
                  className="btn-danger p-2"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-300 mb-2">
                  Players ({team.players?.length || 0}):
                </p>
                <div className="space-y-1">
                  {team.players && team.players.length > 0 ? (
                    team.players.map((player, idx) => (
                      <p
                        key={idx}
                        className="text-sm text-gray-400 pl-2 border-l border-gray-600"
                      >
                        {player.name}
                        {player.role && (
                          <span className="text-gray-500"> ({player.role})</span>
                        )}
                      </p>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic">No players added</p>
                  )}
                </div>
              </div>

              <div className="text-xs text-gray-500">
                Created: {new Date(team.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
