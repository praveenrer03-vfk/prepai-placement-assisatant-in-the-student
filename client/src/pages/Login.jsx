import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  Zap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [focused, setFocused] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Handle login submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        "https://prepai-placement-assisatant-in-the.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(form)
        }
      );

      const data = await res.json();
      console.log(data);

      if (res.ok && data.token) {
        // Save token
        localStorage.setItem("token", data.token);

        // Save user info
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        // Redirect to dashboard
        navigate("/dashboard");
      } else {
        setError(data.error || "Invalid login credentials");
      }
    } catch (error) {
      console.log(error);
      setError("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(145deg, #f8f9fc 0%, #ffffff 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Poppins', sans-serif",
        padding: "20px",
        position: "relative"
      }}
    >
      {/* Decorative Background Elements */}
      <div style={{
        position: "absolute",
        top: "10%",
        left: "5%",
        width: "300px",
        height: "300px",
        background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, rgba(99,102,241,0) 70%)",
        borderRadius: "50%",
        pointerEvents: "none"
      }} />
      <div style={{
        position: "absolute",
        bottom: "10%",
        right: "5%",
        width: "400px",
        height: "400px",
        background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, rgba(139,92,246,0) 70%)",
        borderRadius: "50%",
        pointerEvents: "none"
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          width: "100%",
          maxWidth: "480px",
          padding: "48px",
          borderRadius: "32px",
          background: "#ffffff",
          boxShadow: "0 20px 60px -15px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.02)",
          position: "relative",
          zIndex: 1
        }}
      >
        {/* Premium Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          style={{
            position: "absolute",
            top: "24px",
            right: "24px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            padding: "6px 12px",
            borderRadius: "100px",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <Sparkles size={12} color="white" />
          <span style={{ color: "white", fontSize: "11px", fontWeight: "600", letterSpacing: "0.5px" }}>
            PREMIUM
          </span>
        </motion.div>

        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
            marginBottom: "40px"
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              padding: "14px",
              borderRadius: "20px",
              display: "inline-flex",
              boxShadow: "0 8px 20px -6px rgba(102, 126, 234, 0.3)"
            }}
          >
            <Zap size={34} color="white" strokeWidth={1.5} />
          </div>
          <h2 style={{ 
            color: "#1a1a2e", 
            margin: 0,
            fontSize: "32px",
            fontWeight: "700",
            letterSpacing: "-0.02em",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>PrepAI</h2>
          <p style={{
            color: "#64748b",
            margin: 0,
            fontSize: "15px",
            fontWeight: "400"
          }}>Welcome back! Please sign in to continue</p>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            style={{ position: "relative", marginBottom: "20px" }}
          >
            <label style={{
              display: "block",
              marginBottom: "8px",
              color: "#334155",
              fontSize: "13px",
              fontWeight: "600",
              letterSpacing: "0.3px"
            }}>
              Email Address
            </label>
            <div style={{ position: "relative" }}>
              <Mail
                size={18}
                style={{
                  position: "absolute",
                  top: "50%",
                  transform: "translateY(-50%)",
                  left: "16px",
                  color: focused === "email" ? "#667eea" : "#94a3b8",
                  transition: "color 0.2s ease"
                }}
              />
              <input
                type="email"
                name="email"
                placeholder="hello@example.com"
                value={form.email}
                onChange={handleChange}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused("")}
                required
                style={{
                  width: "100%",
                  background: "#f8fafc",
                  border: `1.5px solid ${
                    focused === "email"
                      ? "#667eea"
                      : "#e2e8f0"
                  }`,
                  borderRadius: "14px",
                  padding: "14px 16px 14px 46px",
                  color: "#1e293b",
                  outline: "none",
                  fontSize: "14px",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: "500",
                  transition: "all 0.2s ease"
                }}
              />
            </div>
          </motion.div>

          {/* Password */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
            style={{ position: "relative", marginBottom: "12px" }}
          >
            <label style={{
              display: "block",
              marginBottom: "8px",
              color: "#334155",
              fontSize: "13px",
              fontWeight: "600",
              letterSpacing: "0.3px"
            }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <Lock
                size={18}
                style={{
                  position: "absolute",
                  top: "50%",
                  transform: "translateY(-50%)",
                  left: "16px",
                  color: focused === "password" ? "#667eea" : "#94a3b8",
                  transition: "color 0.2s ease"
                }}
              />
              <input
                type={showPw ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused("")}
                required
                style={{
                  width: "100%",
                  background: "#f8fafc",
                  border: `1.5px solid ${
                    focused === "password"
                      ? "#667eea"
                      : "#e2e8f0"
                  }`,
                  borderRadius: "14px",
                  padding: "14px 46px 14px 46px",
                  color: "#1e293b",
                  outline: "none",
                  fontSize: "14px",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: "500",
                  transition: "all 0.2s ease"
                }}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                style={{
                  position: "absolute",
                  right: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#94a3b8",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                {showPw ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </motion.div>

          {/* Forgot Password Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{
              textAlign: "right",
              marginBottom: "28px"
            }}
          >
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              style={{
                color: "#667eea",
                fontSize: "13px",
                textDecoration: "none",
                fontWeight: "600",
                transition: "color 0.2s ease"
              }}
              onMouseEnter={(e) => e.target.style.color = "#764ba2"}
              onMouseLeave={(e) => e.target.style.color = "#667eea"}
            >
              Forgot password?
            </a>
          </motion.div>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{
                  color: "#ef4444",
                  marginBottom: "20px",
                  fontSize: "13px",
                  padding: "12px",
                  background: "#fef2f2",
                  borderRadius: "12px",
                  textAlign: "center",
                  fontWeight: "500"
                }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            transition={{ duration: 0.2 }}
            style={{
              width: "100%",
              padding: "14px",
              border: "none",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              fontWeight: "700",
              fontSize: "15px",
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.2s ease",
              opacity: loading ? 0.7 : 1,
              boxShadow: "0 4px 15px -3px rgba(102, 126, 234, 0.4)"
            }}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="spin" /> Signing in...
              </>
            ) : (
              <>
                Sign In <ArrowRight size={18} />
              </>
            )}
          </motion.button>
        </form>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          style={{
            display: "flex",
            alignItems: "center",
            margin: "28px 0",
            gap: "16px"
          }}
        >
          <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
          <span style={{ color: "#94a3b8", fontSize: "12px", fontWeight: "500" }}>Or continue with</span>
          <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
        </motion.div>

        {/* Social Login Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "28px"
          }}
        >
          <button
            style={{
              flex: 1,
              padding: "12px",
              border: "1.5px solid #e2e8f0",
              borderRadius: "12px",
              background: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "all 0.2s ease",
              fontFamily: "'Inter', sans-serif",
              fontWeight: "500",
              fontSize: "13px",
              color: "#334155"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#667eea";
              e.currentTarget.style.background = "#f8fafc";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#e2e8f0";
              e.currentTarget.style.background = "white";
            }}
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: "18px" }} />
            Google
          </button>
          <button
            style={{
              flex: 1,
              padding: "12px",
              border: "1.5px solid #e2e8f0",
              borderRadius: "12px",
              background: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "all 0.2s ease",
              fontFamily: "'Inter', sans-serif",
              fontWeight: "500",
              fontSize: "13px",
              color: "#334155"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#667eea";
              e.currentTarget.style.background = "#f8fafc";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#e2e8f0";
              e.currentTarget.style.background = "white";
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877f2">
              <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/>
            </svg>
            Facebook
          </button>
        </motion.div>

        {/* Register Link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          style={{
            color: "#64748b",
            margin: 0,
            textAlign: "center",
            fontSize: "14px",
            fontWeight: "500"
          }}
        >
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            style={{
              color: "#667eea",
              cursor: "pointer",
              fontWeight: "700",
              transition: "color 0.2s ease"
            }}
            onMouseEnter={(e) => e.target.style.color = "#764ba2"}
            onMouseLeave={(e) => e.target.style.color = "#667eea"}
          >
            Create account
          </span>
        </motion.p>
      </motion.div>

      {/* Add spinning animation for loader */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
        
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
      `}</style>
    </div>
  );
}