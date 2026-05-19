import { useState } from "react";
import api from "../api/axios";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const encoded = btoa(`${username}:${password}`);
    try {
      await api.get("/customer/", {
        headers: { Authorization: `Basic ${encoded}` },
      });
      localStorage.setItem("credentials", encoded);
      onLogin();
    } catch {
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#111318",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(56,189,248,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.04) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
        pointerEvents: "none",
      }} />

      {/* Big ghost text */}
      <div style={{
        position: "absolute",
        fontSize: "22vw",
        fontWeight: 800,
        color: "rgba(56,189,248,0.03)",
        fontFamily: "'Syne', sans-serif",
        userSelect: "none",
        letterSpacing: "-0.05em",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        whiteSpace: "nowrap",
      }}>LOAN</div>

      {/* Card */}
      <div style={{
        position: "relative",
        width: "100%",
        maxWidth: "400px",
        padding: "48px",
        border: "1px solid #272b35",
        background: "#1c1f26",
      }}>
        {/* Top accent */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          height: "2px",
          background: "linear-gradient(90deg, #38bdf8, #7dd3fc)",
        }} />

        <div style={{ marginBottom: "40px" }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "11px",
            color: "#38bdf8",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginBottom: "12px",
          }}>
            LOAN MANAGER v1.0
          </div>
          <h1 style={{
            fontSize: "28px",
            fontWeight: 800,
            color: "#e2e8f0",
            margin: 0,
            letterSpacing: "-0.02em",
          }}>
            Sign In
          </h1>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "12px",
            color: "#4a5568",
            marginTop: "8px",
          }}>
            Enter your credentials to continue
          </p>
        </div>

        <form onSubmit={handleLogin}>
          {[
            { label: "Username", key: "username", type: "text", value: username, setter: setUsername, placeholder: "your_username" },
            { label: "Password", key: "password", type: "password", value: password, setter: setPassword, placeholder: "••••••••" },
          ].map(({ label, key, type, value, setter, placeholder }) => (
            <div key={key} style={{ marginBottom: "20px" }}>
              <label style={{
                display: "block",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "10px",
                color: "#4a5568",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginBottom: "8px",
              }}>{label}</label>
              <input
                type={type}
                value={value}
                onChange={(e) => setter(e.target.value)}
                required
                placeholder={placeholder}
                style={{
                  width: "100%",
                  background: "#111318",
                  border: "1px solid #272b35",
                  borderRadius: 0,
                  padding: "12px 14px",
                  color: "#e2e8f0",
                  fontSize: "13px",
                  outline: "none",
                  fontFamily: "'JetBrains Mono', monospace",
                  transition: "border-color 0.2s",
                }}
                onFocus={e => e.target.style.borderColor = "#38bdf8"}
                onBlur={e => e.target.style.borderColor = "#272b35"}
              />
            </div>
          ))}

          {error && (
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "11px",
              color: "#f87171",
              marginBottom: "20px",
              padding: "10px 14px",
              border: "1px solid #3a1a1a",
              background: "#1f1215",
            }}>
              ✕ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: loading ? "#272b35" : "#38bdf8",
              color: loading ? "#4a5568" : "#111318",
              border: "none",
              padding: "14px",
              fontSize: "13px",
              fontWeight: 700,
              fontFamily: "'Syne', sans-serif",
              letterSpacing: "0.08em",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
            }}
          >
            {loading ? "AUTHENTICATING..." : "SIGN IN →"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;