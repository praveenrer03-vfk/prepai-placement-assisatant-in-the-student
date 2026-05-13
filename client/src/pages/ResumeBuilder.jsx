import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Edit2,
  X,
  Check,
  Target,
  Trophy,
  FileText,
  Sparkle,
  Lock,
  Crown,
  CreditCard,
  Briefcase,
  GraduationCap,
  Code2,
  User,
  Plus,
  BarChart3,
  Palette,
  Eye,
  Layers,
  Zap,
  Shield,
  Star,
  Gift,
  Heart,
  Feather,
  Gem
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Premium Template Styles
const TEMPLATES = {
  aurora: {
    name: "Aurora",
    preview: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
    style: {
      headerBg: "linear-gradient(135deg, #667eea, #764ba2)",
      accent: "#667eea",
      font: "'Inter', sans-serif",
      layout: "rounded",
      glow: true
    }
  },
  darkKnight: {
    name: "Dark Knight",
    preview: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    style: {
      headerBg: "#0f3460",
      accent: "#e94560",
      font: "'Poppins', sans-serif",
      layout: "sharp",
      darkMode: true
    }
  },
  sage: {
    name: "Sage",
    preview: "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
    style: {
      headerBg: "#134e5e",
      accent: "#71b280",
      font: "'Inter', sans-serif",
      layout: "rounded"
    }
  },
  roseGold: {
    name: "Rose Gold",
    preview: "linear-gradient(135deg, #b9935a 0%, #d4af7a 50%, #e8c99b 100%)",
    style: {
      headerBg: "linear-gradient(135deg, #b9935a, #d4af7a)",
      accent: "#b9935a",
      font: "'Poppins', sans-serif",
      layout: "rounded",
      premium: true
    }
  },
  ocean: {
    name: "Ocean",
    preview: "linear-gradient(135deg, #00b4db 0%, #0083b0 100%)",
    style: {
      headerBg: "linear-gradient(135deg, #00b4db, #0083b0)",
      accent: "#0083b0",
      font: "'Roboto', sans-serif",
      layout: "sharp"
    }
  },
  sunset: {
    name: "Sunset",
    preview: "linear-gradient(135deg, #f12711 0%, #f5af19 100%)",
    style: {
      headerBg: "linear-gradient(135deg, #f12711, #f5af19)",
      accent: "#f12711",
      font: "'Inter', sans-serif",
      layout: "rounded"
    }
  }
};

