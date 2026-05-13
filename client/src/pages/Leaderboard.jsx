import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform
} from "framer-motion";
import {
  ArrowLeft,
  Trophy,
  Crown,
  Medal,
  Flame,
  Users,
  Calendar,
  ChevronUp,
  ChevronDown,
  Search,
  Star,
  Gift,
  BarChart3,
  Activity
} from "lucide-react";

// Animated Counter Component
function Counter({ to, decimals = 0 }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!to || to === 0) { setV(0); return; }
    let cur = 0;
    const step = to / 50;
    const id = setInterval(() => {
      cur += step;
      if (cur >= to) { setV(to); clearInterval(id); }
      else setV(decimals ? Math.round(cur * 10 ** decimals) / 10 ** decimals : Math.floor(cur));
    }, 20);
    return () => clearInterval(id);
  }, [to, decimals]);
  return <>{decimals ? v.toFixed(decimals) : v}</>;
}

// Tilt Card Component
function TiltCard({ children, style }) {
  const x = useMotionValue(0), y = useMotionValue(0);
  const rx = useTransform(y, [-60, 60], [8, -8]);
  const ry = useTransform(x, [-60, 60], [-8, 8]);
  return (
    <motion.div
      style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d", ...style }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - r.left - r.width / 2);
        y.set(e.clientY - r.top - r.height / 2);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
    >{children}</motion.div>
  );
}

