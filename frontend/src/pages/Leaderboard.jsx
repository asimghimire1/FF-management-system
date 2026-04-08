import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader, AlertCircle } from "lucide-react";
import { leaderboardAPI } from "../services/api";
import LeaderboardTable from "../components/LeaderboardTable";
import PrizePool from "../components/PrizePool";

export default function Leaderboard() {
  const { leaderboardId } = useParams();
  const [leaderboard, setLeaderboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await leaderboardAPI.getLeaderboardById(leaderboardId);
        setLeaderboard(res.data.leaderboard);
        setError("");
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load leaderboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [leaderboardId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader className="animate-spin text-blue-400" size={40} />
      </div>
    );
  }

  if (!leaderboard) {
    return (
      <div className="card text-center text-red-400">
        <AlertCircle className="mx-auto mb-2" />
        Leaderboard not found
      </div>
    );
  }

  const totalEntries = leaderboard.entries?.length || 0;
  const totalAmount = totalEntries * 100; // Assuming 100 entry fee per team

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-4xl font-bold mb-2">Final Leaderboard</h1>
        <p className="text-gray-400">
          Generated on {new Date(leaderboard.generatedAt).toLocaleString()}
        </p>
      </div>

      {error && (
        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* Prize Pool Info */}
      <PrizePool
        totalPrizePool={leaderboard.totalPrizePool || 0}
        platformFee={leaderboard.platformFee || 0}
        prizes={leaderboard.prizeDistribution || {}}
        totalEntries={totalEntries}
        entryFee={Math.round(totalAmount / totalEntries) || 0}
      />

      {/* Leaderboard Table */}
      <LeaderboardTable
        entries={leaderboard.entries || []}
        prizes={leaderboard.prizeDistribution || {}}
      />

      {/* Additional Stats */}
      {leaderboard.roundNumber && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-3">Match Details</h3>
          <p className="text-gray-300">
            Round: <span className="text-blue-400 font-semibold">{leaderboard.roundNumber}</span>
          </p>
        </div>
      )}
    </div>
  );
}
