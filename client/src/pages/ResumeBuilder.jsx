import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Upload, Download, Eye, Edit2, Trash2, Plus, 
  X, Check, AlertCircle, Award, Target, TrendingUp, 
  FileText, User, Briefcase, GraduationCap, Mail, Phone,
  MapPin,Globe, Star, Zap, Shield,
  Sparkles, FileCheck, AlertTriangle, ChevronRight, Crown,
  Code, BookOpen, Calendar, Clock, Users, MessageCircle
} from "lucide-react";
import { motion } from "framer-motion";

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
  scores.color = scores.overall >= 80 ? "#00ffa3" : scores.overall >= 60 ? "#fbbf24" : "#ff4b6e";

  return scores;
};

// Template styles
const TEMPLATES = {
  modern: {
    name: "Modern",
    preview: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    style: {
      headerBg: "linear-gradient(135deg, #667eea, #764ba2)",
      accent: "#667eea",
      font: "'Inter', sans-serif"
    }
  },
  professional: {
    name: "Professional",
    preview: "linear-gradient(135deg, #2c3e50, #3498db)",
    style: {
      headerBg: "#2c3e50",
      accent: "#3498db",
      font: "'Roboto', sans-serif"
    }
  },
  creative: {
    name: "Creative",
    preview: "linear-gradient(135deg, #f093fb, #f5576c)",
    style: {
      headerBg: "linear-gradient(135deg, #f093fb, #f5576c)",
      accent: "#f5576c",
      font: "'Poppins', sans-serif"
    }
  },
  minimalist: {
    name: "Minimalist",
    preview: "#1a1a2e",
    style: {
      headerBg: "#1a1a2e",
      accent: "#00ffa3",
      font: "'Inter', sans-serif"
    }
  }
};

