import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

/* ───────── QUESTIONS ───────── */
const QUESTIONS = [
  { category: "Behavioural", question: "Tell me about yourself.", difficulty: "Medium", timeEstimate: "2-3 min" },
  { category: "Behavioural", question: "Describe a challenge you faced and how you solved it.", difficulty: "Hard", timeEstimate: "3-4 min" },
  { category: "HR", question: "Why do you want to join this company?", difficulty: "Easy", timeEstimate: "2-3 min" },
  { category: "HR", question: "What are your strengths and weaknesses?", difficulty: "Medium", timeEstimate: "2-3 min" },
  { category: "Technical", question: "What is React and why is it used?", difficulty: "Medium", timeEstimate: "3-4 min" },
  { category: "Technical", question: "Explain let vs var vs const.", difficulty: "Easy", timeEstimate: "2-3 min" },
  { category: "Situational", question: "How do you handle pressure?", difficulty: "Medium", timeEstimate: "2-3 min" },
  { category: "Situational", question: "What if you miss a deadline?", difficulty: "Hard", timeEstimate: "3-4 min" },
];

const CATEGORY_STYLES = {
  Behavioural: {
    gradient: "from-violet-500 to-purple-600",
    glow: "rgba(139, 92, 246, 0.3)",
    accent: "#8B5CF6",
    icon: "🧠"
  },
  HR: {
    gradient: "from-emerald-500 to-teal-600",
    glow: "rgba(16, 185, 129, 0.3)",
    accent: "#10B981",
    icon: "👥"
  },
  Technical: {
    gradient: "from-blue-500 to-cyan-600",
    glow: "rgba(59, 130, 246, 0.3)",
    accent: "#3B82F6",
    icon: "💻"
  },
  Situational: {
    gradient: "from-orange-500 to-red-600",
    glow: "rgba(249, 115, 22, 0.3)",
    accent: "#F97316",
    icon: "🎯"
  },
};

function wordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// Advanced AI Feedback Function
const getIntelligentFeedback = async (answer, question, category) => {
  // Simulated AI analysis with multiple metrics
  const wordCount = answer.trim().split(/\s+/).length;
  const hasNumbers = /\d+/.test(answer);
  const hasExamples = /\b(for example|such as|like|instance|specifically)\b/i.test(answer);
  const hasStructure = /\b(first|second|finally|moreover|additionally)\b/i.test(answer);
  const sentenceLength = answer.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  
  // Calculate scores
  let clarityScore = Math.min(100, (wordCount / 30) * 100);
  let structureScore = hasStructure ? 85 : 60;
  let relevanceScore = Math.min(100, (sentenceLength / 5) * 100);
  let confidenceScore = hasExamples ? 90 : 65;
  
  // Generate comprehensive feedback
  const strengths = [];
  const improvements = [];
  const tips = [];
  
  if (wordCount >= 30) {
    strengths.push("✅ Excellent length - detailed and comprehensive");
    clarityScore += 15;
  } else if (wordCount >= 20) {
    strengths.push("✓ Good length, consider adding more details");
  } else {
    improvements.push("📏 Expand your answer with more specific details (aim for 30+ words)");
  }
  
  if (hasExamples) {
    strengths.push("💡 Strong use of concrete examples");
    confidenceScore += 10;
  } else {
    improvements.push("📝 Include specific examples to strengthen your answer");
    tips.push("• Use 'for example' or 'such as' to introduce real scenarios");
  }
  
  if (hasStructure) {
    strengths.push("📊 Well-structured response with clear progression");
  } else {
    improvements.push("🔨 Structure your answer with clear sections (First..., Then..., Finally...)");
    tips.push("• Start with a brief overview");
    tips.push("• Use transition words to guide the interviewer");
  }
  
  // Category-specific analysis
  if (category === "Behavioural") {
    if (answer.toLowerCase().includes("i learned") || answer.toLowerCase().includes("improved")) {
      strengths.push("🎯 Shows growth mindset and learning ability");
    } else {
      improvements.push("🌱 Highlight what you learned from the experience");
      tips.push("• Emphasize personal growth and lessons learned");
    }
  }
  
  if (category === "HR") {
    if (answer.toLowerCase().includes("company") || answer.toLowerCase().includes("values")) {
      strengths.push("🏢 Shows research and genuine interest in the company");
    } else {
      improvements.push("🔍 Research the company and connect your values to theirs");
      tips.push("• Mention specific company values or projects");
    }
  }
  
  if (category === "Technical") {
    if (hasNumbers || /code|programming|development/i.test(answer)) {
      strengths.push("⚡ Demonstrates technical depth");
    } else {
      improvements.push("💻 Add technical specifics or code examples");
      tips.push("• Include technical terminology to show expertise");
    }
  }
  
  // Generate overall score
  const overallScore = Math.round((clarityScore + structureScore + relevanceScore + confidenceScore) / 4);
  
  // Generate motivational message
  let motivationalMessage = "";
  if (overallScore >= 85) {
    motivationalMessage = "🌟 Outstanding! This answer would impress any interviewer!";
  } else if (overallScore >= 70) {
    motivationalMessage = "👍 Great job! With minor improvements, you'll be interview-ready!";
  } else if (overallScore >= 50) {
    motivationalMessage = "📈 Good start! Let's work on making your answer more impactful.";
  } else {
    motivationalMessage = "💪 Keep practicing! Every attempt makes you better.";
  }
  
  // Generate sample answer
  const sampleAnswer = `"Here's an excellent example: I would structure my response by first addressing the key points, then providing concrete examples from my experience, and finally connecting it back to the role requirements. For instance, in a similar situation, I handled it by..."`;
  
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    feedback: `## 🎯 Performance Analysis (${overallScore}/100)

### ✨ Strengths
${strengths.join('\n') || "✓ Good foundation to build upon"}

### 🔧 Areas for Improvement
${improvements.join('\n') || "✓ Keep practicing to perfect your delivery"}

### 💡 Pro Tips
${tips.join('\n') || "• Practice speaking naturally\n• Record yourself to track progress\n• Focus on being concise and impactful"}

### 📝 Sample Answer Template
${sampleAnswer}

### 🎉 Overall Impression
${motivationalMessage}

### 📊 Score Breakdown
• Clarity & Detail: ${Math.round(clarityScore)}/100
• Structure & Flow: ${structureScore}/100  
• Relevance: ${Math.round(relevanceScore)}/100
• Impact & Examples: ${Math.round(confidenceScore)}/100`,
    score: overallScore,
    strengths: strengths,
    improvements: improvements,
    tips: tips
  };
};

