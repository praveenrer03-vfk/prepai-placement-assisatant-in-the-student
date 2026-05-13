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
  Palette
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";



// Template Styles
const TEMPLATES = {
  modern: {
    name: "Modern",
    preview: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    style: {
      headerBg: "linear-gradient(135deg, #6366f1, #8b5cf6)",
      accent: "#6366f1",
      font: "'Inter', sans-serif",
      layout: "rounded"
    }
  },
  professional: {
    name: "Professional",
    preview: "linear-gradient(135deg, #1e293b, #3b82f6)",
    style: {
      headerBg: "#1e293b",
      accent: "#3b82f6",
      font: "'Roboto', sans-serif",
      layout: "sharp"
    }
  },
  creative: {
    name: "Creative",
    preview: "linear-gradient(135deg, #ec4899, #f43f5e)",
    style: {
      headerBg: "linear-gradient(135deg, #ec4899, #f43f5e)",
      accent: "#ec4899",
      font: "'Poppins', sans-serif",
      layout: "rounded"
    }
  },
  minimalist: {
    name: "Minimalist",
    preview: "#0f172a",
    style: {
      headerBg: "#0f172a",
      accent: "#64748b",
      font: "'Inter', sans-serif",
      layout: "sharp"
    }
  }
};

// ATS Analyzer
const analyzeATS = (resumeData) => {
  const scores = {
    overall: 0,
    sections: {},
    keywords: [],
    suggestions: []
  };

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

  const commonKeywords = [
    "JavaScript", "React", "Python", "Java", "Node.js", "MongoDB",
    "Leadership", "Team Management", "Agile", "Communication",
    "Problem Solving", "Project Management", "HTML", "CSS", "API"
  ];
  
  const allText = JSON.stringify(resumeData).toLowerCase();
  scores.keywords = commonKeywords.filter(keyword => 
    allText.includes(keyword.toLowerCase())
  );
  
  scores.sections.keywordMatch = (scores.keywords.length / commonKeywords.length) * 100;
  scores.overall = Math.round((scores.sections.completeness * 0.5) + (scores.sections.keywordMatch * 0.5));
  scores.level = scores.overall >= 80 ? "Excellent" : scores.overall >= 60 ? "Good" : "Needs Improvement";
  scores.color = scores.overall >= 80 ? "#10b981" : scores.overall >= 60 ? "#f59e0b" : "#ef4444";

  return scores;
};