export default function ResumeBuilder() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("build");
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [showPreview, setShowPreview] = useState(false);
  const [atsScore, setAtsScore] = useState(null);
  
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
    alert("Resume saved successfully!");
  };

  const exportPDF = () => {
    alert("PDF export feature will be available in Pro version!");
  };

  const getATSScoreColor = () => {
    if (!atsScore) return "#6b7280";
    if (atsScore.overall >= 80) return "#00ffa3";
    if (atsScore.overall >= 60) return "#fbbf24";
    return "#ff4b6e";
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #060610; font-family: 'Inter', sans-serif; }
        .resume-container { min-height: 100vh; background: #060610; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 3px; }
      `}</style>

      <div className="resume-container" style={{
        minHeight: "100vh",
        background: "#060610",
        position: "relative",
        overflowX: "hidden"
      }}>
        {/* Background Effects */}
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
          <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", top: "-20%", right: "-20%",
            background: "radial-gradient(circle, rgba(0,255,163,0.08) 0%, transparent 65%)" }} />
          <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", bottom: "-10%", left: "-10%",
            background: "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 65%)" }} />
        </div>

        {/* Header */}
        <div style={{ position: "relative", zIndex: 1, maxWidth: 1400, margin: "0 auto", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <button
              onClick={() => navigate("/dashboard")}
              style={{
                width: 40, height: 40, borderRadius: 12,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "rgba(255,255,255,0.6)"
              }}
            >
              <ArrowLeft size={20} />
            </button>
            <div style={{ textAlign: "center" }}>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
                Resume Builder
              </h1>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                Create ATS-friendly resume & get instant feedback
              </p>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={downloadResume}
                style={{
                  padding: "8px 16px",
                  background: "rgba(0,255,163,0.1)",
                  border: "1px solid rgba(0,255,163,0.3)",
                  borderRadius: 10,
                  color: "#00ffa3",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6
                }}
              >
                <Download size={16} /> Save
              </button>
              <button
                onClick={exportPDF}
                style={{
                  padding: "8px 16px",
                  background: "linear-gradient(135deg, #00ffa3, #00c9ff)",
                  border: "none",
                  borderRadius: 10,
                  color: "#060610",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6
                }}
              >
                <FileText size={16} /> Export PDF
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 12, marginBottom: 24, borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 12 }}>
            {[
              { id: "build", label: "Build Resume", icon: <Edit2 size={16} /> },
              { id: "templates", label: "Templates", icon: <FileText size={16} /> },
              { id: "ats", label: "ATS Analysis", icon: <Target size={16} /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "8px 20px",
                  background: activeTab === tab.id ? "rgba(0,255,163,0.1)" : "transparent",
                  border: activeTab === tab.id ? "1px solid rgba(0,255,163,0.3)" : "1px solid transparent",
                  borderRadius: 10,
                  color: activeTab === tab.id ? "#00ffa3" : "rgba(255,255,255,0.6)",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: 24 }}>
            {/* Left Panel - Form */}
            <div>
              {activeTab === "build" && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{ display: "flex", flexDirection: "column", gap: 20 }}
                >
                  {/* Personal Information */}
                  <div style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 20,
                    padding: 24
                  }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                      <User size={18} color="#00ffa3" /> Personal Information
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={resumeData.personal.name}
                        onChange={(e) => updatePersonalInfo("name", e.target.value)}
                        style={{
                          padding: "12px",
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: 10,
                          color: "#fff",
                          outline: "none"
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Professional Title"
                        value={resumeData.personal.title}
                        onChange={(e) => updatePersonalInfo("title", e.target.value)}
                        style={{
                          padding: "12px",
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: 10,
                          color: "#fff",
                          outline: "none"
                        }}
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={resumeData.personal.email}
                        onChange={(e) => updatePersonalInfo("email", e.target.value)}
                        style={{
                          padding: "12px",
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: 10,
                          color: "#fff",
                          outline: "none"
                        }}
                      />
                      <input
                        type="tel"
                        placeholder="Phone"
                        value={resumeData.personal.phone}
                        onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                        style={{
                          padding: "12px",
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: 10,
                          color: "#fff",
                          outline: "none"
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Location"
                        value={resumeData.personal.location}
                        onChange={(e) => updatePersonalInfo("location", e.target.value)}
                        style={{
                          padding: "12px",
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: 10,
                          color: "#fff",
                          outline: "none"
                        }}
                      />
                      <input
                        type="url"
                        placeholder="LinkedIn URL"
                        value={resumeData.personal.linkedin}
                        onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
                        style={{
                          padding: "12px",
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: 10,
                          color: "#fff",
                          outline: "none"
                        }}
                      />
                    </div>
                    <textarea
                      placeholder="Professional Summary (2-3 sentences highlighting your key strengths)"
                      value={resumeData.summary}
                      onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
                      rows="3"
                      style={{
                        width: "100%",
                        marginTop: 16,
                        padding: "12px",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 10,
                        color: "#fff",
                        outline: "none",
                        resize: "vertical"
                      }}
                    />
                  </div>

                  {/* Work Experience */}
                  <div style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 20,
                    padding: 24
                  }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                      <Briefcase size={18} color="#00c9ff" /> Work Experience
                    </h3>
                    
                    {resumeData.experience.map((exp, idx) => (
                      <div key={idx} style={{
                        background: "rgba(255,255,255,0.05)",
                        borderRadius: 12,
                        padding: 12,
                        marginBottom: 12,
                        position: "relative"
                      }}>
                        <button
                          onClick={() => removeExperience(idx)}
                          style={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            background: "rgba(255,75,110,0.1)",
                            border: "none",
                            borderRadius: 6,
                            padding: 4,
                            cursor: "pointer",
                            color: "#ff4b6e"
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                        <p style={{ fontWeight: 700, color: "#fff" }}>{exp.role} at {exp.company}</p>
                        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{exp.duration}</p>
                        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 6 }}>{exp.description}</p>
                      </div>
                    ))}
                    
                    <div style={{ display: "grid", gap: 12 }}>
                      <input
                        type="text"
                        placeholder="Company Name"
                        value={newExperience.company}
                        onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                        style={{
                          padding: "12px",
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: 10,
                          color: "#fff",
                          outline: "none"
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Role / Position"
                        value={newExperience.role}
                        onChange={(e) => setNewExperience({ ...newExperience, role: e.target.value })}
                        style={{
                          padding: "12px",
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: 10,
                          color: "#fff",
                          outline: "none"
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Duration (e.g., Jan 2022 - Present)"
                        value={newExperience.duration}
                        onChange={(e) => setNewExperience({ ...newExperience, duration: e.target.value })}
                        style={{
                          padding: "12px",
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: 10,
                          color: "#fff",
                          outline: "none"
                        }}
                      />
                      <textarea
                        placeholder="Key responsibilities and achievements"
                        value={newExperience.description}
                        onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                        rows="2"
                        style={{
                          padding: "12px",
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: 10,
                          color: "#fff",
                          outline: "none"
                        }}
                      />
                      <button
                        onClick={addExperience}
                        style={{
                          padding: "10px",
                          background: "rgba(0,255,163,0.1)",
                          border: "1px solid rgba(0,255,163,0.3)",
                          borderRadius: 10,
                          color: "#00ffa3",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 6
                        }}
                      >
                        <Plus size={16} /> Add Experience
                      </button>
                    </div>
                  </div>

                  {/* Education */}
                  <div style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 20,
                    padding: 24
                  }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                      <GraduationCap size={18} color="#a78bfa" /> Education
                    </h3>
                    
                    {resumeData.education.map((edu, idx) => (
                      <div key={idx} style={{
                        background: "rgba(255,255,255,0.05)",
                        borderRadius: 12,
                        padding: 12,
                        marginBottom: 12,
                        position: "relative"
                      }}>
                        <button
                          onClick={() => removeEducation(idx)}
                          style={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            background: "rgba(255,75,110,0.1)",
                            border: "none",
                            borderRadius: 6,
                            padding: 4,
                            cursor: "pointer",
                            color: "#ff4b6e"
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                        <p style={{ fontWeight: 700, color: "#fff" }}>{edu.degree} - {edu.institution}</p>
                        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{edu.year} | CGPA: {edu.cgpa}</p>
                      </div>
                    ))}
                    
                    <div style={{ display: "grid", gap: 12 }}>
                      <input
                        type="text"
                        placeholder="Institution Name"
                        value={newEducation.institution}
                        onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                        style={{
                          padding: "12px",
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: 10,
                          color: "#fff",
                          outline: "none"
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Degree / Course"
                        value={newEducation.degree}
                        onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                        style={{
                          padding: "12px",
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: 10,
                          color: "#fff",
                          outline: "none"
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Year of Graduation"
                        value={newEducation.year}
                        onChange={(e) => setNewEducation({ ...newEducation, year: e.target.value })}
                        style={{
                          padding: "12px",
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: 10,
                          color: "#fff",
                          outline: "none"
                        }}
                      />
                      <input
                        type="text"
                        placeholder="CGPA / Percentage"
                        value={newEducation.cgpa}
                        onChange={(e) => setNewEducation({ ...newEducation, cgpa: e.target.value })}
                        style={{
                          padding: "12px",
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: 10,
                          color: "#fff",
                          outline: "none"
                        }}
                      />
                      <button
                        onClick={addEducation}
                        style={{
                          padding: "10px",
                          background: "rgba(0,255,163,0.1)",
                          border: "1px solid rgba(0,255,163,0.3)",
                          borderRadius: 10,
                          color: "#00ffa3",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 6
                        }}
                      >
                        <Plus size={16} /> Add Education
                      </button>
                    </div>
                  </div>

                  {/* Skills */}
                  <div style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 20,
                    padding: 24
                  }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                      <Zap size={18} color="#fbbf24" /> Technical Skills
                    </h3>
                    
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                      {resumeData.skills.map((skill, idx) => (
                        <span key={idx} style={{
                          background: "rgba(0,255,163,0.1)",
                          border: "1px solid rgba(0,255,163,0.3)",
                          borderRadius: 20,
                          padding: "5px 12px",
                          fontSize: 12,
                          color: "#00ffa3",
                          display: "flex",
                          alignItems: "center",
                          gap: 6
                        }}>
                          {skill}
                          <X size={12} style={{ cursor: "pointer" }} onClick={() => removeSkill(idx)} />
                        </span>
                      ))}
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
                          padding: "12px",
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: 10,
                          color: "#fff",
                          outline: "none"
                        }}
                      />
                      <button
                        onClick={addSkill}
                        style={{
                          padding: "10px 20px",
                          background: "rgba(0,255,163,0.1)",
                          border: "1px solid rgba(0,255,163,0.3)",
                          borderRadius: 10,
                          color: "#00ffa3",
                          cursor: "pointer"
                        }}
                      >
                        Add
                      </button>
                    </div>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 8 }}>
                      💡 Add skills relevant to your target job role
                    </p>
                  </div>
                </motion.div>
              )}

              {activeTab === "templates" && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}
                >
                  {Object.entries(TEMPLATES).map(([key, template]) => (
                    <div
                      key={key}
                      onClick={() => setSelectedTemplate(key)}
                      style={{
                        cursor: "pointer",
                        background: selectedTemplate === key ? `linear-gradient(135deg, ${template.style.accent}20, rgba(255,255,255,0.03))` : "rgba(255,255,255,0.03)",
                        border: selectedTemplate === key ? `2px solid ${template.style.accent}` : "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 16,
                        padding: 20,
                        transition: "all 0.3s ease"
                      }}
                    >
                      <div style={{
                        height: 200,
                        background: template.preview,
                        borderRadius: 12,
                        marginBottom: 16,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: 14,
                        fontWeight: 600
                      }}>
                        {template.name} Template
                      </div>
                      <h4 style={{ color: "#fff", marginBottom: 4 }}>{template.name}</h4>
                      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Professional & ATS-friendly</p>
                      {selectedTemplate === key && (
                        <div style={{ marginTop: 12, color: template.style.accent, fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
                          <Check size={14} /> Selected
                        </div>
                      )}
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === "ats" && atsScore && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 20,
                    padding: 24
                  }}
                >
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                    <Target size={18} color="#00ffa3" /> ATS Score Analysis
                  </h3>
                  
                  {/* Score Circle */}
                  <div style={{ textAlign: "center", marginBottom: 30 }}>
                    <div style={{
                      width: 150,
                      height: 150,
                      margin: "0 auto",
                      position: "relative"
                    }}>
                      <svg width="150" height="150">
                        <circle cx="75" cy="75" r="65" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10"/>
                        <circle
                          cx="75" cy="75" r="65"
                          fill="none"
                          stroke={getATSScoreColor()}
                          strokeWidth="10"
                          strokeDasharray={`${2 * Math.PI * 65 * (atsScore.overall / 100)} ${2 * Math.PI * 65}`}
                          strokeLinecap="round"
                          transform="rotate(-90 75 75)"
                          style={{ transition: "stroke-dasharray 1s ease" }}
                        />
                      </svg>
                      <div style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        textAlign: "center"
                      }}>
                        <span style={{ fontSize: 36, fontWeight: 800, color: getATSScoreColor() }}>{atsScore.overall}</span>
                        <span style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>/100</span>
                      </div>
                    </div>
                    <div style={{
                      display: "inline-block",
                      marginTop: 12,
                      padding: "4px 12px",
                      background: `${getATSScoreColor()}20`,
                      borderRadius: 20,
                      color: getATSScoreColor(),
                      fontSize: 12,
                      fontWeight: 600
                    }}>
                      {atsScore.level}
                    </div>
                  </div>

                  {/* Score Breakdown */}
                  <div style={{ marginBottom: 24 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 12 }}>Score Breakdown</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>Resume Completeness</span>
                          <span style={{ fontSize: 12, color: "#00ffa3" }}>{Math.round(atsScore.sections.completeness)}%</span>
                        </div>
                        <div style={{ height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ width: `${atsScore.sections.completeness}%`, height: "100%", background: "#00ffa3", borderRadius: 3 }} />
                        </div>
                      </div>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>Keyword Optimization</span>
                          <span style={{ fontSize: 12, color: "#00c9ff" }}>{Math.round(atsScore.sections.keywordMatch)}%</span>
                        </div>
                        <div style={{ height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ width: `${atsScore.sections.keywordMatch}%`, height: "100%", background: "#00c9ff", borderRadius: 3 }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Keywords Found */}
                  <div style={{ marginBottom: 24 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 12 }}>Keywords Detected</h4>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {atsScore.keywords.map((keyword, idx) => (
                        <span key={idx} style={{
                          background: "rgba(0,255,163,0.1)",
                          border: "1px solid rgba(0,255,163,0.3)",
                          borderRadius: 20,
                          padding: "4px 10px",
                          fontSize: 11,
                          color: "#00ffa3"
                        }}>
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Suggestions */}
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 12 }}>Improvement Suggestions</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {atsScore.suggestions.map((suggestion, idx) => (
                        <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8, padding: 8, background: "rgba(255,75,110,0.05)", borderRadius: 8 }}>
                          <AlertCircle size={14} color="#ff4b6e" />
                          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{suggestion}</span>
                        </div>
                      ))}
                      {atsScore.suggestions.length === 0 && (
                        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: 8, background: "rgba(0,255,163,0.05)", borderRadius: 8 }}>
                          <Check size={14} color="#00ffa3" />
                          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>Your resume looks great! Ready for applications.</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right Panel - Preview */}
            <div style={{ position: "sticky", top: 20, height: "fit-content" }}>
              <div style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 20,
                overflow: "hidden"
              }}>
                <div style={{
                  padding: 16,
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: "#fff", display: "flex", alignItems: "center", gap: 6 }}>
                    <Eye size={14} color="#00ffa3" /> Live Preview
                  </h3>
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    style={{
                      padding: "4px 12px",
                      background: "rgba(0,255,163,0.1)",
                      border: "1px solid rgba(0,255,163,0.3)",
                      borderRadius: 6,
                      color: "#00ffa3",
                      fontSize: 11,
                      cursor: "pointer"
                    }}
                  >
                    {showPreview ? "Hide" : "Show"} Preview
                  </button>
                </div>
                
                {showPreview && (
                  <div style={{ padding: 20, maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
                    {/* Resume Preview */}
                    <div style={{
                      background: "#fff",
                      borderRadius: 12,
                      padding: 24,
                      color: "#333",
                      fontFamily: TEMPLATES[selectedTemplate].style.font
                    }}>
                      {/* Header */}
                      <div style={{
                        background: TEMPLATES[selectedTemplate].style.headerBg,
                        margin: "-24px -24px 20px -24px",
                        padding: "24px",
                        color: "#fff"
                      }}>
                        <h1 style={{ fontSize: 28, marginBottom: 4 }}>{resumeData.personal.name || "Your Name"}</h1>
                        <p style={{ fontSize: 14, opacity: 0.9 }}>{resumeData.personal.title || "Professional Title"}</p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 12, fontSize: 11 }}>
                          {resumeData.personal.email && <span>{resumeData.personal.email}</span>}
                          {resumeData.personal.phone && <span>{resumeData.personal.phone}</span>}
                          {resumeData.personal.location && <span>{resumeData.personal.location}</span>}
                        </div>
                      </div>
                      
                      {/* Summary */}
                      {resumeData.summary && (
                        <div style={{ marginBottom: 16 }}>
                          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: TEMPLATES[selectedTemplate].style.accent }}>Professional Summary</h3>
                          <p style={{ fontSize: 12, lineHeight: 1.5 }}>{resumeData.summary}</p>
                        </div>
                      )}
                      
                      {/* Experience */}
                      {resumeData.experience.length > 0 && (
                        <div style={{ marginBottom: 16 }}>
                          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: TEMPLATES[selectedTemplate].style.accent }}>Work Experience</h3>
                          {resumeData.experience.map((exp, idx) => (
                            <div key={idx} style={{ marginBottom: 12 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                                <strong style={{ fontSize: 13 }}>{exp.role}</strong>
                                <span style={{ fontSize: 11, color: "#666" }}>{exp.duration}</span>
                              </div>
                              <p style={{ fontSize: 12, color: "#666", marginBottom: 2 }}>{exp.company}</p>
                              <p style={{ fontSize: 11, lineHeight: 1.4 }}>{exp.description}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Education */}
                      {resumeData.education.length > 0 && (
                        <div style={{ marginBottom: 16 }}>
                          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: TEMPLATES[selectedTemplate].style.accent }}>Education</h3>
                          {resumeData.education.map((edu, idx) => (
                            <div key={idx} style={{ marginBottom: 8 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                                <strong style={{ fontSize: 13 }}>{edu.degree}</strong>
                                <span style={{ fontSize: 11, color: "#666" }}>{edu.year}</span>
                              </div>
                              <p style={{ fontSize: 12, color: "#666" }}>{edu.institution}</p>
                              {edu.cgpa && <p style={{ fontSize: 11 }}>CGPA: {edu.cgpa}</p>}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Skills */}
                      {resumeData.skills.length > 0 && (
                        <div>
                          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: TEMPLATES[selectedTemplate].style.accent }}>Skills</h3>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {resumeData.skills.map((skill, idx) => (
                              <span key={idx} style={{
                                background: `${TEMPLATES[selectedTemplate].style.accent}20`,
                                padding: "4px 10px",
                                borderRadius: 20,
                                fontSize: 11
                              }}>
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}