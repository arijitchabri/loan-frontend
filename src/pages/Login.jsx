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
      background: "#0F1115",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(212,175,55,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.04) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
        pointerEvents: "none",
      }} />

      {/* Ghost text */}
      <div style={{
        position: "absolute",
        fontSize: "22vw",
        fontWeight: 800,
        color: "rgba(212,175,55,0.03)",
        fontFamily: "'Inter', sans-serif",
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
        border: "1px solid #2A3142",
        background: "#1B1F2A",
        borderRadius: "18px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
      }}>
        {/* Top accent */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          height: "2px",
          background: "linear-gradient(90deg, #D4AF37, #F5D97A)",
          borderRadius: "18px 18px 0 0",
        }} />

        <div style={{ marginBottom: "40px" }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "11px",
            color: "#D4AF37",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginBottom: "12px",
          }}>
            LOAN MANAGER v1.0
          </div>
          <h1 style={{
            fontSize: "28px",
            fontWeight: 800,
            color: "#F5F5F5",
            margin: 0,
            letterSpacing: "-0.02em",
          }}>
            Sign In
          </h1>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "12px",
            color: "#7C8593",
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
                color: "#7C8593",
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
                  background: "#151821",
                  border: "1px solid #2A3142",
                  borderRadius: "12px",
                  padding: "12px 14px",
                  color: "#F5F5F5",
                  fontSize: "14px",
                  outline: "none",
                  fontFamily: "'Inter', sans-serif",
                  transition: "border-color 0.2s",
                  boxSizing: "border-box",
                }}
                onFocus={e => e.target.style.borderColor = "#D4AF37"}
                onBlur={e => e.target.style.borderColor = "#2A3142"}
              />
            </div>
          ))}

          {error && (
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "11px",
              color: "#EF4444",
              marginBottom: "20px",
              padding: "10px 14px",
              border: "1px solid #3a1a1a",
              background: "#1f1215",
              borderRadius: "8px",
            }}>
              ✕ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: loading ? "#2A3142" : "#D4AF37",
              color: loading ? "#7C8593" : "#0F1115",
              border: "none",
              padding: "14px",
              fontSize: "14px",
              fontWeight: 700,
              fontFamily: "'Inter', sans-serif",
              letterSpacing: "0.04em",
              cursor: loading ? "not-allowed" : "pointer",
              borderRadius: "12px",
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