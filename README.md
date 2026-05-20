# 🏦 Loan Manager — Frontend

<div align="center">

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-HTTP-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

> A modern, minimal React frontend for the [Loan Management System](https://github.com/arijitchabri/loan_management_system) Spring Boot backend. Features a dark gold theme, card-based UI, and full CRUD for customers and collaterals.

</div>

---

## 📌 Project Status

| Module | Status |
|---|---|
| 🔐 Login & Authentication | ✅ Complete |
| 🏠 Dashboard | ✅ Complete |
| 👤 Customer Management | ✅ Complete |
| 🏠 Collateral Management | ✅ Complete |
| 🔍 Customer → Collateral Drill-down | ✅ Complete |
| 💰 Loan Management UI | 🚧 In Progress |
| 💳 Payment Management UI | 🚧 In Progress |

---

## ✨ Features

- 🔐 **Secure Login** — HTTP Basic Auth connected to Spring Security backend, credentials stored in localStorage
- 🎨 **Dark Gold Theme** — Custom dark navy (`#0F1115`) with gold accents (`#D4AF37`), Inter + JetBrains Mono typography
- 👤 **Customer Management** — Add, edit, delete customers with full profile details (name, phone, Aadhaar, address, care-of)
- 🏠 **Collateral Management** — Full CRUD for collaterals with type, weight, estimated value, description and remarks
- 🔍 **Drill-down View** — Double-click any customer card to view all their collaterals, total count and total ₹ value
- ➕ **Contextual Add** — Adding a collateral from inside a customer's view pre-fills the customer automatically
- 🃏 **Card-based UI** — Animated hover cards with gold accent sweep, no tables
- 🔢 **Live Stats** — Total collateral count and combined estimated value shown per customer
- 🧭 **Sticky Navbar** — Active route highlighting, one-click logout

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS + Inline styles |
| HTTP Client | Axios |
| Routing | React Router DOM v6 |
| Typography | Inter + JetBrains Mono (Google Fonts) |
| Auth | HTTP Basic Auth (Base64 encoded) |

---

## 📁 Project Structure

```
loan-frontend/
│
├── src/
│   ├── api/
│   │   └── axios.js              # Axios instance — auto-attaches Basic Auth header
│   │
│   ├── components/
│   │   └── Navbar.jsx            # Sticky nav with active route & logout
│   │
│   ├── pages/
│   │   ├── Login.jsx             # Auth page — validates credentials against backend
│   │   ├── Dashboard.jsx         # Overview with module cards
│   │   ├── Customers.jsx         # Customer list + detail drill-down + collateral management
│   │   └── Collaterals.jsx       # Standalone collaterals page with customer filter
│   │
│   ├── styles.js                 # Shared style tokens (S.card, S.input, S.btnPrimary etc.)
│   ├── App.jsx                   # Router + auth state
│   ├── main.jsx                  # React entry point
│   └── index.css                 # Global styles, scrollbar, Tailwind directives
│
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## ⚙️ Getting Started

### Prerequisites

- **Node.js 18+** — [Download](https://nodejs.org)
- **Loan Management System backend** running at `http://localhost:8080`
  → [Backend Repo](https://github.com/arijitchabri/loan_management_system)

---

### 1. Clone the Repository

```bash
git clone https://github.com/arijitchabri/loan-frontend.git
cd loan-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Dev Server

```bash
npm run dev
```

App runs at: **`http://localhost:5173`**

> ⚠️ Make sure the Spring Boot backend is running at `http://localhost:8080` before logging in.

---

## 🔐 Authentication

This app uses **HTTP Basic Authentication** — the same mechanism as the Spring Boot backend.

On login:
1. Credentials are Base64-encoded (`btoa("username:password")`)
2. Stored in `localStorage` as `credentials`
3. Attached automatically to every Axios request via a request interceptor

On logout:
- Credentials are removed from `localStorage`
- User is redirected to `/login`

> To create a user, go to `http://localhost:8080/h2-console` and insert a row into the `USERS` table with a BCrypt-hashed password.

---

## 🖥️ Pages & Features

### 🔐 Login
- Clean centered card with grid background and ghost "LOAN" watermark
- Gold gradient top accent bar
- Input fields glow gold on focus
- Shows error message on wrong credentials

### 🏠 Dashboard
- 4-card grid: Customers, Collaterals, Loans (coming soon), Payments (coming soon)
- Click active cards to navigate
- Inactive cards shown as dimmed placeholders

### 👤 Customers
- Card grid with hover animation (gold sweep across top)
- **Double-click** any card → Customer Detail View
- Add / Edit form slides in above cards
- Delete with confirmation

#### Customer Detail View (drill-down)
- Accessed by double-clicking a customer card
- Shows customer summary banner with:
  - Name, phone, Aadhaar
  - Total collateral count
  - Total estimated value (₹)
- Lists all collaterals for that customer as cards
- **+ Add Collateral** button — customer pre-filled automatically
- Empty state with direct add button
- ← Back button returns to customer list

### 🏠 Collaterals (standalone page)
- Filter by customer using dropdown
- Full CRUD — add, edit, delete
- Each card shows: type, estimated value (₹ in gold), weight, description, remark

---

## 🔗 Backend Connection

This frontend connects to the [Loan Management System](https://github.com/arijitchabri/loan_management_system) Spring Boot backend.

| Frontend Route | Backend API |
|---|---|
| Login validation | `GET /customer/` |
| All customers | `GET /customer/` |
| Add customer | `POST /customer/add` |
| Update customer | `PUT /customer/{id}` |
| Delete customer | `DELETE /customer/{id}` |
| All collaterals | `GET /collaterals/all` |
| Collaterals by customer | `GET /collaterals/customer/{id}` |
| Add collateral | `POST /collaterals/` |
| Update collateral | `PUT /collaterals/{id}` |
| Delete collateral | `DELETE /collaterals/{id}` |

---

## 🗺️ Roadmap

- [x] Login with Spring Security Basic Auth
- [x] Customer CRUD with card UI
- [x] Collateral CRUD with card UI
- [x] Customer → Collateral drill-down view
- [x] Dark gold theme with animations
- [ ] Loan management UI 🚧
- [ ] Payment & EMI tracking UI 🚧
- [ ] JWT Authentication (upgrade from Basic Auth)
- [ ] Search & filter customers
- [ ] Print / export customer collateral report
- [ ] Mobile responsive layout

---

## 🤝 Related Repositories

| Repo | Description |
|---|---|
| [loan_management_system](https://github.com/arijitchabri/loan_management_system) | Spring Boot 4 REST API backend |
| [loan-frontend](https://github.com/arijitchabri/loan-frontend) | This repo — React frontend |

---

## 👨‍💻 Author

**Arijit Chabri**
- GitHub: [@arijitchabri](https://github.com/arijitchabri)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  Built with ⚛️ React &nbsp;|&nbsp; ⚡ Vite &nbsp;|&nbsp; 🍃 Spring Boot &nbsp;|&nbsp; ❤️ from Kolkata
</div>
