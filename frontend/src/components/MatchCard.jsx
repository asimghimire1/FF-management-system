import { Link } from "react-router-dom";
import { Users, DollarSign, Trophy } from "lucide-react";

// Props: { match }
// Example: { _id, name, type, entryFee, maxTeams, status, registrations }
export default function MatchCard({ match }) {
  if (!match) return null;

  const registrationCount = match.registrations?.length || 0;
  const isFull = registrationCount >= (match.maxTeams || 12);
  const isOpen = match.status === "registration_open";

  return (
    <div className="card hover:border-gray-600 transition">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-white">{match.name}</h3>
          <p className="text-sm text-gray-400 mt-1">
            {match.type === "scrim" ? "Scrim" : "Tournament"}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded text-sm font-medium ${
            isOpen
              ? "bg-green-900 text-green-200"
              : "bg-red-900 text-red-200"
          }`}
        >
          {match.status === "registration_open" ? "Open" : "Closed"}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-3 text-gray-300">
          <DollarSign size={16} className="text-yellow-400" />
          <span>Entry: {match.entryFee}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-300">
          <Users size={16} className="text-blue-400" />
          <span>
            {registrationCount} / {match.maxTeams || 12} Teams
          </span>
        </div>
      </div>

      <div className="w-full bg-gray-700 rounded h-2 mb-4">
        <div
          className="bg-blue-500 h-full rounded transition-all"
          style={{
            width: `${(registrationCount / (match.maxTeams || 12)) * 100}%`,
          }}
        />
      </div>

      {isFull && (
        <p className="text-sm text-orange-400 mb-4">Match is full</p>
      )}

      <Link
        to={`/matches/${match._id}`}
        className="btn-primary w-full text-center"
      >
        View Details
      </Link>
    </div>
  );
}
