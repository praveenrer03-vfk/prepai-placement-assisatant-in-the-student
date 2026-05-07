import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Crown, Check, CreditCard, Zap, FileText, Target, Sparkles, Shield, Star, Lock } from "lucide-react";

export default function Subscription() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = {
    free: {
      name: "Free",
      price: 0,
      period: "forever",
      features: [
        "Basic resume builder",
        "JSON export only",
        "Basic ATS score",
        "Limited templates",
        "Community support"
      ],
      color: "#64748b",
      popular: false
    },
    pro: {
      name: "Pro",
      price: 9,
      period: "month",
      features: [
        "Everything in Free",
        "PDF export with templates",
        "Advanced ATS optimization",
        "All premium templates",
        "Unlimited downloads",
        "Priority support",
        "AI-powered suggestions"
      ],
      color: "#6366f1",
      popular: true
    },
    business: {
      name: "Business",
      price: 29,
      period: "month",
      features: [
        "Everything in Pro",
        "Team collaboration",
        "API access",
        "Custom templates",
        "Dedicated account manager",
        "24/7 phone support",
        "Analytics dashboard"
      ],
      color: "#8b5cf6",
      popular: false
    }
  };

  const handleSubscribe = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      localStorage.setItem("subscription", selectedPlan);
      alert(`Successfully subscribed to ${plans[selectedPlan].name} plan!`);
      setIsProcessing(false);
      navigate("/dashboard");
    }, 2000);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f8fafc",
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>
        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "transparent",
              border: "none",
              color: "#64748b",
              cursor: "pointer",
              marginBottom: 24,
              padding: "8px 0"
            }}
          >
            <ArrowLeft size={20} /> Back
          </button>
          
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: 80,
              height: 80,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px"
            }}>
              <Crown size={40} color="#fff" />
            </div>
            <h1 style={{ fontSize: 36, fontWeight: 800, color: "#0f172a", marginBottom: 12 }}>
              Choose Your Plan
            </h1>
            <p style={{ fontSize: 16, color: "#64748b", maxWidth: 500, margin: "0 auto" }}>
              Upgrade to unlock premium features and accelerate your career journey
            </p>
          </div>
        </div>

        {/* Pricing Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 32,
          marginBottom: 48
        }}>
          {Object.entries(plans).map(([key, plan]) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              whileHover={{ y: -8 }}
              onClick={() => setSelectedPlan(key)}
              style={{
                cursor: "pointer",
                background: selectedPlan === key ? `linear-gradient(135deg, ${plan.color}15, #fff)` : "#fff",
                border: selectedPlan === key ? `2px solid ${plan.color}` : "1px solid #e2e8f0",
                borderRadius: 24,
                padding: 32,
                position: "relative",
                transition: "all 0.3s ease",
                boxShadow: selectedPlan === key ? `0 8px 24px ${plan.color}20` : "0 1px 3px rgba(0,0,0,0.05)"
              }}
            >
              {plan.popular && (
                <div style={{
                  position: "absolute",
                  top: -12,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "linear-gradient(135deg, #f59e0b, #ef4444)",
                  padding: "6px 16px",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#fff",
                  whiteSpace: "nowrap"
                }}>
                  ⚡ Most Popular
                </div>
              )}
              
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <h3 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>{plan.name}</h3>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 4 }}>
                  <span style={{ fontSize: 48, fontWeight: 800, color: plan.color }}>${plan.price}</span>
                  <span style={{ fontSize: 14, color: "#64748b" }}>/{plan.period}</span>
                </div>
              </div>
              
              <div style={{ marginBottom: 32 }}>
                {plan.features.map((feature, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <div style={{
                      width: 20,
                      height: 20,
                      background: `${plan.color}15`,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <Check size={12} color={plan.color} />
                    </div>
                    <span style={{ fontSize: 13, color: "#475569" }}>{feature}</span>
                  </div>
                ))}
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubscribe}
                disabled={isProcessing}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: selectedPlan === key ? `linear-gradient(135deg, ${plan.color}, ${plan.color}80)` : "#f1f5f9",
                  border: "none",
                  borderRadius: 16,
                  color: selectedPlan === key ? "#fff" : "#64748b",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: isProcessing ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8
                }}
              >
                {isProcessing && selectedPlan === key ? (
                  <>
                    <div style={{ width: 16, height: 16, border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />
                    Processing...
                  </>
                ) : (
                  <>
                    {selectedPlan === key ? (
                      <>
                        <CreditCard size={16} /> Subscribe Now
                      </>
                    ) : (
                      "Select Plan"
                    )}
                  </>
                )}
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Features Comparison */}
        <div style={{
          background: "#fff",
          borderRadius: 24,
          border: "1px solid #e2e8f0",
          padding: 32,
          marginTop: 32
        }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 24, textAlign: "center" }}>
            Compare Features
          </h2>
          
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ padding: 16, textAlign: "left", color: "#64748b", fontWeight: 600 }}>Feature</th>
                  <th style={{ padding: 16, textAlign: "center", color: "#64748b", fontWeight: 600 }}>Free</th>
                  <th style={{ padding: 16, textAlign: "center", color: "#6366f1", fontWeight: 600 }}>Pro</th>
                  <th style={{ padding: 16, textAlign: "center", color: "#8b5cf6", fontWeight: 600 }}>Business</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Resume Builder", free: true, pro: true, business: true },
                  { feature: "JSON Export", free: true, pro: true, business: true },
                  { feature: "PDF Export", free: false, pro: true, business: true },
                  { feature: "Premium Templates", free: false, pro: true, business: true },
                  { feature: "ATS Score Analysis", free: "Basic", pro: "Advanced", business: "Advanced" },
                  { feature: "AI Suggestions", free: false, pro: true, business: true },
                  { feature: "Unlimited Downloads", free: false, pro: true, business: true },
                  { feature: "Priority Support", free: false, pro: true, business: true },
                  { feature: "Team Collaboration", free: false, pro: false, business: true },
                  { feature: "API Access", free: false, pro: false, business: true },
                  { feature: "Custom Templates", free: false, pro: false, business: true },
                  { feature: "Dedicated Manager", free: false, pro: false, business: true }
                ].map((row, idx) => (
                  <tr key={idx} style={{ borderTop: "1px solid #e2e8f0" }}>
                    <td style={{ padding: 16, color: "#0f172a", fontWeight: 500 }}>{row.feature}</td>
                    <td style={{ padding: 16, textAlign: "center" }}>
                      {row.free === true && <Check size={18} color="#10b981" />}
                      {row.free === false && <Lock size={16} color="#cbd5e1" />}
                      {typeof row.free === "string" && <span style={{ fontSize: 12, color: "#64748b" }}>{row.free}</span>}
                    </td>
                    <td style={{ padding: 16, textAlign: "center" }}>
                      {row.pro === true && <Check size={18} color="#10b981" />}
                      {row.pro === false && <Lock size={16} color="#cbd5e1" />}
                      {typeof row.pro === "string" && <span style={{ fontSize: 12, color: "#6366f1" }}>{row.pro}</span>}
                    </td>
                    <td style={{ padding: 16, textAlign: "center" }}>
                      {row.business === true && <Check size={18} color="#10b981" />}
                      {row.business === false && <Lock size={16} color="#cbd5e1" />}
                      {typeof row.business === "string" && <span style={{ fontSize: 12, color: "#8b5cf6" }}>{row.business}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ marginTop: 48, textAlign: "center" }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>Frequently Asked Questions</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {[
              { q: "Can I cancel anytime?", a: "Yes, you can cancel your subscription at any time. No questions asked." },
              { q: "Is there a free trial?", a: "We offer a 14-day money-back guarantee on all paid plans." },
              { q: "What payment methods?", a: "We accept all major credit cards, PayPal, and UPI." },
              { q: "Can I upgrade later?", a: "Yes, you can upgrade or downgrade your plan anytime." }
            ].map((faq, idx) => (
              <div key={idx} style={{ padding: 20, background: "#f8fafc", borderRadius: 16 }}>
                <p style={{ fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>{faq.q}</p>
                <p style={{ fontSize: 13, color: "#64748b" }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Badge */}
        <div style={{
          marginTop: 48,
          textAlign: "center",
          padding: "32px",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          borderRadius: 24,
          color: "#fff"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 16 }}>
            <Shield size={24} />
            <span style={{ fontSize: 14, fontWeight: 600 }}>Secure Payment</span>
          </div>
          <p style={{ fontSize: 13, opacity: 0.9 }}>
            Your payment information is encrypted and secure. We never store your credit card details.
          </p>
        </div>
      </div>

      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}