// ATS Analyzer with enhanced scoring
const analyzeATS = (resumeData) => {
  const scores = {
    overall: 0,
    sections: {},
    keywords: [],
    suggestions: [],
    industryScore: 0,
    formattingScore: 0
  };

  const requiredSections = ['personal', 'experience', 'education', 'skills'];
  const presentSections = requiredSections.filter(section => {
    if (section === 'personal') return resumeData.personal?.name;
    return resumeData[section]?.length > 0;
  });
  scores.sections.completeness = (presentSections.length / requiredSections.length) * 100;

  // Enhanced suggestions
  if (!resumeData.personal?.name) scores.suggestions.push("✨ Add your full name - this is crucial for ATS")
  if (!resumeData.personal?.email) scores.suggestions.push("📧 Add email address for recruiters to contact you")
  if (!resumeData.personal?.phone) scores.suggestions.push("📱 Include phone number - many recruiters prefer calls")
  if (!resumeData.experience?.length) scores.suggestions.push("💼 Add work experience to showcase your expertise")
  if (!resumeData.skills?.length) scores.suggestions.push("⚡ Add technical skills - this is heavily weighted by ATS")
  if (!resumeData.summary) scores.suggestions.push("📝 Add a professional summary to grab attention")
  if (resumeData.summary && resumeData.summary.length < 100) scores.suggestions.push("✍️ Expand your summary - aim for 150-200 characters")
  if (resumeData.experience.length > 0 && !resumeData.experience.some(exp => exp.description?.length > 50)) 
    scores.suggestions.push("📊 Add more details to your experience descriptions using bullet points")

  const commonKeywords = [
    "JavaScript", "React", "Python", "Java", "Node.js", "MongoDB", "PostgreSQL",
    "Leadership", "Team Management", "Agile", "Scrum", "Communication", "AWS",
    "Problem Solving", "Project Management", "HTML", "CSS", "API", "REST",
    "Git", "CI/CD", "Docker", "Kubernetes", "Machine Learning", "AI"
  ];
  
  const allText = JSON.stringify(resumeData).toLowerCase();
  scores.keywords = commonKeywords.filter(keyword => 
    allText.includes(keyword.toLowerCase())
  );
  
  scores.sections.keywordMatch = (scores.keywords.length / commonKeywords.length) * 100;
  
  // Formatting score based on content completeness
  let formattingPoints = 0;
  if (resumeData.personal?.name) formattingPoints += 15;
  if (resumeData.personal?.email) formattingPoints += 10;
  if (resumeData.personal?.phone) formattingPoints += 10;
  if (resumeData.summary) formattingPoints += 15;
  if (resumeData.experience.length > 0) formattingPoints += 20;
  if (resumeData.education.length > 0) formattingPoints += 15;
  if (resumeData.skills.length > 0) formattingPoints += 15;
  scores.formattingScore = formattingPoints;
  
  scores.overall = Math.min(100, Math.round(
    (scores.sections.completeness * 0.4) + 
    (scores.sections.keywordMatch * 0.3) + 
    (scores.formattingScore * 0.3)
  ));
  
  scores.level = scores.overall >= 85 ? "Excellent" : scores.overall >= 70 ? "Good" : scores.overall >= 50 ? "Needs Improvement" : "Poor";
  scores.color = scores.overall >= 85 ? "#10b981" : scores.overall >= 70 ? "#3b82f6" : scores.overall >= 50 ? "#f59e0b" : "#ef4444";
  scores.gradient = scores.overall >= 85 ? "linear-gradient(135deg, #10b981, #34d399)" : 
                     scores.overall >= 70 ? "linear-gradient(135deg, #3b82f6, #60a5fa)" :
                     scores.overall >= 50 ? "linear-gradient(135deg, #f59e0b, #fbbf24)" : 
                     "linear-gradient(135deg, #ef4444, #f87171)";

  return scores;
};

