import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Download, Eye, Edit2, Trash2, Plus, 
  X, Check, AlertCircle, Target, 
  FileText, User, Briefcase, GraduationCap,
  Sparkles, FileCheck, Layout, Sparkle, Lock, Crown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ... (keep all your existing TEMPLATES, analyzeATS function, etc.)

export default function ResumeBuilder() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("build");
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [showPreview, setShowPreview] = useState(true);
  const [atsScore, setAtsScore] = useState(null);
  const [animateScore, setAnimateScore] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [subscription, setSubscription] = useState(null);
  
  const previewRef = useRef(null);
  
  // ... (keep all your existing state and functions)

  // Check subscription status on mount
  useEffect(() => {
    const subscriptionPlan = localStorage.getItem("subscriptionPlan");
    const subscriptionStatus = localStorage.getItem("subscriptionStatus");
    
    if (subscriptionStatus === "active") {
      setSubscription({
        plan: subscriptionPlan || "free",
        status: "active"
      });
    } else {
      setSubscription({
        plan: "free",
        status: "active"
      });
    }
  }, []);

  // Check if user has pro access
  const isPro = () => {
    return subscription?.plan !== "free" && subscription?.status === "active";
  };

  // Modified exportPDF function with subscription check
  const exportPDF = () => {
    if (!isPro()) {
      setShowProModal(true);
      return;
    }
    
    // Pro feature - implement actual PDF export
    setIsExporting(true);
    setTimeout(() => {
      alert("PDF Export feature is available for Pro users!");
      setIsExporting(false);
    }, 1000);
  };

  // Pro Modal Component
  const ProModal = () => (
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
            background: "rgba(0,0,0,0.8)",
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
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            style={{
              background: "#fff",
              borderRadius: 28,
              maxWidth: 500,
              width: "100%",
              overflow: "hidden",
              position: "relative"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              padding: "32px",
              textAlign: "center",
              color: "#fff"
            }}>
              <div style={{
                width: 80,
                height: 80,
                background: "rgba(255,255,255,0.2)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px"
              }}>
                <Lock size={40} color="#fff" />
              </div>
              <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Pro Feature</h2>
              <p style={{ fontSize: 14, opacity: 0.9 }}>Upgrade to unlock premium resume features</p>
            </div>
            
            <div style={{ padding: "32px" }}>
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>✨ Pro Benefits:</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    "Export to PDF with professional templates",
                    "Multiple premium template designs",
                    "Advanced ATS optimization tips",
                    "Unlimited resume downloads",
                    "Priority support"
                  ].map((benefit, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 20, height: 20, background: "#10b981", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Check size={12} color="#fff" />
                      </div>
                      <span style={{ fontSize: 13, color: "#475569" }}>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div style={{ marginBottom: 24, padding: "16px", background: "#f8fafc", borderRadius: 16, textAlign: "center" }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 4 }}>
                  <span style={{ fontSize: 36, fontWeight: 800, color: "#6366f1" }}>$9</span>
                  <span style={{ fontSize: 14, color: "#64748b" }}>/month</span>
                </div>
                <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 8 }}>Cancel anytime • No questions asked</p>
              </div>
              
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
                    borderRadius: 12,
                    color: "#475569",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  Maybe Later
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowProModal(false);
                    navigate("/subscription");
                  }}
                  style={{
                    flex: 1,
                    padding: "14px",
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    border: "none",
                    borderRadius: 12,
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8
                  }}
                >
                  Upgrade Now →
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Subscription Badge Component
  const SubscriptionBadge = () => (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "6px 14px",
      background: !isPro() ? "#f1f5f9" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 600,
      color: !isPro() ? "#64748b" : "#fff",
      cursor: "pointer"
    }}
    onClick={() => navigate("/subscription")}
    >
      {!isPro() ? (
        <>
          <Lock size={12} /> Free Plan
        </>
      ) : (
        <>
          <Crown size={12} /> {subscription?.plan} Plan
        </>
      )}
    </div>
  );

  // ... (keep all your existing handlers and JSX)

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
              <SubscriptionBadge />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={downloadJSON}
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
              >
                <Download size={16} /> Save JSON
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={exportPDF}
                disabled={isExporting}
                style={{
                  padding: "8px 20px",
                  background: !isPro() ? "#cbd5e1" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  border: "none",
                  borderRadius: 10,
                  color: !isPro() ? "#94a3b8" : "#fff",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: !isPro() ? "pointer" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  transition: "transform 0.2s, box-shadow 0.2s",
                  opacity: isExporting ? 0.7 : 1
                }}
              >
                {isExporting ? (
                  <div style={{ width: 16, height: 16, border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />
                ) : (
                  <FileText size={16} />
                )}
                Export PDF {!isPro() && "(Pro)"}
              </motion.button>
            </div>
          </div>

          {/* ... rest of your component remains the same ... */}
          
        </div>
      </div>

      <ProModal />
    </>
  );
}