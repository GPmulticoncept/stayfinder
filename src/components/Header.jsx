import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  return (
    <header className="header">
      {toast && (
        <div className="header-toast">
          <span>🔔</span> {toast}
        </div>
      )}
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
          <button
            className="btn-outline"
            onClick={() => showToast('Sign In coming in V2 — powered by Supabase.')}
          >
            Sign In
          </button>
          <button
            className="btn-primary"
            onClick={() => showToast('Registration coming in V2 — powered by Supabase.')}
          >
            Register
          </button>
        </div>
      </div>
    </header>
  );
}
