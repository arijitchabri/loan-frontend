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
    <div style={{ padding: "48px 40px", minHeight: "calc(100vh - 56px)", background: "#0F1115" }}>
      <div style={{ marginBottom: "48px", borderBottom: "1px solid #2A3142", paddingBottom: "32px" }}>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "10px", color: "#D4AF37",
          letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "12px",
        }}>OVERVIEW</div>
        <h1 style={{ fontSize: "36px", fontWeight: 800, color: "#F5F5F5", margin: 0, letterSpacing: "-0.03em" }}>
          Dashboard
        </h1>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "1px",
        background: "#2A3142",
        border: "1px solid #2A3142",
        borderRadius: "16px",
        overflow: "hidden",
        maxWidth: "900px",
      }}>
        {cards.map((card) => (
          <div
            key={card.num}
            onClick={() => card.active && card.path && navigate(card.path)}
            style={{
              background: "#1B1F2A",
              padding: "32px 24px",
              cursor: card.active ? "pointer" : "default",
              transition: "background 0.2s",
              position: "relative",
            }}
            onMouseOver={e => { if (card.active) e.currentTarget.style.background = "#232938" }}
            onMouseOut={e => { if (card.active) e.currentTarget.style.background = "#1B1F2A" }}
          >
            {card.active && (
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0,
                height: "2px", background: "#D4AF37",
              }} />
            )}
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "11px",
              color: card.active ? "#D4AF37" : "#2A3142",
              marginBottom: "24px",
              letterSpacing: "0.1em",
            }}>{card.num}</div>
            <div style={{
              fontSize: "16px", fontWeight: 700,
              color: card.active ? "#F5F5F5" : "#2A3142",
              marginBottom: "6px",
            }}>{card.label}</div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "10px",
              color: card.active ? "#7C8593" : "#2A3142",
              letterSpacing: "0.05em",
            }}>{card.sub}</div>
            {card.active && (
              <div style={{
                position: "absolute", bottom: "24px", right: "24px",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "14px", color: "#D4AF37",
              }}>→</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;