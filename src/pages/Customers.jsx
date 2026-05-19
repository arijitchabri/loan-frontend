import { useEffect, useState } from "react";
import api from "../api/axios";
import { S } from "../styles";

const emptyCustomerForm = {
  name: "", phoneNumber: "", address: "",
  careOf: "", aadhaarNo: "", creationDate: "",
};

const emptyCollateralForm = {
  customerId: "", type: "", weight: "",
  estimatedValue: "", image: "", description: "", remark: "",
};

// ─── Collateral Card ───────────────────────────────────────────────
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
        gap: "20px",
      }}
    >
      <div style={{
        position: "absolute", top: 0, left: 0,
        width: hovered ? "100%" : "40px",
        height: "2px", background: "#D4AF37",
        transition: "width 0.3s ease",
      }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ ...S.mono, fontSize: "11px", color: "#7C8593", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "8px" }}>
            {collateral.type}
          </div>
          <div style={{ fontSize: "22px", fontWeight: 700, color: "#F5F5F5" }}>
            ₹{collateral.estimatedValue?.toLocaleString("en-IN")}
          </div>
        </div>

        <div style={{ display: "flex", gap: "14px" }}>
          <button
            onClick={() => onEdit(collateral)}
            style={{ ...S.mono, fontSize: "13px", color: "#B0B7C3", background: "none", border: "none", cursor: "pointer", transition: "0.2s" }}
            onMouseOver={e => e.target.style.color = "#D4AF37"}
            onMouseOut={e => e.target.style.color = "#B0B7C3"}
          >EDIT</button>
          <button
            onClick={() => onDelete(collateral.id)}
            style={{ ...S.mono, fontSize: "13px", color: "#B0B7C3", background: "none", border: "none", cursor: "pointer", transition: "0.2s" }}
            onMouseOver={e => e.target.style.color = "#EF4444"}
            onMouseOut={e => e.target.style.color = "#B0B7C3"}
          >DELETE</button>
        </div>
      </div>

      <div style={{
        background: "#151821", border: "1px solid #2A3142",
        borderRadius: "14px", padding: "16px 20px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div>
          <div style={{ ...S.mono, fontSize: "11px", color: "#7C8593", textTransform: "uppercase", marginBottom: "6px" }}>Weight</div>
          <div style={{ fontSize: "18px", fontWeight: 600, color: "#B0B7C3" }}>{collateral.weight}g</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ ...S.mono, fontSize: "11px", color: "#7C8593", textTransform: "uppercase", marginBottom: "6px" }}>Remark</div>
          <div style={{ fontSize: "14px", color: "#B0B7C3" }}>{collateral.remark || "—"}</div>
        </div>
      </div>

      {collateral.description && (
        <div>
          <div style={{ ...S.mono, fontSize: "11px", color: "#7C8593", textTransform: "uppercase", marginBottom: "6px" }}>Description</div>
          <div style={{ fontSize: "14px", color: "#B0B7C3", lineHeight: 1.6 }}>{collateral.description}</div>
        </div>
      )}
    </div>
  );
}

