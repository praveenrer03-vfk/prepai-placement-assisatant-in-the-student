import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring
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

// Animated Counter Component with Spring Physics for smoother feel
function Counter({ to, decimals = 0 }) {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = parseFloat(to);
    if (start === end) return;

    let totalMiliseconds = 1000;
    let timer = setInterval(() => {
      start += end / (totalMiliseconds / 20);
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(start);
      }
    }, 20);

    return () => clearInterval(timer);
  }, [to]);

  return <>{decimals ? displayValue.toFixed(decimals) : Math.floor(displayValue)}</>;
}

// Enhanced Tilt Card with Spring smoothing
function TiltCard({ children, style }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

export default function Leaderboard() {
  const navigate = useNavigate();
  const [timeFrame, setTimeFrame] = useState("weekly");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [userRank, setUserRank] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);

  // Data structure remains same as your mock...
  const allLeaderboardData = { /* ... your data ... */ };

  const leaderboardData = allLeaderboardData[timeFrame] || [];
  
  const filteredData = useMemo(() => {
    let data = [...leaderboardData];
    if (searchTerm) {
      data = data.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory === "pro") data = data.filter((user) => user.isPro);
    if (selectedCategory === "free") data = data.filter((user) => !user.isPro);
    
    return data.sort((a, b) => b.score - a.score);
  }, [leaderboardData, searchTerm, selectedCategory]);

  useEffect(() => {
    const currentUserIndex = filteredData.findIndex(u => u.isCurrent);
    if (currentUserIndex !== -1) {
      const newRank = currentUserIndex + 1;
      const prevRank = localStorage.getItem(`prevRank_${timeFrame}`);
      
      if (prevRank && newRank < parseInt(prevRank)) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 4000);
      }
      setUserRank(newRank);
      localStorage.setItem(`prevRank_${timeFrame}`, newRank);
    }
  }, [filteredData, timeFrame]);

  // Helper for Rank Styling
  const getRankStyles = (rank) => {
    const configs = {
      1: { color: "#fbbf24", icon: <Crown size={18} /> },
      2: { color: "#94a3b8", icon: <Medal size={18} /> },
      3: { color: "#cd7f32", icon: <Medal size={18} /> }
    };
    return configs[rank] || { color: "rgba(255,255,255,0.4)", icon: null };
  };

  return (
    <div style={{ backgroundColor: "#060610", color: "#fff", minHeight: "100vh", paddingBottom: 50 }}>
      {/* Toast Notification */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ y: -100, x: "-50%", opacity: 0 }}
            animate={{ y: 20, x: "-50%", opacity: 1 }}
            exit={{ y: -100, x: "-50%", opacity: 0 }}
            style={{
              position: "fixed", left: "50%", zIndex: 2000,
              background: "linear-gradient(90deg, #fbbf24, #f59e0b)",
              color: "#000", padding: "12px 24px", borderRadius: "50px",
              fontWeight: "bold", boxShadow: "0 10px 25px rgba(251,191,36,0.5)"
            }}
          >
            🚀 Rank Up! You are now #{userRank}!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container - Added responsive overflow handling */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "20px" }}>
        
        {/* Header and Stats sections here... */}

        {/* Scrollable Table Wrapper for Mobile */}
        <div style={{ overflowX: "auto", borderRadius: 20, border: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ minWidth: "700px" }}> {/* Ensures table doesn't squash */}
            {/* Render your Table Header and Rows here */}
          </div>
        </div>
      </div>
    </div>
  );
}