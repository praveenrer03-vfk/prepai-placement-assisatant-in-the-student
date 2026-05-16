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
// GLASS CARD STYLE — injected once safely
// ==================================================
if (!document.getElementById('glass-card-style')) {
  const style = document.createElement('style');
  style.id = 'glass-card-style';
  style.textContent = `
    .glass-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .spin { animation: spin 1s linear infinite; }
  `;
  document.head.appendChild(style);
}

// ==================================================
// HELPERS
// ==================================================
const difficultyClass = (difficulty) => {
  if (difficulty === 'Easy') return 'bg-green-500/20 text-green-400';
  if (difficulty === 'Medium') return 'bg-yellow-500/20 text-yellow-400';
  return 'bg-red-500/20 text-red-400';
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
  const [questions, setQuestions] = useState([]);   // ← from DB
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
        // Token expired — redirect to login
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

    // Fetch questions from DB
    fetchQuestions();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
  // Uses _id from MongoDB for solved tracking
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
  // NOTE: Now uses _id (MongoDB) instead of id (hardcoded)
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

    const qId = selectedQuestion._id; // ← MongoDB _id
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
  // Uses questions from DB + _id for matching
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

  // Unique topics from DB questions for filter buttons
  const topics = ['All', ...new Set(questions.map((q) => q.topic).filter(Boolean))];

  // ==================================================
  // RENDER
  // ==================================================
  return (
    <div className="min-h-screen bg-[#060610]">

      {/* ── Success Popup ── */}
      <AnimatePresence>
        {showSuccessPopup && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3">
              <CheckCircle className="w-6 h-6" />
              <span className="font-semibold">Problem Solved! 🎉 +50 Coins!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-6 max-w-7xl">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </motion.button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00ffa3] to-[#00c9ff] bg-clip-text text-transparent">
                Coding Practice
              </h1>
              <p className="text-gray-400 mt-1">Practice DSA & coding interview problems</p>
            </div>
          </div>

          <div className="flex gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="glass-card px-4 py-2 rounded-xl flex items-center gap-2"
            >
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="text-white font-bold">{dailyStreak} day streak</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="glass-card px-4 py-2 rounded-xl flex items-center gap-2"
            >
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-white font-bold">{totalCoins} coins</span>
            </motion.div>
          </div>
        </div>

        {/* ── Progress ── */}
        <div className="glass-card rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-[#00ffa3]" />
            Your Progress
          </h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{stats.total}</div>
              <div className="text-sm text-gray-400">Total Solved</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">{stats.easy.solved}</div>
              <div className="text-sm text-gray-400">Easy ({stats.easy.total})</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">{stats.medium.solved}</div>
              <div className="text-sm text-gray-400">Medium ({stats.medium.total})</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400">{stats.hard.solved}</div>
              <div className="text-sm text-gray-400">Hard ({stats.hard.total})</div>
            </div>
          </div>
        </div>

        {/* ── Search & Filters ── */}
        <div className="glass-card rounded-2xl p-6 mb-8">
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
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#00ffa3] transition-colors"
            />
          </div>

          <div className="mb-4">
            <label className="text-sm text-gray-400 mb-2 block">Difficulty</label>
            <div className="flex gap-2 flex-wrap">
              {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
                <motion.button
                  key={diff}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDifficultyFilter(diff)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    difficultyFilter === diff
                      ? 'bg-gradient-to-r from-[#00ffa3] to-[#00c9ff] text-black font-semibold'
                      : 'bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
                  {diff}
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">Topics</label>
            <div className="flex gap-2 flex-wrap">
              {/* Topics are now dynamically generated from DB questions */}
              {topics.map((topic) => (
                <motion.button
                  key={topic}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTopicFilter(topic)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    topicFilter === topic
                      ? 'bg-gradient-to-r from-[#00ffa3] to-[#00c9ff] text-black font-semibold'
                      : 'bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
                  {topic}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Questions List ── */}
        <div className="grid gap-4">
          <h2 className="text-xl font-semibold text-white mb-2">
            Problems
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
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#00ffa3] to-[#00c9ff] text-black font-semibold"
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
            filteredQuestions.map((question) => (
              <motion.div
                key={question._id}           /* ← MongoDB _id */
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
                className="glass-card rounded-xl p-5 flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{question.title}</h3>
                    {isQuestionSolved(question._id) && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                  <div className="flex gap-2">
                    <span
                      className={`px-2 py-1 rounded-lg text-xs font-medium ${difficultyClass(
                        question.difficulty
                      )}`}
                    >
                      {question.difficulty}
                    </span>
                    <span className="px-2 py-1 rounded-lg text-xs font-medium bg-blue-500/20 text-blue-400">
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
                  className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                    isQuestionSolved(question._id)
                      ? 'bg-green-500/20 text-green-400 cursor-default'
                      : 'bg-gradient-to-r from-[#00ffa3] to-[#00c9ff] text-black hover:shadow-lg cursor-pointer'
                  }`}
                >
                  {isQuestionSolved(question._id) ? 'Solved' : 'Solve'}
                </motion.button>
              </motion.div>
            ))}
        </div>
      </div>

      {/* ── Code Editor Modal ── */}
      <AnimatePresence>
        {showEditor && selectedQuestion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleCloseEditor}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0a0a1a] rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-[#0a0a1a] border-b border-white/10 p-4 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedQuestion.title}</h3>
                  <div className="flex gap-2 mt-1">
                    <span
                      className={`px-2 py-1 rounded-lg text-xs font-medium ${difficultyClass(
                        selectedQuestion.difficulty
                      )}`}
                    >
                      {selectedQuestion.difficulty}
                    </span>
                    <span className="px-2 py-1 rounded-lg text-xs font-medium bg-blue-500/20 text-blue-400">
                      {selectedQuestion.topic}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleCloseEditor}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Problem Statement</h4>
                  <p className="text-gray-300">{selectedQuestion.description}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4">
                    <h5 className="text-sm font-semibold text-[#00ffa3] mb-2">Input Format</h5>
                    <p className="text-gray-300 text-sm">{selectedQuestion.inputFormat}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <h5 className="text-sm font-semibold text-[#00ffa3] mb-2">Output Format</h5>
                    <p className="text-gray-300 text-sm">{selectedQuestion.outputFormat}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4">
                    <h5 className="text-sm font-semibold text-yellow-400 mb-2">Sample Input</h5>
                    <pre className="text-gray-300 text-sm font-mono">{selectedQuestion.sampleInput}</pre>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <h5 className="text-sm font-semibold text-yellow-400 mb-2">Sample Output</h5>
                    <pre className="text-gray-300 text-sm font-mono">{selectedQuestion.sampleOutput}</pre>
                  </div>
                </div>

                {/* Code Editor */}
                <div>
                  <label
                    htmlFor="code-editor"
                    className="text-lg font-semibold text-white mb-2 block"
                  >
                    Your Code
                  </label>
                  <textarea
                    id="code-editor"
                    name="code-editor"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    autoComplete="off"
                    spellCheck={false}
                    className="w-full h-64 bg-[#1a1a2e] border border-white/10 rounded-xl p-4 text-white font-mono text-sm focus:outline-none focus:border-[#00ffa3] resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRunCode}
                    className="flex-1 py-3 rounded-xl bg-white/10 text-white font-semibold flex items-center justify-center gap-2 hover:bg-white/20 transition-colors"
                  >
                    <Play className="w-5 h-5" />
                    Run Code
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmitCode}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#00ffa3] to-[#00c9ff] text-black font-semibold flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Submit Solution
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CodingPractice;