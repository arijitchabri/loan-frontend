import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import Customers from "./pages/Customers";
import Collaterals from "./pages/Collaterals";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("credentials")
  );

  const handleLogin = () => setIsLoggedIn(true);

  const handleLogout = () => {
    localStorage.removeItem("credentials");
    setIsLoggedIn(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route
          path="/login"
          element={
            isLoggedIn
              ? <Navigate to="/dashboard" />
              : <Login onLogin={handleLogin} />
          }
        />

        {/* Protected routes */}
        <Route
  path="/dashboard"
  element={
    isLoggedIn ? (
      <div>
        <Navbar onLogout={handleLogout} />
        <Dashboard />
      </div>
    ) : (
      <Navigate to="/login" />
    )
  }
/>

<Route
  path="/customers"
  element={
    isLoggedIn ? (
      <div>
        <Navbar onLogout={handleLogout} />
        <Customers />
      </div>
    ) : (
      <Navigate to="/login" />
    )
  }
/>

<Route
  path="/collaterals"
  element={
    isLoggedIn ? (
      <div>
        <Navbar onLogout={handleLogout} />
        <Collaterals />
      </div>
    ) : (
      <Navigate to="/login" />
    )
  }
/>

        {/* Catch all */}
        <Route
          path="*"
          element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;