import { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/AuthNavbar.css";

const AuthNavbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
      } catch (error) {
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed");
    }
  };

  return (
    <nav className="auth-navbar">
      <div className="auth-navbar-logo">🗺️ TravelBucket</div>

      <div className="auth-navbar-right">
        {user && (
          <span className="auth-navbar-user">{user.name.split(" ")[0]}</span>
        )}

        <button className="auth-navbar-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default AuthNavbar;
