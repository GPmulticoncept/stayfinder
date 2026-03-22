import { useState } from 'react';
import { Link } from 'react-router-dom';

// Replace with your actual WhatsApp number (no + or spaces)
const WHATSAPP_NUMBER = '2347034542773';
const WHATSAPP_MSG = encodeURIComponent('Hello, I would like to list my property on StayFinder.');

export default function Header() {
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const handleListProperty = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`, '_blank');
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
          <button className="btn-list-property" onClick={handleListProperty}>
            🏠 List Your Property
          </button>
        </div>
      </div>
    </header>
  );
}
