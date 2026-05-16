// src/pages/CodingPractice.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Search,
  CheckCircle,
  Trophy,
  Flame,
  Brain,
  Play,
  Send,
  X,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

// ==================================================
// CONFIG
// ==================================================
const API_URL = 'https://prepai-placement-assisatant-in-the.onrender.com';

// ==================================================
// GLASS CARD STYLE & FONTS — injected once safely
// ==================================================
if (!document.getElementById('glass-card-style')) {
  const style = document.createElement('style');
  style.id = 'glass-card-style';
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,100..900;1,100..900&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap');
    
    * {
      font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }
    
    .font-mono, textarea, pre, code {
      font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
    }
    
    .glass-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition: all 0.3s ease;
    }
    
    .glass-card:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }
    
    @keyframes spin { to { transform: rotate(360deg); } }
    .spin { animation: spin 1s linear infinite; }
    
    @keyframes gradient-shift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    .animate-gradient {
      background-size: 200% auto;
      animation: gradient-shift 3s ease infinite;
    }
    
    @keyframes glow-pulse {
      0%, 100% { box-shadow: 0 0 5px rgba(0, 255, 163, 0.3); }
      50% { box-shadow: 0 0 20px rgba(0, 255, 163, 0.6); }
    }
    
    /* Custom scrollbar */
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    
    ::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 10px;
    }
    
    ::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #00ffa3, #00c9ff);
      border-radius: 10px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(135deg, #00ffa3, #00c9ff);
    }
    
    textarea::-webkit-scrollbar {
      width: 8px;
    }
    
    textarea::-webkit-scrollbar-track {
      background: #1a1a2e;
      border-radius: 4px;
    }
    
    textarea::-webkit-scrollbar-thumb {
      background: #00ffa3;
      border-radius: 4px;
    }
    
    /* UNIQUE EXIT BUTTON STYLE — Neon Pulse with Rotate and Glow */
    .exit-button-unique {
      position: relative;
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: linear-gradient(135deg, rgba(255, 59, 48, 0.15), rgba(255, 59, 48, 0.05));
      border: 1px solid rgba(255, 59, 48, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      overflow: hidden;
    }
    
    .exit-button-unique::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255, 59, 48, 0.4), transparent);
      transform: translate(-50%, -50%);
      transition: width 0.5s, height 0.5s;
    }
    
    .exit-button-unique:hover::before {
      width: 100px;
      height: 100px;
    }
    
    .exit-button-unique:hover {
      transform: rotate(180deg) scale(1.1);
      background: linear-gradient(135deg, rgba(255, 59, 48, 0.3), rgba(255, 59, 48, 0.15));
      border-color: rgba(255, 59, 48, 0.8);
      box-shadow: 0 0 20px rgba(255, 59, 48, 0.5);
    }
    
    .exit-button-unique:active {
      transform: rotate(180deg) scale(0.95);
    }
    
    /* Input focus glow */
    input:focus, textarea:focus {
      animation: glow-pulse 1.5s infinite;
    }
  `;
  document.head.appendChild(style);
}

// ==================================================
// HELPERS
// ==================================================
const difficultyClass = (difficulty) => {
  if (difficulty === 'Easy') return 'bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-400 border border-green-500/30';
  if (difficulty === 'Medium') return 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-400 border border-yellow-500/30';
  return 'bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-400 border border-red-500/30';
};

const todayString = () => new Date().toDateString();
const yesterdayString = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toDateString();
};

// ==================================================
// MAIN COMPONENT
// ==================================================
const CodingPractice = () => {
  const navigate = useNavigate();

  // ── Filter state ──
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [topicFilter, setTopicFilter] = useState('All');

  // ── Data state ──
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── UI state ──
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [code, setCode] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // ── Progress state ──
  const [solvedQuestions, setSolvedQuestions] = useState([]);
  const [dailyStreak, setDailyStreak] = useState(0);
  const [lastSolvedDate, setLastSolvedDate] = useState('');
  const [totalCoins, setTotalCoins] = useState(0);

  const popupTimer = useRef(null);

  // ========== FETCH QUESTIONS FROM DB ==========
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/');
        return;
      }

      const res = await fetch(`${API_URL}/api/coding/questions`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        localStorage.clear();
        navigate('/');
        return;
      }

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();
      setQuestions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ========== LOAD FROM LOCALSTORAGE ON MOUNT ==========
  useEffect(() => {
    const savedSolved = localStorage.getItem('codingSolvedQuestions');
    if (savedSolved) {
      try {
        setSolvedQuestions(JSON.parse(savedSolved));
      } catch {
        localStorage.removeItem('codingSolvedQuestions');
      }
    }

    const savedStreak = localStorage.getItem('codingDailyStreak');
    const savedLastDate = localStorage.getItem('codingLastSolvedDate');
    const savedCoins = localStorage.getItem('codingTotalCoins');

    const parsedStreak = parseInt(savedStreak, 10);
    const parsedCoins = parseInt(savedCoins, 10);

    if (!isNaN(parsedStreak)) setDailyStreak(parsedStreak);
    if (savedLastDate) setLastSolvedDate(savedLastDate);
    if (!isNaN(parsedCoins)) setTotalCoins(parsedCoins);

    fetchQuestions();
  }, []);

  // ========== STREAK CHECK ==========
  useEffect(() => {
    if (!lastSolvedDate) return;
    const today = todayString();
    const yesterday = yesterdayString();
    if (lastSolvedDate !== today && lastSolvedDate !== yesterday) {
      setDailyStreak(0);
    }
  }, [lastSolvedDate]);

  // ========== PERSIST SOLVED QUESTIONS ==========
  useEffect(() => {
    localStorage.setItem('codingSolvedQuestions', JSON.stringify(solvedQuestions));
  }, [solvedQuestions]);

  // ========== PERSIST STREAK & COINS ==========
  useEffect(() => {
    localStorage.setItem('codingDailyStreak', dailyStreak.toString());
    localStorage.setItem('codingLastSolvedDate', lastSolvedDate);
    localStorage.setItem('codingTotalCoins', totalCoins.toString());
    localStorage.setItem('userCoins', totalCoins.toString());
  }, [dailyStreak, lastSolvedDate, totalCoins]);

  // ========== CLEANUP TIMER ==========
  useEffect(() => {
    return () => {
      if (popupTimer.current) clearTimeout(popupTimer.current);
    };
  }, []);

  // ========== STREAK UPDATE ON SOLVE ==========
  const updateStreakOnSolve = () => {
    const today = todayString();
    if (lastSolvedDate === today) return;
    if (lastSolvedDate === yesterdayString()) {
      setDailyStreak((prev) => prev + 1);
    } else {
      setDailyStreak(1);
    }
    setLastSolvedDate(today);
  };

  const awardCoins = () => setTotalCoins((prev) => prev + 50);

  // ========== FILTERING ==========
  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = searchTerm
      ? q.title.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const matchesDifficulty =
      difficultyFilter === 'All' ? true : q.difficulty === difficultyFilter;
    const matchesTopic = topicFilter === 'All' ? true : q.topic === topicFilter;
    return matchesSearch && matchesDifficulty && matchesTopic;
  });

  // ========== HELPERS ==========
  const isQuestionSolved = (questionId) => solvedQuestions.includes(questionId);

  const handleSolveClick = (question) => {
    setSelectedQuestion(question);
    setCode(question.starterCode || '// Write your code here\n');
    setShowEditor(true);
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
    setSelectedQuestion(null);
  };

  const handleSubmitCode = () => {
    if (!code.trim() || !selectedQuestion) return;

    const qId = selectedQuestion._id;
    if (!isQuestionSolved(qId)) {
      setSolvedQuestions((prev) => [...prev, qId]);
      updateStreakOnSolve();
      awardCoins();
      setShowSuccessPopup(true);
      popupTimer.current = setTimeout(() => setShowSuccessPopup(false), 3000);
    }

    handleCloseEditor();
  };

  const handleRunCode = () => {
    alert(
      'Running code... (Demo)\nIn a production app this would execute your code against test cases.'
    );
  };

  // ========== PROGRESS STATS ==========
  const getProgressStats = () => {
    const countByDifficulty = (difficulty) =>
      solvedQuestions.filter((id) => {
        const q = questions.find((q) => q._id === id);
        return q && q.difficulty === difficulty;
      }).length;

    const totalByDifficulty = (difficulty) =>
      questions.filter((q) => q.difficulty === difficulty).length;

    return {
      total: solvedQuestions.length,
      easy: { solved: countByDifficulty('Easy'), total: totalByDifficulty('Easy') },
      medium: { solved: countByDifficulty('Medium'), total: totalByDifficulty('Medium') },
      hard: { solved: countByDifficulty('Hard'), total: totalByDifficulty('Hard') },
    };
  };

  const stats = getProgressStats();

  const topics = ['All', ...new Set(questions.map((q) => q.topic).filter(Boolean))];

  // ==================================================
  // RENDER
  // ==================================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#060610] via-[#0a0a1a] to-[#060610]">
      {/* Animated background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#00ffa3]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#00c9ff]/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* ── Success Popup ── */}
      <AnimatePresence>
        {showSuccessPopup && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <CheckCircle className="w-6 h-6" />
              </motion.div>
              <span className="font-semibold">Problem Solved! 🎉 +50 Coins!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-6 max-w-7xl relative z-10">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05, x: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-[#00ffa3]/50"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </motion.button>
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl font-bold bg-gradient-to-r from-[#00ffa3] via-[#00c9ff] to-[#00ffa3] bg-clip-text text-transparent animate-gradient"
              >
                Coding Practice
              </motion.h1>
              <p className="text-gray-400 mt-1 font-medium">Master DSA with interactive coding challenges</p>
            </div>
          </div>

          <div className="flex gap-3">
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              className="glass-card px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg"
            >
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="text-white font-bold text-lg">{dailyStreak}</span>
              <span className="text-gray-400 text-sm">day streak</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              className="glass-card px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg"
            >
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-white font-bold text-lg">{totalCoins}</span>
              <span className="text-gray-400 text-sm">coins</span>
            </motion.div>
          </div>
        </div>

        {/* ── Progress Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-white mb-5 flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-r from-[#00ffa3] to-[#00c9ff]">
              <Brain className="w-4 h-4 text-black" />
            </div>
            Your Progress Dashboard
          </h2>
          <div className="grid grid-cols-4 gap-5">
            {[
              { label: 'Total Solved', value: stats.total, color: 'text-white' },
              { label: 'Easy', value: stats.easy.solved, total: stats.easy.total, color: 'text-green-400' },
              { label: 'Medium', value: stats.medium.solved, total: stats.medium.total, color: 'text-yellow-400' },
              { label: 'Hard', value: stats.hard.solved, total: stats.hard.total, color: 'text-red-400' }
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 + idx * 0.05 }}
                className="text-center p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
              >
                <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-sm text-gray-400 mt-1">
                  {stat.label}
                  {stat.total && ` (${stat.total})`}
                </div>
                {stat.total && (
                  <div className="w-full bg-white/10 rounded-full h-1 mt-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(stat.value / stat.total) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className={`h-full rounded-full ${
                        stat.label === 'Easy' ? 'bg-green-400' : 
                        stat.label === 'Medium' ? 'bg-yellow-400' : 'bg-red-400'
                      }`}
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Search & Filters ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-6 mb-8"
        >
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="question-search"
              name="question-search"
              type="text"
              placeholder="Search coding questions by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoComplete="off"
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#00ffa3] focus:shadow-lg transition-all duration-300"
            />
          </div>

          <div className="mb-4">
            <label className="text-sm text-gray-400 mb-2 block font-medium">Difficulty</label>
            <div className="flex gap-2 flex-wrap">
              {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
                <motion.button
                  key={diff}
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDifficultyFilter(diff)}
                  className={`px-4 py-2 rounded-xl transition-all duration-300 font-medium ${
                    difficultyFilter === diff
                      ? 'bg-gradient-to-r from-[#00ffa3] to-[#00c9ff] text-black shadow-lg'
                      : 'bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
                  {diff}
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block font-medium">Topics</label>
            <div className="flex gap-2 flex-wrap">
              {topics.map((topic) => (
                <motion.button
                  key={topic}
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTopicFilter(topic)}
                  className={`px-4 py-2 rounded-xl transition-all duration-300 font-medium ${
                    topicFilter === topic
                      ? 'bg-gradient-to-r from-[#00ffa3] to-[#00c9ff] text-black shadow-lg'
                      : 'bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
                  {topic}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Questions List ── */}
        <div className="grid gap-4">
          <h2 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
            <span className="text-[#00ffa3]">📝</span> Problems
            {!loading && !error && (
              <span className="ml-2 text-sm text-gray-500 font-normal">
                ({filteredQuestions.length} shown)
              </span>
            )}
          </h2>

          {/* Loading State */}
          {loading && (
            <div className="glass-card rounded-2xl p-12 text-center">
              <RefreshCw className="w-8 h-8 text-[#00ffa3] mx-auto mb-3 spin" />
              <p className="text-gray-400 animate-pulse">Loading questions from database...</p>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="glass-card rounded-2xl p-12 text-center">
              <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
              <p className="text-red-400 mb-4">Failed to load: {error}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchQuestions}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#00ffa3] to-[#00c9ff] text-black font-semibold"
              >
                Retry
              </motion.button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredQuestions.length === 0 && (
            <div className="glass-card rounded-2xl p-12 text-center">
              <p className="text-gray-400">
                {questions.length === 0
                  ? 'No questions in database yet. Visit /api/coding/seed to add questions.'
                  : 'No questions match your filters.'}
              </p>
            </div>
          )}

          {/* Questions */}
          {!loading && !error &&
            filteredQuestions.map((question, index) => (
              <motion.div
                key={question._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.01, x: 4 }}
                className="glass-card rounded-xl p-5 flex items-center justify-between group"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white group-hover:text-[#00ffa3] transition-colors">
                      {question.title}
                    </h3>
                    {isQuestionSolved(question._id) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500 }}
                      >
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </motion.div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${difficultyClass(
                        question.difficulty
                      )}`}
                    >
                      {question.difficulty}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-400 border border-blue-500/30">
                      {question.topic}
                    </span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: isQuestionSolved(question._id) ? 1 : 1.05 }}
                  whileTap={{ scale: isQuestionSolved(question._id) ? 1 : 0.95 }}
                  onClick={() =>
                    !isQuestionSolved(question._id) && handleSolveClick(question)
                  }
                  disabled={isQuestionSolved(question._id)}
                  className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                    isQuestionSolved(question._id)
                      ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 cursor-default border border-green-500/30'
                      : 'bg-gradient-to-r from-[#00ffa3] to-[#00c9ff] text-black hover:shadow-xl hover:shadow-[#00ffa3]/20 cursor-pointer'
                  }`}
                >
                  {isQuestionSolved(question._id) ? '✓ Solved' : 'Solve →'}
                </motion.button>
              </motion.div>
            ))}
        </div>
      </div>

      {/* ── Code Editor Modal with UNIQUE EXIT BUTTON ── */}
      <AnimatePresence>
        {showEditor && selectedQuestion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={handleCloseEditor}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-gradient-to-br from-[#0a0a1a] to-[#0f0f1f] rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with UNIQUE EXIT BUTTON */}
              <div className="sticky top-0 bg-gradient-to-r from-[#0a0a1a] to-[#0f0f1f] backdrop-blur-sm border-b border-white/10 p-5 flex justify-between items-center">
                <div>
                  <motion.h3 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                  >
                    {selectedQuestion.title}
                  </motion.h3>
                  <div className="flex gap-2 mt-2">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${difficultyClass(
                        selectedQuestion.difficulty
                      )}`}
                    >
                      {selectedQuestion.difficulty}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-400 border border-blue-500/30">
                      {selectedQuestion.topic}
                    </span>
                  </div>
                </div>
                {/* UNIQUE EXIT BUTTON - Neon Pulse with Rotate and Glow */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCloseEditor}
                  className="exit-button-unique"
                >
                  <X className="w-5 h-5 text-red-400" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="text-[#00ffa3]">📖</span> Problem Statement
                  </h4>
                  <p className="text-gray-300 leading-relaxed">{selectedQuestion.description}</p>
                </motion.div>

                <motion.div 
                  className="grid md:grid-cols-2 gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                >
                  <div className="bg-gradient-to-br from-white/5 to-white/3 rounded-xl p-4 border border-white/10">
                    <h5 className="text-sm font-semibold text-[#00ffa3] mb-2">📥 Input Format</h5>
                    <p className="text-gray-300 text-sm">{selectedQuestion.inputFormat}</p>
                  </div>
                  <div className="bg-gradient-to-br from-white/5 to-white/3 rounded-xl p-4 border border-white/10">
                    <h5 className="text-sm font-semibold text-[#00ffa3] mb-2">📤 Output Format</h5>
                    <p className="text-gray-300 text-sm">{selectedQuestion.outputFormat}</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="grid md:grid-cols-2 gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 rounded-xl p-4 border border-yellow-500/20">
                    <h5 className="text-sm font-semibold text-yellow-400 mb-2">📋 Sample Input</h5>
                    <pre className="text-gray-300 text-sm font-mono bg-black/30 p-2 rounded-lg overflow-x-auto">
                      {selectedQuestion.sampleInput}
                    </pre>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 rounded-xl p-4 border border-yellow-500/20">
                    <h5 className="text-sm font-semibold text-yellow-400 mb-2">✨ Sample Output</h5>
                    <pre className="text-gray-300 text-sm font-mono bg-black/30 p-2 rounded-lg overflow-x-auto">
                      {selectedQuestion.sampleOutput}
                    </pre>
                  </div>
                </motion.div>

                {/* Code Editor */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <label
                    htmlFor="code-editor"
                    className="text-lg font-semibold text-white mb-3 block flex items-center gap-2"
                  >
                    <span className="text-[#00ffa3]">💻</span> Your Solution
                  </label>
                  <textarea
                    id="code-editor"
                    name="code-editor"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    autoComplete="off"
                    spellCheck={false}
                    className="w-full h-72 bg-[#0d0d1a] border border-white/10 rounded-xl p-4 text-gray-200 font-mono text-sm focus:outline-none focus:border-[#00ffa3] focus:ring-1 focus:ring-[#00ffa3] resize-none transition-all"
                    placeholder="Write your code here..."
                  />
                </motion.div>

                {/* Action Buttons */}
                <motion.div 
                  className="flex gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleRunCode}
                    className="flex-1 py-3 rounded-xl bg-white/10 text-white font-semibold flex items-center justify-center gap-2 hover:bg-white/20 transition-all duration-300 border border-white/20"
                  >
                    <Play className="w-5 h-5" />
                    Run Code
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmitCode}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#00ffa3] to-[#00c9ff] text-black font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Send className="w-5 h-5" />
                    Submit Solution
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CodingPractice;