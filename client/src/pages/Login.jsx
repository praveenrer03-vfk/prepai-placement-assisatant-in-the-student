import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  Zap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Globe,
  TrendingUp,
  Award,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginModern() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const features = [
    { icon: <TrendingUp size={24} />, title: "Smart Analytics", desc: "AI-driven insights" },
    { icon: <Globe size={24} />, title: "Global Network", desc: "Connect worldwide" },
    { icon: <Award size={24} />, title: "Certified Courses", desc: "Industry recognized" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("https://prepai-placement-assisatant-in-the.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      } else {
        setError(data.error || "Invalid login credentials");
      }
    } catch (error) {
      setError("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        position: "relative",
        overflow: "auto",
        fontFamily: "'Inter', 'Poppins', system-ui, sans-serif"
      }}
    >
      {/* Animated Background Circles - Adjusted for mobile */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 25, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          top: "-20%",
          right: "-20%",
          width: isMobile ? "300px" : "500px",
          height: isMobile ? "300px" : "500px",
          background: "radial-gradient(circle, rgba(255,255,255,0.1), transparent)",
          borderRadius: "50%",
          pointerEvents: "none"
        }}
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -50, 0],
          y: [0, -25, 0]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          bottom: "-20%",
          left: "-20%",
          width: isMobile ? "350px" : "600px",
          height: isMobile ? "350px" : "600px",
          background: "radial-gradient(circle, rgba(255,255,255,0.08), transparent)",
          borderRadius: "50%",
          pointerEvents: "none"
        }}
      />

      {/* Main Container */}
      <div style={{ 
        display: "flex", 
        width: "100%", 
        zIndex: 1, 
        alignItems: "center", 
        justifyContent: "center", 
        padding: isMobile ? "16px" : "20px",
        minHeight: "100vh"
      }}>
        
        {/* Glassmorphism Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            maxWidth: isMobile ? "100%" : "1200px",
            width: "100%",
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(20px)",
            borderRadius: isMobile ? "24px" : "40px",
            overflow: "hidden",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            border: "1px solid rgba(255, 255, 255, 0.2)"
          }}
        >
          
          {/* Left Side - Brand Section */}
          <motion.div
            initial={{ x: isMobile ? 0 : -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              flex: isMobile ? "auto" : 1.2,
              padding: isMobile ? "32px 24px" : "60px",
              background: "linear-gradient(135deg, rgba(0,0,0,0.4), rgba(0,0,0,0.2))",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <div>
              {/* Logo */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: isMobile ? "40px" : "60px",
                  justifyContent: isMobile ? "center" : "flex-start"
                }}
              >
                <div style={{
                  width: isMobile ? "40px" : "45px",
                  height: isMobile ? "40px" : "45px",
                  background: "white",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <Zap size={isMobile ? 24 : 28} color="#667eea" />
                </div>
                <h2 style={{ 
                  color: "white", 
                  fontSize: isMobile ? "24px" : "28px", 
                  fontWeight: "700", 
                  margin: 0 
                }}>
                  CAMPUS CRAZE
                </h2>
              </motion.div>

              {/* Main Message */}
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                style={{
                  color: "white",
                  fontSize: isMobile ? "32px" : "48px",
                  fontWeight: "800",
                  lineHeight: 1.2,
                  marginBottom: "16px",
                  textAlign: isMobile ? "center" : "left"
                }}
              >
                Welcome to the
                <br />
                Future of Learning
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                style={{
                  color: "rgba(255,255,255,0.8)",
                  fontSize: isMobile ? "14px" : "16px",
                  lineHeight: 1.6,
                  marginBottom: isMobile ? "30px" : "50px",
                  textAlign: isMobile ? "center" : "left"
                }}
              >
                Join thousands of students who have accelerated their careers with our AI-powered platform.
              </motion.p>

              {/* Rotating Features */}
              <div style={{ marginBottom: isMobile ? "30px" : "50px" }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeFeature}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      padding: isMobile ? "12px" : "16px",
                      background: "rgba(255,255,255,0.1)",
                      borderRadius: "16px",
                      border: "1px solid rgba(255,255,255,0.2)",
                      flexDirection: isMobile ? "column" : "row",
                      textAlign: isMobile ? "center" : "left"
                    }}
                  >
                    <div style={{ color: "white" }}>{features[activeFeature].icon}</div>
                    <div>
                      <h4 style={{ color: "white", margin: 0, fontSize: isMobile ? "16px" : "18px" }}>
                        {features[activeFeature].title}
                      </h4>
                      <p style={{ color: "rgba(255,255,255,0.7)", margin: "5px 0 0", fontSize: "13px" }}>
                        {features[activeFeature].desc}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Stats */}
              <div style={{ 
                display: "flex", 
                gap: isMobile ? "15px" : "30px", 
                justifyContent: isMobile ? "center" : "flex-start",
                flexWrap: "wrap"
              }}>
                {[
                  { value: "50K+", label: "Active Students" },
                  { value: "98%", label: "Success Rate" },
                  { value: "24/7", label: "Support" }
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    style={{ textAlign: "center", flex: isMobile ? "auto" : "none" }}
                  >
                    <h3 style={{ 
                      color: "white", 
                      fontSize: isMobile ? "24px" : "28px", 
                      margin: 0, 
                      fontWeight: "700" 
                    }}>
                      {stat.value}
                    </h3>
                    <p style={{ 
                      color: "rgba(255,255,255,0.6)", 
                      margin: "5px 0 0", 
                      fontSize: "11px" 
                    }}>
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Trust Badges - Hidden on mobile */}
            {!isMobile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                style={{
                  display: "flex",
                  gap: "20px",
                  marginTop: "60px",
                  paddingTop: "30px",
                  borderTop: "1px solid rgba(255,255,255,0.1)"
                }}
              >
                {["Trustpilot", "G2", "Capterra"].map((badge) => (
                  <div key={badge} style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>
                    ★ {badge}
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            initial={{ x: isMobile ? 0 : 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{
              flex: 1,
              padding: isMobile ? "32px 24px" : "60px",
              background: "rgba(255, 255, 255, 0.95)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center"
            }}
          >
            <div style={{ 
              maxWidth: isMobile ? "100%" : "400px", 
              margin: "0 auto", 
              width: "100%" 
            }}>
              {/* Header */}
              <div style={{ marginBottom: isMobile ? "32px" : "40px", textAlign: isMobile ? "center" : "left" }}>
                <h2 style={{ 
                  fontSize: isMobile ? "28px" : "32px", 
                  fontWeight: "700", 
                  color: "#333", 
                  marginBottom: "8px" 
                }}>
                  Sign In
                </h2>
                <p style={{ color: "#666", fontSize: "14px" }}>
                  Welcome back! Please enter your details
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Email Field */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ 
                    display: "block", 
                    marginBottom: "8px", 
                    color: "#333", 
                    fontSize: "13px", 
                    fontWeight: "600" 
                  }}>
                    Email Address
                  </label>
                  <div style={{ position: "relative" }}>
                    <Mail size={18} style={{ 
                      position: "absolute", 
                      left: "16px", 
                      top: "50%", 
                      transform: "translateY(-50%)", 
                      color: "#999" 
                    }} />
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="you@example.com"
                      style={{
                        width: "100%",
                        padding: isMobile ? "12px 12px 12px 46px" : "14px 14px 14px 46px",
                        border: "2px solid #e0e0e0",
                        borderRadius: "12px",
                        fontSize: isMobile ? "16px" : "14px",
                        outline: "none",
                        transition: "all 0.3s",
                        fontFamily: "inherit",
                        WebkitAppearance: "none"
                      }}
                      onFocus={(e) => e.target.style.borderColor = "#667eea"}
                      onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ 
                    display: "block", 
                    marginBottom: "8px", 
                    color: "#333", 
                    fontSize: "13px", 
                    fontWeight: "600" 
                  }}>
                    Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <Lock size={18} style={{ 
                      position: "absolute", 
                      left: "16px", 
                      top: "50%", 
                      transform: "translateY(-50%)", 
                      color: "#999" 
                    }} />
                    <input
                      type={showPw ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      required
                      placeholder="Enter your password"
                      style={{
                        width: "100%",
                        padding: isMobile ? "12px 46px 12px 46px" : "14px 46px 14px 46px",
                        border: "2px solid #e0e0e0",
                        borderRadius: "12px",
                        fontSize: isMobile ? "16px" : "14px",
                        outline: "none",
                        transition: "all 0.3s",
                        fontFamily: "inherit",
                        WebkitAppearance: "none"
                      }}
                      onFocus={(e) => e.target.style.borderColor = "#667eea"}
                      onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      style={{
                        position: "absolute",
                        right: "16px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#999",
                        padding: "8px"
                      }}
                    >
                      {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Options */}
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center", 
                  marginBottom: "24px",
                  flexWrap: "wrap",
                  gap: "10px"
                }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#666" }}>
                    <input type="checkbox" style={{ accentColor: "#667eea" }} />
                    Remember me
                  </label>
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#667eea",
                      fontSize: "13px",
                      cursor: "pointer",
                      fontWeight: "600",
                      padding: "4px"
                    }}
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      style={{
                        background: "#fee",
                        border: "1px solid #fcc",
                        padding: "12px",
                        borderRadius: "8px",
                        color: "#e74c3c",
                        fontSize: "12px",
                        marginBottom: "20px",
                        textAlign: "center"
                      }}
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    width: "100%",
                    padding: isMobile ? "14px" : "14px",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    border: "none",
                    borderRadius: "12px",
                    color: "white",
                    fontWeight: "600",
                    fontSize: isMobile ? "16px" : "16px",
                    cursor: loading ? "not-allowed" : "pointer",
                    marginBottom: "24px",
                    transition: "all 0.3s",
                    WebkitTapHighlightColor: "transparent"
                  }}
                >
                  {loading ? (
                    <Loader2 size={20} style={{ animation: "spin 1s linear infinite", margin: "0 auto" }} />
                  ) : (
                    "Sign In"
                  )}
                </motion.button>

                {/* Divider */}
                <div style={{ display: "flex", alignItems: "center", marginBottom: "24px", gap: "15px" }}>
                  <div style={{ flex: 1, height: "1px", background: "#e0e0e0" }} />
                  <span style={{ color: "#999", fontSize: "12px", textAlign: "center" }}>
                    OR CONTINUE WITH
                  </span>
                  <div style={{ flex: 1, height: "1px", background: "#e0e0e0" }} />
                </div>

                {/* Social Login */}
                <div style={{ 
                  display: "flex", 
                  gap: "12px", 
                  marginBottom: "32px",
                  flexDirection: isMobile ? "column" : "row"
                }}>
                  {["Google", "GitHub", "LinkedIn"].map((platform) => (
                    <motion.button
                      key={platform}
                      whileHover={{ y: -2 }}
                      style={{
                        flex: 1,
                        padding: isMobile ? "12px" : "10px",
                        background: "white",
                        border: "2px solid #e0e0e0",
                        borderRadius: "10px",
                        color: "#666",
                        fontSize: "13px",
                        cursor: "pointer",
                        fontWeight: "600",
                        transition: "all 0.3s",
                        WebkitTapHighlightColor: "transparent"
                      }}
                      onMouseEnter={(e) => e.target.style.borderColor = "#667eea"}
                      onMouseLeave={(e) => e.target.style.borderColor = "#e0e0e0"}
                    >
                      {platform}
                    </motion.button>
                  ))}
                </div>

                {/* Register Link */}
                <p style={{ textAlign: "center", color: "#666", fontSize: "13px", marginBottom: "20px" }}>
                  Don't have an account?{" "}
                  <motion.span
                    whileHover={{ x: 5 }}
                    onClick={() => navigate("/register")}
                    style={{ 
                      color: "#667eea", 
                      cursor: "pointer", 
                      fontWeight: "600",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px"
                    }}
                  >
                    Create Account
                    <ChevronRight size={14} />
                  </motion.span>
                </p>
              </form>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          input:focus {
            border-color: #667eea !important;
            outline: none;
          }
          
          ::-webkit-scrollbar {
            display: none;
          }
          
          /* Better touch targets for mobile */
          @media (max-width: 768px) {
            button, 
            input, 
            [role="button"],
            label {
              touch-action: manipulation;
            }
            
            input {
              font-size: 16px !important; /* Prevents zoom on iOS */
            }
            
            button {
              min-height: 44px;
            }
          }
          
          /* Smooth scrolling */
          html {
            scroll-behavior: smooth;
          }
          
          /* Prevent pull-to-refresh on mobile */
          body {
            overscroll-behavior: none;
          }
        `}
      </style>
    </div>
  );
}