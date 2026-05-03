import { ChevronRight } from "lucide-react";

export default function FeatureCard({ feature, onClick }) {
  const Icon = feature.icon;

  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        gap: 12,
        padding: 16,
        borderRadius: 12,
        background: "#111",
        border: "1px solid #222",
        width: "100%",
        textAlign: "left",
      }}
    >
      <Icon color={feature.accent} />
      <div style={{ flex: 1 }}>
        <h4 style={{ color: "#fff" }}>{feature.title}</h4>
        <p style={{ color: "#888", fontSize: 12 }}>{feature.sub}</p>
      </div>
      <ChevronRight />
    </button>
  );
}