import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  Zap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Fingerprint,
  Shield,
  Star,
  Activity
} from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState([]);
  const containerRef = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleRipple = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples(prev => [...prev, { id, x, y }]);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 1000);
  };

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
      ref={containerRef}
      style={{
        minHeight: "100vh",
        background: "#000000",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'SF Pro Display', 'Inter', system-ui, sans-serif"
      }}
    >
      {/* Animated Grid Background */}
      <svg style={{ position: "absolute", width: "100%", height: "100%", opacity: 0.1 }}>
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00ff88" strokeWidth="0.5"/>
          </pattern>
          <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ff88" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="#00d4ff" stopOpacity="0.8"/>
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* 3D Floating Geometric Shapes */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, rotate: 0 }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            x: [0, Math.sin(i) * 100, 0],
            y: [0, Math.cos(i) * 100, 0]
          }}
          transition={{
            duration: 10 + i * 2,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            position: "absolute",
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${30 + i * 5}px`,
            height: `${30 + i * 5}px`,
            background: `linear-gradient(135deg, #00ff88, #00d4ff)`,
            opacity: 0.1,
            borderRadius: i % 2 === 0 ? "50%" : "30%",
            filter: "blur(20px)",
            pointerEvents: "none"
          }}
        />
      ))}

      {/* Dynamic Cursor Light */}
      <motion.div
        style={{
          position: "fixed",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(0,255,136,0.15), transparent)",
          borderRadius: "50%",
          left: useTransform(mouseX, x => x - 200),
          top: useTransform(mouseY, y => y - 200),
          pointerEvents: "none",
          zIndex: 0
        }}
      />

      {/* Main Content Split Screen */}
      <div style={{ display: "flex", width: "100%", zIndex: 1 }}>
        
        {/* Left Side - Interactive Hero Section */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          style={{
            flex: 1,
            background: "linear-gradient(135deg, rgba(0,0,0,0.95), rgba(0,20,10,0.98))",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "60px",
            position: "relative",
            overflow: "hidden"
          }}
        >
          {/* Animated Stats Cards */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{
              position: "absolute",
              top: "20%",
              right: "10%",
              background: "rgba(0,255,136,0.1)",
              backdropFilter: "blur(10px)",
              padding: "20px",
              borderRadius: "20px",
              border: "1px solid rgba(0,255,136,0.3)"
            }}
          >
            <div style={{ color: "#00ff88", fontSize: "32px", fontWeight: "bold" }}>98%</div>
            <div style={{ color: "white", fontSize: "12px" }}>Success Rate</div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            style={{
              position: "absolute",
              bottom: "20%",
              left: "10%",
              background: "rgba(0,255,136,0.1)",
              backdropFilter: "blur(10px)",
              padding: "20px",
              borderRadius: "20px",
              border: "1px solid rgba(0,255,136,0.3)"
            }}
          >
            <div style={{ color: "#00ff88", fontSize: "32px", fontWeight: "bold" }}>50K+</div>
            <div style={{ color: "white", fontSize: "12px" }}>Active Users</div>
          </motion.div>

          <motion.h1
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            style={{
              fontSize: "72px",
              fontWeight: "900",
              background: "linear-gradient(135deg, #00ff88, #00d4ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "20px",
              lineHeight: 1.1
            }}
          >
            PrepAI
            <br />
            Intelligence
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ color: "#888", fontSize: "18px", marginBottom: "40px", maxWidth: "80%" }}
          >
            Experience the future of AI-powered placement assistance with cutting-edge technology
          </motion.p>

          {/* Feature List with Animations */}
          {[
            { icon: <Star size={20} />, text: "AI-Powered Career Guidance" },
            { icon: <Activity size={20} />, text: "Real-time Performance Analytics" },
            { icon: <Shield size={20} />, text: "Enterprise-Grade Security" }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              whileHover={{ x: 10 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
                marginBottom: "20px",
                color: "white"
              }}
            >
              <div style={{ color: "#00ff88" }}>{feature.icon}</div>
              <span>{feature.text}</span>
            </motion.div>
          ))}

          {/* Animated Progress Bar */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "80%" }}
            transition={{ delay: 1, duration: 1 }}
            style={{
              marginTop: "60px",
              height: "2px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "2px",
              overflow: "hidden"
            }}
          >
            <motion.div
              animate={{ x: ["0%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              style={{
                width: "30%",
                height: "100%",
                background: "linear-gradient(90deg, #00ff88, #00d4ff)"
              }}
            />
          </motion.div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(20px)",
            position: "relative"
          }}
        >
          {/* Ripple Effect Canvas */}
          <div
            onClick={handleRipple}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              zIndex: 10
            }}
          >
            {ripples.map(ripple => (
              <motion.div
                key={ripple.id}
                initial={{ scale: 0, opacity: 0.8 }}
                animate={{ scale: 4, opacity: 0 }}
                transition={{ duration: 1 }}
                style={{
                  position: "fixed",
                  left: ripple.x,
                  top: ripple.y,
                  width: "60px",
                  height: "60px",
                  border: "2px solid #00ff88",
                  borderRadius: "50%",
                  transform: "translate(-50%, -50%)"
                }}
              />
            ))}
          </div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            style={{
              width: "100%",
              maxWidth: "450px",
              padding: "50px"
            }}
          >
            {/* Neon Logo with Pulse */}
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 0px #00ff88",
                  "0 0 30px #00ff88",
                  "0 0 0px #00ff88"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                width: "70px",
                height: "70px",
                background: "linear-gradient(135deg, #00ff88, #00d4ff)",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "30px"
              }}
            >
              <Zap size={35} color="black" />
            </motion.div>

            <h2 style={{ color: "white", fontSize: "32px", marginBottom: "10px" }}>
              Welcome Back
            </h2>
            <p style={{ color: "#666", marginBottom: "40px" }}>
              Sign in to access your dashboard
            </p>

            <form onSubmit={handleSubmit}>
              {/* Email Field */}
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                style={{ marginBottom: "25px" }}
              >
                <label style={{ color: "#00ff88", fontSize: "12px", fontWeight: "600", marginBottom: "8px", display: "block" }}>
                  EMAIL ADDRESS
                </label>
                <div style={{ position: "relative" }}>
                  <Mail size={18} style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "#00ff88" }} />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "15px 15px 15px 45px",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(0,255,136,0.3)",
                      borderRadius: "12px",
                      color: "white",
                      outline: "none",
                      fontSize: "14px",
                      transition: "all 0.3s"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#00ff88"}
                    onBlur={(e) => e.target.style.borderColor = "rgba(0,255,136,0.3)"}
                  />
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{ marginBottom: "20px" }}
              >
                <label style={{ color: "#00ff88", fontSize: "12px", fontWeight: "600", marginBottom: "8px", display: "block" }}>
                  PASSWORD
                </label>
                <div style={{ position: "relative" }}>
                  <Lock size={18} style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "#00ff88" }} />
                  <input
                    type={showPw ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "15px 45px 15px 45px",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(0,255,136,0.3)",
                      borderRadius: "12px",
                      color: "white",
                      outline: "none",
                      fontSize: "14px"
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    style={{
                      position: "absolute",
                      right: "15px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: "#888",
                      cursor: "pointer"
                    }}
                  >
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </motion.div>

              {/* Biometric Option */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "30px"
                }}
              >
                <label style={{ display: "flex", alignItems: "center", gap: "8px", color: "#888", fontSize: "12px" }}>
                  <input type="checkbox" style={{ accentColor: "#00ff88" }} />
                  Remember me
                </label>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  type="button"
                  style={{
                    background: "rgba(0,255,136,0.1)",
                    border: "1px solid rgba(0,255,136,0.3)",
                    padding: "8px 15px",
                    borderRadius: "20px",
                    color: "#00ff88",
                    fontSize: "12px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  <Fingerprint size={14} />
                  Use Biometric
                </motion.button>
              </motion.div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    style={{
                      background: "rgba(255,0,0,0.1)",
                      border: "1px solid rgba(255,0,0,0.3)",
                      padding: "12px",
                      borderRadius: "8px",
                      color: "#ff4444",
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
                  padding: "16px",
                  background: "linear-gradient(135deg, #00ff88, #00d4ff)",
                  border: "none",
                  borderRadius: "12px",
                  color: "black",
                  fontWeight: "bold",
                  fontSize: "16px",
                  cursor: loading ? "not-allowed" : "pointer",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                {loading ? (
                  <Loader2 size={20} style={{ animation: "spin 1s linear infinite", margin: "0 auto" }} />
                ) : (
                  "Sign In"
                )}
              </motion.button>

              {/* Divider */}
              <div style={{ display: "flex", alignItems: "center", margin: "30px 0", gap: "15px" }}>
                <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
                <span style={{ color: "#666", fontSize: "12px" }}>OR</span>
                <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
              </div>

              {/* Social Login */}
              <div style={{ display: "flex", gap: "15px" }}>
                {["Google", "GitHub", "LinkedIn"].map((platform) => (
                  <motion.button
                    key={platform}
                    whileHover={{ y: -5 }}
                    style={{
                      flex: 1,
                      padding: "12px",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(0,255,136,0.3)",
                      borderRadius: "10px",
                      color: "white",
                      fontSize: "13px",
                      cursor: "pointer"
                    }}
                  >
                    {platform}
                  </motion.button>
                ))}
              </div>

              {/* Register Link */}
              <p style={{ textAlign: "center", color: "#666", marginTop: "30px", fontSize: "13px" }}>
                Don't have an account?{" "}
                <span
                  onClick={() => navigate("/register")}
                  style={{ color: "#00ff88", cursor: "pointer", fontWeight: "bold" }}
                >
                  Create Account
                </span>
              </p>
            </form>
          </motion.div>
        </motion.div>
      </div>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          
          input:focus {
            border-color: #00ff88 !important;
            box-shadow: 0 0 20px rgba(0,255,136,0.2);
          }
          
          ::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
    </div>
  );
}