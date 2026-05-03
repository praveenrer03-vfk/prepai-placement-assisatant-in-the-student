import { Zap, Gift, Crown, LogOut } from "lucide-react";
import { motion } from "framer-motion";

export default function Header({ stats, initials, onLogout, onUpgrade }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 0",
      }}
    >
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Zap color="#00ffa3" />
        <h2 style={{ color: "#fff" }}>PrepAI</h2>
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <div style={{ color: "#fbbf24" }}>
          <Gift size={14} /> {stats.coins}
        </div>

        <button onClick={onUpgrade}>
          <Crown size={14} /> Upgrade
        </button>

        <button onClick={onLogout}>
          <LogOut size={14} />
        </button>

        <div style={{ background: "#7c3aed", padding: 8, borderRadius: 8 }}>
          {initials}
        </div>
      </div>
    </motion.header>
  );
}