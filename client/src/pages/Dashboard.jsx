import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo, useCallback } from "react";
import {
  Mic, Brain, UserCircle, LogOut,
  TrendingUp, BarChart3, ChevronRight, Zap,
  Target, Gift, Award, Activity,
  Trophy, Flame, BookOpen, CheckCircle, Crown,
  FileText, Sparkles, Code, Users, Calendar,
  Video, MessageCircle, BarChart, Clock,
  Medal, Briefcase, Star, Construction, X
} from "lucide-react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";

// ─── Type scale ──────────────────────────────────────────────────────────────
const T = {
  xxs: 10, xs: 11, sm: 12, base: 13, md: 15, stat: 22,
  hero: "clamp(2.2rem, 8vw, 3rem)",
};

// ─── Animated counter ────────────────────────────────────────────────────────
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

// ─── Tilt card ────────────────────────────────────────────────────────────────
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

// ─── Confetti ─────────────────────────────────────────────────────────────────
function Confetti({ active }) {
  if (!active) return null;
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1000 }}>
      {[...Array(50)].map((_, i) => (
        <motion.div key={i}
          initial={{ x: "50vw", y: "50vh", opacity: 1 }}
          animate={{ x: `${Math.random() * 100}vw`, y: `${Math.random() * 100}vh`, opacity: 0, rotate: Math.random() * 360 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{
            position: "absolute",
            width: Math.random() * 8 + 4, height: Math.random() * 8 + 4,
            background: `hsl(${Math.random() * 360},100%,50%)`,
            borderRadius: Math.random() > 0.5 ? "50%" : 0,
          }}
        />
      ))}
    </div>
  );
}

// ─── Defaults ────────────────────────────────────────────────────────────────
const DEFAULT_STATS = {
  score: 8.0, attempts: 12, level: "Advanced", streak: 5,
  totalQuestions: 285, accuracy: 76,
  badges: ["Quick Learner", "Math Master"],
  coins: 1250, rank: 42, isPro: false,
};
const DEFAULT_DAILY = {
  title: "Complete 3 Aptitude Tests", progress: 1, target: 3, reward: 100, expiresIn: "12h",
};

const safeParse = (key, fallback) => {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; }
  catch { return fallback; }
};

