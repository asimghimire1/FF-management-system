import { Link } from "react-router-dom";
import { Users, DollarSign, Trophy, Flame } from "lucide-react";

// Props: { match }
// Example: { id, name, type, entryFee, maxTeams, status, registrations }
export default function MatchCard({ match }) {
  if (!match) return null;

  const registrationCount = match.registrations?.length || 0;
  const isFull = registrationCount >= (match.maxTeams || 12);
  const isOpen = match.status === "registration_open";

  return (
    <div className="bg-black/40 border-2 border-orange-600 rounded-lg p-5 backdrop-blur-sm hover:border-yellow-400 transition-all transform hover:scale-105 hover:shadow-xl hover:shadow-orange-500/20">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-black text-orange-300">{match.name}</h3>
          <p className="text-xs text-gray-400 mt-1 font-bold uppercase">
            {match.type === "scrim" ? "⚡ SCRIM" : "🏆 TOURNAMENT"}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded text-xs font-black uppercase ${
            isOpen
              ? "bg-green-900/80 text-green-300 border border-green-600"
              : "bg-red-900/80 text-red-300 border border-red-600"
          }`}
        >
          {match.status === "registration_open" ? "🟢 OPEN" : "🔴 CLOSED"}
        </span>
      </div>

      <div className="space-y-2 mb-4 bg-black/50 rounded-lg p-3">
        <div className="flex items-center gap-3 text-gray-300">
          <DollarSign size={16} className="text-yellow-400" />
          <span className="text-sm font-bold">Entry Fee: <span className="text-yellow-300">{match.entryFee}</span></span>
        </div>
        <div className="flex items-center gap-3 text-gray-300">
          <Users size={16} className="text-blue-400" />
          <span className="text-sm font-bold">
            Teams: <span className="text-blue-300">{registrationCount}/{match.maxTeams || 12}</span>
          </span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs text-gray-400 font-bold mb-1">SLOT CAPACITY</p>
        <div className="w-full bg-gray-800 rounded-full h-2 border border-orange-600">
          <div
            className="bg-gradient-to-r from-orange-500 to-red-600 h-full rounded-full transition-all"
            style={{
              width: `${(registrationCount / (match.maxTeams || 12)) * 100}%`,
            }}
          />
        </div>
      </div>

      {isFull && (
        <p className="text-xs text-orange-400 font-black mb-3 flex items-center gap-1">
          <Flame size={14} /> TOURNAMENT FULL
        </p>
      )}

      <Link
        to={`/matches/${match.id}`}
        className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold py-2 px-4 rounded text-center hover:shadow-lg hover:shadow-orange-500/30 transition-all transform hover:scale-105 block"
      >
        VIEW MATCH
      </Link>
    </div>
  );
}
