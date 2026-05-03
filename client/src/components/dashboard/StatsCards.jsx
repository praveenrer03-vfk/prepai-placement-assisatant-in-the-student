import { TrendingUp, Trophy, Flame, Gift } from "lucide-react";

export default function StatsCards({ stats }) {
  const items = [
    { label: "Score", value: stats.score, color: "#00ffa3" },
    { label: "Tests", value: stats.attempts, color: "#00c9ff" },
    { label: "Streak", value: stats.streak, color: "#f97316" },
    { label: "Rank", value: stats.rank, color: "#a78bfa" },
    { label: "Coins", value: stats.coins, color: "#fbbf24" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10 }}>
      {items.map((item, i) => (
        <div key={i} style={{ padding: 12, background: "#111", borderRadius: 12 }}>
          <p style={{ color: "#888" }}>{item.label}</p>
          <h2 style={{ color: item.color }}>{item.value}</h2>
        </div>
      ))}
    </div>
  );
}