import { Link } from "react-router-dom";
import { Trophy, Users, Zap, TrendingUp, ArrowRight } from "lucide-react";
import useStore from "../store/useStore";

export default function Landing() {
  const { isAuthenticated } = useStore();

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-16 px-4">
        <div className="mb-8">
          <div className="inline-block p-3 bg-blue-900 rounded-full mb-4">
            <Trophy size={64} className="text-yellow-400" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            FF Tournament Manager
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
            The complete esports tournament management platform. Handle team
            registrations, payments, leaderboards, and prizes automatically.
          </p>
        </div>

        <div className="flex gap-4 justify-center flex-wrap">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="btn-primary py-3 px-8 text-lg flex items-center gap-2"
            >
              Go to Dashboard
              <ArrowRight size={20} />
            </Link>
          ) : (
            <>
              <Link
                to="/signup"
                className="btn-primary py-3 px-8 text-lg flex items-center gap-2"
              >
                Get Started
                <ArrowRight size={20} />
              </Link>
              <Link to="/login" className="btn-secondary py-3 px-8 text-lg">
                Log In
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-12">
          Powerful Features for Tournament Management
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card text-center hover:border-blue-600 transition">
            <Users size={48} className="mx-auto text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Team Management</h3>
            <p className="text-gray-400">
              Create and manage teams with players, set leaders, and organize participants
              with ease.
            </p>
          </div>

          <div className="card text-center hover:border-blue-600 transition">
            <Zap size={48} className="mx-auto text-yellow-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Quick Registration</h3>
            <p className="text-gray-400">
              Register teams for matches instantly. Manage payments and slot
              assignments effortlessly.
            </p>
          </div>

          <div className="card text-center hover:border-blue-600 transition">
            <TrendingUp size={48} className="mx-auto text-green-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Smart Leaderboards</h3>
            <p className="text-gray-400">
              Upload screenshots. OCR extracts data and calculates prizes
              automatically.
            </p>
          </div>

          <div className="card text-center hover:border-blue-600 transition">
            <Trophy size={48} className="mx-auto text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Prize Distribution</h3>
            <p className="text-gray-400">
              Automatic prize calculation with customizable rules and
              distribution percentages.
            </p>
          </div>

          <div className="card text-center hover:border-blue-600 transition">
            <Users size={48} className="mx-auto text-cyan-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Tournament System</h3>
            <p className="text-gray-400">
              Flexible multi-round tournaments with automatic team advancement
              and scoring.
            </p>
          </div>

          <div className="card text-center hover:border-blue-600 transition">
            <Zap size={48} className="mx-auto text-orange-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Payment Management</h3>
            <p className="text-gray-400">
              Screenshot-based payment approval with admin control and slot
              management.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="card">
        <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
        <div className="space-y-6">
          <div className="flex gap-6">
            <div className="flex-shrink-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600">
                <span className="text-lg font-bold text-white">1</span>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">
                Create a Team
              </h4>
              <p className="text-gray-400">
                Set up your team with players and designate a leader.
              </p>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex-shrink-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600">
                <span className="text-lg font-bold text-white">2</span>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">
                Register for a Match
              </h4>
              <p className="text-gray-400">
                Browse available scrims or tournaments and register your team.
              </p>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex-shrink-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600">
                <span className="text-lg font-bold text-white">3</span>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">
                Upload Payment Proof
              </h4>
              <p className="text-gray-400">
                Upload a screenshot of your payment to secure your slot.
              </p>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex-shrink-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600">
                <span className="text-lg font-bold text-white">4</span>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">
                Wait for Results
              </h4>
              <p className="text-gray-400">
                Admin uploads leaderboard screenshot and OCR calculates prizes.
              </p>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex-shrink-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600">
                <span className="text-lg font-bold text-white">5</span>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">
                View Leaderboard
              </h4>
              <p className="text-gray-400">
                Check final rankings, your kills, and prize winnings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="card bg-gradient-to-r from-blue-900 to-blue-800 text-center py-12">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Create your account today and start managing tournaments with the
            power of automated OCR and prize calculation.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/signup" className="btn-primary py-3 px-8 text-lg">
              Sign Up Now
            </Link>
            <Link to="/login" className="btn-secondary py-3 px-8 text-lg">
              Login
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}

