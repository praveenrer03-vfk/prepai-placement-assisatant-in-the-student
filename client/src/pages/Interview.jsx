import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

const CATEGORY_COLORS = {
  Behavioural: { bg: "#EEEDFE", color: "#3C3489", dot: "#7F77DD", border: "#7F77DD" },
  HR: { bg: "#E1F5EE", color: "#085041", dot: "#1D9E75", border: "#1D9E75" },
  Technical: { bg: "#E6F1FB", color: "#0C447C", dot: "#378ADD", border: "#378ADD" },
  Situational: { bg: "#FAEEDA", color: "#633806", dot: "#BA7517", border: "#BA7517" },
};

function wordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// Icons as inline SVG
const IconMic = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="2" width="6" height="12" rx="3"/>
    <path d="M19 10a7 7 0 0 1-14 0"/>
    <line x1="12" y1="22" x2="12" y2="17"/>
  </svg>
);

const IconMicOff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="1" y1="1" x2="23" y2="23"/>
    <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/>
    <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2"/>
    <line x1="12" y1="22" x2="12" y2="17"/>
  </svg>
);

const IconBack = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

const IconSend = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IconAlert = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const IconLoader = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
);

export default function Interview() {
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentQ, setCurrentQ] = useState(0);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  const q = QUESTIONS[currentQ];
  const wc = wordCount(answer);
  const isLastQuestion = currentQ === QUESTIONS.length - 1;
  const canSubmit = wc >= 20 && !loading;
  const colors = CATEGORY_COLORS[q.category];

  const progress = ((currentQ + 1) / QUESTIONS.length) * 100;

  // Cleanup on unmount
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

  // Initialize speech recognition
  const initSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError("Speech recognition not supported in this browser. Please use Chrome, Edge, or Safari.");
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
      // Stop listening
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      setListening(false);
    } else {
      // Start listening
      const recognition = initSpeechRecognition();
      
      if (!recognition) return;

      recognition.onstart = () => {
        console.log("Speech recognition started");
        setListening(true);
        setError("");
      };

      recognition.onend = () => {
        console.log("Speech recognition ended");
        setListening(false);
        recognitionRef.current = null;
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
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

    try {
      const res = await fetch("https://prepai-placement-assisatant-in-the.onrender.com/api/ai/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          answer, 
          question: q.question,
          category: q.category 
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setFeedback(data.feedback || "Great answer! Keep practicing to improve further.");
    } catch (err) {
      console.error("Submit error:", err);
      setError("Unable to connect to AI service. Please try again.");
      // For demo purposes, set a mock feedback
      setFeedback(`Great attempt on the "${q.question}" question! To improve, consider:
• Adding more specific examples
• Structuring your answer with clear points
• Practicing your delivery for better flow`);
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
      setError("");
      setTranscript("");
      // Stop mic if it's still listening
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
        setListening(false);
      }
    }
  };

  return (
    <>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes recordingPulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
        textarea:focus {
          outline: none;
          border-color: ${colors.border} !important;
          box-shadow: 0 0 0 3px ${colors.border}20 !important;
        }
        button {
          transition: all 0.2s ease;
        }
        button:active {
          transform: scale(0.97);
        }
        .recording-indicator {
          animation: recordingPulse 1.5s ease infinite;
        }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f0f1a 0%, #060610 100%)",
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
        position: "relative",
        overflowX: "hidden",
      }}>
        
        {/* Animated Background */}
        <div style={{
          position: "fixed",
          top: "-20%",
          right: "-10%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.border}10, transparent)`,
          animation: "pulse 8s ease-in-out infinite",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "fixed",
          bottom: "-20%",
          left: "-10%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.border}08, transparent)`,
          animation: "pulse 6s ease-in-out infinite reverse",
          pointerEvents: "none",
        }} />

        <div style={{
          maxWidth: 800,
          margin: "0 auto",
          padding: "20px",
          position: "relative",
          zIndex: 1,
        }}>
          
          {/* Header */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 30,
            flexWrap: "wrap",
            gap: 15,
          }}>
            <button
              onClick={() => navigate("/dashboard")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                padding: "10px 20px",
                color: "#a09cb8",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                e.currentTarget.style.transform = "translateX(-3px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              <IconBack /> Back
            </button>
            
            <div style={{ textAlign: "center" }}>
              <h1 style={{
                fontSize: "clamp(22px, 5vw, 28px)",
                fontWeight: 800,
                background: "linear-gradient(135deg, #fff, #a09cb8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                margin: 0,
              }}>
                AI Mock Interview
              </h1>
              <p style={{ fontSize: 12, color: "#6b6880", marginTop: 4 }}>
                Practice with real-time AI feedback
              </p>
            </div>
            
            <div style={{
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(10px)",
              padding: "8px 18px",
              borderRadius: 40,
              fontSize: 13,
              fontWeight: 600,
              color: colors.border,
            }}>
              {currentQ + 1} / {QUESTIONS.length}
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{
            height: 4,
            background: "rgba(255,255,255,0.08)",
            borderRadius: 4,
            overflow: "hidden",
            marginBottom: 30,
          }}>
            <div style={{
              width: `${progress}%`,
              height: "100%",
              background: `linear-gradient(90deg, ${colors.border}, ${colors.dot})`,
              borderRadius: 4,
              transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: `0 0 10px ${colors.border}`,
            }} />
          </div>

          {/* Question Card */}
          <div style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
            backdropFilter: "blur(10px)",
            border: `1px solid ${colors.border}30`,
            borderRadius: 24,
            padding: "28px",
            marginBottom: 24,
            position: "relative",
            overflow: "hidden",
            animation: "slideIn 0.5s ease",
          }}>
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: `linear-gradient(90deg, ${colors.border}, ${colors.dot})`,
            }} />
            
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
              flexWrap: "wrap",
              gap: 12,
            }}>
              <span style={{
                background: colors.bg,
                color: colors.color,
                padding: "4px 14px",
                borderRadius: 40,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}>
                {q.category}
              </span>
              <div style={{ display: "flex", gap: 10 }}>
                <span style={{
                  fontSize: 11,
                  padding: "4px 12px",
                  borderRadius: 20,
                  background: q.difficulty === "Easy" ? "#1D9E7520" : q.difficulty === "Medium" ? "#BA751720" : "#F0959520",
                  color: q.difficulty === "Easy" ? "#1D9E75" : q.difficulty === "Medium" ? "#BA7517" : "#F09595",
                  fontWeight: 600,
                }}>
                  {q.difficulty}
                </span>
                <span style={{
                  fontSize: 11,
                  padding: "4px 12px",
                  borderRadius: 20,
                  background: "rgba(255,255,255,0.05)",
                  color: "#a09cb8",
                }}>
                  ⏱ {q.timeEstimate}
                </span>
              </div>
            </div>
            
            <p style={{
              fontSize: "clamp(18px, 4vw, 22px)",
              fontWeight: 600,
              color: "#fff",
              lineHeight: 1.4,
              margin: 0,
            }}>{q.question}</p>
          </div>

          {/* Answer Input */}
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="💭 Type your answer here... or click the microphone button to speak naturally"
            style={{
              width: "100%",
              minHeight: 160,
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 20,
              padding: "18px",
              color: "#fff",
              fontSize: 15,
              fontFamily: "inherit",
              lineHeight: 1.6,
              resize: "vertical",
              transition: "all 0.3s ease",
            }}
          />

          {/* Interim Transcript (what user is currently saying) */}
          {transcript && listening && (
            <div style={{
              marginTop: 8,
              padding: "8px 12px",
              background: "rgba(83,74,183,0.1)",
              borderRadius: 12,
              fontSize: 12,
              color: "#a09cb8",
              fontStyle: "italic",
            }}>
              🎙️ {transcript}
            </div>
          )}

          {/* Word Count */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 12,
            marginBottom: 20,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, color: "#6b6880" }}>📝 Word count:</span>
              <span style={{
                fontSize: 16,
                fontWeight: 700,
                color: wc >= 20 ? "#1D9E75" : wc > 0 ? "#BA7517" : "#6b6880",
              }}>{wc}</span>
              {wc < 20 && wc > 0 && (
                <span style={{ fontSize: 11, color: "#BA7517" }}>({20 - wc} more needed)</span>
              )}
              {wc >= 20 && (
                <span style={{ fontSize: 11, color: "#1D9E75" }}>✓ Ready to submit</span>
              )}
            </div>
            {listening && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div className="recording-indicator" style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#F0997B",
                  boxShadow: "0 0 8px #F0997B",
                }} />
                <span style={{ fontSize: 11, color: "#F0997B", fontWeight: 500 }}>Recording... Speak now</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{
            display: "flex",
            gap: 14,
            flexWrap: "wrap",
          }}>
            <button
              onClick={toggleMic}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 24px",
                background: listening ? "rgba(240,153,123,0.2)" : "rgba(255,255,255,0.05)",
                backdropFilter: "blur(10px)",
                border: listening ? "1px solid #F0997B" : "1px solid rgba(255,255,255,0.1)",
                borderRadius: 40,
                color: listening ? "#F0997B" : "#a09cb8",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                if (!listening) e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              }}
              onMouseLeave={(e) => {
                if (!listening) e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              }}
            >
              {listening ? <IconMicOff /> : <IconMic />}
              {listening ? "🔴 Stop Recording" : "🎤 Speak Answer"}
            </button>

            <button
              onClick={handleSubmit}
              disabled={!canSubmit || loading}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                padding: "12px 24px",
                background: (!canSubmit || loading) ? "rgba(83,74,183,0.3)" : `linear-gradient(135deg, ${colors.border}, ${colors.dot})`,
                border: "none",
                borderRadius: 40,
                color: (!canSubmit || loading) ? "rgba(255,255,255,0.4)" : "#fff",
                fontSize: 14,
                fontWeight: 700,
                cursor: (!canSubmit || loading) ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                boxShadow: (!canSubmit || loading) ? "none" : `0 4px 15px ${colors.border}60`,
              }}
            >
              {loading ? <IconLoader /> : <IconSend />}
              {loading ? "Analyzing..." : "Get AI Feedback"}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "rgba(240,149,149,0.1)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(240,149,149,0.3)",
              padding: "14px 18px",
              borderRadius: 16,
              marginTop: 24,
              animation: "fadeIn 0.3s ease",
            }}>
              <IconAlert />
              <span style={{ color: "#f09595", fontSize: 13 }}>{error}</span>
            </div>
          )}

          {/* Feedback Section */}
          {(feedback || loading) && (
            <div style={{
              background: "linear-gradient(135deg, rgba(83,74,183,0.08), rgba(55,138,221,0.04))",
              backdropFilter: "blur(10px)",
              border: `1px solid ${colors.border}30`,
              borderRadius: 24,
              padding: "28px",
              marginTop: 28,
              animation: "fadeIn 0.5s ease",
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 16,
              }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${colors.border}, ${colors.dot})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                    <path d="M12 3L14 8L19 10L14 12L12 17L10 12L5 10L10 8L12 3Z"/>
                  </svg>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", margin: 0 }}>AI Feedback</h3>
              </div>

              {loading ? (
                <div>
                  <div style={{
                    height: 12,
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: 6,
                    width: "90%",
                    marginBottom: 10,
                    animation: "pulse 1.3s ease-in-out infinite",
                  }} />
                  <div style={{
                    height: 12,
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: 6,
                    width: "75%",
                    marginBottom: 10,
                    animation: "pulse 1.3s ease-in-out infinite 0.1s",
                  }} />
                  <div style={{
                    height: 12,
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: 6,
                    width: "60%",
                    animation: "pulse 1.3s ease-in-out infinite 0.2s",
                  }} />
                </div>
              ) : (
                <>
                  <p style={{
                    fontSize: 14,
                    lineHeight: 1.7,
                    color: "#d4d0e8",
                    whiteSpace: "pre-wrap",
                  }}>{feedback}</p>
                  
                  <button
                    onClick={nextQuestion}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      width: "100%",
                      marginTop: 20,
                      padding: "14px",
                      background: `linear-gradient(135deg, ${colors.border}, ${colors.dot})`,
                      border: "none",
                      borderRadius: 40,
                      color: "#fff",
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = `0 6px 20px ${colors.border}60`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    {isLastQuestion ? "🎉 Complete Interview" : "Next Question →"}
                  </button>
                </>
              )}
            </div>
          )}

          {/* Completion Message */}
          {feedback && isLastQuestion && !loading && (
            <div style={{
              textAlign: "center",
              marginTop: 20,
              padding: "16px",
              background: "linear-gradient(135deg, rgba(29,158,117,0.1), rgba(29,158,117,0.05))",
              borderRadius: 16,
              border: "1px solid rgba(29,158,117,0.3)",
              animation: "fadeIn 0.5s ease",
            }}>
              <p style={{ fontSize: 13, color: "#1D9E75", margin: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <IconCheck /> Congratulations! You've completed all questions!
              </p>
            </div>
          )}

        </div>
      </div>
    </>
  );
}