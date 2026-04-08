import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader, AlertCircle, Trophy, Flame } from "lucide-react";
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 flex justify-center items-center">
        <Loader className="animate-spin text-orange-400" size={60} />
      </div>
    );
  }

  if (!leaderboard) {
    return (
      <div className="bg-black/40 border-2 border-red-600 rounded-xl p-8 backdrop-blur-sm text-center">
        <AlertCircle className="mx-auto mb-4 text-red-400" size={48} />
        <p className="text-red-400 font-bold text-lg">LEADERBOARD NOT FOUND</p>
      </div>
    );
  }

  const totalEntries = leaderboard.entries?.length || 0;
  const totalAmount = totalEntries * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 relative overflow-hidden pb-20">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-orange-500 rounded-full mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-red-600 rounded-full mix-blend-screen animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative z-10 space-y-8 max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="text-center">
          <div className="inline-block p-4 bg-gradient-to-r from-orange-600 to-red-600 rounded-full border-2 border-yellow-400 mb-6">
            <Trophy size={64} className="text-yellow-300" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-yellow-300 to-red-400 mb-4 drop-shadow-lg">
            FINAL RESULTS
          </h1>
          <p className="text-orange-300 font-bold">
            ●●●●●
          </p>
          <p className="text-gray-300 mt-2">
            Generated on {new Date(leaderboard.generatedAt || Date.now()).toLocaleString()}
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

        {/* Prize Pool Info */}
        <PrizePool
          totalPrizePool={leaderboard.totalPrizePool || totalAmount * 0.834}
          platformFee={leaderboard.platformFee || totalAmount * 0.166}
          prizes={leaderboard.prizeDistribution || {}}
          totalEntries={totalEntries}
          entryFee={Math.round(totalAmount / totalEntries) || 100}
        />

        {/* Leaderboard Table */}
        <div className="bg-black/40 border-2 border-orange-600 rounded-xl p-8 backdrop-blur-sm">
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300 mb-6 flex items-center gap-3">
            <Flame size={32} /> BATTLE STANDINGS
          </h2>
          <LeaderboardTable
            entries={leaderboard.entries || []}
            prizes={leaderboard.prizeDistribution || {}}
          />
        </div>

        {/* Match Details */}
        {leaderboard.roundNumber && (
          <div className="bg-black/40 border-2 border-orange-600 rounded-xl p-8 backdrop-blur-sm">
            <h3 className="text-xl font-black text-orange-300 mb-4 flex items-center gap-2">
              <Trophy size={24} /> BATTLE INFORMATION
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-black/50 rounded-lg p-4">
                <p className="text-gray-400 text-xs font-bold mb-1">ROUND</p>
                <p className="text-2xl font-black text-blue-300">{leaderboard.roundNumber}</p>
              </div>
              <div className="bg-black/50 rounded-lg p-4">
                <p className="text-gray-400 text-xs font-bold mb-1">TOTAL TEAMS</p>
                <p className="text-2xl font-black text-green-300">{totalEntries}</p>
              </div>
              <div className="bg-black/50 rounded-lg p-4">
                <p className="text-gray-400 text-xs font-bold mb-1">GENERATED AT</p>
                <p className="text-lg font-black text-orange-300">{new Date(leaderboard.generatedAt || Date.now()).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
