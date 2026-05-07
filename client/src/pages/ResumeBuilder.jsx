import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Upload, Download, Eye, Edit2, Trash2, Plus, 
  X, Check, AlertCircle, Award, Target, TrendingUp, 
  FileText, User, Briefcase, GraduationCap, Mail, Phone,
  MapPin, Globe, Star, Zap, Shield,
  Sparkles, FileCheck, AlertTriangle, ChevronRight, Crown,
  Code, BookOpen, Calendar, Clock, Users, MessageCircle,
  Layout, Palette, Sparkle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ATS Analyzer Utility
const analyzeATS = (resumeData) => {
  const scores = {
    overall: 0,
    sections: {},
    keywords: [],
    suggestions: []
  };

  // Check required sections
  const requiredSections = ['personal', 'experience', 'education', 'skills'];
  const presentSections = requiredSections.filter(section => {
    if (section === 'personal') return resumeData.personal?.name;
    return resumeData[section]?.length > 0;
  });
  scores.sections.completeness = (presentSections.length / requiredSections.length) * 100;

  if (!resumeData.personal?.name) scores.suggestions.push("Add your full name");
  if (!resumeData.personal?.email) scores.suggestions.push("Add email address");
  if (!resumeData.experience?.length) scores.suggestions.push("Add work experience");
  if (!resumeData.skills?.length) scores.suggestions.push("Add technical skills");
  if (!resumeData.summary) scores.suggestions.push("Add a professional summary");

  // Keyword analysis
  const commonKeywords = [
    "JavaScript", "React", "Python", "Java", "Node.js", "MongoDB",
    "Leadership", "Team Management", "Agile", "Scrum", "Communication",
    "Problem Solving", "Critical Thinking", "Analytical", "Project Management"
  ];
  
  const allText = JSON.stringify(resumeData).toLowerCase();
  scores.keywords = commonKeywords.filter(keyword => 
    allText.includes(keyword.toLowerCase())
  );
  
  scores.sections.keywordMatch = (scores.keywords.length / commonKeywords.length) * 100;

  // Calculate overall score
  scores.overall = Math.round(
    (scores.sections.completeness * 0.4) +
    (scores.sections.keywordMatch * 0.4) +
    (Math.min(resumeData.experience?.length * 10 || 0, 20))
  );

  scores.level = scores.overall >= 80 ? "Excellent" : scores.overall >= 60 ? "Good" : "Needs Improvement";
  scores.color = scores.overall >= 80 ? "#6366f1" : scores.overall >= 60 ? "#f59e0b" : "#ef4444";

  return scores;
};

// Template styles - New elegant color scheme
const TEMPLATES = {
  modern: {
    name: "Modern",
    preview: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    style: {
      headerBg: "linear-gradient(135deg, #6366f1, #8b5cf6)",
      accent: "#6366f1",
      font: "'Inter', sans-serif"
    }
  },
  professional: {
    name: "Professional",
    preview: "linear-gradient(135deg, #1e293b, #3b82f6)",
    style: {
      headerBg: "#1e293b",
      accent: "#3b82f6",
      font: "'Roboto', sans-serif"
    }
  },
  creative: {
    name: "Creative",
    preview: "linear-gradient(135deg, #ec4899, #f43f5e)",
    style: {
      headerBg: "linear-gradient(135deg, #ec4899, #f43f5e)",
      accent: "#ec4899",
      font: "'Poppins', sans-serif"
    }
  },
  minimalist: {
    name: "Minimalist",
    preview: "#0f172a",
    style: {
      headerBg: "#0f172a",
      accent: "#64748b",
      font: "'Inter', sans-serif"
    }
  }
};

