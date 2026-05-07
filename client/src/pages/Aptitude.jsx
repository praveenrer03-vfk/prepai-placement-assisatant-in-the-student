import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

/* ─── AI-INSPIRED THEME ─── */
const THEME = {
  primary: "#8B5CF6",      // Vibrant Purple
  secondary: "#EC4899",    // Pink
  accent: "#06B6D4",       // Cyan
  success: "#10B981",      // Emerald
  warning: "#F59E0B",      // Amber
  error: "#EF4444",        // Red
  dark: "#0F172A",         // Slate 900
  darker: "#020617",       // Slate 950
  darkMid: "#1E293B",      // Slate 800
  cardBg: "rgba(30, 41, 59, 0.7)",
  border: "rgba(139, 92, 246, 0.15)",
  glass: "rgba(255, 255, 255, 0.03)",
};

const TOPICS = [
  { key: "percentage",        label: "Percentage",        icon: "%", gradient: "from-purple-500 to-pink-500" },
  { key: "profit_loss",       label: "Profit & Loss",     icon: "💰", gradient: "from-emerald-500 to-teal-500" },
  { key: "time_distance",     label: "Time & Distance",   icon: "🚗", gradient: "from-blue-500 to-cyan-500" },
  { key: "time_work",         label: "Time & Work",       icon: "⚙️", gradient: "from-orange-500 to-red-500" },
  { key: "ratio",             label: "Ratio",             gradient: "from-indigo-500 to-purple-500", icon: "⚖️" },
  { key: "average",           label: "Average",           icon: "📈", gradient: "from-green-500 to-emerald-500" },
  { key: "simple_interest",   label: "Simple Interest",   icon: "🏦", gradient: "from-yellow-500 to-orange-500" },
  { key: "compound_interest", label: "Compound Interest", icon: "📊", gradient: "from-rose-500 to-pink-500" },
  { key: "number_system",     label: "Number System",     icon: "🔢", gradient: "from-violet-500 to-purple-500" },
  { key: "probability",       label: "Probability",       icon: "🎲", gradient: "from-sky-500 to-blue-500" },
];

