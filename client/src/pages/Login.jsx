import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Zap, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Login() {
  const [form, setForm]       = useState({ email: "", password: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]   = useState(false);
  const [focused, setFocused] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await fetch("https://prepai-placement-assisatant-in-the.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        setError(data.message || "Invalid credentials.");
      }
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (name) => ({
    width: "100%", background: "rgba(255,255,255,0.04)",
    border: `1px solid ${focused === name ? "rgba(0,255,163,0.45)" : "rgba(255,255,255,0.08)"}`,
    borderRadius: 14, padding: "13px 16px 13px 44px",
    color: "rgba(255,255,255,0.88)", fontSize: 14, fontWeight: 500,
    outline: "none", fontFamily: "inherit",
    boxShadow: focused === name ? "0 0 0 3px rgba(0,255,163,0.08), inset 0 1px 0 rgba(255,255,255,0.04)" : "inset 0 1px 0 rgba(255,255,255,0.03)",
    transition: "border 0.25s, box-shadow 0.25s",
    caretColor: "#00ffa3",
  });

  return (
    <div style={{
      minHeight: "100vh", width: "100%",
      background: "#060610",
      fontFamily: "'Cabinet Grotesk','DM Sans',sans-serif",
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden", padding: "20px",
    }}>

      {/* ── Mesh bg ── */}
      <div style={{ position:"absolute", inset:0, zIndex:0, pointerEvents:"none" }}>
        <div style={{ position:"absolute", width:700, height:700, borderRadius:"50%", top:"-30%", left:"-20%",
          background:"radial-gradient(circle,rgba(0,255,163,0.06) 0%,transparent 65%)" }} />
        <div style={{ position:"absolute", width:600, height:600, borderRadius:"50%", bottom:"-25%", right:"-15%",
          background:"radial-gradient(circle,rgba(124,58,237,0.09) 0%,transparent 65%)" }} />
        <div style={{ position:"absolute", width:300, height:300, borderRadius:"50%", top:"50%", left:"50%", transform:"translate(-50%,-50%)",
          background:"radial-gradient(circle,rgba(0,201,255,0.04) 0%,transparent 70%)" }} />
        <svg width="100%" height="100%" style={{ position:"absolute", inset:0, opacity:0.025 }}>
          <defs><pattern id="ln" width="1" height="4" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="100%" y2="0" stroke="white" strokeWidth="0.5"/>
          </pattern></defs>
          <rect width="100%" height="100%" fill="url(#ln)" />
        </svg>
        {/* Floating orbs */}
        {[[40,15,"rgba(0,255,163,0.25)",18],[72,78,"rgba(0,201,255,0.2)",12],[88,35,"rgba(167,139,250,0.2)",8]].map(([x,y,c,s],i) => (
          <motion.div key={i}
            style={{ position:"absolute", left:`${x}%`, top:`${y}%`, width:s, height:s, borderRadius:"50%", background:c, filter:"blur(1px)" }}
            animate={{ y:[0,-14,0], opacity:[0.6,1,0.6] }}
            transition={{ duration:3+i, repeat:Infinity, ease:"easeInOut", delay:i*0.8 }}
          />
        ))}
      </div>

      {/* ── Card ── */}
      <motion.div
        initial={{ opacity:0, y:28, scale:0.96 }}
        animate={{ opacity:1, y:0, scale:1 }}
        transition={{ duration:0.65, ease:[0.16,1,0.3,1] }}
        style={{
          position:"relative", zIndex:1, width:"100%", maxWidth:400,
          background:"rgba(255,255,255,0.03)",
          border:"1px solid rgba(255,255,255,0.08)",
          borderRadius:28, overflow:"hidden",
          boxShadow:"0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.07)",
          backdropFilter:"blur(24px)",
        }}
      >
        {/* Top glow line */}
        <div style={{ position:"absolute", top:0, left:"10%", right:"10%", height:1,
          background:"linear-gradient(90deg,transparent,rgba(0,255,163,0.6),transparent)" }} />

        <div style={{ padding:"32px 28px 28px" }}>

          {/* ── Brand ── */}
          <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
            style={{ display:"flex", alignItems:"center", gap:10, marginBottom:32 }}>
            <div style={{
              width:38, height:38, borderRadius:12,
              background:"linear-gradient(135deg,#00ffa3,#00c9ff)",
              display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow:"0 0 20px rgba(0,255,163,0.4)",
            }}>
              <Zap size={18} color="#060610" strokeWidth={2.5} />
            </div>
            <div>
              <p style={{ color:"#fff", fontSize:17, fontWeight:900, letterSpacing:"-0.04em", lineHeight:1 }}>PrepAI</p>
              <p style={{ color:"rgba(255,255,255,0.3)", fontSize:11, fontWeight:600, marginTop:2 }}>AI Interview Platform</p>
            </div>
          </motion.div>

          {/* ── Heading ── */}
          <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.18 }}
            style={{ marginBottom:28 }}>
            <h1 style={{ color:"#fff", fontSize:26, fontWeight:900, letterSpacing:"-0.05em", lineHeight:1.1, marginBottom:6 }}>
              Welcome back
            </h1>
            <p style={{ color:"rgba(255,255,255,0.3)", fontSize:13, fontWeight:500 }}>
              Sign in to continue your prep journey
            </p>
          </motion.div>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:12 }}>

            {/* Email */}
            <motion.div initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.24 }}
              style={{ position:"relative" }}>
              <Mail size={15} style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color: focused==="email" ? "#00ffa3" : "rgba(255,255,255,0.25)", transition:"color 0.2s", pointerEvents:"none" }} />
              <input
                type="email" name="email" placeholder="Email address" required
                onChange={handleChange}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused("")}
                style={inputStyle("email")}
              />
            </motion.div>

            {/* Password */}
            <motion.div initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.3 }}
              style={{ position:"relative" }}>
              <Lock size={15} style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color: focused==="password" ? "#00ffa3" : "rgba(255,255,255,0.25)", transition:"color 0.2s", pointerEvents:"none" }} />
              <input
                type={showPw ? "text" : "password"} name="password" placeholder="Password" required
                onChange={handleChange}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused("")}
                style={{ ...inputStyle("password"), paddingRight:44 }}
              />
              <button type="button" onClick={() => setShowPw(p => !p)}
                style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)",
                  background:"none", border:"none", cursor:"pointer",
                  color:"rgba(255,255,255,0.25)", padding:0, display:"flex" }}>
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </motion.div>

            {/* Forgot */}
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.34 }}
              style={{ display:"flex", justifyContent:"flex-end", marginTop:-4 }}>
              <span style={{ fontSize:12, fontWeight:600, color:"rgba(0,255,163,0.7)", cursor:"pointer" }}
                onMouseEnter={e => e.target.style.color="#00ffa3"}
                onMouseLeave={e => e.target.style.color="rgba(0,255,163,0.7)"}>
                Forgot password?
              </span>
            </motion.div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity:0, y:-6, scale:0.97 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, scale:0.97 }}
                  style={{ borderRadius:12, padding:"11px 14px",
                    background:"rgba(255,75,110,0.08)", border:"1px solid rgba(255,75,110,0.2)",
                    color:"rgba(255,160,160,0.9)", fontSize:12, fontWeight:600 }}>
                  ⚠ {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.38 }}>
              <motion.button
                type="submit" disabled={loading}
                whileHover={!loading ? { scale:1.02 } : {}}
                whileTap={!loading ? { scale:0.97 } : {}}
                style={{
                  width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                  padding:"13px 20px", borderRadius:14,
                  background: loading ? "rgba(255,255,255,0.06)" : "linear-gradient(135deg,#00ffa3,#00c9ff)",
                  color: loading ? "rgba(255,255,255,0.3)" : "#060610",
                  fontSize:14, fontWeight:800, letterSpacing:"-0.01em",
                  border:"none", cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: loading ? "none" : "0 4px 24px rgba(0,255,163,0.35)",
                  transition:"all 0.3s", fontFamily:"inherit", marginTop:4,
                }}
              >
                {loading
                  ? <><Loader2 size={15} style={{ animation:"spin 0.8s linear infinite" }} /> Signing in…</>
                  : <>Sign in <ArrowRight size={15} /></>
                }
              </motion.button>
            </motion.div>
          </form>

          {/* ── Divider ── */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.46 }}
            style={{ display:"flex", alignItems:"center", gap:12, margin:"22px 0" }}>
            <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.06)" }} />
            <span style={{ fontSize:11, fontWeight:600, color:"rgba(255,255,255,0.2)", letterSpacing:"0.08em" }}>OR</span>
            <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.06)" }} />
          </motion.div>

          {/* ── Social logins ── */}
          <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5 }}
            style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {[
              { label:"Google", icon:"G" },
              { label:"GitHub", icon:"⌥" },
            ].map(s => (
              <motion.button key={s.label} type="button"
                whileHover={{ scale:1.03, y:-1 }} whileTap={{ scale:0.97 }}
                style={{
                  display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                  padding:"11px 16px", borderRadius:12,
                  background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)",
                  color:"rgba(255,255,255,0.55)", fontSize:13, fontWeight:700,
                  cursor:"pointer", fontFamily:"inherit",
                  boxShadow:"inset 0 1px 0 rgba(255,255,255,0.04)",
                }}>
                <span style={{ fontSize:14 }}>{s.icon}</span> {s.label}
              </motion.button>
            ))}
          </motion.div>

          {/* ── Sign up link ── */}
          <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.56 }}
            style={{ textAlign:"center", fontSize:12, fontWeight:600, color:"rgba(255,255,255,0.25)", marginTop:22 }}>
            No account?{" "}
            <span onClick={() => navigate("/register")}
              style={{ color:"rgba(0,255,163,0.8)", cursor:"pointer" }}
              onMouseEnter={e => e.target.style.color="#00ffa3"}
              onMouseLeave={e => e.target.style.color="rgba(0,255,163,0.8)"}>
              Create one free →
            </span>
          </motion.p>

        </div>
      </motion.div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800;900&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        input::placeholder { color:rgba(255,255,255,0.2); }
        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>
    </div>
  );
}