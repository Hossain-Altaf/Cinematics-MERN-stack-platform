import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">Cinematics</Link>
      <div className="nav-links">
        <Link to="/news">News</Link>
        {user ? (
          <>
            <Link to="/watchlist">Watchlist</Link>
            <Link to="/watched">Watched</Link>
            {isAdmin && <Link to="/admin">Admin</Link>}
            <button onClick={handleLogout}>Logout ({user.name})</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/admin-register">Admin Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;