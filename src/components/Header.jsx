import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';

const WHATSAPP_NUMBER = '2347034542773';
const WHATSAPP_MSG = encodeURIComponent('Hello, I would like to list my property on StayFinder.');

export default function Header() {
  const [scrolled,    setScrolled]    = useState(false);
  const [drawerOpen,  setDrawerOpen]  = useState(false);
  const [langOpen,    setLangOpen]    = useState(false);
  const location   = useLocation();
  const isHome     = location.pathname === '/';
  const langRef    = useRef(null);
  const { lang, setLang, t, meta } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close lang dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const solid = scrolled || !isHome;

  const handleListProperty = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`, '_blank');
  };

  const closeDrawer = () => setDrawerOpen(false);

  const currentMeta = meta[lang];
  const LANG_CODES = Object.keys(meta);

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
            <Link to="/" className="sf-nav-link">{t('home')}</Link>
            <a href="/#destinations" className="sf-nav-link">{t('destinations')}</a>
            <a href="/#features" className="sf-nav-link">{t('whyUs')}</a>
          </nav>

          {/* Desktop Right */}
          <div className="sf-header-right">

            {/* Language Switcher */}
            <div className="sf-lang-wrap" ref={langRef}>
              <button
                className={`sf-lang-btn ${solid ? 'sf-lang-btn--solid' : 'sf-lang-btn--transparent'}`}
                onClick={() => setLangOpen((v) => !v)}
                aria-label="Change language"
              >
                <span className="sf-lang-flag">{currentMeta?.flag}</span>
                <span className="sf-lang-code">{lang.toUpperCase()}</span>
                <span className="sf-lang-arrow">{langOpen ? '▲' : '▼'}</span>
              </button>

              {langOpen && (
                <div className="sf-lang-dropdown">
                  {LANG_CODES.map((code) => (
                    <button
                      key={code}
                      className={`sf-lang-option ${lang === code ? 'active' : ''}`}
                      onClick={() => { setLang(code); setLangOpen(false); }}
                    >
                      <span className="sf-lang-option-flag">{meta[code].flag}</span>
                      <span className="sf-lang-option-name">{meta[code].nativeName}</span>
                      {lang === code && <span className="sf-lang-option-check">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button className="sf-list-btn" onClick={handleListProperty}>
              🏠 {t('listProperty')}
            </button>

            {/* Mobile hamburger */}
            <button
              className={`sf-hamburger ${drawerOpen ? 'open' : ''}`}
              onClick={() => setDrawerOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <span /><span /><span />
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
            🏠 <span>{t('home')}</span>
          </Link>
          <a href="/#destinations" className="sf-drawer-link" onClick={closeDrawer}>
            🌍 <span>{t('destinations')}</span>
          </a>
          <a href="/#features" className="sf-drawer-link" onClick={closeDrawer}>
            ⭐ <span>{t('whyUs')}</span>
          </a>

          {/* Language options in drawer */}
          <div className="sf-drawer-lang-section">
            <p className="sf-drawer-lang-title">🌐 Language</p>
            <div className="sf-drawer-lang-grid">
              {LANG_CODES.map((code) => (
                <button
                  key={code}
                  className={`sf-drawer-lang-btn ${lang === code ? 'active' : ''}`}
                  onClick={() => { setLang(code); closeDrawer(); }}
                >
                  <span>{meta[code].flag}</span>
                  <span>{meta[code].nativeName}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>

        <div className="sf-drawer-footer">
          <button className="sf-drawer-list-btn" onClick={() => { handleListProperty(); closeDrawer(); }}>
            🏠 {t('listProperty')}
          </button>
        </div>
      </div>
    </>
  );
}
