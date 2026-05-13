import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Mail, User, ShieldCheck, Award, Brain, Clock, TrendingUp, 
  Star, Zap, BarChart3, Target, CheckCircle, BookOpen, Edit2, Save, 
  X, Camera, Upload, Trash2, AlertCircle, Activity, Calendar
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [topicScores, setTopicScores] = useState([]);
  const [recentTests, setRecentTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "" });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activityLog, setActivityLog] = useState([]);
  
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Fetch user data from database
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      
      if (!token || !userId) {
        loadFromLocalStorage();
        return;
      }

      // Fetch user profile
      const profileResponse = await fetch(`https://prepai-placement-assisatant-in-the.onrender.com/api/user/profile/${userId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (profileResponse.ok) {
        const userData = await profileResponse.json();
        setUser(userData);
        setEditForm({ 
          name: userData.name, 
          email: userData.email 
        });
        
        if (userData.profilePhoto) {
          setProfilePhoto(userData.profilePhoto);
        }
        
        // Fetch user activity
        await fetchUserActivity(userId, token);
        
        // Save to localStorage as backup
        localStorage.setItem("user", JSON.stringify(userData));
        if (userData.profilePhoto) {
          localStorage.setItem("profilePhoto", userData.profilePhoto);
        }
      } else {
        loadFromLocalStorage();
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      loadFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  // Fetch user activity from database
  const fetchUserActivity = async (userId, token) => {
    try {
      const activityResponse = await fetch(`https://prepai-placement-assisatant-in-the.onrender.com/api/user/${userId}/activity`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      if (activityResponse.ok) {
        const activityData = await activityResponse.json();
        setActivityLog(activityData);
        localStorage.setItem("activityLog", JSON.stringify(activityData));
      }
    } catch (error) {
      console.error("Error fetching activity:", error);
      // Load from localStorage if API fails
      const savedActivity = localStorage.getItem("activityLog");
      if (savedActivity) {
        setActivityLog(JSON.parse(savedActivity));
      }
    }
  };

  // Log user activity
  const logActivity = async (action, details) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    
    if (!token || !userId) return;
    
    const activity = {
      userId,
      action,
      details,
      timestamp: new Date().toISOString()
    };
    
    try {
      await fetch(`https://prepai-placement-assisatant-in-the.onrender.com/api/user/activity`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(activity)
      });
      
      // Update local activity log
      setActivityLog(prev => [activity, ...prev].slice(0, 10));
    } catch (error) {
      console.error("Error logging activity:", error);
    }
  };

  const loadFromLocalStorage = () => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const statsData = JSON.parse(localStorage.getItem("stats") || '{"score":8.0,"attempts":12,"level":"Advanced"}');
    const topicData = JSON.parse(localStorage.getItem("topicScores") || '[]');
    const recentData = JSON.parse(localStorage.getItem("recentTests") || '[]');
    const savedPhoto = localStorage.getItem("profilePhoto") || null;
    const savedActivity = localStorage.getItem("activityLog") || '[]';
    
    setUser(userData.name ? userData : null);
    setStats(statsData);
    setTopicScores(topicData.length ? topicData : getDefaultTopicScores());
    setRecentTests(recentData.length ? recentData : getDefaultRecentTests());
    setProfilePhoto(savedPhoto);
    setActivityLog(JSON.parse(savedActivity));
    setEditForm({ 
      name: userData.name || "Guest User", 
      email: userData.email || "user@example.com" 
    });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const getDefaultTopicScores = () => [
    { name: "Time & Work", score: 85, attempts: 12, color: "#00ffa3" },
    { name: "Time & Distance", score: 72, attempts: 8, color: "#00c9ff" },
    { name: "Ratio", score: 90, attempts: 6, color: "#a78bfa" },
    { name: "Probability", score: 68, attempts: 10, color: "#ff4b6e" },
    { name: "Simple Interest", score: 78, attempts: 5, color: "#fbbf24" },
    { name: "Compound Interest", score: 65, attempts: 7, color: "#ec4899" },
    { name: "Number System", score: 82, attempts: 9, color: "#14b8a6" },
    { name: "Average", score: 75, attempts: 6, color: "#8b5cf6" },
    { name: "Mixture", score: 60, attempts: 4, color: "#f97316" }
  ];

  const getDefaultRecentTests = () => [
    { date: "2026-04-09", topic: "Time & Work", score: 85, total: 100, difficulty: "Medium" },
    { date: "2026-04-08", topic: "Probability", score: 68, total: 100, difficulty: "Hard" },
    { date: "2026-04-07", topic: "Ratio", score: 90, total: 100, difficulty: "Easy" },
    { date: "2026-04-06", topic: "Number System", score: 82, total: 100, difficulty: "Medium" }
  ];

  const handleSaveProfile = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      
      const updatedUser = { 
        name: editForm.name, 
        email: editForm.email,
        profilePhoto: profilePhoto,
        updatedAt: new Date().toISOString()
      };
      
      if (token && userId) {
        const response = await fetch(`https://prepai-placement-assisatant-in-the.onrender.com/api/user/profile/${userId}`, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(updatedUser)
        });
        
        if (response.ok) {
          const savedUser = await response.json();
          setUser(savedUser);
          setSuccess("Profile updated successfully!");
          
          // Log the activity
          await logActivity("profile_update", `Updated profile information`);
          
          setTimeout(() => setSuccess(""), 3000);
        } else {
          throw new Error("Failed to save to database");
        }
      }
      
      localStorage.setItem("user", JSON.stringify(updatedUser));
      if (profilePhoto) {
        localStorage.setItem("profilePhoto", profilePhoto);
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      setError("Failed to save profile. Please try again.");
      setTimeout(() => setError(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const compressedPhoto = await compressImage(file);
      
      const reader = new FileReader();
      reader.onloadend = async () => {
        const photoData = reader.result;
        setProfilePhoto(photoData);
        
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        
        if (token && userId) {
          try {
            const response = await fetch(`https://prepai-placement-assisatant-in-the.onrender.com/api/user/profile/${userId}/photo`, {
              method: "PUT",
              headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ profilePhoto: photoData })
            });
            
            if (response.ok) {
              setSuccess("Photo updated successfully!");
              await logActivity("photo_upload", "Updated profile photo");
              setTimeout(() => setSuccess(""), 3000);
            }
          } catch (error) {
            console.error("Error saving photo:", error);
          }
        }
        
        localStorage.setItem("profilePhoto", photoData);
        setShowPhotoOptions(false);
      };
      reader.readAsDataURL(compressedPhoto);
    }
  };

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          
          const maxWidth = 300;
          const maxHeight = 300;
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            resolve(new File([blob], file.name, { type: "image/jpeg" }));
          }, "image/jpeg", 0.7);
        };
      };
    });
  };

  const handleRemovePhoto = async () => {
    setProfilePhoto(null);
    
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    
    if (token && userId) {
      try {
        const response = await fetch(`https://prepai-placement-assisatant-in-the.onrender.com/api/user/profile/${userId}/photo`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          setSuccess("Photo removed successfully!");
          await logActivity("photo_removal", "Removed profile photo");
          setTimeout(() => setSuccess(""), 3000);
        }
      } catch (error) {
        console.error("Error removing photo:", error);
      }
    }
    
    localStorage.removeItem("profilePhoto");
    setShowPhotoOptions(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getInitials = () => {
    if (editForm.name && editForm.name !== "Guest User") {
      return editForm.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    }
    return "U";
  };

  const getLevelBadge = () => {
    const level = stats?.level || "Advanced";
    const colors = {
      Beginner: { bg: "rgba(0,255,163,0.1)", color: "#00ffa3", border: "rgba(0,255,163,0.25)" },
      Intermediate: { bg: "rgba(0,201,255,0.1)", color: "#00c9ff", border: "rgba(0,201,255,0.25)" },
      Advanced: { bg: "rgba(167,139,250,0.1)", color: "#a78bfa", border: "rgba(167,139,250,0.25)" },
      Expert: { bg: "rgba(255,75,110,0.1)", color: "#ff4b6e", border: "rgba(255,75,110,0.25)" }
    };
    return colors[level] || colors.Advanced;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const overallProgress = (stats?.score || 8) * 10;
  const totalQuestionsAttempted = (stats?.attempts || 12) * 25;
  const accuracy = stats?.score || 8;

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#060610", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 40, height: 40, border: "2px solid rgba(0,255,163,0.2)", borderTopColor: "#00ffa3", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#060610",
      fontFamily: "'Cabinet Grotesk', sans-serif",
      position: "relative",
      overflowX: "hidden"
    }}>
      {/* Background effects */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", top: "-20%", right: "-15%",
          background: "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 65%)" }} />
        <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", bottom: "-10%", left: "-10%",
          background: "radial-gradient(circle, rgba(0,255,163,0.05) 0%, transparent 65%)" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 480, margin: "0 auto", padding: "20px" }}>
        
        {/* Success/Error Messages */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                background: "rgba(0,255,163,0.1)",
                border: "1px solid rgba(0,255,163,0.3)",
                borderRadius: 12,
                padding: "12px 16px",
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                gap: 8
              }}
            >
              <CheckCircle size={16} color="#00ffa3" />
              <span style={{ color: "#00ffa3", fontSize: 13 }}>{success}</span>
            </motion.div>
          )}
          
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                background: "rgba(255,75,110,0.1)",
                border: "1px solid rgba(255,75,110,0.3)",
                borderRadius: 12,
                padding: "12px 16px",
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                gap: 8
              }}
            >
              <AlertCircle size={16} color="#ff4b6e" />
              <span style={{ color: "#ff4b6e", fontSize: 13 }}>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}
        >
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
            <ArrowLeft size={18} />
          </button>
          <div>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Account</p>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>Your Profile</h1>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              style={{
                marginLeft: "auto",
                width: 36, height: 36, borderRadius: 10,
                background: "rgba(0,255,163,0.1)",
                border: "1px solid rgba(0,255,163,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "#00ffa3"
              }}
            >
              <Edit2 size={16} />
            </button>
          )}
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 24,
            padding: 20,
            marginBottom: 20,
            backdropFilter: "blur(20px)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Profile Photo with Edit Option */}
            <div style={{ position: "relative" }}>
              <div
                onClick={() => !isEditing && setShowPhotoOptions(!showPhotoOptions)}
                style={{
                  width: 80, height: 80, borderRadius: 24,
                  background: profilePhoto ? "none" : "linear-gradient(135deg, #7c3aed, #2563eb)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 32, fontWeight: 800, color: "#fff",
                  boxShadow: "0 0 30px rgba(124,58,237,0.3)",
                  cursor: !isEditing ? "pointer" : "default",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {profilePhoto ? (
                  <img 
                    src={profilePhoto} 
                    alt="Profile" 
                    style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 24 }}
                  />
                ) : (
                  getInitials()
                )}
                
                {!isEditing && (
                  <div style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    background: "#00ffa3",
                    borderRadius: 10,
                    padding: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <Camera size={12} color="#000" />
                  </div>
                )}
              </div>
              
              {/* Photo Options Modal */}
              <AnimatePresence>
                {showPhotoOptions && !isEditing && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      marginTop: 8,
                      background: "#1a1a24",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 12,
                      padding: 8,
                      minWidth: 160,
                      zIndex: 10,
                      boxShadow: "0 10px 25px rgba(0,0,0,0.5)"
                    }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg, image/png, image/jpg"
                      style={{ display: "none" }}
                      onChange={handlePhotoUpload}
                    />
                    <button
                      onClick={() => fileInputRef.current.click()}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        background: "transparent",
                        border: "none",
                        color: "#fff",
                        fontSize: 13,
                        textAlign: "left",
                        cursor: "pointer",
                        borderRadius: 8,
                        display: "flex",
                        alignItems: "center",
                        gap: 8
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <Upload size={14} /> Upload Photo
                    </button>
                    {profilePhoto && (
                      <button
                        onClick={handleRemovePhoto}
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          background: "transparent",
                          border: "none",
                          color: "#ff4b6e",
                          fontSize: 13,
                          textAlign: "left",
                          cursor: "pointer",
                          borderRadius: 8,
                          display: "flex",
                          alignItems: "center",
                          gap: 8
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,75,110,0.1)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                      >
                        <Trash2 size={14} /> Remove Photo
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div style={{ flex: 1 }}>
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    style={{
                      width: "100%",
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: 10,
                      padding: "8px 12px",
                      color: "#fff",
                      fontSize: 16,
                      fontWeight: 600,
                      marginBottom: 8,
                      outline: "none"
                    }}
                    placeholder="Your name"
                  />
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    style={{
                      width: "100%",
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: 10,
                      padding: "8px 12px",
                      color: "#fff",
                      fontSize: 13,
                      outline: "none"
                    }}
                    placeholder="Your email"
                  />
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      style={{
                        flex: 1,
                        padding: "6px",
                        background: "#00ffa3",
                        border: "none",
                        borderRadius: 8,
                        color: "#000",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: saving ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 4,
                        opacity: saving ? 0.7 : 1
                      }}
                    >
                      {saving ? "Saving..." : <><Save size={12} /> Save</>}
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      style={{
                        flex: 1,
                        padding: "6px",
                        background: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 8,
                        color: "#fff",
                        fontSize: 12,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 4
                      }}
                    >
                      <X size={12} /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <h2 style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>{user?.name || "Guest User"}</h2>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                      background: getLevelBadge().bg,
                      color: getLevelBadge().color,
                      border: `1px solid ${getLevelBadge().border}`
                    }}>{stats?.level || "Advanced"}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Mail size={12} color="rgba(255,255,255,0.4)" />
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{user?.email || "user@example.com"}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                    <ShieldCheck size={12} color="#00ffa3" />
                    <p style={{ fontSize: 11, color: "#00ffa3" }}>Active · Pro Member</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}
        >
          {[
            { label: "Overall Score", value: `${overallProgress}%`, icon: <Target size={14} />, color: "#00ffa3" },
            { label: "Tests Taken", value: stats?.attempts || 12, icon: <BookOpen size={14} />, color: "#00c9ff" },
            { label: "Questions", value: totalQuestionsAttempted, icon: <Brain size={14} />, color: "#a78bfa" },
            { label: "Accuracy", value: `${accuracy * 10}%`, icon: <CheckCircle size={14} />, color: "#ff4b6e" }
          ].map((stat, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 16,
              padding: "14px",
              textAlign: "center"
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 8 }}>
                <span style={{ color: stat.color }}>{stat.icon}</span>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>{stat.label}</p>
              </div>
              <p style={{ fontSize: 24, fontWeight: 800, color: stat.color }}>{stat.value}</p>
            </div>
          ))}
        </motion.div>

        {/* Recent Activity Log */}
        {activityLog.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 20,
              padding: 20,
              marginBottom: 20
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <Activity size={16} color="#00c9ff" />
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Recent Activity</h3>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {activityLog.slice(0, 5).map((activity, i) => (
                <div key={i} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "8px 0",
                  borderBottom: i < activityLog.slice(0, 5).length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none"
                }}>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    background: "rgba(0,201,255,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <Calendar size={14} color="#00c9ff" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, color: "#fff", marginBottom: 2 }}>
                      {activity.action === "profile_update" ? "Profile Updated" :
                       activity.action === "photo_upload" ? "Photo Uploaded" :
                       activity.action === "photo_removal" ? "Photo Removed" :
                       activity.action === "test_completed" ? "Test Completed" : "Account Activity"}
                    </p>
                    {activity.details && (
                      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{activity.details}</p>
                    )}
                    <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{formatDateTime(activity.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Topic Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 20,
            padding: 20,
            marginBottom: 20
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <BarChart3 size={16} color="#a78bfa" />
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Performance by Topic</h3>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {topicScores.slice(0, 5).map((topic, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{topic.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: topic.color }}>{topic.score}%</span>
                </div>
                <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 4, overflow: "hidden" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${topic.score}%` }}
                    transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                    style={{ height: "100%", background: topic.color, borderRadius: 4 }}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <button
            onClick={() => navigate("/aptitude")}
            style={{
              marginTop: 16,
              width: "100%",
              padding: "10px",
              background: "rgba(167,139,250,0.1)",
              border: "1px solid rgba(167,139,250,0.2)",
              borderRadius: 12,
              color: "#a78bfa",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            View All Topics →
          </button>
        </motion.div>

        {/* Recent Tests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 20,
            padding: 20,
            marginBottom: 20
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Clock size={16} color="#00c9ff" />
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Recent Tests</h3>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {recentTests.map((test, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 0", borderBottom: i < recentTests.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none"
              }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 2 }}>{test.topic}</p>
                  <div style={{ display: "flex", gap: 8 }}>
                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{formatDate(test.date)}</span>
                    <span style={{
                      fontSize: 9, padding: "1px 6px", borderRadius: 10,
                      background: test.difficulty === "Hard" ? "rgba(255,75,110,0.15)" : test.difficulty === "Medium" ? "rgba(0,201,255,0.15)" : "rgba(0,255,163,0.15)",
                      color: test.difficulty === "Hard" ? "#ff4b6e" : test.difficulty === "Medium" ? "#00c9ff" : "#00ffa3"
                    }}>{test.difficulty}</span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 18, fontWeight: 800, color: test.score >= 80 ? "#00ffa3" : test.score >= 60 ? "#fbbf24" : "#ff4b6e" }}>{test.score}</p>
                  <p style={{ fontSize: 9, color: "rgba(255,255,255,0.35)" }}>/{test.total}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Badges Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 20,
            padding: 20,
            marginBottom: 20
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Award size={16} color="#fbbf24" />
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Achievements</h3>
          </div>
          
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[
              { name: "Quick Learner", icon: <Zap size={20} />, color: "#00ffa3", unlocked: true },
              { name: "Math Master", icon: <Brain size={20} />, color: "#a78bfa", unlocked: stats?.score >= 8 },
              { name: "Perfect Streak", icon: <Star size={20} />, color: "#fbbf24", unlocked: stats?.attempts >= 20 },
              { name: "Dedication", icon: <TrendingUp size={20} />, color: "#00c9ff", unlocked: stats?.attempts >= 10 }
            ].map((badge, i) => (
              <div key={i} style={{
                flex: "1 0 auto",
                textAlign: "center",
                padding: "12px 8px",
                background: badge.unlocked ? `${badge.color}10` : "rgba(255,255,255,0.02)",
                borderRadius: 12,
                border: `1px solid ${badge.unlocked ? `${badge.color}30` : "rgba(255,255,255,0.05)"}`,
                opacity: badge.unlocked ? 1 : 0.4
              }}>
                <div style={{ color: badge.unlocked ? badge.color : "rgba(255,255,255,0.2)", marginBottom: 6 }}>{badge.icon}</div>
                <p style={{ fontSize: 10, fontWeight: 600, color: badge.unlocked ? badge.color : "rgba(255,255,255,0.3)" }}>{badge.name}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Sign Out Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          onClick={async () => { 
            await logActivity("logout", "User signed out");
            localStorage.clear(); 
            navigate("/"); 
          }}
          style={{
            width: "100%",
            padding: "14px",
            background: "rgba(255,75,110,0.08)",
            border: "1px solid rgba(255,75,110,0.2)",
            borderRadius: 16,
            color: "#ff4b6e",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            marginBottom: 20
          }}
        >
          Sign Out
        </motion.button>
      </div>
    </div>
  );
}