export default function Leaderboard() {
  const navigate = useNavigate();
  const [timeFrame, setTimeFrame] = useState("weekly"); // weekly, monthly, allTime
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [userRank, setUserRank] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);

  // Mock leaderboard data
  const allLeaderboardData = {
    weekly: [
      { name: "Alex Kumar", score: 9.8, avatar: "AK", isPro: true, streak: 7, tests: 45, accuracy: 92, badge: "🔥 Hot Streak" },
      { name: "Priya Sharma", score: 9.5, avatar: "PS", isPro: true, streak: 5, tests: 38, accuracy: 89, badge: "⭐ Top Performer" },
      { name: "Rahul Verma", score: 9.2, avatar: "RV", isPro: false, streak: 4, tests: 32, accuracy: 87, badge: "📈 Rising Star" },
      { name: "Sneha Patel", score: 9.0, avatar: "SP", isPro: false, streak: 6, tests: 35, accuracy: 85, badge: "💪 Consistent" },
      { name: "Vikram Singh", score: 8.8, avatar: "VS", isPro: true, streak: 3, tests: 28, accuracy: 84, badge: "🎯 Sharp Shooter" },
      { name: "Neha Gupta", score: 8.6, avatar: "NG", isPro: false, streak: 4, tests: 30, accuracy: 82, badge: "🌟 Star Performer" },
      { name: "You", score: 8.5, avatar: "YO", isPro: false, streak: 5, tests: 25, accuracy: 80, badge: "🏃‍♂️ On Fire", isCurrent: true },
      { name: "Amit Patel", score: 8.3, avatar: "AP", isPro: false, streak: 2, tests: 22, accuracy: 78, badge: "📚 Dedicated" },
      { name: "Deepa Nair", score: 8.0, avatar: "DN", isPro: false, streak: 3, tests: 20, accuracy: 76, badge: "🎓 Learning" },
      { name: "Rajesh Kumar", score: 7.8, avatar: "RK", isPro: false, streak: 1, tests: 18, accuracy: 74, badge: "💡 Improving" },
    ],
    monthly: [
      { name: "Priya Sharma", score: 9.6, avatar: "PS", isPro: true, streak: 15, tests: 120, accuracy: 91, badge: "👑 Monthly Champion" },
      { name: "Alex Kumar", score: 9.4, avatar: "AK", isPro: true, streak: 12, tests: 110, accuracy: 89, badge: "⚡ Power User" },
      { name: "You", score: 9.1, avatar: "YO", isPro: false, streak: 10, tests: 95, accuracy: 87, badge: "🚀 Fast Learner", isCurrent: true },
      { name: "Sneha Patel", score: 8.9, avatar: "SP", isPro: false, streak: 8, tests: 88, accuracy: 85, badge: "💎 Diamond" },
      { name: "Rahul Verma", score: 8.7, avatar: "RV", isPro: false, streak: 7, tests: 82, accuracy: 83, badge: "🎯 Focused" },
    ],
    allTime: [
      { name: "Alex Kumar", score: 9.7, avatar: "AK", isPro: true, streak: 50, tests: 450, accuracy: 94, badge: "🏆 Legend" },
      { name: "Priya Sharma", score: 9.5, avatar: "PS", isPro: true, streak: 42, tests: 420, accuracy: 92, badge: "⭐ All-Star" },
      { name: "Rahul Verma", score: 9.2, avatar: "RV", isPro: false, streak: 38, tests: 380, accuracy: 89, badge: "🎓 Master" },
      { name: "You", score: 9.0, avatar: "YO", isPro: false, streak: 35, tests: 350, accuracy: 87, badge: "🌟 Rising Legend", isCurrent: true },
      { name: "Sneha Patel", score: 8.8, avatar: "SP", isPro: false, streak: 32, tests: 320, accuracy: 85, badge: "💪 Warrior" },
    ]
  };

  const leaderboardData = allLeaderboardData[timeFrame];
  
  // Filter by search and category
 const filteredData = useMemo(() => {
  let data = [...leaderboardData];

  if (searchTerm) {
    data = data.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (selectedCategory === "pro") {
    data = data.filter((user) => user.isPro);
  } else if (selectedCategory === "free") {
    data = data.filter((user) => !user.isPro);
  }

  data.sort((a, b) => b.score - a.score);

  return data;
}, [leaderboardData, searchTerm, selectedCategory]);

  // Get medal color based on rank
  const getMedalColor = (rank) => {
    if (rank === 1) return "#fbbf24";
    if (rank === 2) return "#94a3b8";
    if (rank === 3) return "#cd7f32";
    return "rgba(255,255,255,0.3)";
  };

  // Get rank icon
  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown size={16} color="#fbbf24" />;
    if (rank === 2) return <Medal size={16} color="#94a3b8" />;
    if (rank === 3) return <Medal size={16} color="#cd7f32" />;
    return <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.5)" }}>#{rank}</span>;
  };

  // Stats cards data
  const statsCards = [
    { label: "Total Participants", value: "1,284", icon: <Users size={14} />, color: "#00c9ff", change: "+12%", trend: "up" },
    { label: "Avg. Score", value: "7.8", icon: <BarChart3 size={14} />, color: "#00ffa3", change: "+0.3", trend: "up" },
    { label: "Active Today", value: "89", icon: <Activity size={14} />, color: "#a78bfa", change: "+5", trend: "up" },
    { label: "Top Streak", value: "42 days", icon: <Flame size={14} />, color: "#f97316", change: "Alex K", trend: "up" },
  ];

  // Check if user improved rank (show celebration)
  useEffect(() => {
    const previousRank = localStorage.getItem("previousRank");
    if (previousRank && userRank && parseInt(previousRank) > userRank) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
    if (userRank) {
      localStorage.setItem("previousRank", userRank);
    }
  }, [userRank]);
  useEffect(() => {
  const currentUserIndex = filteredData.findIndex(
    (user) => user.isCurrent
  );

  if (currentUserIndex !== -1) {
    setUserRank(currentUserIndex + 1);
  } else {
    setUserRank(null);
  }
}, [filteredData]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #060610; font-family: 'Inter', system-ui, sans-serif; }
      `}</style>

      {/* Celebration Toast */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 16 }}
            exit={{ opacity: 0, y: -60 }}
            style={{
              position: "fixed",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 1000,
              background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
              padding: "12px 24px",
              borderRadius: 40,
              color: "#060610",
              fontWeight: 700,
              fontSize: 14,
              whiteSpace: "nowrap",
              boxShadow: "0 0 28px rgba(251,191,36,0.45)",
            }}
          >
            🎉 Congratulations! You moved up to #{userRank} rank! 🎉
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{
        minHeight: "100vh",
        width: "100%",
        background: "#060610",
        position: "relative",
        overflowX: "hidden",
      }}>
        {/* Background Effects */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
          <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", top: "-15%", left: "-10%", background: "radial-gradient(circle,rgba(0,255,163,0.07) 0%,transparent 65%)" }} />
          <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", bottom: "-15%", right: "-8%", background: "radial-gradient(circle,rgba(124,58,237,0.09) 0%,transparent 65%)" }} />
          <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", top: "40%", left: "50%", transform: "translate(-50%,-50%)", background: "radial-gradient(circle,rgba(0,201,255,0.04) 0%,transparent 70%)" }} />
        </div>

        {/* Main Content */}
        <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 1200, margin: "0 auto", padding: "24px 20px" }}>
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}
          >
            <button
              onClick={() => navigate("/dashboard")}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12, padding: "8px 16px",
                color: "#fff", fontSize: 13, cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
            >
              <ArrowLeft size={16} /> Back to Dashboard
            </button>

            <div style={{ textAlign: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}>
                <Trophy size={28} color="#fbbf24" />
                <h1 style={{ fontSize: 28, fontWeight: 800, background: "linear-gradient(135deg, #fff, #fbbf24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Leaderboard
                </h1>
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>
                Compete with top performers & climb the ranks
              </p>
            </div>

            <div style={{ width: 120 }} /> {/* Spacer for alignment */}
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}
          >
            {statsCards.map((stat, idx) => (
              <TiltCard key={idx}>
                <div style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 16, padding: "16px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ color: stat.color }}>{stat.icon}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: stat.change.startsWith("+") ? "#00ffa3" : "#ef4444", display: "flex", alignItems: "center", gap: 2 }}>
                      {stat.trend === "up" ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      {stat.change}
                    </span>
                  </div>
                  <p style={{ fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 4 }}>{stat.value}</p>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{stat.label}</p>
                </div>
              </TiltCard>
            ))}
          </motion.div>

          {/* Time Frame Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ display: "flex", gap: 12, marginBottom: 24, justifyContent: "center", flexWrap: "wrap" }}
          >
            {[
              { id: "weekly", label: "Weekly", icon: <Calendar size={14} /> },
              { id: "monthly", label: "Monthly", icon: <Calendar size={14} /> },
              { id: "allTime", label: "All Time", icon: <Trophy size={14} /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setTimeFrame(tab.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 20px", borderRadius: 40,
                  background: timeFrame === tab.id ? "linear-gradient(135deg, #00ffa3, #00c9ff)" : "rgba(255,255,255,0.05)",
                  border: "none", color: timeFrame === tab.id ? "#060610" : "rgba(255,255,255,0.7)",
                  fontSize: 13, fontWeight: 600, cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}
          >
            <div style={{ flex: 1, position: "relative" }}>
              <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.4)" }} />
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%", padding: "10px 16px 10px 36px",
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12, color: "#fff", fontSize: 13, outline: "none"
                }}
              />
            </div>
            
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setSelectedCategory("all")}
                style={{
                  padding: "8px 16px", borderRadius: 12,
                  background: selectedCategory === "all" ? "linear-gradient(135deg, #00ffa3, #00c9ff)" : "rgba(255,255,255,0.05)",
                  border: "none", color: selectedCategory === "all" ? "#060610" : "rgba(255,255,255,0.7)",
                  fontSize: 12, fontWeight: 600, cursor: "pointer"
                }}
              >
                All
              </button>
              <button
                onClick={() => setSelectedCategory("pro")}
                style={{
                  padding: "8px 16px", borderRadius: 12, display: "flex", alignItems: "center", gap: 5,
                  background: selectedCategory === "pro" ? "linear-gradient(135deg, #fbbf24, #f59e0b)" : "rgba(255,255,255,0.05)",
                  border: "none", color: selectedCategory === "pro" ? "#060610" : "rgba(255,255,255,0.7)",
                  fontSize: 12, fontWeight: 600, cursor: "pointer"
                }}
              >
                <Crown size={12} /> Pro
              </button>
              <button
                onClick={() => setSelectedCategory("free")}
                style={{
                  padding: "8px 16px", borderRadius: 12,
                  background: selectedCategory === "free" ? "linear-gradient(135deg, #a78bfa, #7c3aed)" : "rgba(255,255,255,0.05)",
                  border: "none", color: selectedCategory === "free" ? "#fff" : "rgba(255,255,255,0.7)",
                  fontSize: 12, fontWeight: 600, cursor: "pointer"
                }}
              >
                Free
              </button>
            </div>
          </motion.div>

          {/* Leaderboard Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 20, overflow: "hidden",
              backdropFilter: "blur(10px)"
            }}
          >
            {/* Table Header */}
            <div style={{
              display: "grid", gridTemplateColumns: "80px 80px 1fr 100px 80px 100px",
              padding: "16px 20px", background: "rgba(255,255,255,0.05)",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.6)"
            }}>
              <div>Rank</div>
              <div>Avatar</div>
              <div>Name</div>
              <div>Score</div>
              <div>Tests</div>
              <div>Badge</div>
            </div>

            {/* Table Rows */}
            <AnimatePresence>
              {filteredData.map((user, idx) => (
                <motion.div
                  key={user.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: idx * 0.02 }}
                  style={{
                    display: "grid", gridTemplateColumns: "80px 80px 1fr 100px 80px 100px",
                    padding: "14px 20px", alignItems: "center",
                    borderBottom: idx < filteredData.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                    background: user.isCurrent ? "rgba(0,255,163,0.05)" : "transparent",
                    transition: "all 0.2s"
                  }}
                >
                  {/* Rank */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    {getRankIcon(idx + 1)}
                  </div>

                  {/* Avatar */}
                  <div>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: user.isCurrent ? "linear-gradient(135deg, #00ffa3, #00c9ff)" : "linear-gradient(135deg, #7c3aed, #2563eb)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 700, color: "#fff"
                    }}>
                      {user.avatar}
                    </div>
                  </div>

                  {/* Name */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontWeight: user.isCurrent ? 700 : 500, color: user.isCurrent ? "#00ffa3" : "#fff" }}>
                      {user.name}
                    </span>
                    {user.isPro && <Crown size={12} color="#fbbf24" />}
                    {user.isCurrent && <span style={{ fontSize: 10, padding: "2px 6px", background: "rgba(0,255,163,0.2)", borderRadius: 20, color: "#00ffa3" }}>You</span>}
                  </div>

                  {/* Score */}
                  <div>
                    <span style={{ fontSize: 18, fontWeight: 800, color: "#00ffa3" }}>
                      <Counter to={user.score} decimals={1} />
                    </span>
                  </div>

                  {/* Tests */}
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{user.tests}</div>

                  {/* Badge */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{
                      fontSize: 10, padding: "4px 8px", borderRadius: 20,
                      background: `${getMedalColor(idx + 1)}20`,
                      color: getMedalColor(idx + 1),
                      fontWeight: 600
                    }}>
                      {user.badge}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Empty State */}
            {filteredData.length === 0 && (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "rgba(255,255,255,0.5)" }}>
                <Search size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
                <p>No users found matching your search</p>
              </div>
            )}
          </motion.div>

          {/* Your Rank Card (if not in top list) */}
          {userRank && userRank > 10 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                marginTop: 24, padding: 20,
                background: "linear-gradient(135deg, rgba(0,255,163,0.1), rgba(0,201,255,0.05))",
                border: "1px solid rgba(0,255,163,0.2)",
                borderRadius: 16, textAlign: "center"
              }}
            >
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>Your Current Rank</p>
              <p style={{ fontSize: 48, fontWeight: 800, color: "#00ffa3", marginBottom: 4 }}>#{userRank}</p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
                Complete more tests to climb the leaderboard!
              </p>
              <button
                onClick={() => navigate("/aptitude")}
                style={{
                  marginTop: 16, padding: "8px 24px",
                  background: "linear-gradient(135deg, #00ffa3, #00c9ff)",
                  border: "none", borderRadius: 12, color: "#060610",
                  fontWeight: 700, fontSize: 13, cursor: "pointer"
                }}
              >
                Take a Test Now →
              </button>
            </motion.div>
          )}

          {/* Incentive Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{
              marginTop: 32, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: 16, padding: 24, background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(251,191,36,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Trophy size={24} color="#fbbf24" />
              </div>
              <div>
                <p style={{ fontWeight: 700, color: "#fff", marginBottom: 4 }}>Top 3 Monthly Prize</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>₹5,000 Amazon Voucher + Pro Plan</p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(0,255,163,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Gift size={24} color="#00ffa3" />
              </div>
              <div>
                <p style={{ fontWeight: 700, color: "#fff", marginBottom: 4 }}>Weekly Rewards</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Top 10 get 500 coins + Premium Badges</p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(167,139,250,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Star size={24} color="#a78bfa" />
              </div>
              <div>
                <p style={{ fontWeight: 700, color: "#fff", marginBottom: 4 }}>Special Badges</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Earn exclusive achievement badges</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </>
  );
}