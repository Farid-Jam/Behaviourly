import { NavLink, Link } from "react-router-dom";
import "./SiteHeader.css";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/" className="site-logo">
          Behaviourly
        </Link>
        <nav className="site-nav">
          <NavLink to="/" end className="site-nav-link">
            Home
          </NavLink>
          <NavLink to="/home" className="site-nav-link">
            Dashboard
          </NavLink>
          <NavLink to="/profile" className="site-nav-link">
            Profile
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
