import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar__logo">
        Event<span>Hub</span>
      </Link>

      <div className="navbar__links">
        <Link to="/">Browse</Link>

        {user?.role === "organizer" && <Link to="/dashboard">Dashboard</Link>}
        {user && <Link to="/my-tickets">My Tickets</Link>}

        {user ? (
          <>
            <span className="navbar__user">{user.name}</span>
            <button className="btn btn--ghost-inverse" onClick={handleLogout}>
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Log in</Link>
            <Link to="/signup" className="btn btn--primary">
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