export default function ResumeBuilder() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("build");
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [showPreview, setShowPreview] = useState(true);
  const [atsScore, setAtsScore] = useState(null);
  const [isPro, setIsPro] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  
  const previewRef = useRef(null);
  
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

  // Form states
  const [newExperience, setNewExperience] = useState({ company: "", role: "", duration: "", description: "" });
  const [newEducation, setNewEducation] = useState({ institution: "", degree: "", year: "", cgpa: "" });
  const [newSkill, setNewSkill] = useState("");

  // Check subscription status
  useEffect(() => {
    const subscriptionPlan = localStorage.getItem("subscriptionPlan");
    const subscriptionStatus = localStorage.getItem("subscriptionStatus");
    
    if (subscriptionStatus === "active" && subscriptionPlan !== "free") {
      setIsPro(true);
    }
  }, []);

  // Load saved data
  useEffect(() => {
    const savedData = localStorage.getItem("resumeData");
    if (savedData) {
      try {
        setResumeData(JSON.parse(savedData));
      } catch (e) {
        console.error("Error loading saved resume:", e);
      }
    }
  }, []);

  // Save data automatically
  useEffect(() => {
    if (resumeData.personal.name || resumeData.experience.length > 0) {
      localStorage.setItem("resumeData", JSON.stringify(resumeData));
    }
  }, [resumeData]);

  // Update ATS score
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

  // Save JSON - FREE FEATURE
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

  // Export PDF - PRO FEATURE
  const exportPDF = () => {
    if (!isPro) {
      setShowProModal(true);
      return;
    }
    alert("PDF Export feature ready! Your resume will be downloaded as PDF.");
  };

  // Pro Upgrade Modal Component
  const ProUpgradeModal = () => (
    <AnimatePresence>
      {showProModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(8px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}
          onClick={() => setShowProModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            style={{
              background: "#fff",
              borderRadius: 32,
              maxWidth: 500,
              width: "100%",
              overflow: "hidden",
              position: "relative"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: "linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899, #6366f1)",
              backgroundSize: "200%",
              animation: "gradient 3s linear infinite"
            }} />
            
            <div style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              padding: "32px",
              textAlign: "center",
              color: "#fff",
              position: "relative"
            }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                style={{
                  width: 80,
                  height: 80,
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                  border: "2px solid rgba(255,255,255,0.3)"
                }}
              >
                <Crown size={40} color="#fff" />
              </motion.div>
              <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Upgrade to Pro</h2>
              <p style={{ fontSize: 14, opacity: 0.95 }}>Unlock premium features for your resume</p>
            </div>
            
            <div style={{ padding: "32px" }}>
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>
                  ✨ Pro Features Include:
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    { icon: "📄", text: "Export to PDF with professional templates" },
                    { icon: "🎨", text: "Access all premium template designs" },
                    { icon: "📊", text: "Advanced ATS optimization tips" },
                    { icon: "🔄", text: "Unlimited resume downloads" },
                    { icon: "⭐", text: "Priority customer support" },
                    { icon: "🚀", text: "AI-powered improvement suggestions" }
                  ].map((benefit, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <div style={{
                        width: 28,
                        height: 28,
                        background: "#f0fdf4",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <span style={{ fontSize: 14 }}>{benefit.icon}</span>
                      </div>
                      <span style={{ fontSize: 13, color: "#475569" }}>{benefit.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                style={{
                  marginBottom: 24,
                  padding: "20px",
                  background: "linear-gradient(135deg, #f8fafc, #f1f5f9)",
                  borderRadius: 20,
                  textAlign: "center"
                }}
              >
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 4 }}>
                  <span style={{ fontSize: 48, fontWeight: 800, color: "#6366f1" }}>$9</span>
                  <span style={{ fontSize: 16, color: "#64748b" }}>/month</span>
                </div>
                <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 8 }}>
                  Cancel anytime • 14-day money-back guarantee
                </p>
                <div style={{
                  display: "inline-block",
                  marginTop: 12,
                  padding: "4px 12px",
                  background: "#fee2e2",
                  borderRadius: 20,
                  fontSize: 11,
                  color: "#ef4444",
                  fontWeight: 600
                }}>
                  🎉 Limited Time: Save 20% on yearly plan
                </div>
              </motion.div>
              
              <div style={{ display: "flex", gap: 12 }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowProModal(false)}
                  style={{
                    flex: 1,
                    padding: "14px",
                    background: "#f1f5f9",
                    border: "none",
                    borderRadius: 16,
                    color: "#475569",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  Maybe Later
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowProModal(false);
                    navigate("/payment");
                  }}
                  style={{
                    flex: 1,
                    padding: "14px",
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    border: "none",
                    borderRadius: 16,
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    boxShadow: "0 4px 15px rgba(99,102,241,0.3)"
                  }}
                >
                  <CreditCard size={16} /> Upgrade Now
                </motion.button>
              </div>
              
              <p style={{
                fontSize: 11,
                color: "#94a3b8",
                textAlign: "center",
                marginTop: 16
              }}>
                🔒 Secure payment powered by Stripe
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Subscription Badge Component
  const SubscriptionBadge = () => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 14px",
        background: !isPro ? "#f1f5f9" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 600,
        color: !isPro ? "#64748b" : "#fff",
        cursor: "pointer"
      }}
      onClick={() => !isPro && setShowProModal(true)}
    >
      {!isPro ? (
        <>
          <Lock size={12} /> Free Plan - Click to Upgrade
        </>
      ) : (
        <>
          <Crown size={12} /> Pro Plan Active
        </>
      )}
    </motion.div>
  );

  // Resume Preview Component
  const ResumePreview = () => {
    const template = TEMPLATES[selectedTemplate];
    
    return (
      <div ref={previewRef} style={{
        background: "#fff",
        padding: "40px",
        color: "#1e293b",
        fontFamily: template.style.font,
        maxWidth: "800px",
        margin: "0 auto",
        borderRadius: template.style.layout === "rounded" ? "16px" : "0px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
      }}>
        <div style={{
          background: template.style.headerBg,
          margin: "-40px -40px 30px -40px",
          padding: "40px",
          color: "#fff",
          borderRadius: template.style.layout === "rounded" ? "16px 16px 0 0" : "0"
        }}>
          <h1 style={{ fontSize: "32px", marginBottom: "10px", fontWeight: 800 }}>
            {resumeData.personal.name || "Your Name"}
          </h1>
          <p style={{ fontSize: "16px", opacity: 0.9 }}>
            {resumeData.personal.title || "Professional Title"}
          </p>
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
            <p style={{ fontSize: "14px", lineHeight: 1.6, color: "#475569" }}>{resumeData.summary}</p>
          </div>
        )}
        
        {resumeData.experience.length > 0 && (
          <div style={{ marginBottom: "25px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "15px", color: template.style.accent, borderLeft: `3px solid ${template.style.accent}`, paddingLeft: "12px" }}>
              Work Experience
            </h3>
            {resumeData.experience.map((exp, idx) => (
              <div key={idx} style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
                  <strong style={{ fontSize: "16px", color: "#0f172a" }}>{exp.role}</strong>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>{exp.duration}</span>
                </div>
                <p style={{ fontSize: "13px", color: "#475569", marginBottom: "8px", fontWeight: 500 }}>{exp.company}</p>
                <p style={{ fontSize: "13px", lineHeight: 1.5, color: "#64748b" }}>{exp.description}</p>
              </div>
            ))}
          </div>
        )}
        
        {resumeData.education.length > 0 && (
          <div style={{ marginBottom: "25px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "15px", color: template.style.accent, borderLeft: `3px solid ${template.style.accent}`, paddingLeft: "12px" }}>
              Education
            </h3>
            {resumeData.education.map((edu, idx) => (
              <div key={idx} style={{ marginBottom: "15px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
                  <strong style={{ fontSize: "16px", color: "#0f172a" }}>{edu.degree}</strong>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>{edu.year}</span>
                </div>
                <p style={{ fontSize: "13px", color: "#475569" }}>{edu.institution}</p>
                {edu.cgpa && <p style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>CGPA: {edu.cgpa}</p>}
              </div>
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
                <span key={idx} style={{
                  background: `${template.style.accent}15`,
                  color: template.style.accent,
                  padding: "6px 14px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: 500
                }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Build Form Component
  const BuildForm = () => (
    <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
      {/* Form Section */}
      <div style={{ flex: 1, maxHeight: "calc(100vh - 200px)", overflowY: "auto", paddingRight: 16 }}>
        {/* Personal Information */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 24, marginBottom: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <User size={24} color="#6366f1" />
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>Personal Information</h3>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
            <input type="text" placeholder="Full Name" value={resumeData.personal.name} onChange={(e) => updatePersonalInfo("name", e.target.value)}
              style={{ padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 14 }} />
            <input type="text" placeholder="Professional Title" value={resumeData.personal.title} onChange={(e) => updatePersonalInfo("title", e.target.value)}
              style={{ padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 14 }} />
            <input type="email" placeholder="Email" value={resumeData.personal.email} onChange={(e) => updatePersonalInfo("email", e.target.value)}
              style={{ padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 14 }} />
            <input type="tel" placeholder="Phone" value={resumeData.personal.phone} onChange={(e) => updatePersonalInfo("phone", e.target.value)}
              style={{ padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 14 }} />
            <input type="text" placeholder="Location" value={resumeData.personal.location} onChange={(e) => updatePersonalInfo("location", e.target.value)}
              style={{ padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 14 }} />
            <input type="text" placeholder="LinkedIn URL" value={resumeData.personal.linkedin} onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
              style={{ padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 14 }} />
          </div>
        </div>

        {/* Professional Summary */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 24, marginBottom: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <FileText size={24} color="#6366f1" />
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>Professional Summary</h3>
          </div>
          <textarea rows={4} placeholder="Write a brief summary of your professional background, key achievements, and career goals..." value={resumeData.summary} onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
            style={{ width: "100%", padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 14, fontFamily: "inherit", resize: "vertical" }} />
        </div>

        {/* Work Experience */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 24, marginBottom: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <Briefcase size={24} color="#6366f1" />
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>Work Experience</h3>
          </div>
          
          {resumeData.experience.map((exp, idx) => (
            <div key={idx} style={{ background: "#f8fafc", padding: 16, borderRadius: 12, marginBottom: 12, position: "relative" }}>
              <button onClick={() => removeExperience(idx)} style={{ position: "absolute", top: 12, right: 12, background: "none", border: "none", cursor: "pointer" }}>
                <X size={16} color="#ef4444" />
              </button>
              <p style={{ fontWeight: 700, marginBottom: 4 }}>{exp.role} at {exp.company}</p>
              <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>{exp.duration}</p>
              <p style={{ fontSize: 13, color: "#475569" }}>{exp.description}</p>
            </div>
          ))}
          
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input type="text" placeholder="Company Name" value={newExperience.company} onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
              style={{ padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 14 }} />
            <input type="text" placeholder="Role / Position" value={newExperience.role} onChange={(e) => setNewExperience({ ...newExperience, role: e.target.value })}
              style={{ padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 14 }} />
            <input type="text" placeholder="Duration (e.g., Jan 2020 - Present)" value={newExperience.duration} onChange={(e) => setNewExperience({ ...newExperience, duration: e.target.value })}
              style={{ padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 14 }} />
            <textarea rows={3} placeholder="Description of responsibilities and achievements..." value={newExperience.description} onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
              style={{ padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 14, resize: "vertical" }} />
            <button onClick={addExperience} style={{ padding: "12px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <Plus size={16} /> Add Experience
            </button>
          </div>
        </div>

        {/* Education */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 24, marginBottom: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <GraduationCap size={24} color="#6366f1" />
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>Education</h3>
          </div>
          
          {resumeData.education.map((edu, idx) => (
            <div key={idx} style={{ background: "#f8fafc", padding: 16, borderRadius: 12, marginBottom: 12, position: "relative" }}>
              <button onClick={() => removeEducation(idx)} style={{ position: "absolute", top: 12, right: 12, background: "none", border: "none", cursor: "pointer" }}>
                <X size={16} color="#ef4444" />
              </button>
              <p style={{ fontWeight: 700, marginBottom: 4 }}>{edu.degree}</p>
              <p style={{ fontSize: 13, color: "#475569", marginBottom: 4 }}>{edu.institution}</p>
              <p style={{ fontSize: 12, color: "#64748b" }}>{edu.year} {edu.cgpa && `• CGPA: ${edu.cgpa}`}</p>
            </div>
          ))}
          
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input type="text" placeholder="Institution Name" value={newEducation.institution} onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
              style={{ padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 14 }} />
            <input type="text" placeholder="Degree / Certification" value={newEducation.degree} onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
              style={{ padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 14 }} />
            <input type="text" placeholder="Year of Graduation" value={newEducation.year} onChange={(e) => setNewEducation({ ...newEducation, year: e.target.value })}
              style={{ padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 14 }} />
            <input type="text" placeholder="CGPA (optional)" value={newEducation.cgpa} onChange={(e) => setNewEducation({ ...newEducation, cgpa: e.target.value })}
              style={{ padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 14 }} />
            <button onClick={addEducation} style={{ padding: "12px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <Plus size={16} /> Add Education
            </button>
          </div>
        </div>

        {/* Skills */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 24, marginBottom: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <Code2 size={24} color="#6366f1" />
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>Skills</h3>
          </div>
          
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
            {resumeData.skills.map((skill, idx) => (
              <span key={idx} style={{ background: "#e0e7ff", color: "#6366f1", padding: "6px 12px", borderRadius: 20, fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 8 }}>
                {skill}
                <button onClick={() => removeSkill(idx)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
                  <X size={14} color="#6366f1" />
                </button>
              </span>
            ))}
          </div>
          
          <div style={{ display: "flex", gap: 12 }}>
            <input type="text" placeholder="Add a skill (e.g., React, Python)" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyPress={(e) => e.key === "Enter" && addSkill()}
              style={{ flex: 1, padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 14 }} />
            <button onClick={addSkill} style={{ padding: "12px 24px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 12, fontWeight: 600, cursor: "pointer" }}>
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      {showPreview && (
        <div style={{ flex: 1, position: "sticky", top: 24, maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Live Preview</h3>
            <button onClick={() => setShowPreview(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
              <X size={20} />
            </button>
          </div>
          <ResumePreview />
        </div>
      )}
    </div>
  );

  // Templates Section
  const TemplatesSection = () => (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, marginBottom: 32 }}>
        {Object.entries(TEMPLATES).map(([key, template]) => (
          <motion.div
            key={key}
            whileHover={{ y: -8 }}
            onClick={() => setSelectedTemplate(key)}
            style={{
              cursor: "pointer",
              borderRadius: 16,
              overflow: "hidden",
              border: selectedTemplate === key ? "2px solid #6366f1" : "1px solid #e2e8f0",
              transition: "all 0.3s"
            }}
          >
            <div style={{ height: 200, background: template.preview, position: "relative" }}>
              <div style={{ position: "absolute", bottom: 16, right: 16, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)", padding: "4px 12px", borderRadius: 20, color: "#fff", fontSize: 12 }}>
                {template.name}
              </div>
            </div>
            <div style={{ padding: 20, background: "#fff" }}>
              <h4 style={{ fontWeight: 700, marginBottom: 8 }}>{template.name} Template</h4>
              <p style={{ fontSize: 13, color: "#64748b", marginBottom: 12 }}>
                {template.name === "Modern" && "Clean & contemporary design with gradient accents"}
                {template.name === "Professional" && "Traditional corporate style for serious roles"}
                {template.name === "Creative" && "Bold & artistic for creative industries"}
                {template.name === "Minimalist" && "Simple, elegant & distraction-free"}
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
      
      {/* Template Preview */}
      <div style={{ background: "#fff", borderRadius: 16, padding: 24, marginTop: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Template Preview</h3>
        <ResumePreview />
      </div>
    </div>
  );

  // ATS Analysis Section
  const ATSSection = () => (
    <div>
      {/* ATS Score Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{
          background: "#fff",
          borderRadius: 24,
          padding: 32,
          marginBottom: 32,
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Target size={28} color="#6366f1" />
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a" }}>ATS Compatibility Score</h2>
          </div>
          <div style={{ padding: "8px 16px", background: `${atsScore?.color}15`, borderRadius: 12, color: atsScore?.color, fontWeight: 700 }}>
            {atsScore?.level}
          </div>
        </div>
        
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Overall Score</span>
            <span style={{ fontSize: 32, fontWeight: 800, color: atsScore?.color }}>
              {atsScore?.overall}%
            </span>
          </div>
          <div style={{ background: "#f1f5f9", borderRadius: 12, overflow: "hidden", height: 12 }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${atsScore?.overall}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{ height: "100%", background: atsScore?.color, borderRadius: 12 }}
            />
          </div>
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24, marginBottom: 32 }}>
          <div style={{ padding: 20, background: "#f8fafc", borderRadius: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: "#64748b" }}>Section Completeness</span>
              <span style={{ fontWeight: 700 }}>{Math.round(atsScore?.sections.completeness || 0)}%</span>
            </div>
            <div style={{ background: "#e2e8f0", borderRadius: 8, overflow: "hidden", height: 8 }}>
              <div style={{ width: `${atsScore?.sections.completeness || 0}%`, height: "100%", background: "#6366f1", borderRadius: 8 }} />
            </div>
          </div>
          <div style={{ padding: 20, background: "#f8fafc", borderRadius: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: "#64748b" }}>Keyword Match</span>
              <span style={{ fontWeight: 700 }}>{Math.round(atsScore?.sections.keywordMatch || 0)}%</span>
            </div>
            <div style={{ background: "#e2e8f0", borderRadius: 8, overflow: "hidden", height: 8 }}>
              <div style={{ width: `${atsScore?.sections.keywordMatch || 0}%`, height: "100%", background: "#10b981", borderRadius: 8 }} />
            </div>
          </div>
        </div>
        
        {/* Keywords Found */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>🔑 Keywords Detected</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {atsScore?.keywords.map((keyword, idx) => (
              <motion.span
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                style={{
                  background: "#e0e7ff",
                  color: "#6366f1",
                  padding: "6px 14px",
                  borderRadius: 20,
                  fontSize: 13,
                  fontWeight: 500
                }}
              >
                {keyword}
              </motion.span>
            ))}
          </div>
          {atsScore?.keywords.length === 0 && (
            <p style={{ color: "#94a3b8", fontStyle: "italic" }}>No keywords detected. Add more industry-specific terms to improve your score.</p>
          )}
        </div>
        
        {/* Suggestions */}
        {atsScore?.suggestions.length > 0 && (
          <div style={{ background: "#fef3c7", padding: 20, borderRadius: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: "#d97706" }}>💡 Suggestions to Improve</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {atsScore.suggestions.map((suggestion, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, fontSize: 13, color: "#92400e" }}
                >
                  <div style={{ width: 4, height: 4, background: "#d97706", borderRadius: "50%" }} />
                  {suggestion}
                </motion.li>
              ))}
            </ul>
          </div>
        )}
        
        {atsScore?.overall >= 80 && (
          <div style={{ background: "#d1fae5", padding: 16, borderRadius: 12, marginTop: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Trophy size={24} color="#10b981" />
              <div>
                <p style={{ fontWeight: 700, color: "#065f46" }}>Excellent! Your resume is well-optimized for ATS</p>
                <p style={{ fontSize: 13, color: "#065f46", marginTop: 4 }}>Your resume has a strong chance of passing through automated screening systems.</p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
      
      {/* Resume Preview with analysis */}
      <div style={{ background: "#fff", borderRadius: 24, padding: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Your Resume Preview</h3>
        <ResumePreview />
      </div>
    </div>
  );

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Roboto:wght@400;500;700&family=Poppins:wght@400;500;600;700;800&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { background: #f8fafc; font-family: 'Inter', sans-serif; }
          ::-webkit-scrollbar { width: 8px; }
          ::-webkit-scrollbar-track { background: #f1f5f9; }
          ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
          ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes slideIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px 32px" }}>
          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}
          >
            <button onClick={() => navigate("/dashboard")} style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "#fff",
              border: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateX(-4px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateX(0)"}>
              <ArrowLeft size={20} />
            </button>
            
            <div style={{ textAlign: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center" }}>
                <Sparkle size={28} fill="#6366f1" color="#6366f1" />
                <h1 style={{ fontSize: 32, fontWeight: 800, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Resume Builder
                </h1>
              </div>
              <p style={{ fontSize: 14, color: "#64748b", marginTop: 6 }}>
                Create ATS-friendly resume & get instant feedback
              </p>
            </div>
            
            <div style={{ display: "flex", gap: 12 }}>
              <SubscriptionBadge />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={downloadJSON}
                style={{
                  padding: "8px 20px",
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 12,
                  color: "#475569",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  transition: "all 0.2s"
                }}
              >
                <Download size={16} /> Save JSON
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={exportPDF}
                style={{
                  padding: "8px 20px",
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  border: "none",
                  borderRadius: 12,
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  boxShadow: "0 2px 4px rgba(99,102,241,0.2)"
                }}
              >
                <FileText size={16} /> Export PDF {!isPro && "(Pro)"}
              </motion.button>
            </div>
          </motion.div>

          {/* Save Success Message */}
          <AnimatePresence>
            {saved && (
              <motion.div
                initial={{ opacity: 0, y: -20, x: "-50%" }}
                animate={{ opacity: 1, y: 0, x: "-50%" }}
                exit={{ opacity: 0, y: -20, x: "-50%" }}
                style={{
                  position: "fixed",
                  top: 80,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "#10b981",
                  color: "#fff",
                  padding: "12px 24px",
                  borderRadius: 12,
                  zIndex: 100,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                }}
              >
                <Check size={18} /> Resume saved successfully!
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 32, borderBottom: "2px solid #e2e8f0" }}>
            {[
              { id: "build", label: "Build Resume", icon: <Edit2 size={16} /> },
              { id: "templates", label: "Templates", icon: <Palette size={16} /> },
              { id: "ats", label: "ATS Analysis", icon: <BarChart3 size={16} /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "12px 28px",
                  background: "transparent",
                  border: "none",
                  borderBottom: activeTab === tab.id ? "2px solid #6366f1" : "2px solid transparent",
                  color: activeTab === tab.id ? "#6366f1" : "#64748b",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: "-2px",
                  transition: "all 0.2s"
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
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