// ─── Customer Card ─────────────────────────────────────────────────
function CustomerCard({ customer, onEdit, onDelete, onDoubleClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => setHovered(false)}
      onDoubleClick={() => onDoubleClick(customer)}
      style={{
        ...S.card,
        background: hovered ? "#232938" : "#1B1F2A",
        borderColor: hovered ? "#D4AF37" : "#2A3142",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <div style={{
        position: "absolute", top: 0, left: 0,
        width: hovered ? "100%" : "40px",
        height: "2px", background: "#D4AF37",
        transition: "width 0.3s ease",
      }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ ...S.mono, fontSize: "11px", color: "#7C8593", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "8px" }}>
            Customer
          </div>
          <div style={{ fontSize: "22px", fontWeight: 700, color: "#F5F5F5" }}>
            {customer.name}
          </div>
        </div>

        <div style={{ display: "flex", gap: "14px" }}>
          <button
            onClick={e => { e.stopPropagation(); onEdit(customer); }}
            style={{ ...S.mono, fontSize: "13px", color: "#B0B7C3", background: "none", border: "none", cursor: "pointer", transition: "0.2s" }}
            onMouseOver={e => e.target.style.color = "#D4AF37"}
            onMouseOut={e => e.target.style.color = "#B0B7C3"}
          >EDIT</button>
          <button
            onClick={e => { e.stopPropagation(); onDelete(customer.id); }}
            style={{ ...S.mono, fontSize: "13px", color: "#B0B7C3", background: "none", border: "none", cursor: "pointer", transition: "0.2s" }}
            onMouseOver={e => e.target.style.color = "#EF4444"}
            onMouseOut={e => e.target.style.color = "#B0B7C3"}
          >DELETE</button>
        </div>
      </div>

      <div style={S.divider} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
        {[
          { label: "Phone", value: customer.phoneNumber },
          { label: "Aadhaar", value: customer.aadhaarNo },
          { label: "Care Of", value: customer.careOf },
          { label: "Address", value: customer.address },
        ].map(({ label, value }) => (
          <div key={label}>
            <div style={{ ...S.mono, fontSize: "11px", color: "#7C8593", textTransform: "uppercase", marginBottom: "6px" }}>{label}</div>
            <div style={{ fontSize: "14px", color: "#B0B7C3", lineHeight: 1.6 }}>{value || "—"}</div>
          </div>
        ))}
      </div>

      {/* Double-click hint */}
      <div style={{
        ...S.mono, fontSize: "10px", color: hovered ? "#D4AF37" : "#2A3142",
        textAlign: "right", letterSpacing: "0.1em",
        transition: "color 0.2s",
      }}>
        DOUBLE-CLICK TO VIEW COLLATERALS →
      </div>
    </div>
  );
}

