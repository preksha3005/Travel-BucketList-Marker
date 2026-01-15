import "../styles/Navbar.css";

const Navbar = () => {
  const handleAuth = () => {
    window.location.href = "http://localhost:3001/auth/google";
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        🗺️ TravelBucket
      </div>

      {/* Auth buttons */}
      <div className="navbar-actions">
        <button className="navbar-login" onClick={handleAuth}>
          Login
        </button>
        <button className="navbar-signup" onClick={handleAuth}>
          Sign Up
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
