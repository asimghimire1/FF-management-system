import { Link } from "react-router-dom";
import { Trophy, Users, Zap, TrendingUp, ArrowRight, Flame, Target, Sword } from "lucide-react";
import useStore from "../store/useStore";

export default function Landing() {
  const { isAuthenticated } = useStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 right-40 w-96 h-96 bg-orange-500 rounded-full mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-40 left-20 w-96 h-96 bg-red-600 rounded-full mix-blend-screen animate-pulse" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-yellow-500 rounded-full mix-blend-screen animate-pulse" style={{animationDelay: '0.75s'}}></div>
      </div>

      <div className="relative z-10 space-y-20">
        {/* Hero Section */}
        <section className="text-center py-20 px-4 pt-32">
          <div className="mb-8 animate-fade-in">
            <div className="inline-block p-4 bg-gradient-to-r from-orange-600 to-red-600 rounded-full mb-6 border-2 border-yellow-400 shadow-lg shadow-orange-500/50">
              <Trophy size={80} className="text-yellow-300" />
            </div>
            <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-yellow-300 to-red-400 mb-6 drop-shadow-lg">
              FREE FIRE TOURNAMENT MASTER
            </h1>
            <p className="text-2xl font-bold text-orange-300 mb-4">●●●●●</p>
            <p className="text-xl text-yellow-200 mb-8 max-w-3xl mx-auto leading-relaxed font-semibold">
              Command your esports battlefield. Manage scrims, tournaments, payments, and prizes with precision. Win battles, dominate tournaments.
            </p>
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="bg-gradient-to-r from-orange-500 to-red-600 text-white font-black py-4 px-10 text-lg flex items-center gap-3 rounded-lg hover:shadow-xl hover:shadow-orange-500/50 transition-all transform hover:scale-105 border-2 border-yellow-300"
              >
                <Flame size={24} />
                ENTER ARENA
                <ArrowRight size={20} />
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-orange-500 to-red-600 text-white font-black py-4 px-10 text-lg flex items-center gap-3 rounded-lg hover:shadow-xl hover:shadow-orange-500/50 transition-all transform hover:scale-105 border-2 border-yellow-300"
                >
                  <Flame size={24} />
                  JOIN NOW
                  <ArrowRight size={20} />
                </Link>
                <Link
                  to="/login"
                  className="bg-gray-800 border-2 border-orange-500 text-orange-300 hover:border-yellow-400 font-black py-4 px-10 text-lg flex items-center gap-2 rounded-lg transition-all transform hover:scale-105"
                >
                  SIGN IN
                </Link>
              </>
            )}
          </div>
        </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <h2 className="text-5xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400 mb-16">
          BATTLE FEATURES
        </h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="bg-black/40 border-2 border-orange-600 rounded-lg p-6 backdrop-blur-sm hover:border-yellow-400 transition-all transform hover:scale-105 hover:shadow-xl hover:shadow-orange-500/20">
            <div className="bg-gradient-to-br from-orange-600 to-red-600 p-4 rounded-lg inline-block mb-4 border-2 border-yellow-400">
              <Users size={40} className="text-yellow-300" />
            </div>
            <h3 className="text-xl font-black text-orange-300 mb-3">TEAM COMMAND</h3>
            <p className="text-gray-300">
              Create and organize your squads with players, team leader designation, and full roster management.
            </p>
          </div>

          <div className="bg-black/40 border-2 border-orange-600 rounded-lg p-6 backdrop-blur-sm hover:border-yellow-400 transition-all transform hover:scale-105 hover:shadow-xl hover:shadow-orange-500/20">
            <div className="bg-gradient-to-br from-orange-600 to-red-600 p-4 rounded-lg inline-block mb-4 border-2 border-yellow-400">
              <Zap size={40} className="text-yellow-300" />
            </div>
            <h3 className="text-xl font-black text-orange-300 mb-3">INSTANT REGISTRATION</h3>
            <p className="text-gray-300">
              Register teams instantly. Manage payments via screenshot proof and get automatic slot assignments.
            </p>
          </div>

          <div className="bg-black/40 border-2 border-orange-600 rounded-lg p-6 backdrop-blur-sm hover:border-yellow-400 transition-all transform hover:scale-105 hover:shadow-xl hover:shadow-orange-500/20">
            <div className="bg-gradient-to-br from-orange-600 to-red-600 p-4 rounded-lg inline-block mb-4 border-2 border-yellow-400">
              <TrendingUp size={40} className="text-yellow-300" />
            </div>
            <h3 className="text-xl font-black text-orange-300 mb-3">SMART LEADERBOARDS</h3>
            <p className="text-gray-300">
              Upload screenshots. Advanced OCR extracts team data, kills, and placements automatically.
            </p>
          </div>

          <div className="bg-black/40 border-2 border-orange-600 rounded-lg p-6 backdrop-blur-sm hover:border-yellow-400 transition-all transform hover:scale-105 hover:shadow-xl hover:shadow-orange-500/20">
            <div className="bg-gradient-to-br from-orange-600 to-red-600 p-4 rounded-lg inline-block mb-4 border-2 border-yellow-400">
              <Trophy size={40} className="text-yellow-300" />
            </div>
            <h3 className="text-xl font-black text-orange-300 mb-3">PRIZE WARFARE</h3>
            <p className="text-gray-300">
              Automatic prize calculation with dynamic distribution rules. Customizable percentages per placement.
            </p>
          </div>

          <div className="bg-black/40 border-2 border-orange-600 rounded-lg p-6 backdrop-blur-sm hover:border-yellow-400 transition-all transform hover:scale-105 hover:shadow-xl hover:shadow-orange-500/20">
            <div className="bg-gradient-to-br from-orange-600 to-red-600 p-4 rounded-lg inline-block mb-4 border-2 border-yellow-400">
              <Sword size={40} className="text-yellow-300" />
            </div>
            <h3 className="text-xl font-black text-orange-300 mb-3">TOURNAMENT SYSTEM</h3>
            <p className="text-gray-300">
              Multi-round tournaments with flexible configurations. Auto advancement for top teams across rounds.
            </p>
          </div>

          <div className="bg-black/40 border-2 border-orange-600 rounded-lg p-6 backdrop-blur-sm hover:border-yellow-400 transition-all transform hover:scale-105 hover:shadow-xl hover:shadow-orange-500/20">
            <div className="bg-gradient-to-br from-orange-600 to-red-600 p-4 rounded-lg inline-block mb-4 border-2 border-yellow-400">
              <Target size={40} className="text-yellow-300" />
            </div>
            <h3 className="text-xl font-black text-orange-300 mb-3">SLOT MASTERY</h3>
            <p className="text-gray-300">
              12 team slots per match. Auto-assignment or manual slot reassignment. Real-time slot tracking.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-4 py-16 max-w-4xl mx-auto">
        <h2 className="text-4xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400 mb-16">
          BATTLE ROADMAP
        </h2>
        <div className="bg-black/40 border-2 border-orange-600 rounded-xl p-8 backdrop-blur-sm">
          <div className="space-y-6">
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-600 border-2 border-yellow-300">
                  <span className="text-2xl font-black text-yellow-300">1</span>
                </div>
              </div>
              <div className="pt-2">
                <h4 className="text-lg font-black text-orange-300 mb-1">
                  ASSEMBLE YOUR SQUAD
                </h4>
                <p className="text-gray-300">
                  Create your team with players and designate your squad leader.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-600 border-2 border-yellow-300">
                  <span className="text-2xl font-black text-yellow-300">2</span>
                </div>
              </div>
              <div className="pt-2">
                <h4 className="text-lg font-black text-orange-300 mb-1">
                  REGISTER FOR BATTLE
                </h4>
                <p className="text-gray-300">
                  Find and register your team for scrims or tournaments instantly.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-600 border-2 border-yellow-300">
                  <span className="text-2xl font-black text-yellow-300">3</span>
                </div>
              </div>
              <div className="pt-2">
                <h4 className="text-lg font-black text-orange-300 mb-1">
                  PROVE VICTORY
                </h4>
                <p className="text-gray-300">
                  Upload your payment screenshot to secure your tournament slot.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-600 border-2 border-yellow-300">
                  <span className="text-2xl font-black text-yellow-300">4</span>
                </div>
              </div>
              <div className="pt-2">
                <h4 className="text-lg font-black text-orange-300 mb-1">
                  DOMINATE THE MATCH
                </h4>
                <p className="text-gray-300">
                  Compete in the tournament while admins track real-time progress.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-600 border-2 border-yellow-300">
                  <span className="text-2xl font-black text-yellow-300">5</span>
                </div>
              </div>
              <div className="pt-2">
                <h4 className="text-lg font-black text-orange-300 mb-1">
                  CLAIM YOUR PRIZE
                </h4>
                <p className="text-gray-300">
                  View final rankings, your stats, and prize winnings on the leaderboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="px-4 pb-20">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-orange-600 via-red-600 to-red-700 border-2 border-yellow-300 rounded-xl p-12 backdrop-blur-sm text-center shadow-xl shadow-orange-500/50">
            <h2 className="text-4xl font-black text-yellow-300 mb-4">READY TO COMPETE?</h2>
            <p className="text-lg text-yellow-100 mb-8 max-w-3xl mx-auto font-bold">
              Join thousands of teams battling in epic tournaments. Revolutionary OCR technology, automatic prizes, and seamless tournament management. Your competitive edge awaits!
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                to="/signup"
                className="bg-gray-900 border-2 border-yellow-300 text-yellow-300 hover:bg-black font-black py-4 px-10 text-lg flex items-center gap-2 rounded-lg transition-all transform hover:scale-105"
              >
                <Flame size={24} />
                CREATE ACCOUNT
              </Link>
              <Link
                to="/login"
                className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-black py-4 px-10 text-lg rounded-lg transition-all transform hover:scale-105"
              >
                EXISTING PLAYER? LOGIN
              </Link>
            </div>
          </div>
        </section>
      )}
      </div>
    </div>
  );
}



