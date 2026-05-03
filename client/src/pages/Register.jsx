import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Zap, User, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Password strength ─────────────────────────────────────── */
function getStrength(pw) {
  if (!pw) return { score: 0, label: "", color: "transparent" };
  let s = 0;
  if (pw.length >= 8)           s++;
  if (/[A-Z]/.test(pw))         s++;
  if (/[0-9]/.test(pw))         s++;
  if (/[^A-Za-z0-9]/.test(pw))  s++;
  const map = [
    { label: "Too short",  color: "#ff4b6e" },
    { label: "Weak",       color: "#ff4b6e" },
    { label: "Fair",       color: "#f59e0b" },
    { label: "Good",       color: "#00c9ff" },
    { label: "Strong",     color: "#00ffa3" },
  ];
  return { score: s, ...map[s] };
}

/* ── Perks list ────────────────────────────────────────────── */
const PERKS = [
  "AI-powered mock interviews",
  "Real-time feedback & scoring",
  "Aptitude & reasoning drills",
];

export default function Register() {
  const [form, setForm]       = useState({ name:"", email:"", password:"" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]   = useState(false);
  const [focused, setFocused] = useState("");
  const navigate = useNavigate();

  const strength = getStrength(form.password);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) { navigate("/"); }
      else { setError(data.message || "Registration failed."); }
    } catch {
      setError("Unable to connect. Please try again.");
    } finally { setLoading(false); }
  };

  const inputStyle = (name) => ({
    width:"100%", background:"rgba(255,255,255,0.04)",
    border:`1px solid ${focused===name ? "rgba(0,255,163,0.45)" : "rgba(255,255,255,0.08)"}`,
    borderRadius:14, padding:"13px 16px 13px 44px",
    color:"rgba(255,255,255,0.88)", fontSize:14, fontWeight:500,
    outline:"none", fontFamily:"inherit",
    boxShadow: focused===name ? "0 0 0 3px rgba(0,255,163,0.08), inset 0 1px 0 rgba(255,255,255,0.04)" : "inset 0 1px 0 rgba(255,255,255,0.03)",
    transition:"border 0.25s, box-shadow 0.25s",
    caretColor:"#00ffa3",
  });

  const iconColor = (name) => focused===name ? "#00ffa3" : "rgba(255,255,255,0.25)";

  return (
    <div style={{
      minHeight:"100vh", width:"100%",
      background:"#060610",
      fontFamily:"'Cabinet Grotesk','DM Sans',sans-serif",
      display:"flex", alignItems:"center", justifyContent:"center",
      position:"relative", overflow:"hidden", padding:"20px",
    }}>

      {/* ── Mesh bg ── */}
      <div style={{ position:"absolute", inset:0, zIndex:0, pointerEvents:"none" }}>
        <div style={{ position:"absolute", width:650, height:650, borderRadius:"50%", top:"-25%", right:"-20%",
          background:"radial-gradient(circle,rgba(0,201,255,0.07) 0%,transparent 65%)" }} />
        <div style={{ position:"absolute", width:550, height:550, borderRadius:"50%", bottom:"-20%", left:"-15%",
          background:"radial-gradient(circle,rgba(124,58,237,0.09) 0%,transparent 65%)" }} />
        <div style={{ position:"absolute", width:350, height:350, borderRadius:"50%", top:"40%", left:"50%", transform:"translate(-50%,-50%)",
          background:"radial-gradient(circle,rgba(0,255,163,0.04) 0%,transparent 70%)" }} />
        <svg width="100%" height="100%" style={{ position:"absolute", inset:0, opacity:0.025 }}>
          <defs><pattern id="ln" width="1" height="4" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="100%" y2="0" stroke="white" strokeWidth="0.5"/>
          </pattern></defs>
          <rect width="100%" height="100%" fill="url(#ln)" />
        </svg>
        {/* Floating orbs */}
        {[[20,20,"rgba(0,201,255,0.3)",14],[80,65,"rgba(167,139,250,0.25)",10],[60,15,"rgba(0,255,163,0.2)",8]].map(([x,y,c,s],i) => (
          <motion.div key={i}
            style={{ position:"absolute", left:`${x}%`, top:`${y}%`, width:s, height:s, borderRadius:"50%", background:c, filter:"blur(1px)" }}
            animate={{ y:[0,-16,0], opacity:[0.5,1,0.5] }}
            transition={{ duration:3.5+i*0.7, repeat:Infinity, ease:"easeInOut", delay:i*0.9 }}
          />
        ))}
      </div>

      {/* ── Card ── */}
      <motion.div
        initial={{ opacity:0, y:30, scale:0.95 }}
        animate={{ opacity:1, y:0, scale:1 }}
        transition={{ duration:0.65, ease:[0.16,1,0.3,1] }}
        style={{
          position:"relative", zIndex:1, width:"100%", maxWidth:420,
          background:"rgba(255,255,255,0.03)",
          border:"1px solid rgba(255,255,255,0.08)",
          borderRadius:28, overflow:"hidden",
          boxShadow:"0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.07)",
          backdropFilter:"blur(24px)",
        }}
      >
        {/* Top glow line — cyan tint to differentiate from Login */}
        <div style={{ position:"absolute", top:0, left:"10%", right:"10%", height:1,
          background:"linear-gradient(90deg,transparent,rgba(0,201,255,0.7),transparent)" }} />

        <div style={{ padding:"32px 28px 28px" }}>

          {/* ── Brand ── */}
          <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
            style={{ display:"flex", alignItems:"center", gap:10, marginBottom:28 }}>
            <div style={{
              width:38, height:38, borderRadius:12,
              background:"linear-gradient(135deg,#00c9ff,#a78bfa)",
              display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow:"0 0 20px rgba(0,201,255,0.4)",
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
            style={{ marginBottom:24 }}>
            <h1 style={{ color:"#fff", fontSize:26, fontWeight:900, letterSpacing:"-0.05em", lineHeight:1.1, marginBottom:6 }}>
              Create your account
            </h1>
            <p style={{ color:"rgba(255,255,255,0.3)", fontSize:13, fontWeight:500 }}>
              Join thousands prepping smarter with AI
            </p>
          </motion.div>

          {/* ── Perks ── */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.24 }}
            style={{ display:"flex", flexDirection:"column", gap:7, marginBottom:24,
              padding:"14px 16px", borderRadius:14,
              background:"rgba(0,201,255,0.05)", border:"1px solid rgba(0,201,255,0.12)" }}>
            {PERKS.map((p, i) => (
              <motion.div key={i} initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.28+i*0.07 }}
                style={{ display:"flex", alignItems:"center", gap:8 }}>
                <CheckCircle2 size={13} style={{ color:"#00c9ff", flexShrink:0 }} />
                <span style={{ color:"rgba(255,255,255,0.55)", fontSize:12, fontWeight:600 }}>{p}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:11 }}>

            {/* Name */}
            <motion.div initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.3 }}
              style={{ position:"relative" }}>
              <User size={15} style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color:iconColor("name"), transition:"color 0.2s", pointerEvents:"none" }} />
              <input type="text" name="name" placeholder="Full name" required
                onChange={handleChange}
                onFocus={() => setFocused("name")} onBlur={() => setFocused("")}
                style={inputStyle("name")} />
            </motion.div>

            {/* Email */}
            <motion.div initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.36 }}
              style={{ position:"relative" }}>
              <Mail size={15} style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color:iconColor("email"), transition:"color 0.2s", pointerEvents:"none" }} />
              <input type="email" name="email" placeholder="Email address" required
                onChange={handleChange}
                onFocus={() => setFocused("email")} onBlur={() => setFocused("")}
                style={inputStyle("email")} />
            </motion.div>

            {/* Password */}
            <motion.div initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.42 }}>
              <div style={{ position:"relative" }}>
                <Lock size={15} style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color:iconColor("password"), transition:"color 0.2s", pointerEvents:"none" }} />
                <input type={showPw ? "text" : "password"} name="password" placeholder="Create password" required
                  onChange={handleChange}
                  onFocus={() => setFocused("password")} onBlur={() => setFocused("")}
                  style={{ ...inputStyle("password"), paddingRight:44 }} />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)",
                    background:"none", border:"none", cursor:"pointer",
                    color:"rgba(255,255,255,0.25)", padding:0, display:"flex" }}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {/* Strength meter */}
              <AnimatePresence>
                {form.password.length > 0 && (
                  <motion.div initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                    style={{ marginTop:8, display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ flex:1, display:"flex", gap:4 }}>
                      {[1,2,3,4].map(n => (
                        <div key={n} style={{ flex:1, height:3, borderRadius:99, transition:"background 0.3s",
                          background: n <= strength.score ? strength.color : "rgba(255,255,255,0.07)",
                          boxShadow: n <= strength.score ? `0 0 6px ${strength.color}55` : "none",
                        }} />
                      ))}
                    </div>
                    <span style={{ fontSize:10, fontWeight:700, color:strength.color, flexShrink:0, letterSpacing:"0.04em" }}>
                      {strength.label}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
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
            <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.48 }}>
              <motion.button type="submit" disabled={loading}
                whileHover={!loading ? { scale:1.02 } : {}}
                whileTap={!loading ? { scale:0.97 } : {}}
                style={{
                  width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                  padding:"13px 20px", borderRadius:14, marginTop:4,
                  background: loading ? "rgba(255,255,255,0.06)" : "linear-gradient(135deg,#00c9ff,#a78bfa)",
                  color: loading ? "rgba(255,255,255,0.3)" : "#060610",
                  fontSize:14, fontWeight:800, letterSpacing:"-0.01em",
                  border:"none", cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: loading ? "none" : "0 4px 24px rgba(0,201,255,0.3)",
                  transition:"all 0.3s", fontFamily:"inherit",
                }}>
                {loading
                  ? <><Loader2 size={15} style={{ animation:"spin 0.8s linear infinite" }} /> Creating account…</>
                  : <>Create free account <ArrowRight size={15} /></>
                }
              </motion.button>
            </motion.div>
          </form>

          {/* ── Sign in link ── */}
          <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.56 }}
            style={{ textAlign:"center", fontSize:12, fontWeight:600, color:"rgba(255,255,255,0.25)", marginTop:20 }}>
            Already have an account?{" "}
            <span onClick={() => navigate("/")}
              style={{ color:"rgba(0,201,255,0.8)", cursor:"pointer", transition:"color 0.2s" }}
              onMouseEnter={e => e.target.style.color="#00c9ff"}
              onMouseLeave={e => e.target.style.color="rgba(0,201,255,0.8)"}>
              Sign in →
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