import { NavLink } from 'react-router-dom';

function linkClass({ isActive }) {
  return isActive ? 'nav-link active' : 'nav-link';
}

export default function NavBar() {
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
    </header>
  );
}
