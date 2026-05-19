import { useNavigate } from "react-router-dom";

const cards = [
  { num: "01", label: "Customers", sub: "Manage borrower profiles", path: "/customers", active: true },
  { num: "02", label: "Collaterals", sub: "Track assets & valuables", path: "/collaterals", active: true },
  { num: "03", label: "Loans", sub: "Coming soon", path: null, active: false },
  { num: "04", label: "Payments", sub: "Coming soon", path: null, active: false },
];

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "48px 40px", minHeight: "calc(100vh - 56px)", background: "#111318" }}>
      <div style={{ marginBottom: "48px", borderBottom: "1px solid #272b35", paddingBottom: "32px" }}>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "10px", color: "#38bdf8",
          letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "12px",
        }}>OVERVIEW</div>
        <h1 style={{ fontSize: "36px", fontWeight: 800, color: "#e2e8f0", margin: 0, letterSpacing: "-0.03em" }}>
          Dashboard
        </h1>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "1px",
        background: "#272b35",
        border: "1px solid #272b35",
        maxWidth: "900px",
      }}>
        {cards.map((card) => (
          <div
            key={card.num}
            onClick={() => card.active && card.path && navigate(card.path)}
            style={{
              background: "#1c1f26",
              padding: "32px 24px",
              cursor: card.active ? "pointer" : "default",
              transition: "background 0.2s",
              position: "relative",
            }}
            onMouseOver={e => { if (card.active) e.currentTarget.style.background = "#272b35" }}
            onMouseOut={e => { if (card.active) e.currentTarget.style.background = "#1c1f26" }}
          >
            {/* Top accent on hover handled via active state */}
            {card.active && (
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0,
                height: "2px", background: "#38bdf8",
                opacity: 0,
                transition: "opacity 0.2s",
              }} />
            )}
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "11px",
              color: card.active ? "#38bdf8" : "#272b35",
              marginBottom: "24px",
              letterSpacing: "0.1em",
            }}>{card.num}</div>
            <div style={{
              fontSize: "16px", fontWeight: 700,
              color: card.active ? "#e2e8f0" : "#272b35",
              marginBottom: "6px", letterSpacing: "-0.01em",
            }}>{card.label}</div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "10px",
              color: card.active ? "#4a5568" : "#272b35",
              letterSpacing: "0.05em",
            }}>{card.sub}</div>
            {card.active && (
              <div style={{
                position: "absolute", bottom: "24px", right: "24px",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "14px", color: "#38bdf8",
              }}>→</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;