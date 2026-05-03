import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

/* ─── THEME ─── */
const THEME = {
  teal: "#00d4b8",
  coral: "#ff6b6b",
  gold: "#ffd166",
  navy: "#060d1f",
  navyMid: "#0a1628",
  navyLight: "#0f2040",
  cardBg: "rgba(255,255,255,0.04)",
  border: "rgba(0,212,184,0.15)",
};

const TOPICS = [
  { key: "percentage",        label: "Percentage",        icon: "%" },
  { key: "profit_loss",       label: "Profit & Loss",     icon: "💰" },
  { key: "time_distance",     label: "Time & Distance",   icon: "🚗" },
  { key: "time_work",         label: "Time & Work",       icon: "⚙️" },
  { key: "ratio",             label: "Ratio",             icon: "⚖️" },
  { key: "average",           label: "Average",           icon: "📈" },
  { key: "simple_interest",   label: "Simple Interest",   icon: "🏦" },
  { key: "compound_interest", label: "Compound Interest", icon: "📊" },
  { key: "number_system",     label: "Number System",     icon: "🔢" },
  { key: "probability",       label: "Probability",       icon: "🎲" },
];

/* ─── INJECT GLOBAL STYLES ─── */
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: ${THEME.navy};
  }

  .quiz-wrapper {
    min-height: 100vh;
    background: ${THEME.navy};
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 24px;
    color: #e2eaff;
    position: relative;
    overflow: hidden;
  }

  .quiz-wrapper::before {
    content: '';
    position: fixed;
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(0,212,184,0.08) 0%, transparent 70%);
    top: -200px; left: -200px;
    border-radius: 50%;
    pointer-events: none;
  }
  .quiz-wrapper::after {
    content: '';
    position: fixed;
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(255,107,107,0.07) 0%, transparent 70%);
    bottom: -150px; right: -150px;
    border-radius: 50%;
    pointer-events: none;
  }

  .quiz-card {
    width: 100%;
    max-width: 680px;
    background: ${THEME.cardBg};
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border-radius: 28px;
    padding: 36px;
    border: 1px solid ${THEME.border};
    box-shadow:
      0 0 0 1px rgba(0,212,184,0.05),
      0 24px 60px rgba(0,0,0,0.6),
      inset 0 1px 0 rgba(255,255,255,0.06);
    position: relative;
    z-index: 1;
  }

  /* ── TOPIC SELECTION ── */
  .topic-screen-header {
    text-align: center;
    margin-bottom: 32px;
  }
  .topic-screen-header h1 {
    font-family: 'Syne', sans-serif;
    font-size: 28px;
    font-weight: 800;
    color: #e8f0ff;
    margin-bottom: 8px;
    letter-spacing: -0.02em;
  }
  .topic-screen-header p {
    font-size: 14px;
    color: rgba(226,234,255,0.4);
    letter-spacing: 0.02em;
  }

  .topics-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 28px;
  }

  .topic-card {
    padding: 16px 18px;
    border-radius: 16px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 12px;
    transition: all 0.2s;
    user-select: none;
  }
  .topic-card:hover {
    background: rgba(0,212,184,0.07);
    border-color: rgba(0,212,184,0.25);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
  }
  .topic-card.active {
    background: rgba(0,212,184,0.12);
    border-color: ${THEME.teal};
    box-shadow: 0 0 20px rgba(0,212,184,0.15);
  }
  .topic-icon {
    width: 38px; height: 38px;
    border-radius: 10px;
    background: rgba(255,255,255,0.06);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
    transition: background 0.2s;
  }
  .topic-card.active .topic-icon {
    background: rgba(0,212,184,0.2);
  }
  .topic-card-label {
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: #c8d6f0;
    line-height: 1.3;
  }
  .topic-card.active .topic-card-label {
    color: ${THEME.teal};
    font-weight: 600;
  }

  .start-btn {
    width: 100%;
    padding: 16px;
    border-radius: 14px;
    background: linear-gradient(135deg, ${THEME.teal} 0%, #00f5d4 100%);
    border: none;
    color: #001a16;
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 16px;
    cursor: pointer;
    letter-spacing: 0.03em;
    transition: all 0.2s;
    box-shadow: 0 8px 24px rgba(0,212,184,0.3);
  }
  .start-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none;
  }
  .start-btn:not(:disabled):hover {
    box-shadow: 0 12px 32px rgba(0,212,184,0.45);
    transform: translateY(-1px);
  }

  /* ── QUIZ SCREEN ── */
  .quiz-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 28px;
  }

  .back-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(0,212,184,0.08);
    border: 1px solid rgba(0,212,184,0.2);
    color: ${THEME.teal};
    padding: 8px 16px;
    border-radius: 50px;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s;
    letter-spacing: 0.01em;
  }
  .back-btn:hover {
    background: rgba(0,212,184,0.15);
    box-shadow: 0 0 16px rgba(0,212,184,0.2);
  }

  .score-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255,209,102,0.1);
    border: 1px solid rgba(255,209,102,0.25);
    color: ${THEME.gold};
    padding: 8px 18px;
    border-radius: 50px;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 14px;
  }

  .progress-wrap { margin-bottom: 28px; }
  .progress-meta {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: rgba(226,234,255,0.4);
    margin-bottom: 10px;
    font-weight: 500;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
  .progress-track {
    height: 6px;
    background: rgba(255,255,255,0.06);
    border-radius: 99px;
    overflow: hidden;
  }
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, ${THEME.teal}, #00f5d4);
    border-radius: 99px;
    transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 0 10px rgba(0,212,184,0.5);
  }

  .topic-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: linear-gradient(135deg, rgba(0,212,184,0.12), rgba(0,212,184,0.06));
    border: 1px solid rgba(0,212,184,0.2);
    color: ${THEME.teal};
    padding: 6px 14px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 20px;
    letter-spacing: 0.02em;
  }

  .question-label {
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: rgba(226,234,255,0.35);
    font-weight: 400;
    margin-bottom: 10px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .question-text {
    font-family: 'Syne', sans-serif;
    font-size: 22px;
    font-weight: 700;
    color: #e8f0ff;
    line-height: 1.4;
    margin-bottom: 28px;
    letter-spacing: -0.01em;
  }

  .options-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 24px;
  }

  .option-item {
    padding: 16px 20px;
    border-radius: 14px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    color: #c8d6f0;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 12px;
    user-select: none;
  }
  .option-item:hover {
    background: rgba(0,212,184,0.08);
    border-color: rgba(0,212,184,0.3);
    color: #e8f0ff;
    transform: translateX(4px);
  }
  .option-item.correct {
    background: rgba(0,212,184,0.12);
    border-color: ${THEME.teal};
    color: #e8fff9;
    box-shadow: 0 0 20px rgba(0,212,184,0.15);
  }
  .option-item.wrong {
    background: rgba(255,107,107,0.1);
    border-color: ${THEME.coral};
    color: #ffe8e8;
  }
  .option-item.disabled {
    cursor: default;
    transform: none !important;
  }

  .option-letter {
    width: 28px; height: 28px;
    border-radius: 8px;
    background: rgba(255,255,255,0.06);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 12px;
    color: rgba(226,234,255,0.5);
    flex-shrink: 0;
    transition: all 0.2s;
  }
  .option-item.correct .option-letter { background: ${THEME.teal}; color: #001a16; }
  .option-item.wrong .option-letter { background: ${THEME.coral}; color: white; }

  .explanation-box {
    padding: 18px 20px;
    border-radius: 14px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    margin-bottom: 20px;
    border-left: 3px solid ${THEME.teal};
  }
  .explanation-box .ans-line {
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 700;
    color: ${THEME.teal};
    margin-bottom: 8px;
  }
  .explanation-box .exp-line {
    font-size: 14px;
    color: rgba(226,234,255,0.55);
    line-height: 1.6;
  }

  .next-btn {
    width: 100%;
    padding: 16px;
    border-radius: 14px;
    background: linear-gradient(135deg, ${THEME.teal} 0%, #00f5d4 100%);
    border: none;
    color: #001a16;
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 16px;
    cursor: pointer;
    letter-spacing: 0.03em;
    transition: all 0.2s;
    box-shadow: 0 8px 24px rgba(0,212,184,0.3);
  }
  .next-btn:hover {
    box-shadow: 0 12px 32px rgba(0,212,184,0.45);
    transform: translateY(-1px);
  }

  /* Result screen */
  .result-card { text-align: center; }
  .result-emoji { font-size: 64px; margin-bottom: 20px; display: block; }
  .result-title {
    font-family: 'Syne', sans-serif;
    font-size: 32px;
    font-weight: 800;
    color: #e8f0ff;
    margin-bottom: 8px;
  }
  .result-sub {
    font-size: 15px;
    color: rgba(226,234,255,0.45);
    margin-bottom: 32px;
  }
  .score-display {
    display: inline-flex;
    align-items: baseline;
    gap: 4px;
    background: linear-gradient(135deg, rgba(0,212,184,0.1), rgba(0,212,184,0.04));
    border: 1px solid rgba(0,212,184,0.25);
    border-radius: 20px;
    padding: 20px 40px;
    margin-bottom: 36px;
  }
  .score-num {
    font-family: 'Syne', sans-serif;
    font-size: 56px;
    font-weight: 800;
    color: ${THEME.teal};
    line-height: 1;
  }
  .score-denom {
    font-family: 'Syne', sans-serif;
    font-size: 24px;
    font-weight: 600;
    color: rgba(0,212,184,0.5);
  }
  .result-actions { display: flex; gap: 12px; }
  .btn-secondary {
    flex: 1;
    padding: 14px;
    border-radius: 14px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    color: #c8d6f0;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-secondary:hover {
    background: rgba(255,255,255,0.09);
    border-color: rgba(255,255,255,0.2);
  }
  .btn-primary {
    flex: 1;
    padding: 14px;
    border-radius: 14px;
    background: linear-gradient(135deg, ${THEME.teal}, #00f5d4);
    border: none;
    color: #001a16;
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 8px 24px rgba(0,212,184,0.25);
  }
  .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 12px 32px rgba(0,212,184,0.35); }

  /* Loading */
  .loading-wrap {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 16px;
    background: ${THEME.navy};
    color: #e2eaff;
    font-family: 'Syne', sans-serif;
  }
  .loader-ring {
    width: 48px; height: 48px;
    border: 3px solid rgba(0,212,184,0.15);
    border-top-color: ${THEME.teal};
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  @media (max-width: 500px) {
    .quiz-card { padding: 24px 20px; }
    .question-text { font-size: 18px; }
    .topics-grid { grid-template-columns: 1fr; }
  }
`;

const LETTERS = ["A", "B", "C", "D"];

export default function Aptitude() {
  // ── Topic selection state ──
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [fetchTrigger, setFetchTrigger] = useState(0); // ✅ increment to re-fetch

  // ── Quiz state ──
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = globalStyles;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Fetch questions — re-runs whenever fetchTrigger increments
  useEffect(() => {
    if (!quizStarted || !selectedTopic || fetchTrigger === 0) return;

    setLoading(true);
    setError(null);

    fetch(`http://localhost:5000/api/aptitude/questions?topic=${selectedTopic.key}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch questions");
        return res.json();
      })
      .then(data => {
        if (!data || data.length === 0) throw new Error("No questions found for this topic");
        setQuestions(data);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [fetchTrigger]); // only fetchTrigger drives re-fetch

  const startQuiz = () => {
    if (!selectedTopic) return;
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setFinished(false);
    setQuestions([]);
    setError(null);
    setQuizStarted(true);
    setFetchTrigger(prev => prev + 1); // ✅ trigger fetch with current selectedTopic
  };

  const resetToTopics = () => {
    setQuizStarted(false);
    setSelectedTopic(null);
    setQuestions([]);
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
    setQuestions([]);
    setError(null);
    setFetchTrigger(prev => prev + 1); // ✅ re-fetch same topic reliably
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

  // ── TOPIC SELECTION SCREEN ──
  if (!quizStarted) {
    return (
      <div className="quiz-wrapper">
        <motion.div
          className="quiz-card"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          {/* Header */}
          <div className="quiz-header">
            <button className="back-btn" onClick={() => navigate("/dashboard")}>
              ← Back
            </button>
          </div>

          <div className="topic-screen-header">
            <h1>Choose a Topic</h1>
            <p>Select a subject to begin your aptitude quiz</p>
          </div>

          <div className="topics-grid">
            {TOPICS.map((t, i) => (
              <motion.div
                key={t.key}
                className={`topic-card ${selectedTopic?.key === t.key ? "active" : ""}`}
                onClick={() => setSelectedTopic(t)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ y: -2 }}
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
            whileHover={selectedTopic ? { scale: 1.01 } : {}}
            whileTap={selectedTopic ? { scale: 0.98 } : {}}
          >
            {selectedTopic ? `Start ${selectedTopic.label} Quiz →` : "Select a Topic to Begin"}
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // ── LOADING ──
  if (loading) {
    return (
      <div className="loading-wrap">
        <div className="loader-ring" />
        <span style={{ opacity: 0.5, fontSize: 14, letterSpacing: "0.1em" }}>LOADING QUESTIONS</span>
      </div>
    );
  }

  // ── ERROR ──
  if (error) {
    return (
      <div className="quiz-wrapper">
        <motion.div
          className="quiz-card result-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <span className="result-emoji">⚠️</span>
          <h2 className="result-title">Something went wrong</h2>
          <p className="result-sub">{error}</p>
          <div className="result-actions">
            <button className="btn-secondary" onClick={resetToTopics}>← Back to Topics</button>
            <button className="btn-primary" onClick={startQuiz}>Try Again</button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── RESULT SCREEN ──
  if (finished) {
    return (
      <div className="quiz-wrapper">
        <motion.div
          className="quiz-card result-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <span className="result-emoji">🏆</span>
          <h2 className="result-title">Quiz Complete!</h2>
          <p className="result-sub">Here's how you performed on {selectedTopic.label}</p>

          <div className="score-display">
            <span className="score-num">{score}</span>
            <span className="score-denom"> / {questions.length}</span>
          </div>

          <div className="result-actions">
            <button className="btn-secondary" onClick={resetToTopics}>← Topics</button>
            <button className="btn-secondary" onClick={resetQuiz}>↺ Retry</button>
            <button className="btn-primary" onClick={() => navigate("/dashboard")}>Dashboard →</button>
          </div>
        </motion.div>
      </div>
    );
  }

  const q = questions[current];
  if (!q) return <div className="loading-wrap"><div className="loader-ring" /></div>;

  const progress = ((current + 1) / questions.length) * 100;

  // ── QUIZ SCREEN ──
  return (
    <div className="quiz-wrapper">
      <motion.div
        className="quiz-card"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        {/* HEADER */}
        <div className="quiz-header">
          <button className="back-btn" onClick={resetToTopics}>
            ← Topics
          </button>
          <div className="score-badge">⭐ {score} pts</div>
        </div>

        {/* PROGRESS */}
        <div className="progress-wrap">
          <div className="progress-meta">
            <span>Progress</span>
            <span>{current + 1} / {questions.length}</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* TOPIC CHIP */}
        <div className="topic-chip">{selectedTopic.icon} {selectedTopic.label}</div>

        {/* QUESTION */}
        <p className="question-label">Question {current + 1}</p>
        <AnimatePresence mode="wait">
          <motion.h2
            key={current}
            className="question-text"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {q.question}
          </motion.h2>
        </AnimatePresence>

        {/* OPTIONS */}
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
                whileHover={selected === null ? { x: 4 } : {}}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <span className="option-letter">{LETTERS[i]}</span>
                {opt}
              </motion.div>
            );
          })}
        </div>

        {/* EXPLANATION */}
        <AnimatePresence>
          {selected !== null && (
            <motion.div
              className="explanation-box"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="ans-line">✓ Correct Answer: {q.answer}</p>
              <p className="exp-line">💡 {q.explanation || "No explanation available."}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* NEXT */}
        <AnimatePresence>
          {selected !== null && (
            <motion.button
              className="next-btn"
              onClick={handleNext}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {current + 1 === questions.length ? "Finish Quiz 🏆" : "Next Question →"}
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}