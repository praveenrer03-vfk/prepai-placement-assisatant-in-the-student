// src/pages/CodingPractice.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Search, 
  Code2, 
  CheckCircle, 
  Trophy,
  Flame,
  Calendar,
  Brain,
  Play,
  Send,
  X
} from 'lucide-react';

// ==================================================
// SAMPLE QUESTIONS DATA
// ==================================================
// Each question object contains all necessary information for the coding practice
const sampleQuestions = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    topic: "Arrays",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers that add up to target.",
    inputFormat: "First line: array of integers, Second line: target integer",
    outputFormat: "Indices of the two numbers (0-based)",
    sampleInput: "[2,7,11,15]\n9",
    sampleOutput: "[0,1]",
    starterCode: "function twoSum(nums, target) {\n    // Write your code here\n    \n}"
  },
  {
    id: 2,
    title: "Reverse String",
    difficulty: "Easy",
    topic: "Strings",
    description: "Write a function that reverses a string. The input string is given as an array of characters.",
    inputFormat: "Array of characters",
    outputFormat: "Reversed array of characters",
    sampleInput: "['h','e','l','l','o']",
    sampleOutput: "['o','l','l','e','h']",
    starterCode: "function reverseString(s) {\n    // Write your code here\n    \n}"
  },
  {
    id: 3,
    title: "Binary Search",
    difficulty: "Medium",
    topic: "Arrays",
    description: "Implement binary search to find target in sorted array. Return index if found, else -1.",
    inputFormat: "Sorted array and target value",
    outputFormat: "Index of target or -1",
    sampleInput: "[-1,0,3,5,9,12]\n9",
    sampleOutput: "4",
    starterCode: "function binarySearch(nums, target) {\n    // Write your code here\n    \n}"
  },
  {
    id: 4,
    title: "Reverse Linked List",
    difficulty: "Hard",
    topic: "Linked List",
    description: "Given the head of a singly linked list, reverse the list and return its head.",
    inputFormat: "Linked list nodes",
    outputFormat: "Reversed linked list head",
    sampleInput: "[1,2,3,4,5]",
    sampleOutput: "[5,4,3,2,1]",
    starterCode: "function reverseList(head) {\n    // Write your code here\n    \n}"
  },
  {
    id: 5,
    title: "Valid Parentheses",
    difficulty: "Easy",
    topic: "Strings",
    description: "Given a string containing just characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    inputFormat: "String of brackets",
    outputFormat: "true or false",
    sampleInput: "()[]{}",
    sampleOutput: "true",
    starterCode: "function isValid(s) {\n    // Write your code here\n    \n}"
  },
  {
    id: 6,
    title: "Climbing Stairs",
    difficulty: "Medium",
    topic: "Dynamic Programming",
    description: "You are climbing a staircase. Each time you can climb 1 or 2 steps. Find number of distinct ways to reach top.",
    inputFormat: "Integer n (number of steps)",
    outputFormat: "Number of distinct ways",
    sampleInput: "3",
    sampleOutput: "3",
    starterCode: "function climbStairs(n) {\n    // Write your code here\n    \n}"
  },
  {
    id: 7,
    title: "Merge Sorted Array",
    difficulty: "Medium",
    topic: "Arrays",
    description: "Merge two sorted arrays into one sorted array.",
    inputFormat: "Two sorted arrays",
    outputFormat: "Merged sorted array",
    sampleInput: "[1,2,3]\n[2,5,6]",
    sampleOutput: "[1,2,2,3,5,6]",
    starterCode: "function merge(nums1, nums2) {\n    // Write your code here\n    \n}"
  },
  {
    id: 8,
    title: "Longest Substring",
    difficulty: "Hard",
    topic: "Strings",
    description: "Find length of longest substring without repeating characters.",
    inputFormat: "String s",
    outputFormat: "Length of longest substring",
    sampleInput: "abcabcbb",
    sampleOutput: "3",
    starterCode: "function lengthOfLongestSubstring(s) {\n    // Write your code here\n    \n}"
  }
];