// ─── Customer Detail View ──────────────────────────────────────────
function CustomerDetail({ customer, onBack }) {
  const [collaterals, setCollaterals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...emptyCollateralForm, customerId: customer.id });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchCollaterals = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/collaterals/customer/${customer.id}`);
      setCollaterals(res.data);
    } catch {
      setError("Failed to load collaterals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCollaterals(); }, [customer.id]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = () => {
    setForm({ ...emptyCollateralForm, customerId: customer.id });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = col => {
    setForm({
      customerId: customer.id,
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

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/collaterals/${editingId}`, form);
      } else {
        await api.post("/collaterals/", form);
      }
      setShowForm(false);
      setEditingId(null);
      setForm({ ...emptyCollateralForm, customerId: customer.id });
      fetchCollaterals();
    } catch {
      setError("Failed to save collateral.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm("Delete this collateral?")) return;
    try {
      await api.delete(`/collaterals/${id}`);
      fetchCollaterals();
    } catch {
      setError("Failed to delete collateral.");
    }
  };

  const totalValue = collaterals.reduce((sum, c) => sum + (c.estimatedValue || 0), 0);

  return (
    <div style={S.page}>

      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          ...S.mono, fontSize: "12px", color: "#7C8593",
          background: "none", border: "none", cursor: "pointer",
          letterSpacing: "0.1em", textTransform: "uppercase",
          marginBottom: "32px", padding: 0,
          display: "flex", alignItems: "center", gap: "8px",
          transition: "color 0.2s",
        }}
        onMouseOver={e => e.currentTarget.style.color = "#D4AF37"}
        onMouseOut={e => e.currentTarget.style.color = "#7C8593"}
      >
        ← BACK TO CUSTOMERS
      </button>

      {/* Customer summary banner */}
      <div style={{
        background: "#1B1F2A",
        border: "1px solid #2A3142",
        borderRadius: "16px",
        padding: "28px 32px",
        marginBottom: "40px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          height: "2px", background: "linear-gradient(90deg, #D4AF37, #F5D97A)",
        }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "24px" }}>
          <div>
            <div style={{ ...S.mono, fontSize: "11px", color: "#7C8593", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "8px" }}>
              Viewing Customer
            </div>
            <div style={{ fontSize: "28px", fontWeight: 800, color: "#F5F5F5", letterSpacing: "-0.02em" }}>
              {customer.name}
            </div>
            <div style={{ ...S.mono, fontSize: "13px", color: "#7C8593", marginTop: "6px" }}>
              {customer.phoneNumber} &nbsp;·&nbsp; {customer.aadhaarNo || "No Aadhaar"}
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: "24px" }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ ...S.mono, fontSize: "11px", color: "#7C8593", textTransform: "uppercase", marginBottom: "6px" }}>
                Collaterals
              </div>
              <div style={{ fontSize: "28px", fontWeight: 800, color: "#D4AF37" }}>
                {collaterals.length}
              </div>
            </div>
            <div style={{ width: "1px", background: "#2A3142" }} />
            <div style={{ textAlign: "right" }}>
              <div style={{ ...S.mono, fontSize: "11px", color: "#7C8593", textTransform: "uppercase", marginBottom: "6px" }}>
                Total Value
              </div>
              <div style={{ fontSize: "28px", fontWeight: 800, color: "#D4AF37" }}>
                ₹{totalValue.toLocaleString("en-IN")}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Collaterals header */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: "28px",
      }}>
        <div style={{ ...S.mono, fontSize: "11px", color: "#7C8593", letterSpacing: "0.15em", textTransform: "uppercase" }}>
          {collaterals.length} COLLATERAL{collaterals.length !== 1 ? "S" : ""}
        </div>
        <button
          onClick={handleAdd}
          style={S.btnPrimary}
          onMouseOver={e => e.currentTarget.style.background = "#E6C55A"}
          onMouseOut={e => e.currentTarget.style.background = "#D4AF37"}
        >
          + ADD COLLATERAL
        </button>
      </div>

      {error && (
        <div style={{ ...S.mono, fontSize: "11px", color: "#EF4444", marginBottom: "24px", padding: "12px 16px", border: "1px solid #3a1a1a", background: "#1a0a0a", borderRadius: "8px" }}>
          {error}
        </div>
      )}

      {/* Add / Edit Collateral Form */}
      {showForm && (
        <div style={{
          background: "#1B1F2A",
          border: "1px solid #2A3142",
          borderRadius: "18px",
          padding: "32px",
          marginBottom: "36px",
          position: "relative",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "#D4AF37", borderRadius: "18px 18px 0 0" }} />
          <div style={{ ...S.mono, fontSize: "11px", color: "#D4AF37", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "24px" }}>
            {editingId ? "EDIT COLLATERAL" : `NEW COLLATERAL — ${customer.name.toUpperCase()}`}
          </div>

          <form onSubmit={handleSave}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginBottom: "24px" }}>
              {[
                { name: "type", label: "Type", placeholder: "Gold, Silver, Property", required: true },
                { name: "weight", label: "Weight (g)", placeholder: "10.5", type: "number" },
                { name: "estimatedValue", label: "Est. Value (₹)", placeholder: "62500", type: "number" },
                { name: "image", label: "Image URL", placeholder: "Optional" },
                { name: "remark", label: "Remark", placeholder: "Optional" },
                { name: "description", label: "Description", placeholder: "Optional" },
              ].map(({ name, label, placeholder, required, type }) => (
                <div key={name}>
                  <label style={S.label}>{label}</label>
                  <input
                    name={name}
                    type={type || "text"}
                    value={form[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    required={required}
                    step={type === "number" ? "0.01" : undefined}
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

      {/* Collateral Cards */}
      {loading ? (
        <div style={{ ...S.mono, fontSize: "13px", color: "#7C8593" }}>LOADING COLLATERALS...</div>
      ) : collaterals.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "80px 0",
          border: "1px dashed #2A3142", borderRadius: "16px",
        }}>
          <div style={{ fontSize: "40px", marginBottom: "16px", opacity: 0.3 }}>🏠</div>
          <div style={{ ...S.mono, fontSize: "12px", color: "#7C8593", letterSpacing: "0.15em" }}>
            NO COLLATERALS FOR {customer.name.toUpperCase()}
          </div>
          <button
            onClick={handleAdd}
            style={{ ...S.btnPrimary, marginTop: "24px" }}
          >
            + ADD FIRST COLLATERAL
          </button>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px",
        }}>
          {collaterals.map(c => (
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

// ─── Main Customers Page ───────────────────────────────────────────
function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyCustomerForm);
  const [saving, setSaving] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const fetchCustomers = async () => {
    try {
      const res = await api.get("/customer/");
      setCustomers(res.data);
    } catch {
      setError("Failed to load customers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = () => { setForm(emptyCustomerForm); setEditingId(null); setShowForm(true); };

  const handleEdit = customer => {
    setForm({
      name: customer.name,
      phoneNumber: customer.phoneNumber,
      address: customer.address,
      careOf: customer.careOf,
      aadhaarNo: customer.aadhaarNo,
      creationDate: customer.creationDate
        ? new Date(customer.creationDate).toISOString().split("T")[0] : "",
    });
    setEditingId(customer.id);
    setShowForm(true);
  };

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/customer/${editingId}`, form);
      } else {
        await api.post("/customer/add", form);
      }
      setShowForm(false);
      setForm(emptyCustomerForm);
      setEditingId(null);
      fetchCustomers();
    } catch {
      setError("Failed to save customer.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm("Delete this customer?")) return;
    try {
      await api.delete(`/customer/${id}`);
      fetchCustomers();
    } catch {
      setError("Failed to delete customer.");
    }
  };

  // ── If a customer is selected, show detail view ──
  if (selectedCustomer) {
    return (
      <CustomerDetail
        customer={selectedCustomer}
        onBack={() => setSelectedCustomer(null)}
      />
    );
  }

  // ── Otherwise show the customer list ──
  return (
    <div style={S.page}>
      {/* Header */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "flex-end",
        marginBottom: "40px", borderBottom: "1px solid #2A3142", paddingBottom: "28px",
      }}>
        <div>
          <div style={{ ...S.mono, fontSize: "11px", color: "#7C8593", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "10px" }}>
            {customers.length} RECORDS
          </div>
          <h1 style={S.pageTitle}>Customers</h1>
          <div style={{ ...S.mono, fontSize: "12px", color: "#7C8593", marginTop: "8px" }}>
            Double-click any card to view collaterals
          </div>
        </div>
        <button
          onClick={handleAdd}
          style={S.btnPrimary}
          onMouseOver={e => e.currentTarget.style.background = "#E6C55A"}
          onMouseOut={e => e.currentTarget.style.background = "#D4AF37"}
        >
          + ADD CUSTOMER
        </button>
      </div>

      {error && (
        <div style={{ ...S.mono, fontSize: "11px", color: "#EF4444", marginBottom: "24px", padding: "12px 16px", border: "1px solid #3a1a1a", background: "#1a0a0a", borderRadius: "8px" }}>
          {error}
        </div>
      )}

      {/* Add / Edit Customer Form */}
      {showForm && (
        <div style={{
          background: "#1B1F2A", border: "1px solid #2A3142",
          borderRadius: "18px", boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
          padding: "32px", marginBottom: "40px", position: "relative",
        }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "#D4AF37", borderRadius: "18px 18px 0 0" }} />
          <div style={{ ...S.mono, fontSize: "11px", color: "#D4AF37", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "24px" }}>
            {editingId ? "EDIT CUSTOMER" : "NEW CUSTOMER"}
          </div>

          <form onSubmit={handleSave}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginBottom: "24px" }}>
              {[
                { name: "name", label: "Full Name", placeholder: "Rajesh Kumar", required: true },
                { name: "phoneNumber", label: "Phone Number", placeholder: "9876543210", required: true },
                { name: "aadhaarNo", label: "Aadhaar No", placeholder: "XXXX-XXXX-XXXX" },
                { name: "careOf", label: "Care Of", placeholder: "S/O Suresh Kumar" },
                { name: "address", label: "Address", placeholder: "123 MG Road, Kolkata" },
                { name: "creationDate", label: "Date", type: "date" },
              ].map(({ name, label, placeholder, required, type }) => (
                <div key={name}>
                  <label style={S.label}>{label}</label>
                  <input
                    name={name}
                    type={type || "text"}
                    value={form[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    required={required}
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

      {/* Customer Cards */}
      {loading ? (
        <div style={{ ...S.mono, fontSize: "13px", color: "#7C8593" }}>LOADING...</div>
      ) : customers.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.2 }}>👤</div>
          <div style={{ ...S.mono, fontSize: "11px", color: "#7C8593", letterSpacing: "0.15em" }}>NO CUSTOMERS YET</div>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "20px",
        }}>
          {customers.map(c => (
            <CustomerCard
              key={c.id}
              customer={c}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onDoubleClick={setSelectedCustomer}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Customers;