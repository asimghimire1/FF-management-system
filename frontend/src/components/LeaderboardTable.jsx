import { Trophy, Zap } from "lucide-react";

// Props: { entries, prizes }
// Example entries: [{ teamName, kills, placement, points }, ...]
export default function LeaderboardTable({ entries = [], prizes = {} }) {
  if (!entries || entries.length === 0) {
    return (
      <div className="card text-center text-gray-400 py-8">
        No leaderboard data available yet
      </div>
    );
  }

  const getMedalIcon = (placement) => {
    if (placement === 1) return "🥇";
    if (placement === 2) return "🥈";
    if (placement === 3) return "🥉";
    return null;
  };

  const getPrize = (placement) => {
    return prizes?.[placement] || 0;
  };

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Trophy size={24} className="text-yellow-400" />
        Final Leaderboard
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-4 text-gray-300 font-medium">Placement</th>
              <th className="text-left py-3 px-4 text-gray-300 font-medium">Team Name</th>
              <th className="text-right py-3 px-4 text-gray-300 font-medium">
                <span className="flex items-center gap-1 justify-end">
                  <Zap size={16} /> Kills
                </span>
              </th>
              <th className="text-right py-3 px-4 text-gray-300 font-medium">Points</th>
              <th className="text-right py-3 px-4 text-gray-300 font-medium">Prize</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, idx) => {
              const isTopThree = entry.placement <= 3;
              return (
                <tr
                  key={idx}
                  className={`border-b border-gray-700 transition ${
                    isTopThree ? "bg-gray-700" : ""
                  }`}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {getMedalIcon(entry.placement) && (
                        <span className="text-lg">{getMedalIcon(entry.placement)}</span>
                      )}
                      <span className="font-semibold">{entry.placement}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-white font-medium">
                    {entry.teamName}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-300">
                    {entry.kills}
                  </td>
                  <td className="py-3 px-4 text-right text-blue-300 font-semibold">
                    {Math.round(entry.points || 0)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {getPrize(entry.placement) > 0 ? (
                      <span className="text-green-400 font-semibold">
                        {getPrize(entry.placement)}
                      </span>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
