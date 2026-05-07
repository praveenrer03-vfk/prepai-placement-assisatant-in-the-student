import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Download, Eye, Edit2, Trash2, Plus, 
  X, Check, AlertCircle, Target, 
  FileText, User, Briefcase, GraduationCap,
  Sparkles, Layout, Sparkle, Lock, Crown,
  Save, CreditCard, Zap, Mail, Phone, MapPin, Linkedin, Globe,
  Award, Code, BookOpen, Calendar, Clock
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

  const requiredSections = ['personal', 'experience', 'education', 'skills', 'projects', 'certifications'];
  const presentSections = requiredSections.filter(section => {
    if (section === 'personal') return resumeData.personal?.name;
    return resumeData[section]?.length > 0;
  });
  scores.sections.completeness = (presentSections.length / requiredSections.length) * 100;

  if (!resumeData.personal?.name) scores.suggestions.push("Add your full name");
  if (!resumeData.personal?.email) scores.suggestions.push("Add email address");
  if (!resumeData.personal?.title) scores.suggestions.push("Add professional title");
  if (!resumeData.experience?.length) scores.suggestions.push("Add work experience");
  if (!resumeData.skills?.length) scores.suggestions.push("Add technical skills");
  if (!resumeData.summary) scores.suggestions.push("Add a professional summary");
  if (!resumeData.projects?.length) scores.suggestions.push("Add projects to showcase your work");
  if (!resumeData.certifications?.length) scores.suggestions.push("Add certifications to validate your skills");

  const commonKeywords = [
    "JavaScript", "React", "Python", "Java", "Node.js", "MongoDB",
    "Leadership", "Team Management", "Agile", "Communication",
    "Problem Solving", "Project Management", "HTML", "CSS", "API",
    "Machine Learning", "Cloud Computing", "DevOps", "AWS", "Docker"
  ];
  
  const allText = JSON.stringify(resumeData).toLowerCase();
  scores.keywords = commonKeywords.filter(keyword => 
    allText.includes(keyword.toLowerCase())
  );
  
  scores.sections.keywordMatch = (scores.keywords.length / commonKeywords.length) * 100;
  scores.overall = Math.round((scores.sections.completeness * 0.4) + (scores.sections.keywordMatch * 0.6));
  scores.level = scores.overall >= 80 ? "Excellent" : scores.overall >= 60 ? "Good" : "Needs Improvement";
  scores.color = scores.overall >= 80 ? "#6366f1" : scores.overall >= 60 ? "#f59e0b" : "#ef4444";

  return scores;
};

