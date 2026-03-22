import { Link } from 'react-router-dom';

const WHATSAPP_NUMBER = '2347034542773';
const WHATSAPP_MSG = encodeURIComponent('Hello, I would like to list my property on StayFinder.');

export default function Header() {
  const handleListProperty = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`, '_blank');
  };

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
          {/* Full button on desktop */}
          <button className="btn-list-property btn-list-property--full" onClick={handleListProperty}>
            🏠 List Your Property
          </button>
          {/* Icon-only on mobile */}
          <button className="btn-list-property btn-list-property--icon" onClick={handleListProperty} title="List Your Property">
            🏠
          </button>
        </div>
      </div>
    </header>
  );
}