export default function ResumeBuilder() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("build");
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [showPreview, setShowPreview] = useState(true);
  const [atsScore, setAtsScore] = useState(null);
  const [animateScore, setAnimateScore] = useState(false);
  
  // Resume Data State
  const [resumeData, setResumeData] = useState({
    personal: {
      name: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      portfolio: ""
    },
    summary: "",
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    projects: [],
    languages: []
  });

  // Form states for adding entries
  const [newExperience, setNewExperience] = useState({ company: "", role: "", duration: "", description: "" });
  const [newEducation, setNewEducation] = useState({ institution: "", degree: "", year: "", cgpa: "" });
  const [newSkill, setNewSkill] = useState("");

  // Update ATS score when data changes
  useEffect(() => {
    const score = analyzeATS(resumeData);
    setAtsScore(score);
    setAnimateScore(true);
    const timer = setTimeout(() => setAnimateScore(false), 500);
    return () => clearTimeout(timer);
  }, [resumeData]);

  // Handlers
  const updatePersonalInfo = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      personal: { ...prev.personal, [field]: value }
    }));
  };

  const addExperience = () => {
    if (newExperience.company && newExperience.role) {
      setResumeData(prev => ({
        ...prev,
        experience: [...prev.experience, { ...newExperience, id: Date.now() }]
      }));
      setNewExperience({ company: "", role: "", duration: "", description: "" });
    }
  };

  const removeExperience = (index) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const addEducation = () => {
    if (newEducation.institution && newEducation.degree) {
      setResumeData(prev => ({
        ...prev,
        education: [...prev.education, { ...newEducation, id: Date.now() }]
      }));
      setNewEducation({ institution: "", degree: "", year: "", cgpa: "" });
    }
  };

  const removeEducation = (index) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addSkill = () => {
    if (newSkill && !resumeData.skills.includes(newSkill)) {
      setResumeData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill]
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (index) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const downloadResume = () => {
    const resumeJSON = JSON.stringify(resumeData, null, 2);
    const blob = new Blob([resumeJSON], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume.json";
    a.click();
    URL.revokeObjectURL(url);
    
    localStorage.setItem("resumeData", resumeJSON);
  };

  const exportPDF = () => {
    alert("PDF export feature will be available in Pro version!");
  };

  const getATSScoreColor = () => {
    if (!atsScore) return "#64748b";
    if (atsScore.overall >= 80) return "#6366f1";
    if (atsScore.overall >= 60) return "#f59e0b";
    return "#ef4444";
  };

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 }
  };

  const staggerContainer = {
    animate: { transition: { staggerChildren: 0.05 } }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Roboto:wght@400;500;700&family=Poppins:wght@400;500;600;700;800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #f8fafc; font-family: 'Inter', sans-serif; }
        .resume-container { min-height: 100vh; background: #f8fafc; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: rgba(0,0,0,0.05); }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.2); border-radius: 3px; }
      `}</style>

      <div className="resume-container" style={{
        minHeight: "100vh",
        background: "#f8fafc",
        position: "relative",
        overflowX: "hidden"
      }}>
        {/* Header */}
        <div style={{ position: "relative", zIndex: 1, maxWidth: 1400, margin: "0 auto", padding: "24px 32px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
            <button
              onClick={() => navigate("/dashboard")}
              style={{
                width: 40, height: 40, borderRadius: 12,
                background: "#fff",
                border: "1px solid #e2e8f0",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "#475569",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#f1f5f9"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}
            >
              <ArrowLeft size={20} />
            </button>
            <div style={{ textAlign: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                <Sparkle size={24} fill="#6366f1" color="#6366f1" />
                <h1 style={{ fontSize: 28, fontWeight: 800, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.02em" }}>
                  Resume Builder
                </h1>
              </div>
              <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
                Create ATS-friendly resume & get instant feedback
              </p>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={downloadResume}
                style={{
                  padding: "8px 20px",
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 10,
                  color: "#475569",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.borderColor = "#cbd5e1"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
              >
                <Download size={16} /> Save
              </button>
              <button
                onClick={exportPDF}
                style={{
                  padding: "8px 20px",
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  border: "none",
                  borderRadius: 10,
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  transition: "transform 0.2s, box-shadow 0.2s"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(99,102,241,0.3)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <FileText size={16} /> Export PDF
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 32, borderBottom: "2px solid #e2e8f0", paddingBottom: 0 }}>
            {[
              { id: "build", label: "Build Resume", icon: <Edit2 size={16} /> },
              { id: "templates", label: "Templates", icon: <Layout size={16} /> },
              { id: "ats", label: "ATS Analysis", icon: <Target size={16} /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "10px 24px",
                  background: "transparent",
                  border: "none",
                  borderBottom: activeTab === tab.id ? "2px solid #6366f1" : "2px solid transparent",
                  color: activeTab === tab.id ? "#6366f1" : "#64748b",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: "-2px",
                  transition: "all 0.2s"
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: 32 }}>
            {/* Left Panel - Form */}
            <motion.div variants={staggerContainer} initial="initial" animate="animate">
              {activeTab === "build" && (
                <motion.div
                  variants={fadeInUp}
                  style={{ display: "flex", flexDirection: "column", gap: 24 }}
                >
                  {/* Personal Information */}
                  <div style={{
                    background: "#fff",
                    borderRadius: 20,
                    padding: 28,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    border: "1px solid #e2e8f0"
                  }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <User size={16} color="#fff" />
                      </div>
                      Personal Information
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={resumeData.personal.name}
                        onChange={(e) => updatePersonalInfo("name", e.target.value)}
                        style={{
                          padding: "12px 16px",
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          borderRadius: 12,
                          color: "#0f172a",
                          outline: "none",
                          fontSize: 14,
                          transition: "all 0.2s"
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = "#6366f1"}
                        onBlur={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}
                      />
                      <input
                        type="text"
                        placeholder="Professional Title"
                        value={resumeData.personal.title}
                        onChange={(e) => updatePersonalInfo("title", e.target.value)}
                        style={{
                          padding: "12px 16px",
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          borderRadius: 12,
                          color: "#0f172a",
                          outline: "none",
                          fontSize: 14,
                          transition: "all 0.2s"
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = "#6366f1"}
                        onBlur={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={resumeData.personal.email}
                        onChange={(e) => updatePersonalInfo("email", e.target.value)}
                        style={{
                          padding: "12px 16px",
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          borderRadius: 12,
                          color: "#0f172a",
                          outline: "none",
                          fontSize: 14,
                          transition: "all 0.2s"
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = "#6366f1"}
                        onBlur={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}
                      />
                      <input
                        type="tel"
                        placeholder="Phone"
                        value={resumeData.personal.phone}
                        onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                        style={{
                          padding: "12px 16px",
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          borderRadius: 12,
                          color: "#0f172a",
                          outline: "none",
                          fontSize: 14,
                          transition: "all 0.2s"
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = "#6366f1"}
                        onBlur={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}
                      />
                      <input
                        type="text"
                        placeholder="Location"
                        value={resumeData.personal.location}
                        onChange={(e) => updatePersonalInfo("location", e.target.value)}
                        style={{
                          padding: "12px 16px",
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          borderRadius: 12,
                          color: "#0f172a",
                          outline: "none",
                          fontSize: 14,
                          transition: "all 0.2s"
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = "#6366f1"}
                        onBlur={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}
                      />
                      <input
                        type="url"
                        placeholder="LinkedIn URL"
                        value={resumeData.personal.linkedin}
                        onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
                        style={{
                          padding: "12px 16px",
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          borderRadius: 12,
                          color: "#0f172a",
                          outline: "none",
                          fontSize: 14,
                          transition: "all 0.2s"
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = "#6366f1"}
                        onBlur={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}
                      />
                    </div>
                    <textarea
                      placeholder="Professional Summary (2-3 sentences highlighting your key strengths)"
                      value={resumeData.summary}
                      onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
                      rows="3"
                      style={{
                        width: "100%",
                        marginTop: 20,
                        padding: "12px 16px",
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: 12,
                        color: "#0f172a",
                        outline: "none",
                        resize: "vertical",
                        fontSize: 14,
                        fontFamily: "inherit",
                        transition: "all 0.2s"
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = "#6366f1"}
                      onBlur={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}
                    />
                  </div>

                  {/* Work Experience */}
                  <div style={{
                    background: "#fff",
                    borderRadius: 20,
                    padding: 28,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    border: "1px solid #e2e8f0"
                  }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, background: "linear-gradient(135deg, #3b82f6, #06b6d4)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Briefcase size={16} color="#fff" />
                      </div>
                      Work Experience
                    </h3>
                    
                    <AnimatePresence>
                      {resumeData.experience.map((exp, idx) => (
                        <motion.div 
                          key={idx} 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          style={{
                            background: "#f8fafc",
                            borderRadius: 16,
                            padding: 16,
                            marginBottom: 12,
                            position: "relative",
                            border: "1px solid #e2e8f0"
                          }}
                        >
                          <button
                            onClick={() => removeExperience(idx)}
                            style={{
                              position: "absolute",
                              top: 12,
                              right: 12,
                              background: "#fee2e2",
                              border: "none",
                              borderRadius: 8,
                              padding: 6,
                              cursor: "pointer",
                              color: "#ef4444",
                              transition: "all 0.2s"
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = "#fecaca"}
                            onMouseLeave={(e) => e.currentTarget.style.background = "#fee2e2"}
                          >
                            <Trash2 size={14} />
                          </button>
                          <p style={{ fontWeight: 700, color: "#0f172a", fontSize: 15 }}>{exp.role} at {exp.company}</p>
                          <p style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{exp.duration}</p>
                          <p style={{ fontSize: 13, color: "#475569", marginTop: 8, lineHeight: 1.5 }}>{exp.description}</p>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    
                    <div style={{ display: "grid", gap: 12, marginTop: 8 }}>
                      <input
                        type="text"
                        placeholder="Company Name"
                        value={newExperience.company}
                        onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                        style={{
                          padding: "12px 16px",
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          borderRadius: 12,
                          color: "#0f172a",
                          outline: "none",
                          fontSize: 14,
                          transition: "all 0.2s"
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = "#6366f1"}
                        onBlur={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}
                      />
                      <input
                        type="text"
                        placeholder="Role / Position"
                        value={newExperience.role}
                        onChange={(e) => setNewExperience({ ...newExperience, role: e.target.value })}
                        style={{
                          padding: "12px 16px",
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          borderRadius: 12,
                          color: "#0f172a",
                          outline: "none",
                          fontSize: 14,
                          transition: "all 0.2s"
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = "#6366f1"}
                        onBlur={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}
                      />
                      <input
                        type="text"
                        placeholder="Duration (e.g., Jan 2022 - Present)"
                        value={newExperience.duration}
                        onChange={(e) => setNewExperience({ ...newExperience, duration: e.target.value })}
                        style={{
                          padding: "12px 16px",
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          borderRadius: 12,
                          color: "#0f172a",
                          outline: "none",
                          fontSize: 14,
                          transition: "all 0.2s"
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = "#6366f1"}
                        onBlur={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}
                      />
                      <textarea
                        placeholder="Key responsibilities and achievements"
                        value={newExperience.description}
                        onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                        rows="2"
                        style={{
                          padding: "12px 16px",
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          borderRadius: 12,
                          color: "#0f172a",
                          outline: "none",
                          fontSize: 14,
                          resize: "vertical",
                          transition: "all 0.2s"
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = "#6366f1"}
                        onBlur={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}
                      />
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={addExperience}
                        style={{
                          padding: "12px",
                          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                          border: "none",
                          borderRadius: 12,
                          color: "#fff",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                          fontSize: 14,
                          fontWeight: 600
                        }}
                      >
                        <Plus size={18} /> Add Experience
                      </motion.button>
                    </div>
                  </div>

                  {/* Education */}
                  <div style={{
                    background: "#fff",
                    borderRadius: 20,
                    padding: 28,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    border: "1px solid #e2e8f0"
                  }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, background: "linear-gradient(135deg, #8b5cf6, #d946ef)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <GraduationCap size={16} color="#fff" />
                      </div>
                      Education
                    </h3>
                    
                    <AnimatePresence>
                      {resumeData.education.map((edu, idx) => (
                        <motion.div 
                          key={idx} 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          style={{
                            background: "#f8fafc",
                            borderRadius: 16,
                            padding: 16,
                            marginBottom: 12,
                            position: "relative",
                            border: "1px solid #e2e8f0"
                          }}
                        >
                          <button
                            onClick={() => removeEducation(idx)}
                            style={{
                              position: "absolute",
                              top: 12,
                              right: 12,
                              background: "#fee2e2",
                              border: "none",
                              borderRadius: 8,
                              padding: 6,
                              cursor: "pointer",
                              color: "#ef4444",
                              transition: "all 0.2s"
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = "#fecaca"}
                            onMouseLeave={(e) => e.currentTarget.style.background = "#fee2e2"}
                          >
                            <Trash2 size={14} />
                          </button>
                          <p style={{ fontWeight: 700, color: "#0f172a", fontSize: 15 }}>{edu.degree} - {edu.institution}</p>
                          <p style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{edu.year} | CGPA: {edu.cgpa}</p>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    
                    <div style={{ display: "grid", gap: 12, marginTop: 8 }}>
                      <input
                        type="text"
                        placeholder="Institution Name"
                        value={newEducation.institution}
                        onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                        style={{
                          padding: "12px 16px",
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          borderRadius: 12,
                          color: "#0f172a",
                          outline: "none",
                          fontSize: 14,
                          transition: "all 0.2s"
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = "#6366f1"}
                        onBlur={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}
                      />
                      <input
                        type="text"
                        placeholder="Degree / Course"
                        value={newEducation.degree}
                        onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                        style={{
                          padding: "12px 16px",
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          borderRadius: 12,
                          color: "#0f172a",
                          outline: "none",
                          fontSize: 14,
                          transition: "all 0.2s"
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = "#6366f1"}
                        onBlur={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}
                      />
                      <input
                        type="text"
                        placeholder="Year of Graduation"
                        value={newEducation.year}
                        onChange={(e) => setNewEducation({ ...newEducation, year: e.target.value })}
                        style={{
                          padding: "12px 16px",
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          borderRadius: 12,
                          color: "#0f172a",
                          outline: "none",
                          fontSize: 14,
                          transition: "all 0.2s"
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = "#6366f1"}
                        onBlur={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}
                      />
                      <input
                        type="text"
                        placeholder="CGPA / Percentage"
                        value={newEducation.cgpa}
                        onChange={(e) => setNewEducation({ ...newEducation, cgpa: e.target.value })}
                        style={{
                          padding: "12px 16px",
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          borderRadius: 12,
                          color: "#0f172a",
                          outline: "none",
                          fontSize: 14,
                          transition: "all 0.2s"
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = "#6366f1"}
                        onBlur={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}
                      />
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={addEducation}
                        style={{
                          padding: "12px",
                          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                          border: "none",
                          borderRadius: 12,
                          color: "#fff",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                          fontSize: 14,
                          fontWeight: 600
                        }}
                      >
                        <Plus size={18} /> Add Education
                      </motion.button>
                    </div>
                  </div>

                  {/* Skills */}
                  <div style={{
                    background: "#fff",
                    borderRadius: 20,
                    padding: 28,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    border: "1px solid #e2e8f0"
                  }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, background: "linear-gradient(135deg, #f59e0b, #ef4444)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Zap size={16} color="#fff" />
                      </div>
                      Technical Skills
                    </h3>
                    
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
                      <AnimatePresence>
                        {resumeData.skills.map((skill, idx) => (
                          <motion.span
                            key={idx}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            style={{
                              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                              borderRadius: 24,
                              padding: "6px 14px",
                              fontSize: 12,
                              color: "#fff",
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              fontWeight: 500
                            }}
                          >
                            {skill}
                            <X size={12} style={{ cursor: "pointer", opacity: 0.8 }} onClick={() => removeSkill(idx)} />
                          </motion.span>
                        ))}
                      </AnimatePresence>
                    </div>
                    
                    <div style={{ display: "flex", gap: 12 }}>
                      <input
                        type="text"
                        placeholder="Add skill (e.g., JavaScript, Python, React)"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addSkill()}
                        style={{
                          flex: 1,
                          padding: "12px 16px",
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          borderRadius: 12,
                          color: "#0f172a",
                          outline: "none",
                          fontSize: 14,
                          transition: "all 0.2s"
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = "#6366f1"}
                        onBlur={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}
                      />
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={addSkill}
                        style={{
                          padding: "12px 24px",
                          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                          border: "none",
                          borderRadius: 12,
                          color: "#fff",
                          cursor: "pointer",
                          fontWeight: 600,
                          fontSize: 14
                        }}
                      >
                        Add
                      </motion.button>
                    </div>
                    <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 12, display: "flex", alignItems: "center", gap: 4 }}>
                      <span>💡</span> Add skills relevant to your target job role
                    </p>
                  </div>
                </motion.div>
              )}

              {activeTab === "templates" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}
                >
                  {Object.entries(TEMPLATES).map(([key, template]) => (
                    <motion.div
                      key={key}
                      whileHover={{ y: -4 }}
                      onClick={() => setSelectedTemplate(key)}
                      style={{
                        cursor: "pointer",
                        background: selectedTemplate === key ? `linear-gradient(135deg, ${template.style.accent}15, #fff)` : "#fff",
                        border: selectedTemplate === key ? `2px solid ${template.style.accent}` : "1px solid #e2e8f0",
                        borderRadius: 20,
                        padding: 20,
                        transition: "all 0.3s ease",
                        boxShadow: selectedTemplate === key ? `0 4px 12px ${template.style.accent}20` : "0 1px 3px rgba(0,0,0,0.05)"
                      }}
                    >
                      <div style={{
                        height: 180,
                        background: template.preview,
                        borderRadius: 16,
                        marginBottom: 16,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: 14,
                        fontWeight: 600,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                      }}>
                        {template.name}
                      </div>
                      <h4 style={{ color: "#0f172a", marginBottom: 4, fontSize: 16, fontWeight: 700 }}>{template.name}</h4>
                      <p style={{ fontSize: 12, color: "#64748b" }}>Professional & ATS-friendly</p>
                      {selectedTemplate === key && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          style={{ marginTop: 12, color: template.style.accent, fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}
                        >
                          <Check size={14} /> Selected
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeTab === "ats" && atsScore && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    background: "#fff",
                    borderRadius: 20,
                    padding: 28,
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                  }}
                >
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Target size={16} color="#fff" />
                    </div>
                    ATS Score Analysis
                  </h3>
                  
                  {/* Score Circle */}
                  <div style={{ textAlign: "center", marginBottom: 32 }}>
                    <motion.div 
                      animate={animateScore ? { scale: [1, 1.05, 1] } : {}}
                      style={{
                        width: 180,
                        height: 180,
                        margin: "0 auto",
                        position: "relative"
                      }}
                    >
                      <svg width="180" height="180">
                        <circle cx="90" cy="90" r="78" fill="none" stroke="#e2e8f0" strokeWidth="12"/>
                        <circle
                          cx="90" cy="90" r="78"
                          fill="none"
                          stroke={getATSScoreColor()}
                          strokeWidth="12"
                          strokeDasharray={`${2 * Math.PI * 78 * (atsScore.overall / 100)} ${2 * Math.PI * 78}`}
                          strokeLinecap="round"
                          transform="rotate(-90 90 90)"
                          style={{ transition: "stroke-dasharray 0.8s ease" }}
                        />
                      </svg>
                      <div style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        textAlign: "center"
                      }}>
                        <motion.span 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          style={{ fontSize: 44, fontWeight: 800, color: getATSScoreColor() }}
                        >
                          {atsScore.overall}
                        </motion.span>
                        <span style={{ fontSize: 14, color: "#64748b" }}>/100</span>
                      </div>
                    </motion.div>
                    <div style={{
                      display: "inline-block",
                      marginTop: 12,
                      padding: "4px 16px",
                      background: `${getATSScoreColor()}15`,
                      borderRadius: 24,
                      color: getATSScoreColor(),
                      fontSize: 13,
                      fontWeight: 600
                    }}>
                      {atsScore.level}
                    </div>
                  </div>

                  {/* Score Breakdown */}
                  <div style={{ marginBottom: 28 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", marginBottom: 16 }}>Score Breakdown</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                          <span style={{ fontSize: 13, color: "#475569" }}>Resume Completeness</span>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "#6366f1" }}>{Math.round(atsScore.sections.completeness)}%</span>
                        </div>
                        <div style={{ height: 8, background: "#e2e8f0", borderRadius: 4, overflow: "hidden" }}>
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${atsScore.sections.completeness}%` }}
                            transition={{ duration: 0.5 }}
                            style={{ height: "100%", background: "#6366f1", borderRadius: 4 }} 
                          />
                        </div>
                      </div>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                          <span style={{ fontSize: 13, color: "#475569" }}>Keyword Optimization</span>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "#8b5cf6" }}>{Math.round(atsScore.sections.keywordMatch)}%</span>
                        </div>
                        <div style={{ height: 8, background: "#e2e8f0", borderRadius: 4, overflow: "hidden" }}>
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${atsScore.sections.keywordMatch}%` }}
                            transition={{ duration: 0.5 }}
                            style={{ height: "100%", background: "#8b5cf6", borderRadius: 4 }} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Keywords Found */}
                  <div style={{ marginBottom: 28 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", marginBottom: 12 }}>Keywords Detected</h4>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {atsScore.keywords.map((keyword, idx) => (
                        <motion.span
                          key={idx}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.02 }}
                          style={{
                            background: "#f1f5f9",
                            borderRadius: 20,
                            padding: "5px 12px",
                            fontSize: 11,
                            color: "#475569",
                            fontWeight: 500
                          }}
                        >
                          {keyword}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* Suggestions */}
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", marginBottom: 12 }}>Improvement Suggestions</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {atsScore.suggestions.map((suggestion, idx) => (
                        <div key={idx} style={{ display: "flex", alignItems: "center", gap: 10, padding: 12, background: "#fef2f2", borderRadius: 12 }}>
                          <AlertCircle size={14} color="#ef4444" />
                          <span style={{ fontSize: 12, color: "#991b1b" }}>{suggestion}</span>
                        </div>
                      ))}
                      {atsScore.suggestions.length === 0 && (
                        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 12, background: "#ecfdf5", borderRadius: 12 }}>
                          <Check size={14} color="#10b981" />
                          <span style={{ fontSize: 12, color: "#065f46" }}>Your resume looks great! Ready for applications.</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Right Panel - Preview */}
            <div style={{ position: "sticky", top: 24, height: "fit-content" }}>
              <div style={{
                background: "#fff",
                borderRadius: 20,
                border: "1px solid #e2e8f0",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
              }}>
                <div style={{
                  padding: 16,
                  borderBottom: "1px solid #e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "#f8fafc"
                }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", display: "flex", alignItems: "center", gap: 6 }}>
                    <Eye size={14} color="#6366f1" /> Live Preview
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowPreview(!showPreview)}
                    style={{
                      padding: "6px 14px",
                      background: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: 8,
                      color: "#6366f1",
                      fontSize: 11,
                      cursor: "pointer",
                      fontWeight: 500,
                      transition: "all 0.2s"
                    }}
                  >
                    {showPreview ? "Hide" : "Show"} Preview
                  </motion.button>
                </div>
                
                <AnimatePresence>
                  {showPreview && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{ overflow: "hidden" }}
                    >
                      <div style={{ padding: 24, maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
                        {/* Resume Preview */}
                        <div style={{
                          background: "#fff",
                          borderRadius: 16,
                          padding: 28,
                          color: "#1e293b",
                          fontFamily: TEMPLATES[selectedTemplate].style.font,
                          border: "1px solid #e2e8f0",
                          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)"
                        }}>
                          {/* Header */}
                          <div style={{
                            background: TEMPLATES[selectedTemplate].style.headerBg,
                            margin: "-28px -28px 24px -28px",
                            padding: "28px",
                            color: "#fff",
                            borderRadius: "16px 16px 0 0"
                          }}>
                            <h1 style={{ fontSize: 28, marginBottom: 8, fontWeight: 800 }}>{resumeData.personal.name || "Your Name"}</h1>
                            <p style={{ fontSize: 14, opacity: 0.9 }}>{resumeData.personal.title || "Professional Title"}</p>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 16, fontSize: 12, opacity: 0.85 }}>
                              {resumeData.personal.email && <span>📧 {resumeData.personal.email}</span>}
                              {resumeData.personal.phone && <span>📱 {resumeData.personal.phone}</span>}
                              {resumeData.personal.location && <span>📍 {resumeData.personal.location}</span>}
                            </div>
                          </div>
                          
                          {/* Summary */}
                          {resumeData.summary && (
                            <div style={{ marginBottom: 20 }}>
                              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, color: TEMPLATES[selectedTemplate].style.accent, borderLeft: `3px solid ${TEMPLATES[selectedTemplate].style.accent}`, paddingLeft: 10 }}>
                                Professional Summary
                              </h3>
                              <p style={{ fontSize: 13, lineHeight: 1.6, color: "#475569" }}>{resumeData.summary}</p>
                            </div>
                          )}
                          
                          {/* Experience */}
                          {resumeData.experience.length > 0 && (
                            <div style={{ marginBottom: 20 }}>
                              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, color: TEMPLATES[selectedTemplate].style.accent, borderLeft: `3px solid ${TEMPLATES[selectedTemplate].style.accent}`, paddingLeft: 10 }}>
                                Work Experience
                              </h3>
                              {resumeData.experience.map((exp, idx) => (
                                <div key={idx} style={{ marginBottom: 16 }}>
                                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                                    <strong style={{ fontSize: 14, color: "#0f172a" }}>{exp.role}</strong>
                                    <span style={{ fontSize: 11, color: "#64748b" }}>{exp.duration}</span>
                                  </div>
                                  <p style={{ fontSize: 12, color: "#475569", marginBottom: 6 }}>{exp.company}</p>
                                  <p style={{ fontSize: 12, lineHeight: 1.5, color: "#64748b" }}>{exp.description}</p>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* Education */}
                          {resumeData.education.length > 0 && (
                            <div style={{ marginBottom: 20 }}>
                              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, color: TEMPLATES[selectedTemplate].style.accent, borderLeft: `3px solid ${TEMPLATES[selectedTemplate].style.accent}`, paddingLeft: 10 }}>
                                Education
                              </h3>
                              {resumeData.education.map((edu, idx) => (
                                <div key={idx} style={{ marginBottom: 12 }}>
                                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                                    <strong style={{ fontSize: 14, color: "#0f172a" }}>{edu.degree}</strong>
                                    <span style={{ fontSize: 11, color: "#64748b" }}>{edu.year}</span>
                                  </div>
                                  <p style={{ fontSize: 12, color: "#475569" }}>{edu.institution}</p>
                                  {edu.cgpa && <p style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>CGPA: {edu.cgpa}</p>}
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* Skills */}
                          {resumeData.skills.length > 0 && (
                            <div>
                              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, color: TEMPLATES[selectedTemplate].style.accent, borderLeft: `3px solid ${TEMPLATES[selectedTemplate].style.accent}`, paddingLeft: 10 }}>
                                Skills
                              </h3>
                              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                {resumeData.skills.map((skill, idx) => (
                                  <span key={idx} style={{
                                    background: `${TEMPLATES[selectedTemplate].style.accent}15`,
                                    color: TEMPLATES[selectedTemplate].style.accent,
                                    padding: "5px 12px",
                                    borderRadius: 20,
                                    fontSize: 11,
                                    fontWeight: 500
                                  }}>
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}