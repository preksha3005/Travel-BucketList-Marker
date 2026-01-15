import { useEffect } from "react";
import Navbar from "../components/Navbar";
import "../styles/Landing.css";
import api from "../api/axios.jsx";

const Landing = () => {
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/me");
        if (res.data) {
          window.location.href = "/dashboard";
        }
      } catch (error) {
        // user not logged in → do nothing
      }
    };

    checkAuth();
  }, []);

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3001/auth/google";
  };

  return (
    <>
      <Navbar />

      <main className="landing">
        <h1 className="landing-title">Pin Your Travel Dreams on a Map</h1>

        <p className="landing-subtitle">
          Save places you want to visit, mark the ones you’ve been to, and
          visualize your travel journey.
        </p>

        <button className="landing-cta" onClick={handleGoogleLogin}>
          Get Started with Google
        </button>
      </main>
    </>
  );
};

export default Landing;
