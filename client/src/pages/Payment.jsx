import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Crown, Check, Zap, Sparkles, TrendingUp, 
  MessageCircle, FileText, BarChart3, Users, Gift, 
  Shield, Clock, CreditCard, Wallet, Smartphone,
  Star, Award, Target, Brain, Mic, Video, Download,
  HelpCircle, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Payment() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [billingCycle, setBillingCycle] = useState("yearly");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  const plans = {
    basic: {
      name: "Basic",
      price: { monthly: 9.99, yearly: 99.99 },
      icon: <Zap size={24} />,
      color: "#00c9ff",
      features: [
        "5 Interview sessions/month",
        "10 Aptitude tests/month",
        "Basic AI feedback",
        "Standard question bank",
        "Email support",
        "Progress tracking"
      ],
      popular: false
    },
    pro: {
      name: "Pro",
      price: { monthly: 19.99, yearly: 199.99 },
      icon: <Crown size={24} />,
      color: "#00ffa3",
      features: [
        "Unlimited interview sessions",
        "Unlimited aptitude tests",
        "Advanced AI feedback with detailed analysis",
        "Complete question bank (1000+ questions)",
        "Priority support (24/7)",
        "Advanced analytics & insights",
        "Download performance reports",
        "Mock interviews with AI",
        "Personalized study plan"
      ],
      popular: true
    },
    enterprise: {
      name: "Enterprise",
      price: { monthly: 49.99, yearly: 499.99 },
      icon: <Sparkles size={24} />,
      color: "#a78bfa",
      features: [
        "Everything in Pro",
        "Team accounts (up to 5)",
        "Custom question bank",
        "API access",
        "Dedicated account manager",
        "Custom analytics dashboard",
        "White-label reports",
        "Onboarding training session"
      ],
      popular: false
    }
  };

  const specialOffers = [
    { code: "WELCOME20", discount: 20, description: "20% off first purchase" },
    { code: "ANNUAL30", discount: 30, description: "30% off annual plans" },
    { code: "STUDENT50", discount: 50, description: "50% off for students (verify email)" }
  ];

  const currentPlan = plans[selectedPlan];
  const currentPrice = billingCycle === "monthly" 
    ? currentPlan.price.monthly 
    : currentPlan.price.yearly;
  
  const finalPrice = currentPrice - (currentPrice * discount / 100);
  const savings = billingCycle === "yearly" 
    ? (currentPlan.price.monthly * 12 - currentPlan.price.yearly).toFixed(2)
    : 0;

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '');
    }
    return v;
  };

  const handleApplyCoupon = () => {
    const offer = specialOffers.find(o => o.code === couponCode.toUpperCase());
    if (offer) {
      setDiscount(offer.discount);
      setCouponApplied(true);
    } else {
      alert("Invalid coupon code");
    }
  };

  const handlePayment = async () => {
    setProcessing(true);
    
    setTimeout(() => {
      const subscription = {
        plan: selectedPlan,
        billingCycle: billingCycle,
        startDate: new Date().toISOString(),
        expiryDate: new Date(Date.now() + (billingCycle === "monthly" ? 30 : 365) * 24 * 60 * 60 * 1000).toISOString(),
        amount: finalPrice,
        status: "active"
      };
      
      localStorage.setItem("subscription", JSON.stringify(subscription));
      
      const stats = JSON.parse(localStorage.getItem("stats") || "{}");
      stats.isPro = true;
      localStorage.setItem("stats", JSON.stringify(stats));
      
      setProcessing(false);
      setShowPaymentModal(false);
      
      alert("Payment successful! Welcome to Pro! 🎉");
      navigate("/dashboard");
    }, 2000);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #060610; font-family: 'Inter', sans-serif; }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #060610 0%, #0a0a1a 100%)",
        position: "relative",
        overflowX: "hidden"
      }}>
        
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
          <div style={{ position: "absolute", width: 800, height: 800, borderRadius: "50%", top: "-20%", right: "-20%",
            background: "radial-gradient(circle, rgba(0,255,163,0.08) 0%, transparent 65%)" }} />
          <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", bottom: "-15%", left: "-15%",
            background: "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 65%)" }} />
        </div>

        <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: "20px" }}>
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}
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
              <ArrowLeft size={20} />
            </button>
            <div>
              <p style={{ fontSize: 12, color: "#00ffa3", fontWeight: 600, marginBottom: 4 }}>Upgrade Your Experience</p>
              <h1 style={{ fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
                Choose Your Plan
              </h1>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}
          >
            <div style={{
              display: "flex",
              background: "rgba(255,255,255,0.05)",
              borderRadius: 60,
              padding: 4,
              border: "1px solid rgba(255,255,255,0.1)"
            }}>
              <button
                onClick={() => setBillingCycle("monthly")}
                style={{
                  padding: "10px 28px",
                  borderRadius: 60,
                  border: "none",
                  background: billingCycle === "monthly" ? "linear-gradient(135deg, #00ffa3, #00c9ff)" : "transparent",
                  color: billingCycle === "monthly" ? "#060610" : "rgba(255,255,255,0.6)",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                  transition: "all 0.3s ease"
                }}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                style={{
                  padding: "10px 28px",
                  borderRadius: 60,
                  border: "none",
                  background: billingCycle === "yearly" ? "linear-gradient(135deg, #00ffa3, #00c9ff)" : "transparent",
                  color: billingCycle === "yearly" ? "#060610" : "rgba(255,255,255,0.6)",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  position: "relative"
                }}
              >
                Yearly
                <span style={{
                  position: "absolute",
                  top: -20,
                  right: -10,
                  fontSize: 10,
                  background: "#ff4b6e",
                  color: "#fff",
                  padding: "2px 6px",
                  borderRadius: 20,
                  whiteSpace: "nowrap"
                }}>
                  Save {savings}%
                </span>
              </button>
            </div>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, marginBottom: 60 }}>
            {Object.entries(plans).map(([key, plan], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                onClick={() => setSelectedPlan(key)}
                style={{
                  cursor: "pointer",
                  position: "relative"
                }}
              >
                {plan.popular && (
                  <div style={{
                    position: "absolute",
                    top: -12,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "linear-gradient(135deg, #00ffa3, #00c9ff)",
                    color: "#060610",
                    padding: "4px 16px",
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 700,
                    zIndex: 1
                  }}>
                    Most Popular
                  </div>
                )}
                
                <div style={{
                  background: selectedPlan === key 
                    ? `linear-gradient(135deg, ${plan.color}20, rgba(255,255,255,0.03))`
                    : "rgba(255,255,255,0.03)",
                  border: selectedPlan === key 
                    ? `2px solid ${plan.color}`
                    : "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 24,
                  padding: "28px 20px",
                  transition: "all 0.3s ease",
                  transform: selectedPlan === key ? "scale(1.02)" : "scale(1)",
                  position: "relative",
                  overflow: "hidden"
                }}>
                  {selectedPlan === key && (
                    <div style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 3,
                      background: `linear-gradient(90deg, ${plan.color}, transparent)`
                    }} />
                  )}
                  
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                    <div style={{
                      width: 56, height: 56, borderRadius: 16,
                      background: `${plan.color}20`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: plan.color
                    }}>
                      {plan.icon}
                    </div>
                    <div>
                      <h3 style={{ fontSize: 24, fontWeight: 800, color: "#fff" }}>{plan.name}</h3>
                      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Perfect for {key === "basic" ? "beginners" : key === "pro" ? "professionals" : "teams"}</p>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: 20 }}>
                    <span style={{ fontSize: 40, fontWeight: 800, color: plan.color }}>${finalPrice.toFixed(2)}</span>
                    <span style={{ fontSize: 16, color: "rgba(255,255,255,0.5)" }}>/{billingCycle === "monthly" ? "mo" : "yr"}</span>
                    {billingCycle === "yearly" && (
                      <p style={{ fontSize: 12, color: "#00ffa3", marginTop: 4 }}>
                        Save ${savings}/year
                      </p>
                    )}
                  </div>
                  
                  <div style={{ marginBottom: 24 }}>
                    {plan.features.slice(0, 5).map((feature, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                        <Check size={14} color={plan.color} />
                        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{feature}</span>
                      </div>
                    ))}
                    {plan.features.length > 5 && (
                      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 8 }}>
                        +{plan.features.length - 5} more features
                      </p>
                    )}
                  </div>
                  
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      background: selectedPlan === key 
                        ? `linear-gradient(135deg, ${plan.color}, ${plan.color}dd)`
                        : "rgba(255,255,255,0.05)",
                      border: `1px solid ${selectedPlan === key ? plan.color : "rgba(255,255,255,0.1)"}`,
                      borderRadius: 12,
                      color: selectedPlan === key ? "#060610" : "rgba(255,255,255,0.6)",
                      fontWeight: 600,
                      fontSize: 14,
                      cursor: "pointer",
                      transition: "all 0.3s ease"
                    }}
                  >
                    Get Started
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 20,
              textAlign: "center"
            }}
          >
            {[
              { icon: <Shield size={20} />, text: "Secure Payment", sub: "256-bit SSL encryption" },
              { icon: <Clock size={20} />, text: "30-Day Guarantee", sub: "Full refund if not satisfied" },
              { icon: <Users size={20} />, text: "10,000+ Users", sub: "Trusted by professionals" },
              { icon: <MessageCircle size={20} />, text: "24/7 Support", sub: "Get help anytime" }
            ].map((item, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 16, padding: "16px" }}>
                <div style={{ color: "#00ffa3", marginBottom: 8 }}>{item.icon}</div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 4 }}>{item.text}</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{item.sub}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

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
              background: "rgba(0,0,0,0.9)",
              backdropFilter: "blur(20px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2000,
              padding: "20px"
            }}
            onClick={() => setShowPaymentModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                maxWidth: 500,
                width: "100%",
                background: "linear-gradient(135deg, #1a1a2e, #0f0f1a)",
                border: "1px solid rgba(0,255,163,0.2)",
                borderRadius: 24,
                padding: "32px",
                position: "relative"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowPaymentModal(false)}
                style={{
                  position: "absolute",
                  top: 20,
                  right: 20,
                  background: "rgba(255,255,255,0.05)",
                  border: "none",
                  borderRadius: 8,
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.6)"
                }}
              >
                <X size={18} />
              </button>
              
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 8 }}>
                Complete Payment
              </h2>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", marginBottom: 24 }}>
                You're upgrading to <span style={{ color: "#00ffa3", fontWeight: 700 }}>{currentPlan.name}</span> plan
              </p>
              
              <div style={{
                background: "rgba(0,255,163,0.05)",
                border: "1px solid rgba(0,255,163,0.1)",
                borderRadius: 16,
                padding: "16px",
                marginBottom: 24
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ color: "rgba(255,255,255,0.7)" }}>Plan</span>
                  <span style={{ color: "#fff", fontWeight: 600 }}>{currentPlan.name} ({billingCycle})</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ color: "rgba(255,255,255,0.7)" }}>Subtotal</span>
                  <span style={{ color: "#fff", fontWeight: 600 }}>${currentPrice.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                    <span style={{ color: "#00ffa3" }}>Discount ({discount}%)</span>
                    <span style={{ color: "#00ffa3", fontWeight: 600 }}>-${(currentPrice * discount / 100).toFixed(2)}</span>
                  </div>
                )}
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 12, marginTop: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#fff", fontWeight: 700 }}>Total</span>
                    <span style={{ color: "#00ffa3", fontSize: 20, fontWeight: 800 }}>${finalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 12 }}>Payment Method</p>
                <div style={{ display: "flex", gap: 12 }}>
                  {[
                    { id: "card", name: "Credit Card", icon: <CreditCard size={18} /> },
                    { id: "paypal", name: "PayPal", icon: <Wallet size={18} /> },
                    { id: "upi", name: "UPI", icon: <Smartphone size={18} /> }
                  ].map(method => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      style={{
                        flex: 1,
                        padding: "10px",
                        background: paymentMethod === method.id ? "rgba(0,255,163,0.1)" : "rgba(255,255,255,0.03)",
                        border: paymentMethod === method.id ? "1px solid #00ffa3" : "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 12,
                        color: paymentMethod === method.id ? "#00ffa3" : "rgba(255,255,255,0.6)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        fontSize: 13
                      }}
                    >
                      {method.icon}
                      {method.name}
                    </button>
                  ))}
                </div>
              </div>
              
              {paymentMethod === "card" && (
                <div style={{ marginBottom: 20 }}>
                  <input
                    type="text"
                    placeholder="Card Number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    style={{
                      width: "100%",
                      padding: "12px",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 12,
                      color: "#fff",
                      marginBottom: 12,
                      outline: "none"
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Cardholder Name"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 12,
                      color: "#fff",
                      marginBottom: 12,
                      outline: "none"
                    }}
                  />
                  <div style={{ display: "flex", gap: 12 }}>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                      style={{
                        flex: 1,
                        padding: "12px",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 12,
                        color: "#fff",
                        outline: "none"
                      }}
                    />
                    <input
                      type="password"
                      placeholder="CVV"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      style={{
                        flex: 1,
                        padding: "12px",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 12,
                        color: "#fff",
                        outline: "none"
                      }}
                    />
                  </div>
                </div>
              )}
              
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="text"
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    style={{
                      flex: 1,
                      padding: "12px",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 12,
                      color: "#fff",
                      outline: "none"
                    }}
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={couponApplied}
                    style={{
                      padding: "12px 20px",
                      background: couponApplied ? "rgba(0,255,163,0.2)" : "rgba(0,255,163,0.1)",
                      border: "1px solid rgba(0,255,163,0.3)",
                      borderRadius: 12,
                      color: couponApplied ? "#00ffa3" : "#00ffa3",
                      cursor: couponApplied ? "default" : "pointer",
                      fontWeight: 600
                    }}
                  >
                    {couponApplied ? "Applied" : "Apply"}
                  </button>
                </div>
              </div>
              
              <button
                onClick={handlePayment}
                disabled={processing}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: "linear-gradient(135deg, #00ffa3, #00c9ff)",
                  border: "none",
                  borderRadius: 12,
                  color: "#060610",
                  fontWeight: 700,
                  fontSize: 16,
                  cursor: processing ? "not-allowed" : "pointer",
                  opacity: processing ? 0.7 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8
                }}
              >
                {processing ? (
                  <>
                    <div style={{
                      width: 18,
                      height: 18,
                      border: "2px solid #060610",
                      borderTopColor: "transparent",
                      borderRadius: "50%",
                      animation: "spin 0.8s linear infinite"
                    }} />
                    Processing...
                  </>
                ) : (
                  <>Pay ${finalPrice.toFixed(2)}</>
                )}
              </button>
              
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textAlign: "center", marginTop: 16 }}>
                By completing this purchase, you agree to our Terms of Service and Privacy Policy
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}