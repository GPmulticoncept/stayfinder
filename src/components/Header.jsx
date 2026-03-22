import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo">
          <span className="logo-icon">🏨</span>
          <span className="logo-text">StayFinder</span>
        </Link>

        <nav className="header-nav">
          <Link to="/">Home</Link>
          <a href="#destinations">Destinations</a>
          <a href="#features">Why Us</a>
        </nav>

        <div className="header-actions">
          <button className="btn-outline" onClick={() => {}}>
            Sign In
          </button>
          <button className="btn-primary" onClick={() => {}}>
            Register
          </button>
        </div>
      </div>
    </header>
  );
}