/* ─── GLOBAL STYLES ─── */
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&family=Space+Grotesk:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Inter', sans-serif;
    background: ${THEME.darker};
  }

  .quiz-wrapper {
    min-height: 100vh;
    background: linear-gradient(135deg, ${THEME.darker} 0%, ${THEME.dark} 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 24px;
    color: #E2E8F0;
    position: relative;
    overflow: hidden;
  }

  /* Animated gradient background */
  .quiz-wrapper::before {
    content: '';
    position: fixed;
    width: 800px;
    height: 800px;
    background: radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%);
    top: -400px;
    left: -400px;
    border-radius: 50%;
    pointer-events: none;
    animation: float 20s infinite ease-in-out;
  }
  
  .quiz-wrapper::after {
    content: '';
    position: fixed;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%);
    bottom: -300px;
    right: -300px;
    border-radius: 50%;
    pointer-events: none;
    animation: float 15s infinite ease-in-out reverse;
  }

  @keyframes float {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    50% { transform: translate(50px, 50px) rotate(180deg); }
  }

  .quiz-card {
    width: 100%;
    max-width: 720px;
    background: ${THEME.cardBg};
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 32px;
    padding: 40px;
    border: 1px solid ${THEME.border};
    box-shadow: 
      0 0 0 1px rgba(139,92,246,0.1),
      0 25px 50px -12px rgba(0,0,0,0.5),
      inset 0 1px 0 rgba(255,255,255,0.05);
    position: relative;
    z-index: 1;
  }

  /* Glass morphism effect */
  .quiz-card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 32px;
    padding: 1px;
    background: linear-gradient(135deg, ${THEME.primary}, ${THEME.secondary}, ${THEME.accent});
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
    opacity: 0.3;
  }

  .topic-screen-header {
    text-align: center;
    margin-bottom: 32px;
  }
  
  .topic-screen-header h1 {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 32px;
    font-weight: 700;
    background: linear-gradient(135deg, #fff 0%, #E2E8F0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 12px;
    letter-spacing: -0.02em;
  }
  
  .topic-screen-header p {
    font-size: 14px;
    color: rgba(226,232,240,0.5);
    letter-spacing: 0.02em;
  }

  .topics-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-bottom: 32px;
  }

  .topic-card {
    padding: 18px 20px;
    border-radius: 20px;
    background: ${THEME.glass};
    border: 1px solid rgba(255,255,255,0.06);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 14px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }
  
  .topic-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, ${THEME.primary}, ${THEME.secondary});
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
  }
  
  .topic-card:hover::before {
    opacity: 0.1;
  }
  
  .topic-card:hover {
    transform: translateY(-4px) scale(1.02);
    border-color: ${THEME.primary};
    box-shadow: 0 20px 40px -12px rgba(139,92,246,0.3);
  }
  
  .topic-card.active {
    background: rgba(139,92,246,0.15);
    border-color: ${THEME.primary};
    box-shadow: 0 0 30px rgba(139,92,246,0.2);
  }
  
  .topic-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: linear-gradient(135deg, ${THEME.primary}, ${THEME.secondary});
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
    transition: all 0.3s;
  }
  
  .topic-card.active .topic-icon {
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba(139,92,246,0.5);
  }
  
  .topic-card-label {
    font-family: 'Inter', sans-serif;
    font-size: 15px;
    font-weight: 600;
    color: #CBD5E1;
    line-height: 1.3;
  }
  
  .topic-card.active .topic-card-label {
    background: linear-gradient(135deg, ${THEME.primary}, ${THEME.secondary});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .start-btn {
    width: 100%;
    padding: 18px;
    border-radius: 16px;
    background: linear-gradient(135deg, ${THEME.primary}, ${THEME.secondary});
    border: none;
    color: white;
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;
    font-size: 16px;
    cursor: pointer;
    letter-spacing: 0.03em;
    transition: all 0.3s;
    box-shadow: 0 10px 30px -5px rgba(139,92,246,0.4);
    position: relative;
    overflow: hidden;
  }
  
  .start-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
  }
  
  .start-btn:hover::before {
    left: 100%;
  }
  
  .start-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    filter: grayscale(0.2);
  }
  
  .start-btn:not(:disabled):hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 40px -10px rgba(139,92,246,0.5);
  }

  .quiz-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
  }

  .back-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    background: ${THEME.glass};
    border: 1px solid rgba(139,92,246,0.2);
    color: ${THEME.primary};
    padding: 10px 20px;
    border-radius: 50px;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s;
    backdrop-filter: blur(10px);
  }
  
  .back-btn:hover {
    background: rgba(139,92,246,0.15);
    border-color: ${THEME.primary};
    transform: translateX(-4px);
    box-shadow: 0 10px 20px -10px rgba(139,92,246,0.3);
  }

  .score-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    background: linear-gradient(135deg, rgba(139,92,246,0.15), rgba(236,72,153,0.15));
    border: 1px solid rgba(139,92,246,0.25);
    color: white;
    padding: 10px 20px;
    border-radius: 50px;
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;
    font-size: 14px;
    backdrop-filter: blur(10px);
  }

  .progress-wrap { margin-bottom: 32px; }
  
  .progress-meta {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: rgba(226,232,240,0.5);
    margin-bottom: 12px;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
  
  .progress-track {
    height: 8px;
    background: ${THEME.glass};
    border-radius: 99px;
    overflow: hidden;
    position: relative;
  }
  
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, ${THEME.primary}, ${THEME.secondary}, ${THEME.accent});
    border-radius: 99px;
    transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    animation: shimmer 2s infinite;
  }
  
  @keyframes shimmer {
    0%, 100% { filter: brightness(1); }
    50% { filter: brightness(1.2); }
  }

  .topic-chip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: linear-gradient(135deg, rgba(139,92,246,0.2), rgba(236,72,153,0.1));
    border: 1px solid rgba(139,92,246,0.3);
    color: ${THEME.primary};
    padding: 8px 18px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 24px;
    letter-spacing: 0.02em;
  }

  .question-label {
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    color: ${THEME.accent};
    font-weight: 600;
    margin-bottom: 12px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .question-text {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 24px;
    font-weight: 600;
    background: linear-gradient(135deg, #fff, #E2E8F0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1.4;
    margin-bottom: 32px;
    letter-spacing: -0.01em;
  }

  .options-grid {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 28px;
  }

  .option-item {
    padding: 18px 24px;
    border-radius: 18px;
    background: ${THEME.glass};
    border: 1px solid rgba(255,255,255,0.06);
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    font-size: 15px;
    font-weight: 500;
    color: #CBD5E1;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    gap: 16px;
    backdrop-filter: blur(10px);
  }
  
  .option-item:hover {
    background: rgba(139,92,246,0.1);
    border-color: ${THEME.primary};
    transform: translateX(8px);
    box-shadow: 0 10px 20px -10px rgba(139,92,246,0.2);
  }
  
  .option-item.correct {
    background: linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05));
    border-color: ${THEME.success};
    box-shadow: 0 0 30px rgba(16,185,129,0.2);
    animation: pulse 0.5s ease;
  }
  
  .option-item.wrong {
    background: linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.05));
    border-color: ${THEME.error};
    box-shadow: 0 0 30px rgba(239,68,68,0.2);
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.02); }
  }
  
  .option-item.disabled {
    cursor: default;
    transform: none !important;
  }

  .option-letter {
    width: 32px;
    height: 32px;
    border-radius: 10px;
    background: ${THEME.glass};
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;
    font-size: 14px;
    color: ${THEME.primary};
    flex-shrink: 0;
    transition: all 0.3s;
    border: 1px solid rgba(139,92,246,0.3);
  }
  
  .option-item.correct .option-letter { 
    background: ${THEME.success}; 
    color: white;
    border-color: ${THEME.success};
  }
  
  .option-item.wrong .option-letter { 
    background: ${THEME.error}; 
    color: white;
    border-color: ${THEME.error};
  }

  .explanation-box {
    padding: 20px 24px;
    border-radius: 18px;
    background: linear-gradient(135deg, rgba(139,92,246,0.08), rgba(236,72,153,0.05));
    border: 1px solid rgba(139,92,246,0.2);
    margin-bottom: 24px;
    border-left: 4px solid ${THEME.primary};
    backdrop-filter: blur(10px);
  }
  
  .explanation-box .ans-line {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 14px;
    font-weight: 700;
    color: ${THEME.success};
    margin-bottom: 10px;
    letter-spacing: 0.02em;
  }
  
  .explanation-box .exp-line {
    font-size: 14px;
    color: rgba(226,232,240,0.6);
    line-height: 1.6;
  }

  .next-btn {
    width: 100%;
    padding: 18px;
    border-radius: 16px;
    background: linear-gradient(135deg, ${THEME.primary}, ${THEME.secondary});
    border: none;
    color: white;
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;
    font-size: 16px;
    cursor: pointer;
    letter-spacing: 0.03em;
    transition: all 0.3s;
    box-shadow: 0 10px 30px -5px rgba(139,92,246,0.4);
    position: relative;
    overflow: hidden;
  }
  
  .next-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
  }
  
  .next-btn:hover::before {
    left: 100%;
  }
  
  .next-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 40px -10px rgba(139,92,246,0.6);
  }

  .result-card { text-align: center; }
  
  .result-emoji { 
    font-size: 72px; 
    margin-bottom: 24px; 
    display: inline-block;
    animation: bounce 1s ease infinite;
  }
  
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  
  .result-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 36px;
    font-weight: 700;
    background: linear-gradient(135deg, #fff, ${THEME.primary});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 12px;
  }
  
  .result-sub {
    font-size: 16px;
    color: rgba(226,232,240,0.5);
    margin-bottom: 36px;
  }
  
  .score-display {
    display: inline-flex;
    align-items: baseline;
    gap: 8px;
    background: linear-gradient(135deg, rgba(139,92,246,0.15), rgba(236,72,153,0.1));
    border: 1px solid rgba(139,92,246,0.3);
    border-radius: 50px;
    padding: 24px 48px;
    margin-bottom: 40px;
  }
  
  .score-num {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 64px;
    font-weight: 800;
    background: linear-gradient(135deg, ${THEME.primary}, ${THEME.secondary});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1;
  }
  
  .score-denom {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 28px;
    font-weight: 600;
    color: ${THEME.primary};
    opacity: 0.5;
  }
  
  .result-actions { display: flex; gap: 16px; }
  
  .btn-secondary {
    flex: 1;
    padding: 16px;
    border-radius: 16px;
    background: ${THEME.glass};
    border: 1px solid rgba(255,255,255,0.1);
    color: #CBD5E1;
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 600;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.3s;
    backdrop-filter: blur(10px);
  }
  
  .btn-secondary:hover {
    background: rgba(255,255,255,0.1);
    border-color: ${THEME.primary};
    transform: translateY(-2px);
  }
  
  .btn-primary {
    flex: 1;
    padding: 16px;
    border-radius: 16px;
    background: linear-gradient(135deg, ${THEME.primary}, ${THEME.secondary});
    border: none;
    color: white;
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 10px 30px -5px rgba(139,92,246,0.4);
  }
  
  .btn-primary:hover { 
    transform: translateY(-2px); 
    box-shadow: 0 15px 35px -10px rgba(139,92,246,0.6);
  }

  .loading-wrap {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 24px;
    background: ${THEME.darker};
    color: #E2E8F0;
    font-family: 'Space Grotesk', sans-serif;
  }
  
  .loader-ring {
    width: 60px;
    height: 60px;
    border: 3px solid rgba(139,92,246,0.2);
    border-top-color: ${THEME.primary};
    border-right-color: ${THEME.secondary};
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Shuffle Animation */
  @keyframes shuffle {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .shuffle-icon {
    display: inline-block;
    animation: shuffle 0.5s ease;
  }

  @media (max-width: 640px) {
    .quiz-card { padding: 28px 20px; }
    .question-text { font-size: 20px; }
    .topics-grid { grid-template-columns: 1fr; }
    .result-actions { flex-direction: column; }
  }
`;

const LETTERS = ["A", "B", "C", "D"];

// Fisher-Yates Shuffle Algorithm
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function Aptitude() {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const [originalQuestions, setOriginalQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState(null);
  const [isShuffling, setIsShuffling] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");
  }, [navigate]);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = globalStyles;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    if (!quizStarted || !selectedTopic || fetchTrigger === 0) return;

    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");

    fetch(`https://prepai-placement-assisatant-in-the.onrender.com/api/aptitude/questions?topic=${selectedTopic.key}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(res => {
        if (res.status === 401) {
          localStorage.clear();
          navigate("/");
          throw new Error("Session expired. Please login again.");
        }
        if (!res.ok) throw new Error("Failed to fetch questions");
        return res.json();
      })
      .then(data => {
        if (!data || data.length === 0) throw new Error("No questions found for this topic");
        setOriginalQuestions(data);
        // Shuffle questions when first loaded
        const shuffled = shuffleArray(data);
        setQuestions(shuffled);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [fetchTrigger]);

  // Function to reshuffle remaining questions
  const reshuffleQuestions = () => {
    if (questions.length === 0) return;
    
    setIsShuffling(true);
    
    // Get current question and remaining questions
    const currentQuestion = questions[current];
    const remainingQuestions = questions.slice(current + 1);
    
    // Shuffle remaining questions
    const shuffledRemaining = shuffleArray(remainingQuestions);
    
    // Reconstruct questions array with current question first, then shuffled remaining
    const newQuestions = [currentQuestion, ...shuffledRemaining];
    setQuestions(newQuestions);
    
    // Reset current index to 0 (since we're at the current question)
    setCurrent(0);
    setSelected(null);
    
    setTimeout(() => setIsShuffling(false), 500);
  };

  const startQuiz = () => {
    if (!selectedTopic) return;
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setFinished(false);
    setQuestions([]);
    setOriginalQuestions([]);
    setError(null);
    setQuizStarted(true);
    setFetchTrigger(prev => prev + 1);
  };

  const resetToTopics = () => {
    setQuizStarted(false);
    setSelectedTopic(null);
    setQuestions([]);
    setOriginalQuestions([]);
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setFinished(false);
    setError(null);
    setFetchTrigger(0);
  };

  const resetQuiz = () => {
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setFinished(false);
    // Reshuffle all questions when retrying
    if (originalQuestions.length > 0) {
      const reshuffledAll = shuffleArray(originalQuestions);
      setQuestions(reshuffledAll);
    } else {
      setFetchTrigger(prev => prev + 1);
    }
    setError(null);
  };

  const handleAnswer = (opt) => {
    if (selected !== null) return;
    setSelected(opt);
  };

  const handleNext = () => {
    if (selected === questions[current].answer) setScore(prev => prev + 1);
    if (current + 1 < questions.length) {
      setCurrent(prev => prev + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  };

  if (!quizStarted) {
    return (
      <div className="quiz-wrapper">
        <motion.div
          className="quiz-card"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="quiz-header">
            <button className="back-btn" onClick={() => navigate("/dashboard")}>
              ← Dashboard
            </button>
          </div>

          <div className="topic-screen-header">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Choose Your Challenge
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Master one topic at a time
            </motion.p>
          </div>

          <div className="topics-grid">
            {TOPICS.map((t, i) => (
              <motion.div
                key={t.key}
                className={`topic-card ${selectedTopic?.key === t.key ? "active" : ""}`}
                onClick={() => setSelectedTopic(t)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="topic-icon">{t.icon}</div>
                <span className="topic-card-label">{t.label}</span>
              </motion.div>
            ))}
          </div>

          <motion.button
            className="start-btn"
            disabled={!selectedTopic}
            onClick={startQuiz}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={selectedTopic ? { scale: 1.02 } : {}}
            whileTap={selectedTopic ? { scale: 0.98 } : {}}
          >
            {selectedTopic ? `Start ${selectedTopic.label} Quiz 🚀` : "Select a Topic to Begin"}
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-wrap">
        <div className="loader-ring" />
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ opacity: 0.7, fontSize: 14, letterSpacing: "0.1em" }}
        >
          PREPARING YOUR QUESTIONS
        </motion.span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-wrapper">
        <motion.div
          className="quiz-card result-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <span className="result-emoji">⚠️</span>
          <h2 className="result-title">Oops! Something went wrong</h2>
          <p className="result-sub">{error}</p>
          <div className="result-actions">
            <button className="btn-secondary" onClick={resetToTopics}>← Back to Topics</button>
            <button className="btn-primary" onClick={startQuiz}>Try Again ↺</button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="quiz-wrapper">
        <motion.div
          className="quiz-card result-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <motion.span
            className="result-emoji"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            🏆
          </motion.span>
          <h2 className="result-title">Quiz Complete!</h2>
          <p className="result-sub">Your performance on {selectedTopic.label}</p>
          <motion.div
            className="score-display"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <span className="score-num">{score}</span>
            <span className="score-denom"> / {questions.length}</span>
          </motion.div>
          <div className="result-actions">
            <button className="btn-secondary" onClick={resetToTopics}>← Topics</button>
            <button className="btn-secondary" onClick={resetQuiz}>Retry ↺</button>
            <button className="btn-primary" onClick={() => navigate("/dashboard")}>Dashboard →</button>
          </div>
        </motion.div>
      </div>
    );
  }

  const q = questions[current];
  if (!q) return <div className="loading-wrap"><div className="loader-ring" /></div>;

  const progress = ((current + 1) / questions.length) * 100;

  return (
    <div className="quiz-wrapper">
      <motion.div
        className="quiz-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="quiz-header">
          <button className="back-btn" onClick={resetToTopics}>← Topics</button>
          <div className="score-badge">
            ⭐ {score} / {questions.length}
          </div>
        </div>

        <div className="progress-wrap">
          <div className="progress-meta">
            <span>Progress</span>
            <span>{current + 1} of {questions.length}</span>
          </div>
          <div className="progress-track">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div className="topic-chip">
            {selectedTopic.icon} {selectedTopic.label}
          </div>
          
          {/* Shuffle Button for Remaining Questions */}
          {selected === null && questions.length - current > 1 && (
            <motion.button
              onClick={reshuffleQuestions}
              disabled={isShuffling}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(139,92,246,0.15)",
                border: "1px solid rgba(139,92,246,0.3)",
                borderRadius: 50,
                padding: "6px 14px",
                fontSize: 12,
                fontWeight: 500,
                color: THEME.primary,
                cursor: isShuffling ? "not-allowed" : "pointer",
                transition: "all 0.3s",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className={isShuffling ? "shuffle-icon" : ""}>🔄</span>
              {isShuffling ? "Shuffling..." : "Shuffle Remaining"}
            </motion.button>
          )}
        </div>

        <p className="question-label">Question {current + 1}</p>
        <AnimatePresence mode="wait">
          <motion.h2
            key={current}
            className="question-text"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {q.question}
          </motion.h2>
        </AnimatePresence>

        <div className="options-grid">
          {q.options.map((opt, i) => {
            const isCorrect = opt === q.answer;
            const isSelected = opt === selected;
            let cls = "option-item";
            if (selected !== null) {
              cls += " disabled";
              if (isCorrect) cls += " correct";
              else if (isSelected) cls += " wrong";
            }
            return (
              <motion.div
                key={i}
                className={cls}
                onClick={() => handleAnswer(opt)}
                whileHover={selected === null ? { x: 8 } : {}}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <span className="option-letter">{LETTERS[i]}</span>
                {opt}
              </motion.div>
            );
          })}
        </div>

        <AnimatePresence>
          {selected !== null && (
            <motion.div
              className="explanation-box"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <p className="ans-line">✓ Answer: {q.answer}</p>
              <p className="exp-line">💡 {q.explanation || "No explanation available."}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selected !== null && (
            <motion.button
              className="next-btn"
              onClick={handleNext}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {current + 1 === questions.length ? "Show Results 🏆" : "Next Question →"}
            </motion.button>
          )}
        </AnimatePresence>

        {/* Shuffle Info Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            marginTop: 16,
            padding: "10px 16px",
            background: "rgba(139,92,246,0.08)",
            borderRadius: 12,
            textAlign: "center",
            fontSize: 11,
            color: "rgba(226,232,240,0.4)",
            border: "1px solid rgba(139,92,246,0.15)",
          }}
        >
          🔄 Questions are shuffled randomly each time you start or reshuffle
        </motion.div>
      </motion.div>
    </div>
  );
}