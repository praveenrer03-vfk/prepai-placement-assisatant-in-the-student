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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

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

        // Save user data
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        // Redirect to dashboard
        navigate("/dashboard");
      } else {
        setError(data.error || "Invalid login credentials");
      }
    } catch (err) {
      console.log(err);
      setError("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (name) => ({
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: `1px solid ${
      focused === name
        ? "rgba(0,255,163,0.45)"
        : "rgba(255,255,255,0.08)"
    }`,
    borderRadius: "14px",
    padding: "13px 16px 13px 44px",
    color: "white",
    outline: "none"
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#060610",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          width: "400px",
          padding: "30px",
          borderRadius: "20px",
          background: "rgba(255,255,255,0.05)"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "20px"
          }}
        >
          <Zap color="#00ffa3" />
          <h2 style={{ color: "white" }}>PrepAI Login</h2>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={{ position: "relative", marginBottom: "15px" }}>
            <Mail
              size={16}
              style={{
                position: "absolute",
                top: "14px",
                left: "12px",
                color: "#00ffa3"
              }}
            />

            <input
              type="email"
              name="email"
              placeholder="Enter email"
              required
              value={form.email}
              onChange={handleChange}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused("")}
              style={inputStyle("email")}
            />
          </div>

          {/* Password */}
          <div style={{ position: "relative", marginBottom: "15px" }}>
            <Lock
              size={16}
              style={{
                position: "absolute",
                top: "14px",
                left: "12px",
                color: "#00ffa3"
              }}
            />

            <input
              type={showPw ? "text" : "password"}
              name="password"
              placeholder="Enter password"
              required
              value={form.password}
              onChange={handleChange}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused("")}
              style={inputStyle("password")}
            />

            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              style={{
                position: "absolute",
                right: "10px",
                top: "12px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "white"
              }}
            >
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  color: "red",
                  marginBottom: "15px"
                }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              border: "none",
              borderRadius: "12px",
              background: "#00ffa3",
              color: "black",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            {loading ? (
              <>
                <Loader2 size={16} /> Loading...
              </>
            ) : (
              <>
                Login <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <p
          style={{
            color: "white",
            marginTop: "20px",
            textAlign: "center"
          }}
        >
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            style={{
              color: "#00ffa3",
              cursor: "pointer"
            }}
          >
            Register
          </span>
        </p>
      </motion.div>
    </div>
  );
}