export default function ResumeBuilder() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("build");
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [showPreview, setShowPreview] = useState(true);
  const [atsScore, setAtsScore] = useState(null);
  const [animateScore, setAnimateScore] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [activeFormSection, setActiveFormSection] = useState("personal");
  
  const previewRef = useRef(null);
  
  // Resume Data State - Complete User Profile
  const [resumeData, setResumeData] = useState({
    personal: {
      name: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      portfolio: "",
      github: "",
      twitter: ""
    },
    summary: "",
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    projects: [],
    languages: [],
    achievements: [],
    interests: []
  });

  // Form states for adding entries
  const [newExperience, setNewExperience] = useState({ 
    company: "", 
    role: "", 
    duration: "", 
    description: "",
    achievements: ""
  });
  const [newEducation, setNewEducation] = useState({ 
    institution: "", 
    degree: "", 
    year: "", 
    cgpa: "",
    location: ""
  });
  const [newSkill, setNewSkill] = useState("");
  const [newProject, setNewProject] = useState({ 
    name: "", 
    description: "", 
    technologies: "",
    link: "",
    duration: ""
  });
  const [newCertification, setNewCertification] = useState({ 
    name: "", 
    issuer: "", 
    year: "",
    credentialId: ""
  });
  const [newLanguage, setNewLanguage] = useState({ name: "", proficiency: "" });
  const [newAchievement, setNewAchievement] = useState("");
  const [newInterest, setNewInterest] = useState("");

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
    setAnimateScore(true);
    const timer = setTimeout(() => setAnimateScore(false), 500);
    return () => clearTimeout(timer);
  }, [resumeData]);

  // Personal Information Handlers
  const updatePersonalInfo = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      personal: { ...prev.personal, [field]: value }
    }));
  };

  // Experience Handlers
  const addExperience = () => {
    if (newExperience.company && newExperience.role) {
      setResumeData(prev => ({
        ...prev,
        experience: [...prev.experience, { ...newExperience, id: Date.now() }]
      }));
      setNewExperience({ company: "", role: "", duration: "", description: "", achievements: "" });
    }
  };

  const removeExperience = (index) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  // Education Handlers
  const addEducation = () => {
    if (newEducation.institution && newEducation.degree) {
      setResumeData(prev => ({
        ...prev,
        education: [...prev.education, { ...newEducation, id: Date.now() }]
      }));
      setNewEducation({ institution: "", degree: "", year: "", cgpa: "", location: "" });
    }
  };

  const removeEducation = (index) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  // Skills Handlers
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

  // Projects Handlers
  const addProject = () => {
    if (newProject.name) {
      setResumeData(prev => ({
        ...prev,
        projects: [...prev.projects, { ...newProject, id: Date.now() }]
      }));
      setNewProject({ name: "", description: "", technologies: "", link: "", duration: "" });
    }
  };

  const removeProject = (index) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  // Certifications Handlers
  const addCertification = () => {
    if (newCertification.name) {
      setResumeData(prev => ({
        ...prev,
        certifications: [...prev.certifications, { ...newCertification, id: Date.now() }]
      }));
      setNewCertification({ name: "", issuer: "", year: "", credentialId: "" });
    }
  };

  const removeCertification = (index) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  // Languages Handlers
  const addLanguage = () => {
    if (newLanguage.name) {
      setResumeData(prev => ({
        ...prev,
        languages: [...prev.languages, { ...newLanguage, id: Date.now() }]
      }));
      setNewLanguage({ name: "", proficiency: "" });
    }
  };

  const removeLanguage = (index) => {
    setResumeData(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }));
  };

  // Achievements Handlers
  const addAchievement = () => {
    if (newAchievement) {
      setResumeData(prev => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement]
      }));
      setNewAchievement("");
    }
  };

  const removeAchievement = (index) => {
    setResumeData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  // Interests Handlers
  const addInterest = () => {
    if (newInterest) {
      setResumeData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest]
      }));
      setNewInterest("");
    }
  };

  const removeInterest = (index) => {
    setResumeData(prev => ({
      ...prev,
      interests: prev.interests.filter((_, i) => i !== index)
    }));
  };

  // Save JSON
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

  // Pro Upgrade Modal
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
              overflow: "hidden"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              padding: "32px",
              textAlign: "center",
              color: "#fff"
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
                  margin: "0 auto 20px"
                }}
              >
                <Crown size={40} color="#fff" />
              </motion.div>
              <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Upgrade to Pro</h2>
              <p style={{ fontSize: 14, opacity: 0.95 }}>Unlock premium features for your resume</p>
            </div>
            
            <div style={{ padding: "32px" }}>
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>✨ Pro Features:</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    "Export to PDF with professional templates",
                    "Access all premium template designs",
                    "Advanced ATS optimization tips",
                    "Unlimited resume downloads",
                    "Priority customer support",
                    "AI-powered improvement suggestions"
                  ].map((benefit, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 20, height: 20, background: "#10b981", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Check size={12} color="#fff" />
                      </div>
                      <span style={{ fontSize: 13, color: "#475569" }}>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div style={{ marginBottom: 24, padding: "20px", background: "#f8fafc", borderRadius: 20, textAlign: "center" }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 4 }}>
                  <span style={{ fontSize: 48, fontWeight: 800, color: "#6366f1" }}>$9</span>
                  <span style={{ fontSize: 16, color: "#64748b" }}>/month</span>
                </div>
                <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 8 }}>Cancel anytime • 14-day money-back guarantee</p>
              </div>
              
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={() => setShowProModal(false)} style={{ flex: 1, padding: "14px", background: "#f1f5f9", border: "none", borderRadius: 16, color: "#475569", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                  Maybe Later
                </button>
                <button onClick={() => { setShowProModal(false); navigate("/payment"); }} style={{ flex: 1, padding: "14px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", border: "none", borderRadius: 16, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <CreditCard size={16} /> Upgrade Now
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Subscription Badge
  const SubscriptionBadge = () => (
    <div style={{
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
    onClick={() => !isPro && setShowProModal(true)}>
      {!isPro ? <><Lock size={12} /> Free Plan</> : <><Crown size={12} /> Pro Plan</>}
    </div>
  );

  // Form Sections Navigation
  const formSections = [
    { id: "personal", label: "Personal Info", icon: <User size={16} /> },
    { id: "summary", label: "Summary", icon: <FileText size={16} /> },
    { id: "experience", label: "Experience", icon: <Briefcase size={16} /> },
    { id: "education", label: "Education", icon: <GraduationCap size={16} /> },
    { id: "skills", label: "Skills", icon: <Code size={16} /> },
    { id: "projects", label: "Projects", icon: <Zap size={16} /> },
    { id: "certifications", label: "Certifications", icon: <Award size={16} /> },
    { id: "languages", label: "Languages", icon: <BookOpen size={16} /> },
    { id: "achievements", label: "Achievements", icon: <Trophy size={16} /> },
    { id: "interests", label: "Interests", icon: <Sparkle size={16} /> }
  ];

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
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)"
      }}>
        {/* Header */}
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
          <p style={{ fontSize: "16px", opacity: 0.9, marginBottom: "16px" }}>
            {resumeData.personal.title || "Professional Title"}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", fontSize: "12px", opacity: 0.85 }}>
            {resumeData.personal.email && <span>✉️ {resumeData.personal.email}</span>}
            {resumeData.personal.phone && <span>📱 {resumeData.personal.phone}</span>}
            {resumeData.personal.location && <span>📍 {resumeData.personal.location}</span>}
            {resumeData.personal.linkedin && <span>🔗 LinkedIn</span>}
            {resumeData.personal.github && <span>💻 GitHub</span>}
          </div>
        </div>
        
        {/* Summary */}
        {resumeData.summary && (
          <div style={{ marginBottom: "25px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "12px", color: template.style.accent, borderLeft: `3px solid ${template.style.accent}`, paddingLeft: "12px" }}>
              Professional Summary
            </h3>
            <p style={{ fontSize: "14px", lineHeight: 1.6, color: "#475569" }}>{resumeData.summary}</p>
          </div>
        )}
        
        {/* Experience */}
        {resumeData.experience.length > 0 && (
          <div style={{ marginBottom: "25px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "15px", color: template.style.accent, borderLeft: `3px solid ${template.style.accent}`, paddingLeft: "12px" }}>
              Work Experience
            </h3>
            {resumeData.experience.map((exp, idx) => (
              <div key={idx} style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px", flexWrap: "wrap", gap: "8px" }}>
                  <strong style={{ fontSize: "16px", color: "#0f172a" }}>{exp.role}</strong>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>{exp.duration}</span>
                </div>
                <p style={{ fontSize: "13px", color: "#475569", marginBottom: "8px", fontWeight: 500 }}>{exp.company}</p>
                <p style={{ fontSize: "13px", lineHeight: 1.5, color: "#64748b" }}>{exp.description}</p>
                {exp.achievements && <p style={{ fontSize: "12px", color: "#6366f1", marginTop: "6px" }}>🏆 {exp.achievements}</p>}
              </div>
            ))}
          </div>
        )}
        
        {/* Education */}
        {resumeData.education.length > 0 && (
          <div style={{ marginBottom: "25px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "15px", color: template.style.accent, borderLeft: `3px solid ${template.style.accent}`, paddingLeft: "12px" }}>
              Education
            </h3>
            {resumeData.education.map((edu, idx) => (
              <div key={idx} style={{ marginBottom: "15px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px", flexWrap: "wrap", gap: "8px" }}>
                  <strong style={{ fontSize: "16px", color: "#0f172a" }}>{edu.degree}</strong>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>{edu.year}</span>
                </div>
                <p style={{ fontSize: "13px", color: "#475569" }}>{edu.institution}</p>
                {edu.cgpa && <p style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>CGPA: {edu.cgpa}</p>}
              </div>
            ))}
          </div>
        )}
        
        {/* Projects */}
        {resumeData.projects && resumeData.projects.length > 0 && (
          <div style={{ marginBottom: "25px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "15px", color: template.style.accent, borderLeft: `3px solid ${template.style.accent}`, paddingLeft: "12px" }}>
              Projects
            </h3>
            {resumeData.projects.map((project, idx) => (
              <div key={idx} style={{ marginBottom: "15px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
                  <strong style={{ fontSize: "14px", color: "#0f172a" }}>{project.name}</strong>
                  <span style={{ fontSize: "11px", color: "#64748b" }}>{project.duration}</span>
                </div>
                <p style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>{project.description}</p>
                {project.technologies && <p style={{ fontSize: "11px", color: "#6366f1", marginTop: "4px" }}>🔧 {project.technologies}</p>}
              </div>
            ))}
          </div>
        )}
        
        {/* Certifications */}
        {resumeData.certifications && resumeData.certifications.length > 0 && (
          <div style={{ marginBottom: "25px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "15px", color: template.style.accent, borderLeft: `3px solid ${template.style.accent}`, paddingLeft: "12px" }}>
              Certifications
            </h3>
            {resumeData.certifications.map((cert, idx) => (
              <div key={idx} style={{ marginBottom: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong style={{ fontSize: "13px", color: "#0f172a" }}>{cert.name}</strong>
                  <span style={{ fontSize: "11px", color: "#64748b" }}>{cert.year}</span>
                </div>
                <p style={{ fontSize: "12px", color: "#64748b" }}>{cert.issuer}</p>
              </div>
            ))}
          </div>
        )}
        
        {/* Skills */}
        {resumeData.skills.length > 0 && (
          <div style={{ marginBottom: "25px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "15px", color: template.style.accent, borderLeft: `3px solid ${template.style.accent}`, paddingLeft: "12px" }}>
              Technical Skills
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
        
        {/* Languages */}
        {resumeData.languages && resumeData.languages.length > 0 && (
          <div style={{ marginBottom: "25px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "15px", color: template.style.accent, borderLeft: `3px solid ${template.style.accent}`, paddingLeft: "12px" }}>
              Languages
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
              {resumeData.languages.map((lang, idx) => (
                <div key={idx}>
                  <strong style={{ fontSize: "13px", color: "#0f172a" }}>{lang.name}</strong>
                  <span style={{ fontSize: "11px", color: "#64748b", marginLeft: "6px" }}>({lang.proficiency})</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Achievements */}
        {resumeData.achievements && resumeData.achievements.length > 0 && (
          <div style={{ marginBottom: "25px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "15px", color: template.style.accent, borderLeft: `3px solid ${template.style.accent}`, paddingLeft: "12px" }}>
              Achievements
            </h3>
            <ul style={{ marginLeft: "20px" }}>
              {resumeData.achievements.map((achievement, idx) => (
                <li key={idx} style={{ fontSize: "13px", color: "#64748b", marginBottom: "6px" }}>{achievement}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Interests */}
        {resumeData.interests && resumeData.interests.length > 0 && (
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "15px", color: template.style.accent, borderLeft: `3px solid ${template.style.accent}`, paddingLeft: "12px" }}>
              Interests
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {resumeData.interests.map((interest, idx) => (
                <span key={idx} style={{
                  background: "#f1f5f9",
                  color: "#64748b",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "12px"
                }}>
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Form Section Components
  const renderFormSection = () => {
    switch(activeFormSection) {
      case "personal":
        return (
          <div style={{ display: "grid", gap: "20px" }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>Personal Information</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
              <input type="text" placeholder="Full Name *" value={resumeData.personal.name} onChange={(e) => updatePersonalInfo("name", e.target.value)} style={inputStyle} />
              <input type="text" placeholder="Professional Title *" value={resumeData.personal.title} onChange={(e) => updatePersonalInfo("title", e.target.value)} style={inputStyle} />
              <input type="email" placeholder="Email *" value={resumeData.personal.email} onChange={(e) => updatePersonalInfo("email", e.target.value)} style={inputStyle} />
              <input type="tel" placeholder="Phone" value={resumeData.personal.phone} onChange={(e) => updatePersonalInfo("phone", e.target.value)} style={inputStyle} />
              <input type="text" placeholder="Location" value={resumeData.personal.location} onChange={(e) => updatePersonalInfo("location", e.target.value)} style={inputStyle} />
              <input type="url" placeholder="LinkedIn URL" value={resumeData.personal.linkedin} onChange={(e) => updatePersonalInfo("linkedin", e.target.value)} style={inputStyle} />
              <input type="url" placeholder="GitHub URL" value={resumeData.personal.github} onChange={(e) => updatePersonalInfo("github", e.target.value)} style={inputStyle} />
              <input type="url" placeholder="Portfolio URL" value={resumeData.personal.portfolio} onChange={(e) => updatePersonalInfo("portfolio", e.target.value)} style={inputStyle} />
            </div>
          </div>
        );
      
      case "summary":
        return (
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>Professional Summary</h3>
            <textarea placeholder="Write a compelling professional summary highlighting your key strengths and career achievements..." value={resumeData.summary} onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))} rows="6" style={{ ...inputStyle, resize: "vertical", width: "100%" }} />
            <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 8 }}>Tip: Focus on your key achievements and what makes you unique (100-200 words recommended)</p>
          </div>
        );
      
      case "experience":
        return (
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>Work Experience</h3>
            {resumeData.experience.map((exp, idx) => (
              <div key={idx} style={{ background: "#f8fafc", borderRadius: 12, padding: 16, marginBottom: 12, position: "relative", border: "1px solid #e2e8f0" }}>
                <button onClick={() => removeExperience(idx)} style={{ position: "absolute", top: 12, right: 12, background: "#fee2e2", border: "none", borderRadius: 8, padding: 6, cursor: "pointer" }}><Trash2 size={14} color="#ef4444" /></button>
                <p style={{ fontWeight: 700 }}>{exp.role} at {exp.company}</p>
                <p style={{ fontSize: 12, color: "#64748b" }}>{exp.duration}</p>
                <p style={{ fontSize: 13, marginTop: 8 }}>{exp.description}</p>
              </div>
            ))}
            <div style={{ display: "grid", gap: 12 }}>
              <input type="text" placeholder="Company Name *" value={newExperience.company} onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })} style={inputStyle} />
              <input type="text" placeholder="Role / Position *" value={newExperience.role} onChange={(e) => setNewExperience({ ...newExperience, role: e.target.value })} style={inputStyle} />
              <input type="text" placeholder="Duration (e.g., Jan 2020 - Present)" value={newExperience.duration} onChange={(e) => setNewExperience({ ...newExperience, duration: e.target.value })} style={inputStyle} />
              <textarea placeholder="Key responsibilities and achievements" value={newExperience.description} onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })} rows="3" style={inputStyle} />
              <textarea placeholder="Key achievements (optional)" value={newExperience.achievements} onChange={(e) => setNewExperience({ ...newExperience, achievements: e.target.value })} rows="2" style={inputStyle} />
              <button onClick={addExperience} style={buttonStyle}><Plus size={18} /> Add Experience</button>
            </div>
          </div>
        );
      
      case "education":
        return (
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>Education</h3>
            {resumeData.education.map((edu, idx) => (
              <div key={idx} style={{ background: "#f8fafc", borderRadius: 12, padding: 16, marginBottom: 12, position: "relative", border: "1px solid #e2e8f0" }}>
                <button onClick={() => removeEducation(idx)} style={{ position: "absolute", top: 12, right: 12, background: "#fee2e2", border: "none", borderRadius: 8, padding: 6, cursor: "pointer" }}><Trash2 size={14} color="#ef4444" /></button>
                <p style={{ fontWeight: 700 }}>{edu.degree} - {edu.institution}</p>
                <p style={{ fontSize: 12, color: "#64748b" }}>{edu.year} | CGPA: {edu.cgpa}</p>
              </div>
            ))}
            <div style={{ display: "grid", gap: 12 }}>
              <input type="text" placeholder="Institution Name *" value={newEducation.institution} onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })} style={inputStyle} />
              <input type="text" placeholder="Degree / Course *" value={newEducation.degree} onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })} style={inputStyle} />
              <input type="text" placeholder="Year of Graduation" value={newEducation.year} onChange={(e) => setNewEducation({ ...newEducation, year: e.target.value })} style={inputStyle} />
              <input type="text" placeholder="CGPA / Percentage" value={newEducation.cgpa} onChange={(e) => setNewEducation({ ...newEducation, cgpa: e.target.value })} style={inputStyle} />
              <button onClick={addEducation} style={buttonStyle}><Plus size={18} /> Add Education</button>
            </div>
          </div>
        );
      
      case "skills":
        return (
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>Technical Skills</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
              {resumeData.skills.map((skill, idx) => (
                <span key={idx} style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: 24, padding: "6px 14px", fontSize: 12, color: "#fff", display: "flex", alignItems: "center", gap: 8 }}>
                  {skill} <X size={12} style={{ cursor: "pointer" }} onClick={() => removeSkill(idx)} />
                </span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <input type="text" placeholder="Add skill (e.g., JavaScript, React, Python)" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyPress={(e) => e.key === "Enter" && addSkill()} style={{ flex: 1, ...inputStyle }} />
              <button onClick={addSkill} style={{ ...buttonStyle, width: "auto", padding: "12px 24px" }}>Add</button>
            </div>
          </div>
        );
      
      case "projects":
        return (
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>Projects</h3>
            {resumeData.projects && resumeData.projects.map((project, idx) => (
              <div key={idx} style={{ background: "#f8fafc", borderRadius: 12, padding: 16, marginBottom: 12, position: "relative", border: "1px solid #e2e8f0" }}>
                <button onClick={() => removeProject(idx)} style={{ position: "absolute", top: 12, right: 12, background: "#fee2e2", border: "none", borderRadius: 8, padding: 6, cursor: "pointer" }}><Trash2 size={14} color="#ef4444" /></button>
                <p style={{ fontWeight: 700 }}>{project.name}</p>
                <p style={{ fontSize: 13, marginTop: 4 }}>{project.description}</p>
                {project.technologies && <p style={{ fontSize: 11, color: "#6366f1", marginTop: 4 }}>Tech: {project.technologies}</p>}
              </div>
            ))}
            <div style={{ display: "grid", gap: 12 }}>
              <input type="text" placeholder="Project Name *" value={newProject.name} onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} style={inputStyle} />
              <textarea placeholder="Project Description" value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} rows="3" style={inputStyle} />
              <input type="text" placeholder="Technologies Used (e.g., React, Node.js, MongoDB)" value={newProject.technologies} onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })} style={inputStyle} />
              <input type="text" placeholder="Project Link (GitHub/Live Demo)" value={newProject.link} onChange={(e) => setNewProject({ ...newProject, link: e.target.value })} style={inputStyle} />
              <input type="text" placeholder="Duration" value={newProject.duration} onChange={(e) => setNewProject({ ...newProject, duration: e.target.value })} style={inputStyle} />
              <button onClick={addProject} style={buttonStyle}><Plus size={18} /> Add Project</button>
            </div>
          </div>
        );
      
      case "certifications":
        return (
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>Certifications</h3>
            {resumeData.certifications && resumeData.certifications.map((cert, idx) => (
              <div key={idx} style={{ background: "#f8fafc", borderRadius: 12, padding: 16, marginBottom: 12, position: "relative", border: "1px solid #e2e8f0" }}>
                <button onClick={() => removeCertification(idx)} style={{ position: "absolute", top: 12, right: 12, background: "#fee2e2", border: "none", borderRadius: 8, padding: 6, cursor: "pointer" }}><Trash2 size={14} color="#ef4444" /></button>
                <p style={{ fontWeight: 700 }}>{cert.name}</p>
                <p style={{ fontSize: 13 }}>{cert.issuer} - {cert.year}</p>
              </div>
            ))}
            <div style={{ display: "grid", gap: 12 }}>
              <input type="text" placeholder="Certification Name *" value={newCertification.name} onChange={(e) => setNewCertification({ ...newCertification, name: e.target.value })} style={inputStyle} />
              <input type="text" placeholder="Issuing Organization" value={newCertification.issuer} onChange={(e) => setNewCertification({ ...newCertification, issuer: e.target.value })} style={inputStyle} />
              <input type="text" placeholder="Year of Certification" value={newCertification.year} onChange={(e) => setNewCertification({ ...newCertification, year: e.target.value })} style={inputStyle} />
              <input type="text" placeholder="Credential ID (optional)" value={newCertification.credentialId} onChange={(e) => setNewCertification({ ...newCertification, credentialId: e.target.value })} style={inputStyle} />
              <button onClick={addCertification} style={buttonStyle}><Plus size={18} /> Add Certification</button>
            </div>
          </div>
        );
      
      case "languages":
        return (
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>Languages</h3>
            {resumeData.languages && resumeData.languages.map((lang, idx) => (
              <div key={idx} style={{ background: "#f8fafc", borderRadius: 12, padding: 12, marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #e2e8f0" }}>
                <span><strong>{lang.name}</strong> - {lang.proficiency}</span>
                <button onClick={() => removeLanguage(idx)} style={{ background: "#fee2e2", border: "none", borderRadius: 6, padding: 4, cursor: "pointer" }}><Trash2 size={12} color="#ef4444" /></button>
              </div>
            ))}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 12 }}>
              <input type="text" placeholder="Language" value={newLanguage.name} onChange={(e) => setNewLanguage({ ...newLanguage, name: e.target.value })} style={inputStyle} />
              <select value={newLanguage.proficiency} onChange={(e) => setNewLanguage({ ...newLanguage, proficiency: e.target.value })} style={inputStyle}>
                <option value="">Proficiency</option>
                <option>Native</option>
                <option>Fluent</option>
                <option>Professional Working</option>
                <option>Limited Working</option>
                <option>Basic</option>
              </select>
              <button onClick={addLanguage} style={{ ...buttonStyle, width: "auto", padding: "12px 20px" }}>Add</button>
            </div>
          </div>
        );
      
      case "achievements":
        return (
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>Achievements</h3>
            <ul style={{ marginBottom: 16 }}>
              {resumeData.achievements && resumeData.achievements.map((achievement, idx) => (
                <li key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #e2e8f0" }}>
                  <span>{achievement}</span>
                  <button onClick={() => removeAchievement(idx)} style={{ background: "#fee2e2", border: "none", borderRadius: 6, padding: 4, cursor: "pointer" }}><Trash2 size={12} color="#ef4444" /></button>
                </li>
              ))}
            </ul>
            <div style={{ display: "flex", gap: 12 }}>
              <input type="text" placeholder="Add achievement (e.g., 'Won Hackathon 2023')" value={newAchievement} onChange={(e) => setNewAchievement(e.target.value)} onKeyPress={(e) => e.key === "Enter" && addAchievement()} style={{ flex: 1, ...inputStyle }} />
              <button onClick={addAchievement} style={{ ...buttonStyle, width: "auto", padding: "12px 24px" }}>Add</button>
            </div>
          </div>
        );
      
      case "interests":
        return (
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>Interests & Hobbies</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
              {resumeData.interests && resumeData.interests.map((interest, idx) => (
                <span key={idx} style={{ background: "#f1f5f9", borderRadius: 20, padding: "6px 14px", fontSize: 12, color: "#475569", display: "flex", alignItems: "center", gap: 8 }}>
                  {interest} <X size={12} style={{ cursor: "pointer" }} onClick={() => removeInterest(idx)} />
                </span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <input type="text" placeholder="Add interest (e.g., 'Photography', 'Chess', 'Reading')" value={newInterest} onChange={(e) => setNewInterest(e.target.value)} onKeyPress={(e) => e.key === "Enter" && addInterest()} style={{ flex: 1, ...inputStyle }} />
              <button onClick={addInterest} style={{ ...buttonStyle, width: "auto", padding: "12px 24px" }}>Add</button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const inputStyle = {
    padding: "12px 16px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    outline: "none",
    fontSize: 14,
    transition: "all 0.2s",
    fontFamily: "inherit"
  };

  const buttonStyle = {
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
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #f8fafc; font-family: 'Inter', sans-serif; }
        .resume-container { min-height: 100vh; background: #f8fafc; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: rgba(0,0,0,0.05); }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.2); border-radius: 3px; }
        input:focus, textarea:focus, select:focus { border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.1) !important; }
      `}</style>

      <div className="resume-container">
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px 32px" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
            <button onClick={() => navigate("/dashboard")} style={{ width: 40, height: 40, borderRadius: 12, background: "#fff", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <ArrowLeft size={20} />
            </button>
            
            <div style={{ textAlign: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                <Sparkle size={24} fill="#6366f1" color="#6366f1" />
                <h1 style={{ fontSize: 28, fontWeight: 800, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Resume Builder
                </h1>
              </div>
              <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>Create a complete professional resume</p>
            </div>
            
            <div style={{ display: "flex", gap: 12 }}>
              <SubscriptionBadge />
              <button onClick={downloadJSON} style={{ padding: "8px 20px", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, color: "#475569", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <Download size={16} /> Save JSON
              </button>
              <button onClick={exportPDF} style={{ padding: "8px 20px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", border: "none", borderRadius: 10, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <FileText size={16} /> Export PDF {!isPro && "(Pro)"}
              </button>
            </div>
          </div>

          {/* Save Success Message */}
          <AnimatePresence>
            {saved && (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                style={{ position: "fixed", top: 80, right: 32, background: "#10b981", color: "#fff", padding: "12px 20px", borderRadius: 12, zIndex: 100, display: "flex", alignItems: "center", gap: 8 }}>
                <Check size={16} /> Resume saved successfully!
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content - Two Columns */}
          <div style={{ display: "grid", gridTemplateColumns: "280px 1fr 400px", gap: 24 }}>
            {/* Left Sidebar - Form Navigation */}
            <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e2e8f0", padding: 20, height: "fit-content", position: "sticky", top: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 16, paddingBottom: 12, borderBottom: "2px solid #e2e8f0" }}>Resume Sections</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {formSections.map(section => (
                  <button key={section.id} onClick={() => setActiveFormSection(section.id)} style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: activeFormSection === section.id ? "#6366f115" : "transparent", border: "none", borderRadius: 12, color: activeFormSection === section.id ? "#6366f1" : "#64748b", fontSize: 13, fontWeight: activeFormSection === section.id ? 600 : 500, cursor: "pointer", width: "100%", textAlign: "left", transition: "all 0.2s"
                  }}>
                    {section.icon} {section.label}
                  </button>
                ))}
              </div>
              <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #e2e8f0" }}>
                <div style={{ background: "#6366f115", borderRadius: 12, padding: 12 }}>
                  <p style={{ fontSize: 11, color: "#6366f1", fontWeight: 600, marginBottom: 4 }}>ATS Score: {atsScore?.overall || 0}/100</p>
                  <div style={{ height: 4, background: "#e2e8f0", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ width: `${atsScore?.overall || 0}%`, height: "100%", background: atsScore?.color || "#6366f1", borderRadius: 2 }} />
                  </div>
                  <p style={{ fontSize: 10, color: "#64748b", marginTop: 8 }}>Complete all sections for better score</p>
                </div>
              </div>
            </div>

            {/* Middle Column - Form Content */}
            <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e2e8f0", padding: 28 }}>
              {renderFormSection()}
            </div>

            {/* Right Column - Live Preview */}
            <div style={{ position: "sticky", top: 24, height: "fit-content" }}>
              <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e2e8f0", overflow: "hidden" }}>
                <div style={{ padding: 16, borderBottom: "1px solid #e2e8f0", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}><Eye size={14} color="#6366f1" /> Live Preview</h3>
                  <select value={selectedTemplate} onChange={(e) => setSelectedTemplate(e.target.value)} style={{ padding: "6px 12px", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12, cursor: "pointer" }}>
                    {Object.entries(TEMPLATES).map(([key, template]) => <option key={key} value={key}>{template.name}</option>)}
                  </select>
                </div>
                <div style={{ padding: 24, maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
                  <ResumePreview />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProUpgradeModal />
    </>
  );
}