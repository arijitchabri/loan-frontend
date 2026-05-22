import { useEffect, useState } from "react";
import api from "../api/axios";
import { S } from "../styles";

const COLLATERAL_TYPES = ["GOLD", "SILVER"];
const COLLATERAL_STATUSES = ["ACTIVE", "RELEASED"];

const emptyForm = {
  customerId: "",
  collateralType: "",
  weight: "",
  purityPercentage: "",
  estimatedValue: "",
  image: "",
  description: "",
  remark: "",
  status: "ACTIVE",
};

const statusBadge = (status) => ({
  display: "inline-block",
  padding: "3px 10px",
  borderRadius: "20px",
  fontSize: "10px",
  fontFamily: "'JetBrains Mono', monospace",
  letterSpacing: "0.1em",
  fontWeight: 600,
  background: status === "ACTIVE" ? "rgba(34,197,94,0.12)" : "rgba(212,175,55,0.12)",
  color: status === "ACTIVE" ? "#22c55e" : "#D4AF37",
  border: `1px solid ${status === "ACTIVE" ? "rgba(34,197,94,0.3)" : "rgba(212,175,55,0.3)"}`,
});

function CollateralCard({ collateral, onEdit, onDelete }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => setHovered(false)}
      style={{
        ...S.card,
        background: hovered ? "#232938" : "#1B1F2A",
        borderColor: hovered ? "#D4AF37" : "#2A3142",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
      }}
    >
      <div style={{
        position: "absolute", top: 0, left: 0,
        width: hovered ? "100%" : "40px",
        height: "2px", background: "#D4AF37",
        transition: "width 0.3s ease",
        borderRadius: "16px 16px 0 0",
      }} />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ ...S.mono, fontSize: "11px", color: "#7C8593", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "6px" }}>
            {collateral.customer?.name || "Unknown"}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ fontSize: "20px", fontWeight: 700, color: "#F5F5F5" }}>
              {collateral.collateralType}
            </div>
            <span style={statusBadge(collateral.status)}>{collateral.status}</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: "14px" }}>
          <button
            onClick={() => onEdit(collateral)}
            style={{ ...S.mono, fontSize: "12px", color: "#B0B7C3", background: "none", border: "none", cursor: "pointer", transition: "0.2s" }}
            onMouseOver={e => e.target.style.color = "#D4AF37"}
            onMouseOut={e => e.target.style.color = "#B0B7C3"}
          >EDIT</button>
          <button
            onClick={() => onDelete(collateral.id)}
            style={{ ...S.mono, fontSize: "12px", color: "#B0B7C3", background: "none", border: "none", cursor: "pointer", transition: "0.2s" }}
            onMouseOver={e => e.target.style.color = "#EF4444"}
            onMouseOut={e => e.target.style.color = "#B0B7C3"}
          >DELETE</button>
        </div>
      </div>

      {/* Value Box */}
      <div style={{
        background: "#151821", border: "1px solid #2A3142",
        borderRadius: "12px", padding: "16px 20px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div>
          <div style={{ ...S.mono, fontSize: "10px", color: "#7C8593", textTransform: "uppercase", marginBottom: "6px" }}>Est. Value</div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "#D4AF37", letterSpacing: "-0.03em" }}>
            ₹{collateral.estimatedValue?.toLocaleString("en-IN")}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ ...S.mono, fontSize: "10px", color: "#7C8593", textTransform: "uppercase", marginBottom: "6px" }}>Weight</div>
          <div style={{ fontSize: "18px", fontWeight: 600, color: "#B0B7C3" }}>{collateral.weight}g</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ ...S.mono, fontSize: "10px", color: "#7C8593", textTransform: "uppercase", marginBottom: "6px" }}>Purity</div>
          <div style={{ fontSize: "18px", fontWeight: 600, color: "#B0B7C3" }}>{collateral.purityPercentage}%</div>
        </div>
      </div>

      <div style={S.divider} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
        {[
          { label: "Description", value: collateral.description },
          { label: "Remark", value: collateral.remark },
        ].map(({ label, value }) => (
          <div key={label}>
            <div style={{ ...S.mono, fontSize: "10px", color: "#7C8593", textTransform: "uppercase", marginBottom: "5px" }}>{label}</div>
            <div style={{ fontSize: "13px", color: "#B0B7C3", lineHeight: 1.6 }}>{value || "—"}</div>
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
    } catch { setError("Failed to load collaterals."); }
    finally { setLoading(false); }
  };

  const fetchCustomers = async () => {
    try {
      const res = await api.get("/customer/");
      setCustomers(res.data);
    } catch { setError("Failed to load customers."); }
  };

  useEffect(() => { fetchCollaterals(); fetchCustomers(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleAdd = () => { setForm(emptyForm); setEditingId(null); setShowForm(true); };

  const handleEdit = (col) => {
    setForm({
      customerId: col.customer?.id || "",
      collateralType: col.collateralType || "",
      weight: col.weight,
      purityPercentage: col.purityPercentage,
      estimatedValue: col.estimatedValue,
      image: col.image || "",
      description: col.description || "",
      remark: col.remark || "",
      status: col.status || "ACTIVE",
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
    } catch { setError("Failed to save collateral."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this collateral?")) return;
    try {
      await api.delete(`/collaterals/${id}`);
      fetchCollaterals();
    } catch { setError("Failed to delete collateral."); }
  };

  const displayed = filterCustomerId
    ? collaterals.filter((c) => String(c.customer?.id) === String(filterCustomerId))
    : collaterals;

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "flex-end",
        marginBottom: "40px", borderBottom: "1px solid #2A3142", paddingBottom: "28px",
      }}>
        <div>
          <div style={{ ...S.mono, fontSize: "10px", color: "#7C8593", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "10px" }}>
            {displayed.length} RECORDS
          </div>
          <h1 style={S.pageTitle}>Collaterals</h1>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <select
            value={filterCustomerId}
            onChange={(e) => setFilterCustomerId(e.target.value)}
            style={{ ...S.input, width: "auto", padding: "10px 16px", cursor: "pointer" }}
          >
            <option value="">ALL CUSTOMERS</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>{c.name.toUpperCase()}</option>
            ))}
          </select>
          <button
            onClick={handleAdd}
            style={S.btnPrimary}
            onMouseOver={e => e.currentTarget.style.background = "#E6C55A"}
            onMouseOut={e => e.currentTarget.style.background = "#D4AF37"}
          >+ ADD COLLATERAL</button>
        </div>
      </div>

      {error && (
        <div style={{ ...S.mono, fontSize: "11px", color: "#EF4444", marginBottom: "24px", padding: "12px 16px", border: "1px solid #3a1a1a", background: "#1a0a0a", borderRadius: "8px" }}>
          {error}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div style={{
          background: "#1B1F2A", border: "1px solid #2A3142",
          borderRadius: "18px", padding: "32px", marginBottom: "40px",
          position: "relative", boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "#D4AF37", borderRadius: "18px 18px 0 0" }} />
          <div style={{ ...S.mono, fontSize: "11px", color: "#D4AF37", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "24px" }}>
            {editingId ? "EDIT COLLATERAL" : "NEW COLLATERAL"}
          </div>

          <form onSubmit={handleSave}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginBottom: "24px" }}>

              {/* Customer dropdown */}
              <div>
                <label style={S.label}>Customer</label>
                <select name="customerId" value={form.customerId} onChange={handleChange} required style={{ ...S.input, cursor: "pointer" }}>
                  <option value="">Select customer</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Collateral Type dropdown */}
              <div>
                <label style={S.label}>Type</label>
                <select name="collateralType" value={form.collateralType} onChange={handleChange} required style={{ ...S.input, cursor: "pointer" }}>
                  <option value="">Select type</option>
                  {COLLATERAL_TYPES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Status dropdown */}
              <div>
                <label style={S.label}>Status</label>
                <select name="status" value={form.status} onChange={handleChange} required style={{ ...S.input, cursor: "pointer" }}>
                  {COLLATERAL_STATUSES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Number inputs */}
              {[
                { name: "weight", label: "Weight (g)", placeholder: "10.5" },
                { name: "purityPercentage", label: "Purity %", placeholder: "80" },
                { name: "estimatedValue", label: "Est. Value (₹)", placeholder: "62500" },
              ].map(({ name, label, placeholder }) => (
                <div key={name}>
                  <label style={S.label}>{label}</label>
                  <input
                    name={name} type="number" step="0.01"
                    value={form[name]} onChange={handleChange}
                    placeholder={placeholder}
                    style={S.input}
                    onFocus={e => e.target.style.borderColor = "#D4AF37"}
                    onBlur={e => e.target.style.borderColor = "#2A3142"}
                  />
                </div>
              ))}

              {/* Text inputs */}
              {[
                { name: "image", label: "Image URL", placeholder: "Optional" },
                { name: "remark", label: "Remark", placeholder: "Optional" },
                { name: "description", label: "Description", placeholder: "Optional" },
              ].map(({ name, label, placeholder }) => (
                <div key={name}>
                  <label style={S.label}>{label}</label>
                  <input
                    name={name} type="text"
                    value={form[name]} onChange={handleChange}
                    placeholder={placeholder}
                    style={S.input}
                    onFocus={e => e.target.style.borderColor = "#D4AF37"}
                    onBlur={e => e.target.style.borderColor = "#2A3142"}
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
        <div style={{ ...S.mono, fontSize: "13px", color: "#7C8593" }}>LOADING...</div>
      ) : displayed.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0", border: "1px dashed #2A3142", borderRadius: "16px" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.2 }}>🏠</div>
          <div style={{ ...S.mono, fontSize: "11px", color: "#7C8593", letterSpacing: "0.15em" }}>NO COLLATERALS YET</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
          {displayed.map((c) => (
            <CollateralCard key={c.id} collateral={c} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Collaterals;