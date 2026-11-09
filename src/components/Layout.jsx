import { Outlet } from 'react-router-dom';
import NavBar from './NavBar.jsx';

export default function Layout() {
  return (
    <div className="app">
      <NavBar />
      <main className="content">
        <Outlet />
      </main>
      <footer className="footer">Assignment 7 · Mini Shop · Data from DummyJSON</footer>
    </div>
  );
}
