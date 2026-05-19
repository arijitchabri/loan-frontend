import { useEffect, useState } from "react";
import api from "../api/axios";
import { S } from "../styles";

const emptyForm = {
  customerId: "",
  type: "",
  weight: "",
  estimatedValue: "",
  image: "",
  description: "",
  remark: "",
};

function CollateralCard({ collateral, onEdit, onDelete }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => setHovered(false)}
      style={{
        background: hovered ? "#111" : "#0e0e0e",
        border: "1px solid",
        borderColor: hovered ? "#333" : "#1a1a1a",
        padding: "28px",
        transition: "all 0.2s",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      {/* Top accent */}
      <div style={{
        position: "absolute", top: 0, left: 0,
        width: hovered ? "100%" : "32px",
        height: "2px",
        background: "#fff",
        transition: "width 0.3s ease",
      }} />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "9px",
            color: "#444",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginBottom: "6px",
          }}>
            {collateral.customer?.name || "Unknown"}
          </div>
          <div style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#fff",
            letterSpacing: "-0.02em",
          }}>
            {collateral.type}
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={() => onEdit(collateral)}
            style={{ ...S.mono, fontSize: "10px", color: "#555", background: "none", border: "none", cursor: "pointer", letterSpacing: "0.1em", textTransform: "uppercase", padding: 0, transition: "color 0.2s" }}
            onMouseOver={e => e.target.style.color = "#fff"}
            onMouseOut={e => e.target.style.color = "#555"}
          >
            EDIT
          </button>
          <button
            onClick={() => onDelete(collateral.id)}
            style={{ ...S.mono, fontSize: "10px", color: "#555", background: "none", border: "none", cursor: "pointer", letterSpacing: "0.1em", textTransform: "uppercase", padding: 0, transition: "color 0.2s" }}
            onMouseOver={e => e.target.style.color = "#ff4444"}
            onMouseOut={e => e.target.style.color = "#555"}
          >
            DEL
          </button>
        </div>
      </div>

      {/* Value highlight */}
      <div style={{
        background: "#080808",
        border: "1px solid #1a1a1a",
        padding: "16px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <div>
          <div style={{ ...S.mono, fontSize: "9px", color: "#444", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "4px" }}>
            Est. Value
          </div>
          <div style={{ fontSize: "22px", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
            ₹{collateral.estimatedValue?.toLocaleString("en-IN")}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ ...S.mono, fontSize: "9px", color: "#444", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "4px" }}>
            Weight
          </div>
          <div style={{ ...S.mono, fontSize: "18px", color: "#888" }}>
            {collateral.weight}g
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: "#1a1a1a" }} />

      {/* Details */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
        {[
          { label: "Description", value: collateral.description },
          { label: "Remark", value: collateral.remark },
        ].map(({ label, value }) => (
          <div key={label}>
            <div style={{ ...S.mono, fontSize: "9px", color: "#444", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "4px" }}>
              {label}
            </div>
            <div style={{ ...S.mono, fontSize: "12px", color: "#666" }}>
              {value || "—"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Collaterals() {
  const [collaterals, setCollaterals] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [filterCustomerId, setFilterCustomerId] = useState("");

  const fetchCollaterals = async () => {
    try {
      const res = await api.get("/collaterals/all");
      setCollaterals(res.data);
    } catch {
      setError("Failed to load collaterals.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await api.get("/customer/");
      setCustomers(res.data);
    } catch {
      setError("Failed to load customers.");
    }
  };

  useEffect(() => {
    fetchCollaterals();
    fetchCustomers();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = () => { setForm(emptyForm); setEditingId(null); setShowForm(true); };

  const handleEdit = (col) => {
    setForm({
      customerId: col.customer?.id || "",
      type: col.type,
      weight: col.weight,
      estimatedValue: col.estimatedValue,
      image: col.image || "",
      description: col.description || "",
      remark: col.remark || "",
    });
    setEditingId(col.id);
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/collaterals/${editingId}`, form);
      } else {
        await api.post("/collaterals/", form);
      }
      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
      fetchCollaterals();
    } catch {
      setError("Failed to save collateral.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this collateral?")) return;
    try {
      await api.delete(`/collaterals/${id}`);
      fetchCollaterals();
    } catch {
      setError("Failed to delete collateral.");
    }
  };

  const displayed = filterCustomerId
    ? collaterals.filter((c) => String(c.customer?.id) === String(filterCustomerId))
    : collaterals;

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginBottom: "40px",
        borderBottom: "1px solid #1a1a1a",
        paddingBottom: "28px",
      }}>
        <div>
          <div style={{ ...S.mono, fontSize: "10px", color: "#555", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "10px" }}>
            {displayed.length} RECORDS
          </div>
          <h1 style={S.pageTitle}>Collaterals</h1>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {/* Filter */}
          <select
            value={filterCustomerId}
            onChange={(e) => setFilterCustomerId(e.target.value)}
            style={{
              ...S.input,
              width: "auto",
              padding: "10px 16px",
              color: filterCustomerId ? "#fff" : "#555",
              cursor: "pointer",
            }}
          >
            <option value="">ALL CUSTOMERS</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>{c.name.toUpperCase()}</option>
            ))}
          </select>

          <button
            onClick={handleAdd}
            style={S.btnPrimary}
            onMouseOver={e => e.currentTarget.style.background = "#e0e0e0"}
            onMouseOut={e => e.currentTarget.style.background = "#fff"}
          >
            + ADD COLLATERAL
          </button>
        </div>
      </div>

      {error && (
        <div style={{ ...S.mono, fontSize: "11px", color: "#ff4444", marginBottom: "24px", padding: "12px", border: "1px solid #3a1a1a", background: "#1a0a0a" }}>
          {error}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div style={{
          background: "#0e0e0e",
          border: "1px solid #222",
          padding: "32px",
          marginBottom: "40px",
          position: "relative",
        }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "#fff" }} />
          <div style={{ ...S.mono, fontSize: "10px", color: "#555", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "24px" }}>
            {editingId ? "EDIT COLLATERAL" : "NEW COLLATERAL"}
          </div>

          <form onSubmit={handleSave}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginBottom: "24px" }}>
              <div>
                <label style={S.label}>Customer</label>
                <select
                  name="customerId"
                  value={form.customerId}
                  onChange={handleChange}
                  required
                  style={{ ...S.input, cursor: "pointer" }}
                  onFocus={e => e.target.style.borderColor = "#fff"}
                  onBlur={e => e.target.style.borderColor = "#222"}
                >
                  <option value="">Select customer</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              {[
                { name: "type", label: "Type", placeholder: "Gold, Silver, Property" },
                { name: "weight", label: "Weight (g)", placeholder: "10.5", type: "number" },
                { name: "estimatedValue", label: "Est. Value (₹)", placeholder: "62500", type: "number" },
                { name: "image", label: "Image URL", placeholder: "Optional" },
                { name: "remark", label: "Remark", placeholder: "Optional" },
                { name: "description", label: "Description", placeholder: "Optional" },
              ].map(({ name, label, placeholder, type }) => (
                <div key={name}>
                  <label style={S.label}>{label}</label>
                  <input
                    name={name}
                    type={type || "text"}
                    value={form[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    step={type === "number" ? "0.01" : undefined}
                    style={S.input}
                    onFocus={e => e.target.style.borderColor = "#fff"}
                    onBlur={e => e.target.style.borderColor = "#222"}
                  />
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button type="submit" disabled={saving} style={{ ...S.btnPrimary, opacity: saving ? 0.5 : 1 }}>
                {saving ? "SAVING..." : editingId ? "UPDATE →" : "ADD →"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} style={S.btnSecondary}>
                CANCEL
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Cards */}
      {loading ? (
        <div style={{ ...S.mono, fontSize: "12px", color: "#333" }}>LOADING...</div>
      ) : displayed.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.2 }}>🏠</div>
          <div style={{ ...S.mono, fontSize: "11px", color: "#333", letterSpacing: "0.15em" }}>NO COLLATERALS YET</div>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "1px",
          background: "#1a1a1a",
        }}>
          {displayed.map((c) => (
            <CollateralCard
              key={c.id}
              collateral={c}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Collaterals;