// Feature categories with ALL features
const FEATURE_CATEGORIES = {
  "🎯 Core Preparation": [
    { title: "AI Mock Interview", sub: "Real-time feedback & evaluation", icon: <Mic size={20} />, route: "/interview", accent: "#00ffa3", tag: "AI Powered", status: "live" },
    { title: "Aptitude Tests", sub: "1000+ TCS-level questions", icon: <Brain size={20} />, route: "/aptitude", accent: "#a78bfa", tag: "9 Topics", status: "live" },
    { title: "Resume Builder", sub: "ATS-friendly & instant scoring", icon: <FileText size={20} />, route: "/resume-builder", accent: "#fbbf24", tag: "New", isNew: true, status: "live" },
  ],
  "💻 Coding & Technical": [
    {
 title: "Coding Platform",
 sub: "500+ DSA problems · Online compiler",
 route: "/coding",
 accent: "#00c9ff",
 tag: "Live",
 status: "live"
}
    { title: "Technical Interview", sub: "System design · DBMS · OS", icon: <Video size={20} />, route: "/technical", accent: "#14b8a6", tag: "Coming Soon", status: "coming" },
    { title: "Company-Specific Prep", sub: "TCS · Infosys · Amazon · Google", icon: <Briefcase size={20} />, route: "/company-prep", accent: "#ec4899", tag: "Coming Soon", status: "coming" },
  ],
  "📊 Assessment & Analytics": [
    { title: "Mock Assessment", sub: "Full-length placement simulations", icon: <Calendar size={20} />, route: "/mock-assessment", accent: "#f97316", tag: "Coming Soon", status: "coming" },
    { title: "Skill Gap Analyzer", sub: "Identify weak areas & roadmap", icon: <BarChart size={20} />, route: "/skill-analyzer", accent: "#8b5cf6", tag: "Coming Soon", status: "coming" },
    { title: "Placement Predictor", sub: "ML-based success probability", icon: <TrendingUp size={20} />, route: "/predictor", accent: "#ff4b6e", tag: "Coming Soon", status: "coming" },
  ],
  "🤝 Community & Mentorship": [
    { title: "Peer Mock Interviews", sub: "Practice with real peers", icon: <Users size={20} />, route: "/peer-interview", accent: "#06b6d4", tag: "Coming Soon", status: "coming" },
    { title: "Mentor Connect", sub: "1-on-1 sessions with experts", icon: <MessageCircle size={20} />, route: "/mentor", accent: "#f59e0b", tag: "Coming Soon", status: "coming" },
    { title: "Group Discussions", sub: "AI-powered GD simulator", icon: <Users size={20} />, route: "/group-discussion", accent: "#10b981", tag: "Coming Soon", status: "coming" },
  ],
  "🏆 Gamification": [
    { title: "Daily Challenges", sub: "Earn coins & badges", icon: <Target size={20} />, route: "/daily-challenge", accent: "#fbbf24", tag: "Coming Soon", status: "coming" },
    { title: "Leaderboard", sub: "Compete with top performers", icon: <Trophy size={20} />, route: "/leaderboard", accent: "#f97316", tag: "Live", status: "live" },
    { title: "Achievements", sub: "Unlock special badges", icon: <Medal size={20} />, route: "/achievements", accent: "#ec4899", tag: "Coming Soon", status: "coming" },
  ],
  "📚 Resources & Tools": [
    { title: "Study Material", sub: "Notes · Videos · Cheat sheets", icon: <BookOpen size={20} />, route: "/study-material", accent: "#8b5cf6", tag: "Coming Soon", status: "coming" },
    { title: "Company Tracker", sub: "Application deadlines & status", icon: <Clock size={20} />, route: "/company-tracker", accent: "#06b6d4", tag: "Coming Soon", status: "coming" },
    { title: "Success Stories", sub: "Learn from placed students", icon: <Star size={20} />, route: "/success-stories", accent: "#f59e0b", tag: "Coming Soon", status: "coming" },
  ],
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [dailyChallenge, setDailyChallenge] = useState(DEFAULT_DAILY);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showComingModal, setShowComingModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState("");

  const triggerNotification = useCallback((msg) => {
    setNotificationMsg(msg); setShowNotification(true); setShowConfetti(true);
    setTimeout(() => setShowNotification(false), 3000);
    setTimeout(() => setShowConfetti(false), 2000);
  }, []);

  const checkAchievements = useCallback((s) => {
    const earned = s?.badges ?? [];
    const next = [];
    if (s.streak >= 7 && !earned.includes("Streak Master")) { 
      next.push("Streak Master"); 
      triggerNotification("🔥 Streak Master! 7-day streak!"); 
    }
    if (s.attempts >= 20 && !earned.includes("Dedicated Learner")) { 
      next.push("Dedicated Learner"); 
      triggerNotification("🎉 Dedicated Learner unlocked!"); 
    }
    if (next.length) {
      setStats(p => {
        const u = { ...p, badges: [...(p.badges ?? []), ...next] };
        localStorage.setItem("stats", JSON.stringify(u));
        return u;
      });
    }
  }, [triggerNotification]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { 
      navigate("/"); 
      return; 
    }
    const userData = safeParse("user", {});
    const mergedStats = { ...DEFAULT_STATS, ...safeParse("stats", DEFAULT_STATS) };
    const mergedDaily = { ...DEFAULT_DAILY, ...safeParse("dailyChallenge", DEFAULT_DAILY) };
    if (userData?.name) setUser(userData);
    setStats(mergedStats);
    setDailyChallenge(mergedDaily);
    checkAchievements(mergedStats);
  }, [navigate, checkAchievements]);

  const handleNavigate = useCallback((route, featureTitle, status) => {
    if (status === "coming") {
      setSelectedFeature(featureTitle);
      setShowComingModal(true);
      return;
    }
    localStorage.setItem("lastPage", route);
    navigate(route);
  }, [navigate]);

  const handleUpgradeToPro = useCallback(() => {
    localStorage.setItem("returnTo", "/dashboard");
    navigate("/pricing");
  }, [navigate]);

  const handleDailyChallenge = useCallback(() => {
    setDailyChallenge(prev => {
      if (prev.progress >= prev.target) return prev;
      const updated = { ...prev, progress: prev.progress + 1 };
      localStorage.setItem("dailyChallenge", JSON.stringify(updated));
      if (updated.progress === updated.target) {
        setStats(s => { 
          const n = { ...s, coins: s.coins + prev.reward }; 
          localStorage.setItem("stats", JSON.stringify(n)); 
          return n; 
        });
        triggerNotification(`🎁 Done! +${prev.reward} coins!`);
      } else {
        triggerNotification(`✅ ${updated.progress}/${updated.target} complete`);
      }
      return updated;
    });
  }, [triggerNotification]);

  const logout = useCallback(() => { 
    localStorage.clear(); 
    navigate("/"); 
  }, [navigate]);

  const h = new Date().getHours();
  const timeLabel = h < 12 ? "Morning" : h < 18 ? "Afternoon" : "Evening";
  const initials = useMemo(() =>
    user?.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "ME"
  , [user]);

  const recentActivities = useMemo(() => [
    { action: "Aptitude Test", topic: "Time & Work", score: 85, time: "2h ago", icon: <CheckCircle size={11} color="#00c9ff" /> },
    { action: "Mock Interview", topic: "Technical Round", score: null, time: "1d ago", icon: <Mic size={11} color="#00c9ff" /> },
    { action: "Resume Score", topic: "ATS Analysis", score: 78, time: "2d ago", icon: <FileText size={11} color="#00c9ff" /> },
  ], []);

  const leaderboard = useMemo(() => [
    { name: "Alex Kumar", score: 9.2, rank: 1, avatar: "AK", isPro: true },
    { name: "Priya Sharma", score: 8.9, rank: 2, avatar: "PS", isPro: true },
    { name: user?.name || "You", score: stats.score, rank: stats.rank, avatar: initials, isCurrent: true, isPro: stats.isPro },
    { name: "Rahul Verma", score: 7.8, rank: 4, avatar: "RV", isPro: false },
    { name: "Sneha Patel", score: 7.5, rank: 5, avatar: "SP", isPro: false },
  ], [user, stats.score, stats.rank, initials, stats.isPro]);

  const challengePct = Math.min(100, Math.max(0, (dailyChallenge.progress / dailyChallenge.target) * 100));
  const challengeDone = dailyChallenge.progress >= dailyChallenge.target;

  // Flatten features for search/filter
  const allFeatures = Object.values(FEATURE_CATEGORIES).flat();
  const filteredFeatures = searchTerm 
    ? allFeatures.filter(f => f.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                               f.sub.toLowerCase().includes(searchTerm.toLowerCase()))
    : (selectedCategory === "all" ? allFeatures : FEATURE_CATEGORIES[selectedCategory] || []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { height: 100%; }
        body { background: #060610; font-family: 'Inter', system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
        button { font-family: inherit; }
      `}</style>

      <Confetti active={showConfetti} />

      {/* Coming Soon Modal */}
      <AnimatePresence>
        {showComingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.95)",
              backdropFilter: "blur(20px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2000,
              padding: "20px"
            }}
            onClick={() => setShowComingModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                maxWidth: 400,
                width: "100%",
                background: "linear-gradient(135deg, #1a1a2e, #0f0f1a)",
                border: "1px solid rgba(251,191,36,0.3)",
                borderRadius: 24,
                padding: "32px",
                textAlign: "center",
                position: "relative"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowComingModal(false)}
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  background: "rgba(255,255,255,0.05)",
                  border: "none",
                  borderRadius: 8,
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.6)"
                }}
              >
                <X size={18} />
              </button>
              
              <div style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                background: "rgba(251,191,36,0.1)",
                border: "2px solid rgba(251,191,36,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px"
              }}>
                <Construction size={40} color="#fbbf24" />
              </div>
              
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 8 }}>
                Coming Soon! 🚀
              </h2>
              
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", marginBottom: 16 }}>
                <span style={{ color: "#fbbf24", fontWeight: 700 }}>{selectedFeature}</span> is under development
              </p>
              
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 24 }}>
                We're working hard to bring you this feature. Stay tuned for updates!
              </p>
              
              <button
                onClick={() => setShowComingModal(false)}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "linear-gradient(135deg, #00ffa3, #00c9ff)",
                  border: "none",
                  borderRadius: 12,
                  color: "#060610",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer"
                }}
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Toast */}
      <AnimatePresence>
        {showNotification && (
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
              background: "linear-gradient(135deg,#00ffa3,#00c9ff)",
              padding: "10px 22px",
              borderRadius: 40,
              color: "#060610",
              fontWeight: 700,
              fontSize: T.base,
              whiteSpace: "nowrap",
              boxShadow: "0 0 28px rgba(0,255,163,0.45)",
            }}
          >
            {notificationMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <div style={{
        minHeight: "100vh",
        width: "100%",
        background: "#060610",
        display: "flex",
        justifyContent: "center",
        position: "relative",
        overflowX: "hidden",
      }}>
        {/* Background Effects */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
          <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", top: "-15%", left: "-10%", background: "radial-gradient(circle,rgba(0,255,163,0.07) 0%,transparent 65%)" }} />
          <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", bottom: "-15%", right: "-8%", background: "radial-gradient(circle,rgba(124,58,237,0.09) 0%,transparent 65%)" }} />
        </div>

        {/* Content */}
        <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 1200, padding: "0 20px", margin: "0 auto" }}>
          
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 28, paddingBottom: 20, flexWrap: "wrap", gap: 12 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#00ffa3,#00c9ff)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Zap size={17} color="#060610" />
              </div>
              <span style={{ color: "#fff", fontSize: T.md, fontWeight: 800, letterSpacing: "-0.02em" }}>Campus Craze</span>
            </div>

            {/* Search Bar */}
            <div style={{ flex: 1, maxWidth: 300, marginLeft: 20 }}>
              <input
                type="text"
                placeholder="🔍 Search features..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 16px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 20,
                  color: "#fff",
                  fontSize: 13,
                  outline: "none"
                }}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(255,215,0,0.1)", padding: "5px 11px", borderRadius: 20, border: "1px solid rgba(255,215,0,0.3)" }}>
                <Gift size={12} color="#fbbf24" />
                <span style={{ fontSize: T.xs, fontWeight: 700, color: "#fbbf24" }}>{stats.coins}</span>
              </div>
              
              <motion.button whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.05 }} onClick={handleUpgradeToPro}
                style={{
                  display: "flex", alignItems: "center", gap: 6, fontSize: T.xs, fontWeight: 700,
                  padding: "5px 12px", borderRadius: 20,
                  background: stats.isPro ? "linear-gradient(135deg, #ffd700, #ffed4e)" : "linear-gradient(135deg, #00ffa3, #00c9ff)",
                  color: stats.isPro ? "#000" : "#060610", border: "none", cursor: "pointer",
                }}>
                <Crown size={12} /> {stats.isPro ? "Pro" : "Upgrade"}
              </motion.button>
              
              <motion.button whileTap={{ scale: 0.88 }} onClick={logout}
                style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(255,75,110,0.1)", border: "1px solid rgba(255,75,110,0.2)", color: "#ff4b6e", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <LogOut size={15} />
              </motion.button>
              
              <motion.button whileTap={{ scale: 0.88 }} onClick={() => handleNavigate("/profile", "Profile", "live")}
                style={{ width: 38, height: 38, borderRadius: 12, background: "linear-gradient(135deg,#7c3aed,#2563eb)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: T.sm, fontWeight: 800, cursor: "pointer", border: "none" }}>
                {initials}
              </motion.button>
            </div>
          </motion.header>

          {/* Hero Section */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ paddingTop: 20, paddingBottom: 20 }}
          >
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: T.xxs, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
              Good {timeLabel} ✦
            </p>
            <h1 style={{ fontSize: T.hero, fontWeight: 800, lineHeight: 1.1, color: "#fff", marginBottom: 10, letterSpacing: "-0.03em" }}>
              Your AI<br />
              <span style={{ background: "linear-gradient(90deg,#00ffa3 0%,#00c9ff 50%,#7c3aed 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Placement Hub
              </span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: T.sm, fontWeight: 500 }}>
              16+ Features · AI-Powered · Get Job Ready
            </p>
          </motion.section>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: 12, paddingTop: 20, marginBottom: 24 }}
          >
            {[
              { label: "Score", val: stats.score, dec: 1, color: "#00ffa3", icon: <BarChart3 size={14} /> },
              { label: "Tests", val: stats.attempts, dec: 0, color: "#00c9ff", icon: <TrendingUp size={14} /> },
              { label: "Streak", val: stats.streak, dec: 0, color: "#f97316", icon: <Flame size={14} /> },
              { label: "Rank", val: stats.rank, dec: 0, color: "#a78bfa", icon: <Trophy size={14} /> },
              { label: "Coins", val: stats.coins, dec: 0, color: "#fbbf24", icon: <Gift size={14} /> },
            ].map((s, i) => (
              <TiltCard key={i}>
                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "12px 8px", textAlign: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginBottom: 6 }}>
                    <span style={{ color: s.color }}>{s.icon}</span>
                    <p style={{ color: "rgba(255,255,255,0.5)", fontSize: T.xxs, fontWeight: 600 }}>{s.label}</p>
                  </div>
                  <span style={{ fontSize: T.stat, fontWeight: 800, color: s.color }}>
                    <Counter to={s.val} decimals={s.dec} />
                  </span>
                </div>
              </TiltCard>
            ))}
          </motion.div>

          {/* Daily Challenge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.26 }}
            onClick={!challengeDone ? handleDailyChallenge : undefined}
            style={{
              marginBottom: 24, borderRadius: 18, padding: "16px 20px",
              background: challengeDone ? "linear-gradient(135deg,rgba(0,255,163,0.08),rgba(0,201,255,0.04))" : "linear-gradient(135deg,rgba(251,191,36,0.1),rgba(245,158,11,0.05))",
              border: `1px solid ${challengeDone ? "rgba(0,255,163,0.25)" : "rgba(251,191,36,0.25)"}`,
              cursor: challengeDone ? "default" : "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: challengeDone ? "rgba(0,255,163,0.12)" : "rgba(251,191,36,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {challengeDone ? <Award size={22} color="#00ffa3" /> : <Target size={22} color="#fbbf24" />}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: challengeDone ? "#00ffa3" : "#fbbf24", fontSize: T.base, fontWeight: 700 }}>
                  {challengeDone ? "Challenge Complete! 🎉" : "Daily Challenge"}
                </p>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: T.sm }}>{dailyChallenge.title}</p>
                <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 99, marginTop: 8 }}>
                  <div style={{ width: `${challengePct}%`, height: "100%", borderRadius: 99, background: challengeDone ? "linear-gradient(90deg,#00ffa3,#00c9ff)" : "linear-gradient(90deg,#fbbf24,#f59e0b)" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                  <span style={{ fontSize: T.xs, color: "rgba(255,255,255,0.5)" }}>{dailyChallenge.progress}/{dailyChallenge.target}</span>
                  <span style={{ fontSize: T.xs, fontWeight: 700, color: challengeDone ? "#00ffa3" : "#fbbf24" }}>+{dailyChallenge.reward} 🪙</span>
                </div>
              </div>
              {!challengeDone && <ChevronRight size={18} color="#fbbf24" />}
            </div>
          </motion.div>

          {/* Category Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24, overflowX: "auto", paddingBottom: 8 }}
          >
            <button onClick={() => setSelectedCategory("all")} style={{
              padding: "6px 16px", borderRadius: 20, fontSize: 12, fontWeight: 600,
              background: selectedCategory === "all" ? "linear-gradient(135deg,#00ffa3,#00c9ff)" : "rgba(255,255,255,0.05)",
              color: selectedCategory === "all" ? "#060610" : "rgba(255,255,255,0.7)", border: "none", cursor: "pointer"
            }}>All Features</button>
            {Object.keys(FEATURE_CATEGORIES).map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)} style={{
                padding: "6px 16px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                background: selectedCategory === cat ? "linear-gradient(135deg,#00ffa3,#00c9ff)" : "rgba(255,255,255,0.05)",
                color: selectedCategory === cat ? "#060610" : "rgba(255,255,255,0.7)", border: "none", cursor: "pointer"
              }}>{cat}</button>
            ))}
          </motion.div>

          {/* Features Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14, marginBottom: 32 }}>
            {filteredFeatures.map((feature, idx) => (
              <motion.button
                key={idx}
                onClick={() => handleNavigate(feature.route, feature.title, feature.status)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(0.1 + idx * 0.02, 0.5) }}
                whileHover={{ scale: feature.status === "live" ? 1.02 : 1 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  background: `linear-gradient(135deg, ${feature.accent}10, rgba(255,255,255,0.02))`,
                  border: `1px solid ${feature.accent}30`,
                  borderRadius: 16, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14,
                  cursor: "pointer", textAlign: "left", position: "relative", overflow: "hidden",
                  opacity: feature.status === "coming" ? 0.85 : 1
                }}
              >
                {feature.isNew && (
                  <div style={{ position: "absolute", top: 0, right: 0, background: "linear-gradient(135deg, #ff4b6e, #ff6b8e)", padding: "2px 12px", borderRadius: "0 16px 0 16px", fontSize: 9, fontWeight: 700, color: "#fff" }}>NEW</div>
                )}
                {feature.status === "coming" && (
                  <div style={{ position: "absolute", top: 0, left: 0, background: "rgba(251,191,36,0.9)", padding: "2px 10px", borderRadius: "0 0 12px 0", fontSize: 8, fontWeight: 700, color: "#060610", display: "flex", alignItems: "center", gap: 3 }}>
                    <Construction size={10} /> COMING SOON
                  </div>
                )}
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${feature.accent}15`, border: `1px solid ${feature.accent}30`, display: "flex", alignItems: "center", justifyContent: "center", color: feature.accent }}>
                  {feature.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
                    <p style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>{feature.title}</p>
                    <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 20, background: `${feature.accent}20`, color: feature.accent }}>{feature.tag}</span>
                  </div>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>{feature.sub}</p>
                </div>
                <ChevronRight size={16} color={feature.accent} />
              </motion.button>
            ))}
          </div>

          {/* Pro Upgrade Banner */}
          {!stats.isPro && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              onClick={handleUpgradeToPro}
              style={{
                marginBottom: 24, background: "linear-gradient(135deg, rgba(255,215,0,0.1), rgba(255,165,0,0.05))",
                border: "1px solid rgba(255,215,0,0.3)", borderRadius: 16, padding: "16px 20px", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "space-between"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Crown size={24} color="#fbbf24" />
                <div>
                  <p style={{ fontWeight: 700, color: "#fbbf24" }}>Unlock Pro Features</p>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>AI feedback · Unlimited tests · Priority support</p>
                </div>
              </div>
              <ChevronRight size={18} color="#fbbf24" />
            </motion.div>
          )}

          {/* Recent Activity & Leaderboard */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
            
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55 }}
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 18, padding: "16px" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <Activity size={14} color="#00c9ff" />
                <p style={{ fontSize: T.base, fontWeight: 700, color: "#fff" }}>Recent Activity</p>
              </div>
              {recentActivities.map((act, i) => (
                <div key={i} style={{ marginBottom: 12, paddingBottom: 10, borderBottom: i < recentActivities.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <span style={{ color: "#00c9ff" }}>{act.icon}</span>
                    <p style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>{act.action}</p>
                  </div>
                  <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{act.topic} · {act.time}</p>
                  {act.score != null && <p style={{ fontSize: 11, fontWeight: 600, color: "#00ffa3", marginTop: 2 }}>Score: {act.score}%</p>}
                </div>
              ))}
            </motion.div>

            {/* Leaderboard */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 18, padding: "16px" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <Trophy size={14} color="#fbbf24" />
                <p style={{ fontSize: T.base, fontWeight: 700, color: "#fff" }}>Leaderboard</p>
              </div>
              {leaderboard.map((entry, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, padding: "4px 6px", borderRadius: 10, background: entry.isCurrent ? "rgba(167,139,250,0.1)" : "transparent" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: entry.rank <= 3 ? "#fbbf24" : "rgba(255,255,255,0.4)", width: 28 }}>#{entry.rank}</span>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: entry.isCurrent ? "linear-gradient(135deg,#7c3aed,#2563eb)" : "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#fff" }}>
                    {entry.avatar}
                  </div>
                  <p style={{ flex: 1, fontSize: 12, fontWeight: entry.isCurrent ? 700 : 500, color: entry.isCurrent ? "#a78bfa" : "rgba(255,255,255,0.7)" }}>{entry.name}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    {entry.isPro && <Crown size={9} color="#fbbf24" />}
                    <p style={{ fontSize: 12, fontWeight: 700, color: "#00ffa3" }}>{entry.score}</p>
                  </div>
                </div>
              ))}
              <button 
                onClick={() => handleNavigate("/leaderboard", "Leaderboard", "live")}
                style={{ width: "100%", marginTop: 8, padding: "7px", borderRadius: 9, background: "rgba(255,255,255,0.04)", border: "none", fontSize: T.xs, fontWeight: 600, color: "rgba(255,255,255,0.45)", cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
              >View Full →</button>
            </motion.div>
          </div>

          {/* Footer Stats */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", marginBottom: 24, borderTop: "1px solid rgba(255,255,255,0.06)", flexWrap: "wrap", gap: 12 }}
          >
            {[
              { icon: <BookOpen size={13} color="#00c9ff" />, label: `${stats.totalQuestions} questions solved` },
              { icon: <Target size={13} color="#00ffa3" />, label: `${stats.accuracy}% avg accuracy` },
              { icon: <Flame size={13} color="#f97316" />, label: `${stats.streak} day streak` },
              { icon: <Users size={13} color="#a78bfa" />, label: "500+ active users" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {item.icon}
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{item.label}</span>
              </div>
            ))}
          </motion.footer>

        </div>
      </div>
    </>
  );
}