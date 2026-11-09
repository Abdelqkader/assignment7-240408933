import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { selectItemCount, useCartStore } from '../store/cartStore.js';

function linkClass({ isActive }) {
  return isActive ? 'nav-link active' : 'nav-link';
}

export default function NavBar({ theme, onToggleTheme }) {
  const { user, logOut } = useAuth();
  // A number: the bar only re-renders when the count itself changes.
  const itemCount = useCartStore(selectItemCount);

  return (
    <header className="navbar">
      <nav className="nav-links">
        <NavLink to="/" end className={linkClass}>
          Home
        </NavLink>
        <NavLink to="/products" className={linkClass}>
          Products
        </NavLink>
        <NavLink to="/cart" className={linkClass}>
          Cart ({itemCount})
        </NavLink>
      </nav>

      <div className="nav-actions">
        <button type="button" onClick={onToggleTheme}>
          {theme === 'light' ? 'Dark mode' : 'Light mode'}
        </button>
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
