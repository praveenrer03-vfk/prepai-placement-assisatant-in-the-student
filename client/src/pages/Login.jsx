import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  Zap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight
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

  // Input styling
  const inputStyle = (name) => ({
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: `1px solid ${
      focused === name
        ? "#6366f1"
        : "rgba(255,255,255,0.1)"
    }`,
    borderRadius: "12px",
    padding: "12px 16px 12px 42px",
    color: "#e2e8f0",
    outline: "none",
    fontSize: "14px",
    fontFamily: "'Inter', sans-serif",
    transition: "all 0.2s ease"
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        padding: "20px"
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          width: "100%",
          maxWidth: "440px",
          padding: "40px",
          borderRadius: "24px",
          background: "rgba(15, 23, 42, 0.8)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 25px 45px -12px rgba(0, 0, 0, 0.5)",
          border: "1px solid rgba(255, 255, 255, 0.1)"
        }}
      >
        {/* Logo Section */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
            marginBottom: "32px"
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              padding: "12px",
              borderRadius: "16px",
              display: "inline-flex"
            }}
          >
            <Zap size={32} color="white" />
          </div>
          <h2 style={{ 
            color: "white", 
            margin: 0,
            fontSize: "28px",
            fontWeight: "700",
            letterSpacing: "-0.5px"
          }}>Welcome Back</h2>
          <p style={{
            color: "#94a3b8",
            margin: 0,
            fontSize: "14px"
          }}>Sign in to continue to PrepAI</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          
          {/* Email */}
          <div style={{ position: "relative", marginBottom: "16px" }}>
            <Mail
              size={18}
              style={{
                position: "absolute",
                top: "13px",
                left: "14px",
                color: focused === "email" ? "#6366f1" : "#64748b",
                transition: "color 0.2s ease"
              }}
            />

            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused("")}
              required
              style={inputStyle("email")}
            />
          </div>

          {/* Password */}
          <div style={{ position: "relative", marginBottom: "20px" }}>
            <Lock
              size={18}
              style={{
                position: "absolute",
                top: "13px",
                left: "14px",
                color: focused === "password" ? "#6366f1" : "#64748b",
                transition: "color 0.2s ease"
              }}
            />

            <input
              type={showPw ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused("")}
              required
              style={inputStyle("password")}
            />

            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              style={{
                position: "absolute",
                right: "12px",
                top: "12px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#64748b",
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

          {/* Forgot Password Link */}
          <div style={{
            textAlign: "right",
            marginBottom: "24px"
          }}>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              style={{
                color: "#8b5cf6",
                fontSize: "13px",
                textDecoration: "none",
                fontWeight: "500"
              }}
            >
              Forgot password?
            </a>
          </div>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{
                  color: "#ef4444",
                  marginBottom: "16px",
                  fontSize: "13px",
                  padding: "10px",
                  background: "rgba(239, 68, 68, 0.1)",
                  borderRadius: "8px",
                  textAlign: "center"
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
            style={{
              width: "100%",
              padding: "12px",
              border: "none",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "white",
              fontWeight: "600",
              fontSize: "14px",
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.2s ease",
              opacity: loading ? 0.7 : 1
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

        {/* Register Link */}
        <p
          style={{
            color: "#94a3b8",
            marginTop: "24px",
            textAlign: "center",
            fontSize: "14px"
          }}
        >
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            style={{
              color: "#8b5cf6",
              cursor: "pointer",
              fontWeight: "600",
              transition: "color 0.2s ease"
            }}
            onMouseEnter={(e) => e.target.style.color = "#6366f1"}
            onMouseLeave={(e) => e.target.style.color = "#8b5cf6"}
          >
            Create account
          </span>
        </p>
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
      `}</style>
    </div>
  );
}