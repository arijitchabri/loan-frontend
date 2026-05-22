import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { onLogout(); navigate("/login"); };

  const navLink = (to, label) => {
    const active = location.pathname === to;
    return (
      <Link to={to} style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "11px",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color: active ? "#D4AF37" : "#7C8593",
        textDecoration: "none",
        paddingBottom: "2px",
        borderBottom: active ? "1px solid #D4AF37" : "1px solid transparent",
        transition: "all 0.2s",
      }}>
        {label}
      </Link>
    );
  };

  return (
    <nav style={{
      background: "#1B1F2A",
      borderBottom: "1px solid #2A3142",
      padding: "0 40px",
      height: "56px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "48px" }}>
        <span style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 800,
          fontSize: "15px",
          color: "#F5F5F5",
          letterSpacing: "-0.02em",
        }}>
          LOAN<span style={{ color: "#D4AF37" }}>MGR</span>
        </span>
        <div style={{ display: "flex", gap: "32px" }}>
          {navLink("/dashboard", "Dashboard")}
          {navLink("/customers", "Customers")}
          {navLink("/collaterals", "Collaterals")}
        </div>
      </div>

      <button
        onClick={handleLogout}
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "10px",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "#7C8593",
          background: "none",
          border: "none",
          cursor: "pointer",
          transition: "color 0.2s",
        }}
        onMouseOver={e => e.target.style.color = "#EF4444"}
        onMouseOut={e => e.target.style.color = "#7C8593"}
      >
        LOGOUT →
      </button>
    </nav>
  );
}

export default Navbar;