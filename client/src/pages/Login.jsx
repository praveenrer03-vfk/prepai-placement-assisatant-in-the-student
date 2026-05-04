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
    background: "rgba(255,255,255,0.06)",
    border: `1px solid ${
      focused === name
        ? "rgba(0,255,163,0.5)"
        : "rgba(255,255,255,0.1)"
    }`,
    borderRadius: "14px",
    padding: "14px 16px 14px 45px",
    color: "white",
    outline: "none",
    fontSize: "14px"
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#060610",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "sans-serif"
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          width: "400px",
          padding: "30px",
          borderRadius: "20px",
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(15px)",
          boxShadow: "0px 10px 30px rgba(0,0,0,0.4)"
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "25px"
          }}
        >
          <Zap color="#00ffa3" />
          <h2 style={{ color: "white" }}>PrepAI Login</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          
          {/* Email */}
          <div style={{ position: "relative", marginBottom: "15px" }}>
            <Mail
              size={16}
              style={{
                position: "absolute",
                top: "15px",
                left: "14px",
                color: "#00ffa3"
              }}
            />

            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={form.email}
              onChange={handleChange}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused("")}
              required
              style={inputStyle("email")}
            />
          </div>

          {/* Password */}
          <div style={{ position: "relative", marginBottom: "15px" }}>
            <Lock
              size={16}
              style={{
                position: "absolute",
                top: "15px",
                left: "14px",
                color: "#00ffa3"
              }}
            />

            <input
              type={showPw ? "text" : "password"}
              name="password"
              placeholder="Enter password"
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
                top: "13px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "white"
              }}
            >
              {showPw ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  color: "#ff4d4d",
                  marginBottom: "15px",
                  fontSize: "14px"
                }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              border: "none",
              borderRadius: "14px",
              background:
                "linear-gradient(90deg,#00ffa3,#00c9ff)",
              color: "#000",
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px"
            }}
          >
            {loading ? (
              <>
                <Loader2 size={18} /> Loading...
              </>
            ) : (
              <>
                Login <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Register */}
        <p
          style={{
            color: "white",
            marginTop: "20px",
            textAlign: "center",
            fontSize: "14px"
          }}
        >
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            style={{
              color: "#00ffa3",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Register
          </span>
        </p>
      </motion.div>
    </div>
  );
}