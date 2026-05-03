import FeatureCard from "./FeatureCard";

export default function FeatureGrid({ features, onNavigate }) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {features.map((f, i) => (
        <FeatureCard
          key={i}
          feature={f}
          onClick={() => onNavigate(f.route, f.status)}
        />
      ))}
    </div>
  );
}