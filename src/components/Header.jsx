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
          <button className="btn-outline" onClick={() => alert('Sign In coming in V2 — user auth will be added with Supabase.')}>
            Sign In
          </button>
          <button className="btn-primary" onClick={() => alert('Registration coming in V2 — user auth will be added with Supabase.')}>
            Register
          </button>
        </div>
      </div>
    </header>
  );
}
