import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo">
          <span className="logo-icon">🏨</span>
          <span className="logo-text">StayFinder</span>
        </Link>

        <nav className="header-nav">
          <Link to="/">Home</Link>
          <a href="#">Deals</a>
          <a href="#">Help</a>
        </nav>

        <div className="header-actions">
          <button className="btn-outline">Sign In</button>
          <button className="btn-primary">Register</button>
        </div>
      </div>
    </header>
  );
}
