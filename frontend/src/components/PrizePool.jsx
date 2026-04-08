import { DollarSign, TrendingUp } from "lucide-react";

// Props: { totalPrizePool, platformFee, prizes, totalEntries, entryFee }
export default function PrizePool({
  totalPrizePool = 0,
  platformFee = 0,
  prizes = { 1: 0, 2: 0, 3: 0 },
  totalEntries = 0,
  entryFee = 0,
}) {
  const totalAmount = totalEntries * entryFee;

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <TrendingUp size={20} className="text-yellow-400" />
        Prize Distribution
      </h3>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-gray-700 p-4 rounded">
            <p className="text-xs text-gray-400 mb-1">Total Entries</p>
            <p className="text-2xl font-bold text-white">{totalEntries}</p>
            <p className="text-xs text-gray-400 mt-1">@ {entryFee} each</p>
          </div>

          <div className="bg-gray-700 p-4 rounded">
            <p className="text-xs text-gray-400 mb-1">Total Collection</p>
            <p className="text-2xl font-bold text-blue-400">
              {totalAmount}
            </p>
          </div>

          <div className="bg-gray-700 p-4 rounded">
            <p className="text-xs text-gray-400 mb-1">Prize Pool</p>
            <p className="text-2xl font-bold text-green-400">
              {totalPrizePool}
            </p>
          </div>
        </div>

        {platformFee > 0 && (
          <div className="bg-red-900 bg-opacity-30 border border-red-800 rounded p-3">
            <p className="text-sm text-red-300">
              Platform Fee: <span className="font-semibold">{platformFee}</span> (
              {totalAmount > 0
                ? ((platformFee / totalAmount) * 100).toFixed(1)
                : 0}
              %)
            </p>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-300">Prize Breakdown:</p>

          {[1, 2, 3].map((place) => {
            const amount = prizes[place] || 0;
            const percentage =
              totalPrizePool > 0 ? ((amount / totalPrizePool) * 100).toFixed(1) : 0;

            return (
              <div
                key={place}
                className="flex items-center justify-between p-3 bg-gray-700 rounded"
              >
                <div className="flex items-center gap-2">
                  {place === 1 && <span className="text-2xl">🥇</span>}
                  {place === 2 && <span className="text-2xl">🥈</span>}
                  {place === 3 && <span className="text-2xl">🥉</span>}
                  <span className="text-gray-300">
                    {place === 1 && "1st Place"}
                    {place === 2 && "2nd Place"}
                    {place === 3 && "3rd Place"}
                  </span>
                </div>

                <div className="text-right">
                  <p className="text-white font-bold flex items-center gap-1">
                    <DollarSign size={16} />
                    {amount}
                  </p>
                  <p className="text-xs text-gray-400">{percentage}%</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
