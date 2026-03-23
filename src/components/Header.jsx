import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const WHATSAPP_NUMBER = '2347034542773';
const WHATSAPP_MSG = encodeURIComponent('Hello, I would like to list my property on StayFinder.');

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Always solid on non-home pages
  const solid = scrolled || !isHome;

  const handleListProperty = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`, '_blank');
  };

  const closeDrawer = () => setDrawerOpen(false);

  return (
    <>
      <header className={`sf-header ${solid ? 'sf-header--solid' : 'sf-header--transparent'}`}>
        <div className="sf-header-inner">

          {/* Logo */}
          <Link to="/" className="sf-logo" onClick={closeDrawer}>
            <span className="sf-logo-icon">🏨</span>
            <span className="sf-logo-text">StayFinder</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="sf-nav">
            <Link to="/" className="sf-nav-link">Home</Link>
            <a href="/#destinations" className="sf-nav-link">Destinations</a>
            <a href="/#features" className="sf-nav-link">Why Us</a>
          </nav>

          {/* Desktop Right */}
          <div className="sf-header-right">
            <button className="sf-list-btn" onClick={handleListProperty}>
              🏠 List Your Property
            </button>

            {/* Mobile hamburger */}
            <button
              className={`sf-hamburger ${drawerOpen ? 'open' : ''}`}
              onClick={() => setDrawerOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <div
        className={`sf-drawer-overlay ${drawerOpen ? 'open' : ''}`}
        onClick={closeDrawer}
      />

      {/* Mobile Drawer */}
      <div className={`sf-drawer ${drawerOpen ? 'open' : ''}`}>
        <div className="sf-drawer-header">
          <Link to="/" className="sf-logo" onClick={closeDrawer}>
            <span className="sf-logo-icon">🏨</span>
            <span className="sf-logo-text" style={{ color: 'var(--navy)' }}>StayFinder</span>
          </Link>
          <button className="sf-drawer-close" onClick={closeDrawer}>✕</button>
        </div>

        <nav className="sf-drawer-nav">
          <Link to="/" className="sf-drawer-link" onClick={closeDrawer}>
            🏠 <span>Home</span>
          </Link>
          <a href="/#destinations" className="sf-drawer-link" onClick={closeDrawer}>
            🌍 <span>Destinations</span>
          </a>
          <a href="/#features" className="sf-drawer-link" onClick={closeDrawer}>
            ⭐ <span>Why StayFinder</span>
          </a>
        </nav>

        <div className="sf-drawer-footer">
          <button className="sf-drawer-list-btn" onClick={() => { handleListProperty(); closeDrawer(); }}>
            🏠 List Your Property
          </button>
        </div>
      </div>
    </>
  );
}