export default function Interview() {
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbackData, setFeedbackData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentQ, setCurrentQ] = useState(0);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [showTips, setShowTips] = useState(false);
  const [wordCountState, setWordCountState] = useState(0);

  const recognitionRef = useRef(null);
  const navigate = useNavigate();
  const textareaRef = useRef(null);

  const q = QUESTIONS[currentQ];
  const wc = wordCount(answer);
  const isLastQuestion = currentQ === QUESTIONS.length - 1;
  const canSubmit = wc >= 20 && !loading;
  const categoryStyle = CATEGORY_STYLES[q.category];
  const progress = ((currentQ + 1) / QUESTIONS.length) * 100;

  useEffect(() => {
    setWordCountState(wc);
  }, [wc]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { 
          recognitionRef.current.abort(); 
          recognitionRef.current.stop();
        } catch(e) { 
          console.log("Cleanup error:", e);
        }
      }
    };
  }, []);

  const initSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError("Speech recognition not supported. Please use Chrome, Edge, or Safari.");
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.maxAlternatives = 1;

    return recognition;
  };

  const toggleMic = () => {
    if (listening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      setListening(false);
    } else {
      const recognition = initSpeechRecognition();
      
      if (!recognition) return;

      recognition.onstart = () => {
        setListening(true);
        setError("");
      };

      recognition.onend = () => {
        setListening(false);
        recognitionRef.current = null;
      };

      recognition.onerror = (event) => {
        setListening(false);
        recognitionRef.current = null;
        
        if (event.error === "not-allowed") {
          setError("Microphone access denied. Please allow microphone permissions.");
        } else if (event.error === "no-speech") {
          setError("No speech detected. Please try again.");
        } else {
          setError(`Microphone error: ${event.error}`);
        }
      };

      recognition.onresult = (event) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPiece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPiece;
          } else {
            interimTranscript += transcriptPiece;
          }
        }

        if (finalTranscript) {
          setAnswer(prev => {
            const newAnswer = prev + (prev ? " " : "") + finalTranscript;
            return newAnswer;
          });
          setTranscript("");
        } else if (interimTranscript) {
          setTranscript(interimTranscript);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    }
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setLoading(true);
    setError("");
    setFeedback("");
    setFeedbackData(null);
    setShowTips(false);

    try {
      // Use intelligent feedback system
      const result = await getIntelligentFeedback(answer, q.question, q.category);
      setFeedback(result.feedback);
      setFeedbackData(result);
    } catch (err) {
      console.error("Submit error:", err);
      setError("Unable to analyze answer. Please try again.");
      // Fallback feedback
      setFeedback(`## Feedback for "${q.question}"

Your answer has ${wc} words. To improve:
• Aim for 30+ words for comprehensive answers
• Include specific examples from your experience
• Structure your answer with clear sections
• Practice delivering with confidence

Keep practicing to improve your interview skills!`);
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = () => {
    if (isLastQuestion) {
      navigate("/dashboard");
    } else {
      setCurrentQ((p) => p + 1);
      setAnswer("");
      setFeedback("");
      setFeedbackData(null);
      setError("");
      setTranscript("");
      setShowTips(false);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
        setListening(false);
      }
    }
  };

  const clearAnswer = () => {
    setAnswer("");
    setTranscript("");
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <>
      <style>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scale-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #fff, ${categoryStyle.accent}, #fff);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradient-shift 3s ease infinite;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${categoryStyle.accent};
          border-radius: 10px;
        }
        
        .typing-cursor::after {
          content: '|';
          animation: blink 1s step-end infinite;
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse at top, #0f0c29, #1a1a3e, #0a0a1a)",
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
        position: "relative",
        overflowX: "hidden",
      }}>
        
        {/* Animated Background Elements */}
        <div style={{
          position: "fixed",
          top: "10%",
          right: "5%",
          width: "400px",
          height: "400px",
          background: `radial-gradient(circle, ${categoryStyle.accent}20, transparent)`,
          borderRadius: "50%",
          animation: "float 15s ease-in-out infinite",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "fixed",
          bottom: "10%",
          left: "5%",
          width: "350px",
          height: "350px",
          background: `radial-gradient(circle, ${categoryStyle.accent}15, transparent)`,
          borderRadius: "50%",
          animation: "float 12s ease-in-out infinite reverse",
          pointerEvents: "none",
        }} />
        
        {/* Grid Pattern Overlay */}
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
          pointerEvents: "none",
        }} />

        <div style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "24px",
          position: "relative",
          zIndex: 1,
        }}>
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 40,
              flexWrap: "wrap",
              gap: 20,
            }}
          >
            <motion.button
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/dashboard")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 50,
                padding: "12px 24px",
                color: "#a09cb8",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Back to Dashboard
            </motion.button>
            
            <div style={{ textAlign: "center" }}>
              <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                style={{
                  fontSize: "clamp(28px, 6vw, 40px)",
                  fontWeight: 800,
                  background: "linear-gradient(135deg, #fff, #a09cb8, #fff)",
                  backgroundSize: "200% auto",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  margin: 0,
                  animation: "gradient-shift 3s ease infinite",
                }}
              >
                AI Interview Coach
              </motion.h1>
              <p style={{ fontSize: 13, color: "#6b6880", marginTop: 8 }}>
                Powered by Advanced AI Analysis
              </p>
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              style={{
                background: `linear-gradient(135deg, ${categoryStyle.accent}20, transparent)`,
                backdropFilter: "blur(10px)",
                padding: "10px 22px",
                borderRadius: 50,
                fontSize: 14,
                fontWeight: 700,
                color: categoryStyle.accent,
                border: `1px solid ${categoryStyle.accent}40`,
              }}
            >
              {currentQ + 1} / {QUESTIONS.length}
            </motion.div>
          </motion.div>

          {/* Progress Bar */}
          <div style={{
            height: 6,
            background: "rgba(255,255,255,0.05)",
            borderRadius: 6,
            overflow: "hidden",
            marginBottom: 40,
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              style={{
                height: "100%",
                background: `linear-gradient(90deg, ${categoryStyle.accent}, ${categoryStyle.accent}80)`,
                borderRadius: 6,
                boxShadow: `0 0 20px ${categoryStyle.accent}`,
              }}
            />
          </div>

          {/* Question Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
              backdropFilter: "blur(20px)",
              border: `1px solid ${categoryStyle.accent}30`,
              borderRadius: 32,
              padding: "32px",
              marginBottom: 28,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: `linear-gradient(90deg, ${categoryStyle.accent}, ${categoryStyle.accent}80)`,
            }} />
            
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
              flexWrap: "wrap",
              gap: 12,
            }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{
                  fontSize: 32,
                }}>{categoryStyle.icon}</span>
                <span style={{
                  background: `linear-gradient(135deg, ${categoryStyle.accent}20, transparent)`,
                  color: categoryStyle.accent,
                  padding: "6px 16px",
                  borderRadius: 50,
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  border: `1px solid ${categoryStyle.accent}30`,
                }}>
                  {q.category}
                </span>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <span style={{
                  fontSize: 11,
                  padding: "6px 14px",
                  borderRadius: 20,
                  background: q.difficulty === "Easy" ? "#10B98120" : q.difficulty === "Medium" ? "#F9731620" : "#EF444420",
                  color: q.difficulty === "Easy" ? "#10B981" : q.difficulty === "Medium" ? "#F97316" : "#EF4444",
                  fontWeight: 600,
                }}>
                  {q.difficulty === "Easy" ? "🟢 Beginner" : q.difficulty === "Medium" ? "🟡 Intermediate" : "🔴 Advanced"}
                </span>
                <span style={{
                  fontSize: 11,
                  padding: "6px 14px",
                  borderRadius: 20,
                  background: "rgba(255,255,255,0.05)",
                  color: "#a09cb8",
                }}>
                  ⏱️ {q.timeEstimate}
                </span>
              </div>
            </div>
            
            <motion.p
              key={currentQ}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                fontSize: "clamp(20px, 5vw, 26px)",
                fontWeight: 600,
                color: "#fff",
                lineHeight: 1.4,
                margin: 0,
              }}
            >
              {q.question}
            </motion.p>
          </motion.div>

          {/* Answer Input Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div style={{ position: "relative" }}>
              <textarea
                ref={textareaRef}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="📝 Type your answer here... or click the microphone to speak naturally"
                style={{
                  width: "100%",
                  minHeight: 200,
                  background: "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 24,
                  padding: "20px",
                  color: "#fff",
                  fontSize: 15,
                  fontFamily: "inherit",
                  lineHeight: 1.6,
                  resize: "vertical",
                  transition: "all 0.3s ease",
                }}
              />
              
              {answer.length === 0 && (
                <div style={{
                  position: "absolute",
                  bottom: 20,
                  right: 20,
                  opacity: 0.3,
                  fontSize: 12,
                  color: "#fff",
                }}>
                  <div className="typing-cursor"></div>
                </div>
              )}
            </div>

            {/* Interim Transcript */}
            <AnimatePresence>
              {transcript && listening && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{
                    marginTop: 12,
                    padding: "12px 16px",
                    background: `linear-gradient(135deg, ${categoryStyle.accent}15, transparent)`,
                    borderRadius: 16,
                    fontSize: 13,
                    color: categoryStyle.accent,
                    fontStyle: "italic",
                    border: `1px solid ${categoryStyle.accent}30`,
                  }}
                >
                  🎙️ Listening: {transcript}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Word Count & Actions */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 16,
              marginBottom: 24,
              flexWrap: "wrap",
              gap: 12,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  background: "rgba(255,255,255,0.05)",
                  padding: "8px 16px",
                  borderRadius: 50,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}>
                  <span style={{ fontSize: 13, color: "#6b6880" }}>📝 Words:</span>
                  <motion.span
                    key={wordCountState}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: wc >= 20 ? "#10B981" : wc > 0 ? "#F97316" : "#6b6880",
                    }}
                  >
                    {wc}
                  </motion.span>
                </div>
                
                {wc < 20 && wc > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{
                      background: "#F9731620",
                      padding: "6px 12px",
                      borderRadius: 50,
                      fontSize: 12,
                      color: "#F97316",
                    }}
                  >
                    Need {20 - wc} more words
                  </motion.div>
                )}
                
                {wc >= 20 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                      background: "#10B98120",
                      padding: "6px 12px",
                      borderRadius: 50,
                      fontSize: 12,
                      color: "#10B981",
                    }}
                  >
                    ✓ Ready for review
                  </motion.div>
                )}
              </div>

              {answer && (
                <button
                  onClick={clearAnswer}
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: 50,
                    color: "#a09cb8",
                    fontSize: 12,
                    cursor: "pointer",
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                >
                  Clear ✕
                </button>
              )}
            </div>

            {/* Recording Indicator */}
            {listening && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 20px",
                  background: "linear-gradient(135deg, #EF444420, #F9731620)",
                  borderRadius: 50,
                  marginBottom: 20,
                  border: "1px solid #EF444440",
                }}
              >
                <div style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: "#EF4444",
                  animation: "scale-pulse 1s ease infinite",
                  boxShadow: "0 0 10px #EF4444",
                }} />
                <span style={{ color: "#F97316", fontSize: 13, fontWeight: 500 }}>
                  Recording in progress... Speak clearly
                </span>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div style={{
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
            }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={toggleMic}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "14px 28px",
                  background: listening ? "#EF444420" : "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(10px)",
                  border: listening ? "1px solid #EF4444" : "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 50,
                  color: listening ? "#EF4444" : "#a09cb8",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                {listening ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="1" y1="1" x2="23" y2="23"/>
                      <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/>
                      <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2"/>
                      <line x1="12" y1="22" x2="12" y2="17"/>
                    </svg>
                    Stop Recording
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="2" width="6" height="12" rx="3"/>
                      <path d="M19 10a7 7 0 0 1-14 0"/>
                      <line x1="12" y1="22" x2="12" y2="17"/>
                    </svg>
                    🎤 Speak Answer
                  </>
                )}
              </motion.button>

              <motion.button
                whileHover={canSubmit ? { scale: 1.02 } : {}}
                whileTap={canSubmit ? { scale: 0.98 } : {}}
                onClick={handleSubmit}
                disabled={!canSubmit || loading}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                  padding: "14px 28px",
                  background: (!canSubmit || loading) ? "rgba(255,255,255,0.05)" : `linear-gradient(135deg, ${categoryStyle.accent}, ${categoryStyle.accent}80)`,
                  border: "none",
                  borderRadius: 50,
                  color: (!canSubmit || loading) ? "rgba(255,255,255,0.3)" : "#fff",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: (!canSubmit || loading) ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: (!canSubmit || loading) ? "none" : `0 4px 20px ${categoryStyle.accent}60`,
                }}
              >
                {loading ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}>
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    Analyzing with AI...
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13"/>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                    Get AI Feedback
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: "#EF444420",
                  backdropFilter: "blur(10px)",
                  border: "1px solid #EF444460",
                  padding: "16px 20px",
                  borderRadius: 20,
                  marginTop: 24,
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span style={{ color: "#EF4444", fontSize: 13 }}>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Feedback Section */}
          <AnimatePresence>
            {(feedback || loading) && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.5 }}
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
                  backdropFilter: "blur(20px)",
                  border: `1px solid ${categoryStyle.accent}30`,
                  borderRadius: 32,
                  padding: "32px",
                  marginTop: 32,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: `linear-gradient(90deg, ${categoryStyle.accent}, ${categoryStyle.accent}80)`,
                }} />
                
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 24,
                }}>
                  <motion.div
                    initial={{ rotate: -180, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${categoryStyle.accent}, ${categoryStyle.accent}80)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                      <path d="M12 3L14 8L19 10L14 12L12 17L10 12L5 10L10 8L12 3Z"/>
                    </svg>
                  </motion.div>
                  <div>
                    <h3 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: 0 }}>
                      AI Analysis Report
                    </h3>
                    {feedbackData && (
                      <p style={{ fontSize: 13, color: categoryStyle.accent, marginTop: 4 }}>
                        Score: {feedbackData.score}/100
                      </p>
                    )}
                  </div>
                </div>

                {loading ? (
                  <div>
                    {[1, 2, 3].map((i) => (
                      <div key={i} style={{
                        height: 14,
                        background: "rgba(255,255,255,0.05)",
                        borderRadius: 8,
                        width: `${90 - i * 10}%`,
                        marginBottom: 12,
                        animation: "glow-pulse 1.5s ease-in-out infinite",
                      }} />
                    ))}
                  </div>
                ) : (
                  <>
                    <div style={{
                      fontSize: 14,
                      lineHeight: 1.8,
                      color: "#d4d0e8",
                      whiteSpace: "pre-wrap",
                      fontFamily: "monospace",
                      maxHeight: 500,
                      overflowY: "auto",
                      paddingRight: 8,
                    }}
                    className="custom-scrollbar">
                      {feedback}
                    </div>
                    
                    {feedbackData && feedbackData.tips && (
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => setShowTips(!showTips)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginTop: 20,
                          padding: "10px 20px",
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: 50,
                          color: "#a09cb8",
                          fontSize: 13,
                          cursor: "pointer",
                        }}
                      >
                        <span>💡</span>
                        {showTips ? "Hide Quick Tips" : "Show Quick Tips"}
                      </motion.button>
                    )}
                    
                    <AnimatePresence>
                      {showTips && feedbackData && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          style={{
                            marginTop: 20,
                            padding: "20px",
                            background: "rgba(255,255,255,0.03)",
                            borderRadius: 20,
                            borderLeft: `4px solid ${categoryStyle.accent}`,
                          }}
                        >
                          <h4 style={{ fontSize: 14, fontWeight: 700, color: categoryStyle.accent, marginBottom: 12 }}>
                            🚀 Quick Improvement Tips
                          </h4>
                          {feedbackData.tips.map((tip, idx) => (
                            <p key={idx} style={{ fontSize: 13, color: "#a09cb8", marginBottom: 8 }}>
                              {tip}
                            </p>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={nextQuestion}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 12,
                        width: "100%",
                        marginTop: 28,
                        padding: "16px",
                        background: `linear-gradient(135deg, ${categoryStyle.accent}, ${categoryStyle.accent}80)`,
                        border: "none",
                        borderRadius: 50,
                        color: "#fff",
                        fontSize: 15,
                        fontWeight: 700,
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {isLastQuestion ? (
                        <>
                          🎉 Complete Interview & Return to Dashboard
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="9 18 15 12 9 6"/>
                          </svg>
                        </>
                      ) : (
                        <>
                          Next Question
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="9 18 15 12 9 6"/>
                          </svg>
                        </>
                      )}
                    </motion.button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Completion Celebration */}
          {feedback && isLastQuestion && !loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              style={{
                textAlign: "center",
                marginTop: 24,
                padding: "20px",
                background: "linear-gradient(135deg, #10B98120, #05966910)",
                borderRadius: 24,
                border: "1px solid #10B98140",
              }}
            >
              <p style={{ fontSize: 14, color: "#10B981", margin: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Congratulations! You've completed all interview questions!
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}