// ==================================================
// MAIN COMPONENT: CodingPractice
// ==================================================
const CodingPractice = () => {
  const navigate = useNavigate();

  // ========== STATE MANAGEMENT ==========
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [topicFilter, setTopicFilter] = useState('All');
  
  // UI states
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [code, setCode] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  
  // Progress states
  const [solvedQuestions, setSolvedQuestions] = useState([]);
  const [dailyStreak, setDailyStreak] = useState(0);
  const [lastSolvedDate, setLastSolvedDate] = useState(null);
  const [totalCoins, setTotalCoins] = useState(0);

  // ========== LOCALSTORAGE INITIALIZATION ==========
  // Load all saved data when component mounts
  useEffect(() => {
    // Load solved questions
    const savedSolved = localStorage.getItem('codingSolvedQuestions');
    if (savedSolved) {
      setSolvedQuestions(JSON.parse(savedSolved));
    }
    
    // Load daily streak data
    const savedStreak = localStorage.getItem('codingDailyStreak');
    const savedLastDate = localStorage.getItem('codingLastSolvedDate');
    const savedCoins = localStorage.getItem('codingTotalCoins');
    
    if (savedStreak) setDailyStreak(parseInt(savedStreak));
    if (savedLastDate) setLastSolvedDate(savedLastDate);
    if (savedCoins) setTotalCoins(parseInt(savedCoins));
    
    // Check if streak should be reset (missed a day)
    checkAndUpdateStreak();
  }, []);

  // Save solved questions to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('codingSolvedQuestions', JSON.stringify(solvedQuestions));
  }, [solvedQuestions]);

  // Save streak and coins data
  useEffect(() => {
    localStorage.setItem('codingDailyStreak', dailyStreak.toString());
    localStorage.setItem('codingLastSolvedDate', lastSolvedDate || '');
    localStorage.setItem('codingTotalCoins', totalCoins.toString());
    
    // Also update dashboard coins in localStorage (for cross-page sync)
    localStorage.setItem('userCoins', totalCoins.toString());
  }, [dailyStreak, lastSolvedDate, totalCoins]);

  // ========== STREAK MANAGEMENT ==========
  // Check if user solved a problem today vs yesterday
  const checkAndUpdateStreak = () => {
    const today = new Date().toDateString();
    if (lastSolvedDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      // If last solved was yesterday, streak continues
      // If last solved was before yesterday, reset streak to 0
      if (lastSolvedDate !== yesterday.toDateString()) {
        setDailyStreak(0);
      }
    }
  };

  // Update streak when solving a new problem
  const updateStreakOnSolve = () => {
    const today = new Date().toDateString();
    
    if (lastSolvedDate === today) {
      // Already solved today, streak doesn't increase
      return;
    }
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (lastSolvedDate === yesterday.toDateString()) {
      // Solved yesterday, increase streak
      setDailyStreak(prev => prev + 1);
    } else if (!lastSolvedDate) {
      // First time solving
      setDailyStreak(1);
    } else {
      // Missed days, reset streak
      setDailyStreak(1);
    }
    
    setLastSolvedDate(today);
  };

  // ========== REWARD SYSTEM ==========
  // Award coins when problem is solved
  const awardCoins = () => {
    const COINS_PER_PROBLEM = 50;
    const newTotal = totalCoins + COINS_PER_PROBLEM;
    setTotalCoins(newTotal);
    return newTotal;
  };

  // ========== FILTERING LOGIC ==========
  // Filter questions based on search term, difficulty, and topic
  const getFilteredQuestions = () => {
    let filtered = sampleQuestions;
    
    // Search filter (by title)
    if (searchTerm) {
      filtered = filtered.filter(q => 
        q.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Difficulty filter
    if (difficultyFilter !== 'All') {
      filtered = filtered.filter(q => q.difficulty === difficultyFilter);
    }
    
    // Topic filter
    if (topicFilter !== 'All') {
      filtered = filtered.filter(q => q.topic === topicFilter);
    }
    
    return filtered;
  };

  // ========== QUESTION SOLVING LOGIC ==========
  // Check if a question is already solved
  const isQuestionSolved = (questionId) => {
    return solvedQuestions.includes(questionId);
  };

  // Handle solve button click - opens the code editor
  const handleSolveClick = (question) => {
    setSelectedQuestion(question);
    setCode(question.starterCode);
    setShowEditor(true);
  };

  // Handle code submission - validates and rewards
  const handleSubmitCode = () => {
    // For demo purposes, we consider any non-empty code as "solved"
    // In a real app, you'd run test cases against the code
    if (code.trim() && selectedQuestion) {
      // Check if already solved
      if (!isQuestionSolved(selectedQuestion.id)) {
        // Add to solved questions
        setSolvedQuestions([...solvedQuestions, selectedQuestion.id]);
        
        // Update streak
        updateStreakOnSolve();
        
        // Award coins
        const newCoins = awardCoins();
        
        // Show success popup
        setShowSuccessPopup(true);
        
        // Auto-hide popup after 3 seconds
        setTimeout(() => {
          setShowSuccessPopup(false);
        }, 3000);
      }
      
      // Close editor after solving
      setShowEditor(false);
      setSelectedQuestion(null);
    }
  };

  // Handle run code (test execution simulation)
  const handleRunCode = () => {
    // Simulate code execution
    alert("Running code... (Demo: Check console for output)\nIn a production app, this would execute your code against test cases.");
  };

  // ========== PROGRESS STATISTICS ==========
  // Calculate solved counts by difficulty
  const getProgressStats = () => {
    const easySolved = solvedQuestions.filter(id => {
      const q = sampleQuestions.find(q => q.id === id);
      return q && q.difficulty === 'Easy';
    }).length;
    
    const mediumSolved = solvedQuestions.filter(id => {
      const q = sampleQuestions.find(q => q.id === id);
      return q && q.difficulty === 'Medium';
    }).length;
    
    const hardSolved = solvedQuestions.filter(id => {
      const q = sampleQuestions.find(q => q.id === id);
      return q && q.difficulty === 'Hard';
    }).length;
    
    const totalEasy = sampleQuestions.filter(q => q.difficulty === 'Easy').length;
    const totalMedium = sampleQuestions.filter(q => q.difficulty === 'Medium').length;
    const totalHard = sampleQuestions.filter(q => q.difficulty === 'Hard').length;
    
    return {
      total: solvedQuestions.length,
      easy: { solved: easySolved, total: totalEasy },
      medium: { solved: mediumSolved, total: totalMedium },
      hard: { solved: hardSolved, total: totalHard }
    };
  };

  const stats = getProgressStats();
  const filteredQuestions = getFilteredQuestions();

  // ========== RENDER COMPONENT ==========
  return (
    <div className="min-h-screen bg-[#060610]">
      {/* Success Popup Animation */}
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
              <span className="font-semibold">Problem Solved Successfully 🎉 +50 Coins!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        
        {/* ========== HEADER SECTION ========== */}
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
          
          {/* Stats Cards */}
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

        {/* ========== PROGRESS SECTION ========== */}
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

        {/* ========== SEARCH & FILTERS ========== */}
        <div className="glass-card rounded-2xl p-6 mb-8">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search coding questions by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#00ffa3] transition-colors"
            />
          </div>

          {/* Difficulty Filters */}
          <div className="mb-4">
            <label className="text-sm text-gray-400 mb-2 block">Difficulty</label>
            <div className="flex gap-2 flex-wrap">
              {['All', 'Easy', 'Medium', 'Hard'].map(diff => (
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

          {/* Topic Filters */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Topics</label>
            <div className="flex gap-2 flex-wrap">
              {['All', 'Arrays', 'Strings', 'Linked List', 'Trees', 'Graph', 'Dynamic Programming'].map(topic => (
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

        {/* ========== QUESTIONS LIST ========== */}
        <div className="grid gap-4">
          <h2 className="text-xl font-semibold text-white mb-2">Problems</h2>
          {filteredQuestions.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center">
              <p className="text-gray-400">No questions found matching your criteria</p>
            </div>
          ) : (
            filteredQuestions.map(question => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
                className="glass-card rounded-xl p-5 flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{question.title}</h3>
                    {isQuestionSolved(question.id) && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      question.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                      question.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {question.difficulty}
                    </span>
                    <span className="px-2 py-1 rounded-lg text-xs font-medium bg-blue-500/20 text-blue-400">
                      {question.topic}
                    </span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSolveClick(question)}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                    isQuestionSolved(question.id)
                      ? 'bg-green-500/20 text-green-400 cursor-default'
                      : 'bg-gradient-to-r from-[#00ffa3] to-[#00c9ff] text-black hover:shadow-lg'
                  }`}
                  disabled={isQuestionSolved(question.id)}
                >
                  {isQuestionSolved(question.id) ? 'Solved' : 'Solve'}
                </motion.button>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* ========== CODE EDITOR MODAL ========== */}
      <AnimatePresence>
        {showEditor && selectedQuestion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowEditor(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0a0a1a] rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Editor Header */}
              <div className="sticky top-0 bg-[#0a0a1a] border-b border-white/10 p-4 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedQuestion.title}</h3>
                  <div className="flex gap-2 mt-1">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      selectedQuestion.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                      selectedQuestion.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {selectedQuestion.difficulty}
                    </span>
                    <span className="px-2 py-1 rounded-lg text-xs font-medium bg-blue-500/20 text-blue-400">
                      {selectedQuestion.topic}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowEditor(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              {/* Problem Statement */}
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
                  <h4 className="text-lg font-semibold text-white mb-2">Your Code</h4>
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-64 bg-[#1a1a2e] border border-white/10 rounded-xl p-4 text-white font-mono text-sm focus:outline-none focus:border-[#00ffa3]"
                    spellCheck={false}
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

// Add glass-card CSS style to global or inline
const style = document.createElement('style');
style.textContent = `
  .glass-card {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
`;
document.head.appendChild(style);

export default CodingPractice;