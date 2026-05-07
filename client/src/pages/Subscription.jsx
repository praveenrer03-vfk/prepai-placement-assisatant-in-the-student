import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Crown, Check, CreditCard, Zap, Shield, 
  Lock, Smartphone, Building, Wallet, Star, Sparkles,
  FileText, Layout, Target, Download, MessageCircle, Clock
} from "lucide-react";

export default function Subscription() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [billingInterval, setBillingInterval] = useState("monthly");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const plans = {
    free: {
      name: "Free",
      price: 0,
      priceYearly: 0,
      period: "forever",
      description: "Basic resume building features",
      features: [
        "Basic resume builder",
        "JSON export only",
        "Basic ATS score",
        "Limited templates (2)",
        "Community support"
      ],
      color: "#64748b",
      popular: false,
      icon: "📄",
      buttonText: "Current Plan"
    },
    pro: {
      name: "Pro",
      price: 9,
      priceYearly: 90,
      period: "month",
      description: "Professional resume features",
      features: [
        "Everything in Free",
        "Export to PDF with templates",
        "All premium templates (4)",
        "Advanced ATS optimization",
        "Unlimited downloads",
        "Priority support",
        "AI-powered suggestions"
      ],
      color: "#6366f1",
      popular: true,
      icon: "👑",
      buttonText: "Upgrade to Pro"
    },
    business: {
      name: "Business",
      price: 29,
      priceYearly: 290,
      period: "month",
      description: "Team & organization features",
      features: [
        "Everything in Pro",
        "Team collaboration",
        "API access",
        "Custom templates",
        "Dedicated account manager",
        "24/7 phone support",
        "Analytics dashboard",
        "Bulk resume export"
      ],
      color: "#8b5cf6",
      popular: false,
      icon: "🏢",
      buttonText: "Contact Sales"
    }
  };

  const handleSubscribe = () => {
    if (selectedPlan === "free") {
      activateFreePlan();
    } else if (selectedPlan === "business") {
      window.location.href = "mailto:sales@prepai.com?subject=Business Plan Inquiry";
    } else {
      setShowPaymentModal(true);
    }
  };

  const activateFreePlan = () => {
    setIsProcessing(true);
    setTimeout(() => {
      localStorage.setItem("subscriptionPlan", "free");
      localStorage.setItem("subscriptionStatus", "active");
      localStorage.setItem("subscriptionDate", new Date().toISOString());
      alert("✅ Free plan activated successfully!");
      navigate("/resume-builder");
      setIsProcessing(false);
    }, 1000);
  };

  const processPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const price = billingInterval === "yearly" ? plans[selectedPlan].priceYearly : plans[selectedPlan].price;
      localStorage.setItem("subscriptionPlan", selectedPlan);
      localStorage.setItem("subscriptionStatus", "active");
      localStorage.setItem("subscriptionDate", new Date().toISOString());
      localStorage.setItem("subscriptionAmount", price);
      localStorage.setItem("billingInterval", billingInterval);
      
      alert(`🎉 Successfully subscribed to ${plans[selectedPlan].name} plan!`);
      setShowPaymentModal(false);
      navigate("/resume-builder");
      setIsProcessing(false);
    }, 2000);
  };

  const getPrice = () => {
    if (selectedPlan === "free") return 0;
    return billingInterval === "yearly" ? plans[selectedPlan].priceYearly : plans[selectedPlan].price;
  };

  const getPeriod = () => {
    if (selectedPlan === "free") return "forever";
    return billingInterval === "yearly" ? "year" : "month";
  };

  // Payment Modal Component
  const PaymentModal = () => (
    <AnimatePresence>
      {showPaymentModal && (
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
          onClick={() => setShowPaymentModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            style={{
              background: "#fff",
              borderRadius: 32,
              maxWidth: 550,
              width: "100%",
              maxHeight: "90vh",
              overflow: "auto",
              position: "relative"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              background: `linear-gradient(135deg, ${plans[selectedPlan].color}, ${plans[selectedPlan].color}80)`,
              padding: "28px",
              textAlign: "center",
              color: "#fff"
            }}>
              <div style={{
                width: 64,
                height: 64,
                background: "rgba(255,255,255,0.2)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px"
              }}>
                <CreditCard size={32} color="#fff" />
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>
                Complete Payment
              </h2>
              <p style={{ fontSize: 14, opacity: 0.9 }}>
                {plans[selectedPlan].name} Plan - ${getPrice()}/{getPeriod()}
              </p>
            </div>

            <div style={{ padding: "28px" }}>
              {/* Billing Toggle */}
              {selectedPlan !== "free" && (
                <div style={{ marginBottom: 24 }}>
                  <div style={{
                    background: "#f1f5f9",
                    borderRadius: 40,
                    padding: 4,
                    display: "flex",
                    gap: 4
                  }}>
                    <button
                      onClick={() => setBillingInterval("monthly")}
                      style={{
                        flex: 1,
                        padding: "10px",
                        background: billingInterval === "monthly" ? "#fff" : "transparent",
                        border: "none",
                        borderRadius: 36,
                        cursor: "pointer",
                        fontSize: 13,
                        fontWeight: 600,
                        color: billingInterval === "monthly" ? "#6366f1" : "#64748b",
                        boxShadow: billingInterval === "monthly" ? "0 2px 8px rgba(0,0,0,0.05)" : "none"
                      }}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setBillingInterval("yearly")}
                      style={{
                        flex: 1,
                        padding: "10px",
                        background: billingInterval === "yearly" ? "#fff" : "transparent",
                        border: "none",
                        borderRadius: 36,
                        cursor: "pointer",
                        fontSize: 13,
                        fontWeight: 600,
                        color: billingInterval === "yearly" ? "#6366f1" : "#64748b",
                        boxShadow: billingInterval === "yearly" ? "0 2px 8px rgba(0,0,0,0.05)" : "none"
                      }}
                    >
                      Yearly <span style={{ fontSize: 11, color: "#10b981" }}>(Save 20%)</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Payment Methods */}
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>
                  Payment Method
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                  {[
                    { id: "card", name: "Card", icon: <CreditCard size={18} /> },
                    { id: "upi", name: "UPI", icon: <Smartphone size={18} /> },
                    { id: "netbanking", name: "Bank", icon: <Building size={18} /> },
                    { id: "wallet", name: "Wallet", icon: <Wallet size={18} /> }
                  ].map(method => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      style={{
                        padding: "12px",
                        background: paymentMethod === method.id ? `${plans[selectedPlan].color}15` : "#f8fafc",
                        border: paymentMethod === method.id ? `2px solid ${plans[selectedPlan].color}` : "1px solid #e2e8f0",
                        borderRadius: 12,
                        cursor: "pointer",
                        textAlign: "center",
                        transition: "all 0.2s"
                      }}
                    >
                      <div style={{ color: paymentMethod === method.id ? plans[selectedPlan].color : "#64748b" }}>
                        {method.icon}
                      </div>
                      <div style={{ fontSize: 11, marginTop: 6, color: "#475569" }}>{method.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Card Details Form */}
              {paymentMethod === "card" && (
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <input
                      type="text"
                      placeholder="Card Number"
                      style={{
                        padding: "12px 16px",
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: 12,
                        outline: "none",
                        fontSize: 14
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Cardholder Name"
                      style={{
                        padding: "12px 16px",
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: 12,
                        outline: "none",
                        fontSize: 14
                      }}
                    />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        style={{
                          padding: "12px 16px",
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          borderRadius: 12,
                          outline: "none",
                          fontSize: 14
                        }}
                      />
                      <input
                        type="password"
                        placeholder="CVV"
                        maxLength="4"
                        style={{
                          padding: "12px 16px",
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          borderRadius: 12,
                          outline: "none",
                          fontSize: 14
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* UPI Input */}
              {paymentMethod === "upi" && (
                <div style={{ marginBottom: 24 }}>
                  <input
                    type="text"
                    placeholder="Enter UPI ID (e.g., name@okhdfcbank)"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: 12,
                      outline: "none",
                      fontSize: 14
                    }}
                  />
                </div>
              )}

              {/* Net Banking Select */}
              {paymentMethod === "netbanking" && (
                <div style={{ marginBottom: 24 }}>
                  <select
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: 12,
                      outline: "none",
                      fontSize: 14
                    }}
                  >
                    <option>Select your bank</option>
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>State Bank of India</option>
                    <option>Axis Bank</option>
                    <option>Kotak Mahindra Bank</option>
                  </select>
                </div>
              )}

              {/* Order Summary */}
              <div style={{
                background: "#f8fafc",
                borderRadius: 16,
                padding: 16,
                marginBottom: 24
              }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>
                  Order Summary
                </h3>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: "#64748b" }}>Plan</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{plans[selectedPlan].name}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: "#64748b" }}>Billing</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>
                    {billingInterval === "yearly" ? "Yearly" : "Monthly"}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: "#64748b" }}>Price</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>${getPrice()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: "#64748b" }}>Tax</span>
                  <span style={{ fontSize: 13, color: "#64748b" }}>Included</span>
                </div>
                <div style={{
                  borderTop: "1px solid #e2e8f0",
                  marginTop: 8,
                  paddingTop: 8,
                  display: "flex",
                  justifyContent: "space-between"
                }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>Total</span>
                  <span style={{ fontSize: 18, fontWeight: 800, color: plans[selectedPlan].color }}>
                    ${getPrice()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: 12 }}>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  style={{
                    flex: 1,
                    padding: "14px",
                    background: "#f1f5f9",
                    border: "none",
                    borderRadius: 14,
                    color: "#475569",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={processPayment}
                  disabled={isProcessing}
                  style={{
                    flex: 1,
                    padding: "14px",
                    background: `linear-gradient(135deg, ${plans[selectedPlan].color}, ${plans[selectedPlan].color}80)`,
                    border: "none",
                    borderRadius: 14,
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: isProcessing ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8
                  }}
                >
                  {isProcessing ? (
                    <>
                      <div style={{ width: 16, height: 16, border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock size={16} /> Pay ${getPrice()}
                    </>
                  )}
                </button>
              </div>

              <p style={{
                fontSize: 11,
                color: "#94a3b8",
                textAlign: "center",
                marginTop: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6
              }}>
                <Shield size={12} /> Secure payment encrypted • No hidden fees
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(0,0,0,0.05)",
            borderRadius: 12,
            padding: "10px 20px",
            color: "#475569",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
            marginBottom: 40,
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#fff";
            e.currentTarget.style.transform = "translateX(-4px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.9)";
            e.currentTarget.style.transform = "translateX(0)";
          }}
        >
          <ArrowLeft size={18} /> Back
        </button>

        {/* Hero Section */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.1 }}
            style={{
              width: 80,
              height: 80,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
              boxShadow: "0 20px 40px rgba(99,102,241,0.3)"
            }}
          >
            <Crown size={40} color="#fff" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: 48, fontWeight: 800, color: "#0f172a", marginBottom: 12 }}
          >
            Choose Your Plan
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ fontSize: 18, color: "#64748b", maxWidth: 600, margin: "0 auto" }}
          >
            Start with our Free plan or upgrade to unlock premium features
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 32,
          marginBottom: 48
        }}>
          {Object.entries(plans).map(([key, plan], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              onClick={() => setSelectedPlan(key)}
              style={{
                cursor: "pointer",
                background: selectedPlan === key ? `linear-gradient(135deg, ${plan.color}15, #fff)` : "#fff",
                border: selectedPlan === key ? `2px solid ${plan.color}` : "1px solid #e2e8f0",
                borderRadius: 28,
                padding: 32,
                position: "relative",
                transition: "all 0.3s ease",
                boxShadow: selectedPlan === key ? `0 20px 40px ${plan.color}20` : "0 4px 6px -1px rgba(0,0,0,0.05)"
              }}
            >
              {plan.popular && (
                <div style={{
                  position: "absolute",
                  top: -12,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "linear-gradient(135deg, #f59e0b, #ef4444)",
                  padding: "6px 20px",
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
                <div style={{
                  width: 64,
                  height: 64,
                  background: `${plan.color}15`,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  fontSize: 32
                }}>
                  {plan.icon}
                </div>
                <h3 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>{plan.name}</h3>
                <p style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>{plan.description}</p>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 4 }}>
                  {plan.price === 0 ? (
                    <span style={{ fontSize: 36, fontWeight: 800, color: plan.color }}>Free</span>
                  ) : (
                    <>
                      <span style={{ fontSize: 42, fontWeight: 800, color: plan.color }}>${billingInterval === "yearly" && selectedPlan === key ? plan.priceYearly : plan.price}</span>
                      <span style={{ fontSize: 14, color: "#64748b" }}>
                        /{billingInterval === "yearly" && selectedPlan === key ? "year" : plan.period}
                      </span>
                    </>
                  )}
                </div>
                {billingInterval === "yearly" && selectedPlan === key && plan.price > 0 && (
                  <div style={{ fontSize: 12, color: "#10b981", marginTop: 4 }}>
                    Save ${plan.priceYearly - plan.price * 12}/year
                  </div>
                )}
              </div>
              
              <div style={{ marginBottom: 32 }}>
                {plan.features.map((feature, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
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
                onClick={(e) => {
                  e.stopPropagation();
                  handleSubscribe();
                }}
                disabled={isProcessing && selectedPlan === key}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: selectedPlan === key ? `linear-gradient(135deg, ${plan.color}, ${plan.color}80)` : "#f1f5f9",
                  border: "none",
                  borderRadius: 16,
                  color: selectedPlan === key ? "#fff" : "#64748b",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: (isProcessing && selectedPlan === key) ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease"
                }}
              >
                {isProcessing && selectedPlan === key ? "Processing..." : plan.buttonText}
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            background: "#fff",
            borderRadius: 28,
            border: "1px solid #e2e8f0",
            padding: 32,
            marginTop: 32
          }}
        >
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
                  { feature: "Premium Templates", free: "2", pro: "4", business: "Unlimited" },
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
                      {row.free === false && <Lock size={14} color="#cbd5e1" />}
                      {typeof row.free === "string" && <span style={{ fontSize: 12, color: "#64748b" }}>{row.free}</span>}
                    </td>
                    <td style={{ padding: 16, textAlign: "center" }}>
                      {row.pro === true && <Check size={18} color="#10b981" />}
                      {row.pro === false && <Lock size={14} color="#cbd5e1" />}
                      {typeof row.pro === "string" && <span style={{ fontSize: 12, color: "#6366f1" }}>{row.pro}</span>}
                    </td>
                    <td style={{ padding: 16, textAlign: "center" }}>
                      {row.business === true && <Check size={18} color="#10b981" />}
                      {row.business === false && <Lock size={14} color="#cbd5e1" />}
                      {typeof row.business === "string" && <span style={{ fontSize: 12, color: "#8b5cf6" }}>{row.business}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ marginTop: 48, textAlign: "center" }}
        >
          <h3 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 24 }}>Frequently Asked Questions</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {[
              { q: "Can I cancel anytime?", a: "Yes, you can cancel your subscription at any time. No questions asked." },
              { q: "Is there a free trial?", a: "We offer a 14-day money-back guarantee on all paid plans." },
              { q: "What payment methods?", a: "We accept all major credit cards, PayPal, and UPI." },
              { q: "Can I upgrade later?", a: "Yes, you can upgrade or downgrade your plan anytime." }
            ].map((faq, idx) => (
              <div key={idx} style={{ padding: 20, background: "#f8fafc", borderRadius: 20, textAlign: "left" }}>
                <p style={{ fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>{faq.q}</p>
                <p style={{ fontSize: 13, color: "#64748b" }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{
            marginTop: 48,
            textAlign: "center",
            padding: "32px",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            borderRadius: 28,
            color: "#fff"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 16 }}>
            <Shield size={24} />
            <span style={{ fontSize: 14, fontWeight: 600 }}>Secure Payment Guarantee</span>
          </div>
          <p style={{ fontSize: 13, opacity: 0.9 }}>
            Your payment information is encrypted and secure. We never store your credit card details.
          </p>
        </motion.div>
      </div>

      <PaymentModal />

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