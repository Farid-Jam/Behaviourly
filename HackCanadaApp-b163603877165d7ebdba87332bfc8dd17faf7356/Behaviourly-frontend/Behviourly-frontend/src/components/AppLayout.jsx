import { NavLink, Outlet } from "react-router-dom";
import "./AppLayout.css";

export default function AppLayout() {
  return (
    <div className="app-layout">
      <main className="app-layout-main">
        <Outlet />
      </main>
      <nav className="app-nav">
        <NavLink to="/home" className={({ isActive }) => (isActive ? "app-nav-link active" : "app-nav-link")}>
          <span className="app-nav-icon">🏠</span>
          <span>Home</span>
        </NavLink>
        <NavLink to="/camera" className={({ isActive }) => (isActive ? "app-nav-link active" : "app-nav-link")}>
          <span className="app-nav-icon">📷</span>
          <span>Camera</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => (isActive ? "app-nav-link active" : "app-nav-link")}>
          <span className="app-nav-icon">👤</span>
          <span>Profile</span>
        </NavLink>
      </nav>
    </div>
  );
}
