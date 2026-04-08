import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

// Props: { onSubmit, loading }
export default function TeamForm({ onSubmit, loading = false }) {
  const [name, setName] = useState("");
  const [leaderName, setLeaderName] = useState("");
  const [players, setPlayers] = useState([{ name: "", role: "" }]);
  const [error, setError] = useState("");

  const handleAddPlayer = () => {
    setPlayers([...players, { name: "", role: "" }]);
  };

  const handleRemovePlayer = (index) => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  const handlePlayerChange = (index, field, value) => {
    const newPlayers = [...players];
    newPlayers[index][field] = value;
    setPlayers(newPlayers);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Team name is required");
      return;
    }

    if (!leaderName.trim()) {
      setError("Team leader name is required");
      return;
    }

    const validPlayers = players.filter((p) => p.name.trim());
    if (validPlayers.length === 0) {
      setError("Add at least one player");
      return;
    }

    onSubmit({
      name: name.trim(),
      leaderName: leaderName.trim(),
      players: validPlayers,
    });

    setName("");
    setLeaderName("");
    setPlayers([{ name: "", role: "" }]);
  };

  return (
    <form onSubmit={handleSubmit} className="card max-w-2xl">
      <h3 className="text-xl font-semibold mb-4">Create New Team</h3>

      {error && (
        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="label">Team Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
          placeholder="e.g., Alpha Squad"
          disabled={loading}
        />
      </div>

      <div className="mb-4">
        <label className="label">Team Leader</label>
        <input
          type="text"
          value={leaderName}
          onChange={(e) => setLeaderName(e.target.value)}
          className="input"
          placeholder="e.g., John Doe"
          disabled={loading}
        />
      </div>

      <div className="mb-4">
        <label className="label">Players</label>
        <div className="space-y-2">
          {players.map((player, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={player.name}
                onChange={(e) =>
                  handlePlayerChange(index, "name", e.target.value)
                }
                className="input flex-1"
                placeholder="Player name"
                disabled={loading}
              />
              <input
                type="text"
                value={player.role}
                onChange={(e) =>
                  handlePlayerChange(index, "role", e.target.value)
                }
                className="input flex-1"
                placeholder="Role (Player/IGL)"
                disabled={loading}
              />
              {players.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemovePlayer(index)}
                  className="btn-danger"
                  disabled={loading}
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddPlayer}
          className="btn-secondary mt-2 flex items-center gap-2"
          disabled={loading}
        >
          <Plus size={18} />
          Add Player
        </button>
      </div>

      <button
        type="submit"
        className="btn-primary w-full"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Team"}
      </button>
    </form>
  );
}
