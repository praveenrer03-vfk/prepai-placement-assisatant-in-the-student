export default function DailyChallenge({ challenge, onClick }) {
  const pct = (challenge.progress / challenge.target) * 100;

  return (
    <div
      onClick={onClick}
      style={{
        padding: 16,
        borderRadius: 12,
        background: "#222",
        cursor: "pointer",
      }}
    >
      <h3 style={{ color: "#fbbf24" }}>Daily Challenge</h3>
      <p style={{ color: "#aaa" }}>{challenge.title}</p>

      <div style={{ height: 5, background: "#333", marginTop: 8 }}>
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: "#fbbf24",
          }}
        />
      </div>
    </div>
  );
}