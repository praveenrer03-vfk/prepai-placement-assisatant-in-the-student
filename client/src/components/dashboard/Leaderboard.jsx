export default function Leaderboard({ data }) {
  return (
    <div style={{ background: "#111", padding: 16, borderRadius: 12 }}>
      <h3 style={{ color: "#fff" }}>Leaderboard</h3>

      {data.map((u, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
          <span>{u.name}</span>
          <span>{u.score}</span>
        </div>
      ))}
    </div>
  );
}