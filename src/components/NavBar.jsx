import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function linkClass({ isActive }) {
  return isActive ? 'nav-link active' : 'nav-link';
}

export default function NavBar() {
  const { user, logOut } = useAuth();

  return (
    <header className="navbar">
      <nav className="nav-links">
        <NavLink to="/" end className={linkClass}>
          Home
        </NavLink>
        <NavLink to="/products" className={linkClass}>
          Products
        </NavLink>
      </nav>

      <div className="nav-actions">
        {user ? (
          <>
            <span className="username">{user.username}</span>
            <button type="button" onClick={logOut}>
              Logout
            </button>
          </>
        ) : (
          <NavLink to="/login" className={linkClass}>
            Login
          </NavLink>
        )}
      </div>
    </header>
  );
}