export default function ResumeBuilder() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("build");
  const [selectedTemplate, setSelectedTemplate] = useState("aurora");
  const [showPreview, setShowPreview] = useState(true);
  const [atsScore, setAtsScore] = useState(null);
  const [isPro, setIsPro] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");
  
  const previewRef = useRef(null);
  
  const [resumeData, setResumeData] = useState({
    personal: { name: "", title: "", email: "", phone: "", location: "", linkedin: "", portfolio: "" },
    summary: "",
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    projects: [],
    languages: []
  });

  const [newExperience, setNewExperience] = useState({ company: "", role: "", duration: "", description: "" });
  const [newEducation, setNewEducation] = useState({ institution: "", degree: "", year: "", cgpa: "" });
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    const subscriptionPlan = localStorage.getItem("subscriptionPlan");
    const subscriptionStatus = localStorage.getItem("subscriptionStatus");
    if (subscriptionStatus === "active" && subscriptionPlan !== "free") setIsPro(true);
  }, []);

  useEffect(() => {
    const savedData = localStorage.getItem("resumeData");
    if (savedData) try { setResumeData(JSON.parse(savedData)); } catch (e) {}
  }, []);

  useEffect(() => {
    if (resumeData.personal.name || resumeData.experience.length > 0) 
      localStorage.setItem("resumeData", JSON.stringify(resumeData));
  }, [resumeData]);

  useEffect(() => {
    const score = analyzeATS(resumeData);
    setAtsScore(score);
  }, [resumeData]);

  // AI Suggestion Generator
  const generateAISuggestion = () => {
    const suggestions = [
      "💡 Add quantifiable achievements to your experience (e.g., 'Increased sales by 30%')",
      "🎯 Include specific metrics and numbers - ATS loves data!",
      "📈 Use action verbs like 'Led', 'Developed', 'Implemented' to start bullet points",
      "🔑 Match keywords from job descriptions you're targeting",
      "⭐ Add a portfolio or GitHub link to showcase your work",
      "📝 Keep your resume to 1-2 pages for best results",
      "🎨 Use consistent formatting throughout your resume",
      "🏆 Include relevant certifications and continuous learning",
      "🌐 Add language skills if applicable to your role",
      "🤝 Highlight soft skills like communication and teamwork"
    ];
    setAiSuggestion(suggestions[Math.floor(Math.random() * suggestions.length)]);
    setShowAIAssistant(true);
    setTimeout(() => setShowAIAssistant(false), 5000);
  };

  const updatePersonalInfo = (field, value) => {
    setResumeData(prev => ({ ...prev, personal: { ...prev.personal, [field]: value } }));
  };

  const addExperience = () => {
    if (newExperience.company && newExperience.role) {
      setResumeData(prev => ({ ...prev, experience: [...prev.experience, { ...newExperience, id: Date.now() }] }));
      setNewExperience({ company: "", role: "", duration: "", description: "" });
    }
  };

  const removeExperience = (index) => {
    setResumeData(prev => ({ ...prev, experience: prev.experience.filter((_, i) => i !== index) }));
  };

  const addEducation = () => {
    if (newEducation.institution && newEducation.degree) {
      setResumeData(prev => ({ ...prev, education: [...prev.education, { ...newEducation, id: Date.now() }] }));
      setNewEducation({ institution: "", degree: "", year: "", cgpa: "" });
    }
  };

  const removeEducation = (index) => {
    setResumeData(prev => ({ ...prev, education: prev.education.filter((_, i) => i !== index) }));
  };

  const addSkill = () => {
    if (newSkill && !resumeData.skills.includes(newSkill)) {
      setResumeData(prev => ({ ...prev, skills: [...prev.skills, newSkill] }));
      setNewSkill("");
    }
  };

  const removeSkill = (index) => {
    setResumeData(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== index) }));
  };

  const downloadJSON = () => {
    const resumeJSON = JSON.stringify(resumeData, null, 2);
    const blob = new Blob([resumeJSON], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `resume_${resumeData.personal.name || "my_resume"}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const exportPDF = () => {
    if (!isPro) { setShowProModal(true); return; }
    alert("PDF Export ready! Professional template will be downloaded.");
  };

  const ProUpgradeModal = () => (
    <AnimatePresence>
      {showProModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.9)", backdropFilter: "blur(20px)", zIndex: 1000,
            display: "flex", alignItems: "center", justifyContent: "center", padding: "20px"
          }}
          onClick={() => setShowProModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            style={{
              background: "linear-gradient(135deg, #1a1a2e, #16213e)",
              borderRadius: 48,
              maxWidth: 550,
              width: "100%",
              overflow: "hidden",
              position: "relative",
              border: "1px solid rgba(255,255,255,0.1)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 4,
              background: "linear-gradient(90deg, #667eea, #764ba2, #f093fb, #667eea)",
              backgroundSize: "200%", animation: "gradient 3s linear infinite"
            }} />
            
            <div style={{
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              padding: "40px", textAlign: "center", color: "#fff", position: "relative"
            }}>
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", delay: 0.2 }}
                style={{
                  width: 100, height: 100, background: "rgba(255,255,255,0.2)",
                  borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 20px", border: "2px solid rgba(255,255,255,0.3)"
                }}
              >
                <Gem size={50} color="#fff" />
              </motion.div>
              <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Unlock Premium</h2>
              <p style={{ fontSize: 15, opacity: 0.95 }}>Get hired faster with professional tools</p>
            </div>
            
            <div style={{ padding: "32px" }}>
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 16 }}>
                  ✨ Premium Benefits:
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {[
                    { icon: "📄", text: "PDF Export" },
                    { icon: "🎨", text: "6+ Premium Templates" },
                    { icon: "🤖", text: "AI Content Assistant" },
                    { icon: "📊", text: "Advanced ATS Scoring" },
                    { icon: "🔄", text: "Unlimited Downloads" },
                    { icon: "⭐", text: "Priority Support" }
                  ].map((benefit, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: "rgba(255,255,255,0.05)", borderRadius: 12 }}
                    >
                      <span style={{ fontSize: 18 }}>{benefit.icon}</span>
                      <span style={{ fontSize: 13, color: "#cbd5e1" }}>{benefit.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                style={{
                  marginBottom: 24, padding: "24px", background: "rgba(255,255,255,0.05)",
                  borderRadius: 24, textAlign: "center", border: "1px solid rgba(255,255,255,0.1)"
                }}
              >
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 4 }}>
                  <span style={{ fontSize: 52, fontWeight: 800, color: "#f093fb" }}>$9</span>
                  <span style={{ fontSize: 16, color: "#94a3b8" }}>/month</span>
                </div>
                <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 8 }}>Cancel anytime • 14-day guarantee</p>
                <div style={{ display: "inline-block", marginTop: 12, padding: "4px 12px", background: "rgba(240,147,251,0.2)", borderRadius: 20, fontSize: 11, color: "#f093fb", fontWeight: 600 }}>
                  🎉 Save 30% on yearly
                </div>
              </motion.div>
              
              <div style={{ display: "flex", gap: 12 }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowProModal(false)}
                  style={{
                    flex: 1, padding: "14px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: 16, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer"
                  }}
                >
                  Maybe Later
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setShowProModal(false); navigate("/payment"); }}
                  style={{
                    flex: 1, padding: "14px", background: "linear-gradient(135deg, #667eea, #764ba2)",
                    border: "none", borderRadius: 16, color: "#fff", fontSize: 14, fontWeight: 700,
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8
                  }}
                >
                  <CreditCard size={16} /> Upgrade Now
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const SubscriptionBadge = () => (
    <motion.div whileHover={{ scale: 1.02 }} style={{
      display: "flex", alignItems: "center", gap: 8, padding: "8px 16px",
      background: !isPro ? "rgba(0,0,0,0.05)" : "linear-gradient(135deg, #667eea, #764ba2)",
      borderRadius: 40, fontSize: 12, fontWeight: 600, color: !isPro ? "#64748b" : "#fff",
      cursor: "pointer", backdropFilter: "blur(10px)"
    }} onClick={() => !isPro && setShowProModal(true)}>
      {!isPro ? <><Lock size={12} /> Free Plan</> : <><Crown size={12} /> Pro Active</>}
    </motion.div>
  );

  const ResumePreview = () => {
    const template = TEMPLATES[selectedTemplate];
    
    return (
      <div ref={previewRef} style={{
        background: template.style.darkMode ? "#0f172a" : "#ffffff",
        padding: "40px", color: template.style.darkMode ? "#f1f5f9" : "#1e293b",
        fontFamily: template.style.font, maxWidth: "800px", margin: "0 auto",
        borderRadius: template.style.layout === "rounded" ? "24px" : "0px",
        boxShadow: template.style.glow ? "0 25px 50px -12px rgba(0,0,0,0.25)" : "0 20px 40px rgba(0,0,0,0.1)",
        position: "relative", overflow: "hidden"
      }}>
        {template.style.glow && (
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: template.style.accent }} />
        )}
        
        <div style={{
          background: template.style.headerBg,
          margin: "-40px -40px 30px -40px", padding: "40px", color: "#fff",
          borderRadius: template.style.layout === "rounded" ? "24px 24px 0 0" : "0"
        }}>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
            style={{ fontSize: "36px", marginBottom: "10px", fontWeight: 800 }}>
            {resumeData.personal.name || "Your Name"}
          </motion.h1>
          <p style={{ fontSize: "18px", opacity: 0.95 }}>{resumeData.personal.title || "Professional Title"}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "20px", fontSize: "13px", opacity: 0.85 }}>
            {resumeData.personal.email && <span>📧 {resumeData.personal.email}</span>}
            {resumeData.personal.phone && <span>📱 {resumeData.personal.phone}</span>}
            {resumeData.personal.location && <span>📍 {resumeData.personal.location}</span>}
          </div>
        </div>
        
        {resumeData.summary && (
          <div style={{ marginBottom: "25px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "12px", color: template.style.accent, borderLeft: `3px solid ${template.style.accent}`, paddingLeft: "12px" }}>
              Professional Summary
            </h3>
            <p style={{ fontSize: "14px", lineHeight: 1.6, color: template.style.darkMode ? "#cbd5e1" : "#475569" }}>{resumeData.summary}</p>
          </div>
        )}
        
        {resumeData.experience.length > 0 && (
          <div style={{ marginBottom: "25px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "15px", color: template.style.accent, borderLeft: `3px solid ${template.style.accent}`, paddingLeft: "12px" }}>
              Work Experience
            </h3>
            {resumeData.experience.map((exp, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}
                style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
                  <strong style={{ fontSize: "16px", color: template.style.darkMode ? "#fff" : "#0f172a" }}>{exp.role}</strong>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>{exp.duration}</span>
                </div>
                <p style={{ fontSize: "13px", color: template.style.darkMode ? "#94a3b8" : "#475569", marginBottom: "8px", fontWeight: 500 }}>{exp.company}</p>
                <p style={{ fontSize: "13px", lineHeight: 1.5, color: template.style.darkMode ? "#94a3b8" : "#64748b" }}>{exp.description}</p>
              </motion.div>
            ))}
          </div>
        )}
        
        {resumeData.skills.length > 0 && (
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "15px", color: template.style.accent, borderLeft: `3px solid ${template.style.accent}`, paddingLeft: "12px" }}>
              Skills
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {resumeData.skills.map((skill, idx) => (
                <motion.span key={idx} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }}
                  style={{ background: `${template.style.accent}15`, color: template.style.accent, padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: 500 }}>
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const BuildForm = () => (
    <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
      <div style={{ flex: 1, maxHeight: "calc(100vh - 200px)", overflowY: "auto", paddingRight: 16 }}>
        {/* Personal Information */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: "#fff", borderRadius: 24, padding: 28, marginBottom: 24, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ width: 40, height: 40, background: "linear-gradient(135deg, #667eea, #764ba2)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <User size={20} color="#fff" />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a" }}>Personal Information</h3>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
            <input type="text" placeholder="Full Name" value={resumeData.personal.name} onChange={(e) => updatePersonalInfo("name", e.target.value)}
              style={{ padding: "14px 18px", border: "1px solid #e2e8f0", borderRadius: 16, fontSize: 14, transition: "all 0.2s" }} />
            <input type="text" placeholder="Professional Title" value={resumeData.personal.title} onChange={(e) => updatePersonalInfo("title", e.target.value)}
              style={{ padding: "14px 18px", border: "1px solid #e2e8f0", borderRadius: 16, fontSize: 14 }} />
            <input type="email" placeholder="Email" value={resumeData.personal.email} onChange={(e) => updatePersonalInfo("email", e.target.value)}
              style={{ padding: "14px 18px", border: "1px solid #e2e8f0", borderRadius: 16, fontSize: 14 }} />
            <input type="tel" placeholder="Phone" value={resumeData.personal.phone} onChange={(e) => updatePersonalInfo("phone", e.target.value)}
              style={{ padding: "14px 18px", border: "1px solid #e2e8f0", borderRadius: 16, fontSize: 14 }} />
          </div>
        </motion.div>

        {/* Work Experience */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ background: "#fff", borderRadius: 24, padding: 28, marginBottom: 24, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ width: 40, height: 40, background: "linear-gradient(135deg, #667eea, #764ba2)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Briefcase size={20} color="#fff" />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a" }}>Work Experience</h3>
          </div>
          
          {resumeData.experience.map((exp, idx) => (
            <div key={idx} style={{ background: "#f8fafc", padding: 20, borderRadius: 16, marginBottom: 12, position: "relative" }}>
              <button onClick={() => removeExperience(idx)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer" }}>
                <X size={18} color="#ef4444" />
              </button>
              <p style={{ fontWeight: 700, marginBottom: 4, fontSize: 16 }}>{exp.role} at {exp.company}</p>
              <p style={{ fontSize: 13, color: "#64748b", marginBottom: 8 }}>{exp.duration}</p>
              <p style={{ fontSize: 14, color: "#475569" }}>{exp.description}</p>
            </div>
          ))}
          
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input type="text" placeholder="Company Name" value={newExperience.company} onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
              style={{ padding: "14px 18px", border: "1px solid #e2e8f0", borderRadius: 16, fontSize: 14 }} />
            <input type="text" placeholder="Role / Position" value={newExperience.role} onChange={(e) => setNewExperience({ ...newExperience, role: e.target.value })}
              style={{ padding: "14px 18px", border: "1px solid #e2e8f0", borderRadius: 16, fontSize: 14 }} />
            <input type="text" placeholder="Duration (e.g., Jan 2020 - Present)" value={newExperience.duration} onChange={(e) => setNewExperience({ ...newExperience, duration: e.target.value })}
              style={{ padding: "14px 18px", border: "1px solid #e2e8f0", borderRadius: 16, fontSize: 14 }} />
            <textarea rows={3} placeholder="Description of responsibilities and achievements..." value={newExperience.description} onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
              style={{ padding: "14px 18px", border: "1px solid #e2e8f0", borderRadius: 16, fontSize: 14, resize: "vertical" }} />
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={addExperience} style={{ padding: "14px", background: "linear-gradient(135deg, #667eea, #764ba2)", color: "#fff", border: "none", borderRadius: 16, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <Plus size={18} /> Add Experience
            </motion.button>
          </div>
        </motion.div>

        {/* Skills */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ background: "#fff", borderRadius: 24, padding: 28, marginBottom: 24, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ width: 40, height: 40, background: "linear-gradient(135deg, #667eea, #764ba2)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Code2 size={20} color="#fff" />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a" }}>Skills</h3>
          </div>
          
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
            {resumeData.skills.map((skill, idx) => (
              <span key={idx} style={{ background: "linear-gradient(135deg, #667eea15, #764ba215)", color: "#667eea", padding: "8px 16px", borderRadius: 30, fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 8 }}>
                {skill}
                <button onClick={() => removeSkill(idx)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  <X size={14} color="#667eea" />
                </button>
              </span>
            ))}
          </div>
          
          <div style={{ display: "flex", gap: 12 }}>
            <input type="text" placeholder="Add a skill (e.g., React, Python)" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyPress={(e) => e.key === "Enter" && addSkill()}
              style={{ flex: 1, padding: "14px 18px", border: "1px solid #e2e8f0", borderRadius: 16, fontSize: 14 }} />
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={addSkill} style={{ padding: "14px 28px", background: "linear-gradient(135deg, #667eea, #764ba2)", color: "#fff", border: "none", borderRadius: 16, fontWeight: 600, cursor: "pointer" }}>
              Add
            </motion.button>
          </div>
        </motion.div>
      </div>

      {showPreview && (
        <div style={{ flex: 1, position: "sticky", top: 24, maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700 }}>Live Preview</h3>
            <button onClick={() => setShowPreview(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
              <X size={20} />
            </button>
          </div>
          <ResumePreview />
        </div>
      )}
    </div>
  );

  const TemplatesSection = () => (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, marginBottom: 32 }}>
        {Object.entries(TEMPLATES).map(([key, template]) => (
          <motion.div
            key={key}
            whileHover={{ y: -8, scale: 1.02 }}
            onClick={() => setSelectedTemplate(key)}
            style={{
              cursor: "pointer", borderRadius: 24, overflow: "hidden",
              border: selectedTemplate === key ? "2px solid #667eea" : "1px solid #e2e8f0",
              transition: "all 0.3s", background: "#fff"
            }}
          >
            <div style={{ height: 220, background: template.preview, position: "relative" }}>
              <div style={{ position: "absolute", bottom: 16, right: 16, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(10px)", padding: "6px 14px", borderRadius: 20, color: "#fff", fontSize: 13, fontWeight: 600 }}>
                {template.name}
              </div>
              {template.style.premium && (
                <div style={{ position: "absolute", top: 16, right: 16, background: "linear-gradient(135deg, #f093fb, #f5576c)", padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, color: "#fff" }}>
                  PREMIUM
                </div>
              )}
            </div>
            <div style={{ padding: 24 }}>
              <h4 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{template.name}</h4>
              <p style={{ fontSize: 13, color: "#64748b", marginBottom: 12 }}>
                {template.name === "Aurora" && "Elegant gradient design with modern feel"}
                {template.name === "Dark Knight" && "Sleek dark theme for tech professionals"}
                {template.name === "Sage" && "Fresh green tones for creative fields"}
                {template.name === "Rose Gold" && "Luxurious premium design"}
                {template.name === "Ocean" && "Calm blue tones for corporate roles"}
                {template.name === "Sunset" && "Warm energetic colors"}
              </p>
              {selectedTemplate === key && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#10b981", fontSize: 13, fontWeight: 600 }}>
                  <Check size={16} /> Currently Selected
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      
      <div style={{ background: "#fff", borderRadius: 24, padding: 32, marginTop: 24 }}>
        <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Template Preview</h3>
        <ResumePreview />
      </div>
    </div>
  );

  const ATSSection = () => (
    <div>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        style={{ background: "linear-gradient(135deg, #fff, #f8fafc)", borderRadius: 32, padding: 40, marginBottom: 32, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.1)" }}>
        
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 56, height: 56, background: "linear-gradient(135deg, #667eea, #764ba2)", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Target size={28} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontSize: 28, fontWeight: 800, color: "#0f172a" }}>ATS Compatibility Score</h2>
              <p style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>How well your resume performs with automated tracking systems</p>
            </div>
          </div>
          <div style={{ padding: "10px 20px", background: `${atsScore?.color}15`, borderRadius: 30, color: atsScore?.color, fontWeight: 700, fontSize: 14 }}>
            {atsScore?.level}
          </div>
        </div>
        
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: 16, fontWeight: 600 }}>Overall Score</span>
            <span style={{ fontSize: 42, fontWeight: 800, background: atsScore?.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {atsScore?.overall}%
            </span>
          </div>
          <div style={{ background: "#e2e8f0", borderRadius: 20, overflow: "hidden", height: 16 }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${atsScore?.overall}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{ height: "100%", background: atsScore?.gradient, borderRadius: 20 }}
            />
          </div>
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 32 }}>
          <div style={{ padding: 24, background: "#fff", borderRadius: 20, boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: "#64748b" }}>Section Completeness</span>
              <span style={{ fontWeight: 700, fontSize: 18, color: "#3b82f6" }}>{Math.round(atsScore?.sections.completeness || 0)}%</span>
            </div>
            <div style={{ background: "#e2e8f0", borderRadius: 10, overflow: "hidden", height: 8 }}>
              <div style={{ width: `${atsScore?.sections.completeness || 0}%`, height: "100%", background: "#3b82f6", borderRadius: 10 }} />
            </div>
          </div>
          <div style={{ padding: 24, background: "#fff", borderRadius: 20, boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: "#64748b" }}>Keyword Match</span>
              <span style={{ fontWeight: 700, fontSize: 18, color: "#10b981" }}>{Math.round(atsScore?.sections.keywordMatch || 0)}%</span>
            </div>
            <div style={{ background: "#e2e8f0", borderRadius: 10, overflow: "hidden", height: 8 }}>
              <div style={{ width: `${atsScore?.sections.keywordMatch || 0}%`, height: "100%", background: "#10b981", borderRadius: 10 }} />
            </div>
          </div>
          <div style={{ padding: 24, background: "#fff", borderRadius: 20, boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: "#64748b" }}>Formatting Score</span>
              <span style={{ fontWeight: 700, fontSize: 18, color: "#8b5cf6" }}>{Math.round(atsScore?.formattingScore || 0)}%</span>
            </div>
            <div style={{ background: "#e2e8f0", borderRadius: 10, overflow: "hidden", height: 8 }}>
              <div style={{ width: `${atsScore?.formattingScore || 0}%`, height: "100%", background: "#8b5cf6", borderRadius: 10 }} />
            </div>
          </div>
        </div>
        
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>🔑 Keywords Detected</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {atsScore?.keywords.map((keyword, idx) => (
              <motion.span key={idx} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }}
                style={{ background: "linear-gradient(135deg, #667eea15, #764ba215)", color: "#667eea", padding: "8px 18px", borderRadius: 30, fontSize: 13, fontWeight: 500 }}>
                {keyword}
              </motion.span>
            ))}
            {atsScore?.keywords.length === 0 && (
              <p style={{ color: "#94a3b8", fontStyle: "italic" }}>No keywords detected yet. Add industry-specific skills to improve your score.</p>
            )}
          </div>
        </div>
        
        {atsScore?.suggestions.length > 0 && (
          <div style={{ background: "linear-gradient(135deg, #fef3c7, #fffbeb)", padding: 24, borderRadius: 20 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "#d97706" }}>💡 AI-Powered Suggestions</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {atsScore.suggestions.map((suggestion, idx) => (
                <motion.li key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}
                  style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, fontSize: 14, color: "#92400e" }}>
                  <div style={{ width: 6, height: 6, background: "#d97706", borderRadius: "50%" }} />
                  {suggestion}
                </motion.li>
              ))}
            </ul>
          </div>
        )}
      </motion.div>
      
      <div style={{ background: "#fff", borderRadius: 32, padding: 32 }}>
        <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Your Resume Preview</h3>
        <ResumePreview />
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Poppins:wght@400;500;600;700;800&family=Roboto:wght@400;500;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%); font-family: 'Inter', sans-serif; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 10px; }
        @keyframes gradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
      `}</style>

      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f5f3ff, #ede9fe)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px 32px" }}>
          {/* Header */}
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
            
            <button onClick={() => navigate("/dashboard")} style={{
              width: 48, height: 48, borderRadius: 16, background: "#fff", border: "1px solid #e2e8f0",
              display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s"
            }} onMouseEnter={(e) => e.currentTarget.style.transform = "translateX(-4px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateX(0)"}>
              <ArrowLeft size={20} />
            </button>
            
            <div style={{ textAlign: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center" }}>
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                  <Sparkle size={32} fill="#667eea" color="#667eea" />
                </motion.div>
                <h1 style={{ fontSize: 36, fontWeight: 800, background: "linear-gradient(135deg, #667eea, #764ba2, #f093fb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Resume Studio
                </h1>
              </div>
              <p style={{ fontSize: 14, color: "#64748b", marginTop: 8 }}>Create stunning, ATS-optimized resumes in minutes</p>
            </div>
            
            <div style={{ display: "flex", gap: 12 }}>
              <SubscriptionBadge />
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={generateAISuggestion}
                style={{ padding: "8px 20px", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 40, color: "#667eea", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <Zap size={16} /> AI Assistant
              </motion.button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={downloadJSON}
                style={{ padding: "8px 20px", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 40, color: "#475569", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <Download size={16} /> Save
              </motion.button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={exportPDF}
                style={{ padding: "8px 24px", background: "linear-gradient(135deg, #667eea, #764ba2)", border: "none", borderRadius: 40, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <FileText size={16} /> Export {!isPro && "(Pro)"}
              </motion.button>
            </div>
          </motion.div>

          {/* AI Assistant Toast */}
          <AnimatePresence>
            {showAIAssistant && (
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                style={{
                  position: "fixed", bottom: 30, left: 30, zIndex: 100,
                  background: "linear-gradient(135deg, #667eea, #764ba2)", color: "#fff",
                  padding: "16px 24px", borderRadius: 20, maxWidth: 350,
                  boxShadow: "0 10px 30px rgba(102,126,234,0.3)",
                  display: "flex", alignItems: "center", gap: 12
                }}
              >
                <div style={{ width: 40, height: 40, background: "rgba(255,255,255,0.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Heart size={20} color="#fff" />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>AI Suggestion</p>
                  <p style={{ fontSize: 12, opacity: 0.95 }}>{aiSuggestion}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Save Success Message */}
          <AnimatePresence>
            {saved && (
              <motion.div
                initial={{ opacity: 0, y: -20, x: "-50%" }}
                animate={{ opacity: 1, y: 0, x: "-50%" }}
                exit={{ opacity: 0, y: -20, x: "-50%" }}
                style={{
                  position: "fixed", top: 100, left: "50%", transform: "translateX(-50%)",
                  background: "#10b981", color: "#fff", padding: "14px 28px", borderRadius: 60,
                  zIndex: 100, display: "flex", alignItems: "center", gap: 10, boxShadow: "0 10px 25px rgba(16,185,129,0.3)"
                }}
              >
                <Check size={18} /> Resume saved successfully!
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 32, background: "#fff", padding: 8, borderRadius: 60, width: "fit-content", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            {[
              { id: "build", label: "Build", icon: <Edit2 size={16} /> },
              { id: "templates", label: "Templates", icon: <Palette size={16} /> },
              { id: "ats", label: "ATS Score", icon: <BarChart3 size={16} /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "10px 28px", background: activeTab === tab.id ? "linear-gradient(135deg, #667eea, #764ba2)" : "transparent",
                  border: "none", borderRadius: 40, color: activeTab === tab.id ? "#fff" : "#64748b",
                  fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
                  transition: "all 0.2s"
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {activeTab === "build" && <BuildForm />}
            {activeTab === "templates" && <TemplatesSection />}
            {activeTab === "ats" && <ATSSection />}
          </motion.div>
        </div>
      </div>

      <ProUpgradeModal />
    </>
  );
}