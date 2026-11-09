import { Outlet } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import NavBar from './NavBar.jsx';

export default function Layout() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  function toggleTheme() {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'));
  }

  return (
    <div className={`app theme-${theme}`}>
      <NavBar theme={theme} onToggleTheme={toggleTheme} />
      <main className="content">
        <Outlet />
      </main>
      <footer className="footer">Assignment 7 · Mini Shop · Data from DummyJSON</footer>
    </div>
  );
}
