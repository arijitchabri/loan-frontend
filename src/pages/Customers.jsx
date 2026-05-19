import { useEffect, useState } from "react";
import api from "../api/axios";
import { S } from "../styles";

const emptyForm = {
  name: "",
  phoneNumber: "",
  address: "",
  careOf: "",
  aadhaarNo: "",
  creationDate: "",
};

function CustomerCard({ customer, onEdit, onDelete }) {
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

      {/* Header row */}
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
            Customer
          </div>
          <div style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#fff",
            letterSpacing: "-0.02em",
          }}>
            {customer.name}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={() => onEdit(customer)}
            style={{
              ...S.mono,
              fontSize: "10px",
              color: "#555",
              background: "none",
              border: "none",
              cursor: "pointer",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: 0,
              transition: "color 0.2s",
            }}
            onMouseOver={e => e.target.style.color = "#fff"}
            onMouseOut={e => e.target.style.color = "#555"}
          >
            EDIT
          </button>
          <button
            onClick={() => onDelete(customer.id)}
            style={{
              ...S.mono,
              fontSize: "10px",
              color: "#555",
              background: "none",
              border: "none",
              cursor: "pointer",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: 0,
              transition: "color 0.2s",
            }}
            onMouseOver={e => e.target.style.color = "#ff4444"}
            onMouseOut={e => e.target.style.color = "#555"}
          >
            DEL
          </button>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: "#1a1a1a" }} />

      {/* Details grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {[
          { label: "Phone", value: customer.phoneNumber },
          { label: "Aadhaar", value: customer.aadhaarNo },
          { label: "Care Of", value: customer.careOf },
          { label: "Address", value: customer.address },
        ].map(({ label, value }) => (
          <div key={label}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "9px",
              color: "#444",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: "4px",
            }}>
              {label}
            </div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "12px",
              color: "#888",
            }}>
              {value || "—"}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      {customer.creationDate && (
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "10px",
          color: "#2a2a2a",
          textAlign: "right",
        }}>
          {new Date(customer.creationDate).toLocaleDateString("en-IN")}
        </div>
      )}
    </div>
  );
}

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchCustomers = async () => {
    try {
      const res = await api.get("/customer/");
      setCustomers(res.data);
    } catch (err) {
      setError("Failed to load customers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (customer) => {
    setForm({
      name: customer.name,
      phoneNumber: customer.phoneNumber,
      address: customer.address,
      careOf: customer.careOf,
      aadhaarNo: customer.aadhaarNo,
      creationDate: customer.creationDate
        ? new Date(customer.creationDate).toISOString().split("T")[0]
        : "",
    });
    setEditingId(customer.id);
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/customer/${editingId}`, form);
      } else {
        await api.post("/customer/add", form);
      }
      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
      fetchCustomers();
    } catch {
      setError("Failed to save customer.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this customer?")) return;
    try {
      await api.delete(`/customer/${id}`);
      fetchCustomers();
    } catch {
      setError("Failed to delete customer.");
    }
  };

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
            {customers.length} RECORDS
          </div>
          <h1 style={S.pageTitle}>Customers</h1>
        </div>
        <button
          onClick={handleAdd}
          style={S.btnPrimary}
          onMouseOver={e => e.currentTarget.style.background = "#e0e0e0"}
          onMouseOut={e => e.currentTarget.style.background = "#fff"}
        >
          + ADD CUSTOMER
        </button>
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
      ) : customers.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.2 }}>👤</div>
          <div style={{ ...S.mono, fontSize: "11px", color: "#333", letterSpacing: "0.15em" }}>NO CUSTOMERS YET</div>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "1px",
          background: "#1a1a1a",
        }}>
          {customers.map((c) => (
            <CustomerCard
              key={c.id}
              customer={c}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Customers;