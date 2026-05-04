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
  Diamond
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Login() {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [focused, setFocused] = useState("");

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const x = (clientX / innerWidth - 0.5) * 20;
      const y = (clientY / innerHeight - 0.5) * 20;
      
      setMousePosition({ x: clientX, y: clientY });
      setRotation({ x: -y * 0.02, y: x * 0.02 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        }
      );

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

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at 50% 50%, #0f0c29, #1a1a3e, #0b0b1a)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Poppins', 'Segoe UI', sans-serif",
        padding: "20px",
        position: "relative",
        overflow: "hidden",
        perspective: "1000px"
      }}
    >
      {/* 3D Animated Background Cubes */}
      <div style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        overflow: "hidden"
      }}>
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -window.innerHeight],
              rotateX: [0, 360],
              rotateY: [0, 360],
              rotateZ: [0, 360]
            }}
            transition={{
              duration: 15 + i * 0.5,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.2
            }}
            style={{
              position: "absolute",
              bottom: -100,
              left: `${Math.random() * 100}%`,
              width: "3px",
              height: "3px",
              background: `rgba(0, 255, 255, ${0.1 + Math.random() * 0.3})`,
              boxShadow: "0 0 10px rgba(0, 255, 255, 0.5)",
              borderRadius: "50%"
            }}
          />
        ))}
      </div>

      {/* Animated Gradient Orbs */}
      <motion.div
        animate={{
          x: [0, 100, 0, -100, 0],
          y: [0, -100, 0, 100, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: "absolute",
          top: "10%",
          left: "10%",
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, rgba(0, 255, 255, 0.15), transparent)",
          borderRadius: "50%",
          filter: "blur(60px)",
          pointerEvents: "none"
        }}
      />

      <motion.div
        animate={{
          x: [0, -100, 0, 100, 0],
          y: [0, 100, 0, -100, 0],
          scale: [1, 1.3, 1]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: "absolute",
          bottom: "10%",
          right: "10%",
          width: "350px",
          height: "350px",
          background: "radial-gradient(circle, rgba(255, 0, 255, 0.12), transparent)",
          borderRadius: "50%",
          filter: "blur(60px)",
          pointerEvents: "none"
        }}
      />

      {/* Main 3D Card Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotateX: 45, rotateY: 45 }}
        animate={{ 
          opacity: 1, 
          scale: 1, 
          rotateX: rotation.x, 
          rotateY: rotation.y,
          transition: { duration: 0.8, type: "spring" }
        }}
        style={{
          transformStyle: "preserve-3d",
          width: "100%",
          maxWidth: "500px"
        }}
      >
        {/* Glowing Border Effect */}
        <motion.div
          animate={{
            boxShadow: [
              "0 0 0px rgba(0, 255, 255, 0)",
              "0 0 50px rgba(0, 255, 255, 0.3)",
              "0 0 0px rgba(0, 255, 255, 0)"
            ]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 2
          }}
          style={{
            position: "absolute",
            inset: -2,
            borderRadius: "40px",
            background: "linear-gradient(45deg, #00ffff, #ff00ff, #00ffff)",
            opacity: 0.5,
            filter: "blur(10px)",
            zIndex: -1
          }}
        />

        <div
          style={{
            padding: "50px",
            borderRadius: "32px",
            background: "rgba(10, 10, 20, 0.8)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(0, 255, 255, 0.2)",
            boxShadow: "0 25px 45px rgba(0, 0, 0, 0.3)",
            position: "relative",
            transform: "translateZ(20px)"
          }}
        >
          {/* Animated Corner Decorations */}
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              position: "absolute",
              top: 20,
              left: 20,
              width: 40,
              height: 40,
              borderTop: "2px solid cyan",
              borderLeft: "2px solid cyan"
            }}
          />
          <motion.div
            animate={{
              rotate: -360,
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              position: "absolute",
              bottom: 20,
              right: 20,
              width: 40,
              height: 40,
              borderBottom: "2px solid magenta",
              borderRight: "2px solid magenta"
            }}
          />

          {/* Logo with 3D Flip Animation */}
          <motion.div
            initial={{ rotateY: 0 }}
            animate={{ rotateY: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "30px",
              transformStyle: "preserve-3d"
            }}
          >
            <motion.div
              whileHover={{ scale: 1.1, rotateZ: 360 }}
              transition={{ duration: 0.5 }}
              style={{
                background: "linear-gradient(135deg, #00ffff, #ff00ff)",
                padding: "20px",
                borderRadius: "30px",
                display: "inline-flex",
                boxShadow: "0 0 30px rgba(0, 255, 255, 0.5)"
              }}
            >
              <Sparkles size={45} color="white" />
            </motion.div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              textAlign: "center",
              color: "white",
              fontSize: "38px",
              marginBottom: "10px",
              background: "linear-gradient(135deg, #00ffff, #ff00ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}
          >
            Welcome Back
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              textAlign: "center",
              color: "rgba(255,255,255,0.6)",
              marginBottom: "40px",
              fontSize: "14px"
            }}
          >
            Sign in to continue your journey
          </motion.p>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Email Field with 3D Hover */}
            <motion.div
              initial={{ x: -50, opacity: 0, rotateY: -30 }}
              animate={{ x: 0, opacity: 1, rotateY: 0 }}
              transition={{ delay: 0.4 }}
              style={{ marginBottom: "25px", transformStyle: "preserve-3d" }}
            >
              <label style={{
                display: "block",
                marginBottom: "10px",
                color: "rgba(255,255,255,0.8)",
                fontSize: "13px",
                fontWeight: "600"
              }}>
                EMAIL ADDRESS
              </label>
              <motion.div
                whileHover={{ scale: 1.02 }}
                style={{ position: "relative" }}
              >
                <Mail
                  size={18}
                  style={{
                    position: "absolute",
                    top: "50%",
                    transform: "translateY(-50%)",
                    left: "16px",
                    color: focused === "email" ? "#00ffff" : "rgba(255,255,255,0.3)",
                    transition: "color 0.2s ease",
                    zIndex: 1
                  }}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={handleChange}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused("")}
                  required
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.05)",
                    border: `2px solid ${focused === "email" ? "#00ffff" : "rgba(255,255,255,0.1)"}`,
                    borderRadius: "16px",
                    padding: "16px 20px 16px 48px",
                    color: "white",
                    outline: "none",
                    fontSize: "14px",
                    transition: "all 0.3s ease"
                  }}
                />
                {focused === "email" && (
                  <motion.div
                    layoutId="focusGlow"
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "16px",
                      background: "radial-gradient(circle, rgba(0,255,255,0.1), transparent)",
                      pointerEvents: "none"
                    }}
                  />
                )}
              </motion.div>
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ x: -50, opacity: 0, rotateY: -30 }}
              animate={{ x: 0, opacity: 1, rotateY: 0 }}
              transition={{ delay: 0.5 }}
              style={{ marginBottom: "20px" }}
            >
              <label style={{
                display: "block",
                marginBottom: "10px",
                color: "rgba(255,255,255,0.8)",
                fontSize: "13px",
                fontWeight: "600"
              }}>
                PASSWORD
              </label>
              <motion.div
                whileHover={{ scale: 1.02 }}
                style={{ position: "relative" }}
              >
                <Lock
                  size={18}
                  style={{
                    position: "absolute",
                    top: "50%",
                    transform: "translateY(-50%)",
                    left: "16px",
                    color: focused === "password" ? "#ff00ff" : "rgba(255,255,255,0.3)",
                    transition: "color 0.2s ease"
                  }}
                />
                <input
                  type={showPw ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused("")}
                  required
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.05)",
                    border: `2px solid ${focused === "password" ? "#ff00ff" : "rgba(255,255,255,0.1)"}`,
                    borderRadius: "16px",
                    padding: "16px 48px 16px 48px",
                    color: "white",
                    outline: "none",
                    fontSize: "14px",
                    transition: "all 0.3s ease"
                  }}
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
                    color: "rgba(255,255,255,0.4)",
                    padding: "4px"
                  }}
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </motion.div>
            </motion.div>

            {/* Forgot Password */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              style={{ textAlign: "right", marginBottom: "35px" }}
            >
              <motion.a
                href="#"
                whileHover={{ x: -5, color: "#00ffff" }}
                onClick={(e) => e.preventDefault()}
                style={{
                  color: "#ff00ff",
                  fontSize: "12px",
                  textDecoration: "none",
                  fontWeight: "500",
                  display: "inline-block",
                  cursor: "pointer"
                }}
              >
                Forgot Password?
              </motion.a>
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  style={{
                    color: "#ff6b6b",
                    marginBottom: "20px",
                    fontSize: "12px",
                    padding: "12px",
                    background: "rgba(255, 107, 107, 0.1)",
                    borderRadius: "12px",
                    textAlign: "center",
                    border: "1px solid rgba(255, 107, 107, 0.3)"
                  }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Login Button with 3D Effect */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.05, rotateX: 5, rotateY: 5 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                background: loading 
                  ? "linear-gradient(135deg, #666, #444)"
                  : "linear-gradient(135deg, #00ffff, #ff00ff)"
              }}
              style={{
                width: "100%",
                padding: "16px",
                border: "none",
                borderRadius: "16px",
                color: "white",
                fontWeight: "700",
                fontSize: "16px",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                transition: "all 0.3s ease",
                opacity: loading ? 0.7 : 1,
                boxShadow: "0 10px 20px rgba(0, 255, 255, 0.3)"
              }}
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 size={20} />
                  </motion.div>
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider with Animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            style={{
              display: "flex",
              alignItems: "center",
              margin: "30px 0",
              gap: "15px"
            }}
          >
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, cyan, transparent)" }} />
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>OR</span>
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, magenta, transparent)" }} />
          </motion.div>

          {/* Social Login with 3D Hover */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            style={{
              display: "flex",
              gap: "15px",
              marginBottom: "30px"
            }}
          >
            {["Google", "GitHub", "Twitter"].map((platform, index) => (
              <motion.button
                key={platform}
                whileHover={{ 
                  scale: 1.1, 
                  rotateZ: index === 0 ? -5 : index === 2 ? 5 : 0,
                  boxShadow: "0 5px 15px rgba(0, 255, 255, 0.3)"
                }}
                style={{
                  flex: 1,
                  padding: "12px",
                  border: "1px solid rgba(0, 255, 255, 0.3)",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.05)",
                  cursor: "pointer",
                  color: "white",
                  fontSize: "13px",
                  fontWeight: "500",
                  transition: "all 0.3s ease"
                }}
              >
                {platform}
              </motion.button>
            ))}
          </motion.div>

          {/* Register Link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            style={{
              textAlign: "center",
              color: "rgba(255,255,255,0.6)",
              fontSize: "13px"
            }}
          >
            Don't have an account?{" "}
            <motion.span
              onClick={() => navigate("/register")}
              whileHover={{ 
                scale: 1.1,
                color: "#00ffff",
                textShadow: "0 0 8px cyan"
              }}
              style={{
                color: "#ff00ff",
                cursor: "pointer",
                fontWeight: "700",
                display: "inline-block"
              }}
            >
              Create Account
              <Diamond size={12} style={{ display: "inline", marginLeft: "5px" }} />
            </motion.span>
          </motion.p>
        </div>
      </motion.div>

      {/* Particle System */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        
        input::placeholder {
          color: rgba(255,255,255,0.3);
        }
        
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
      `}</style>
    </div>
  );
}