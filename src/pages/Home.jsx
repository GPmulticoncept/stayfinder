import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import { useLanguage } from '../i18n/LanguageContext';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=85',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1600&q=85',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1600&q=85',
];

const DESTINATIONS = [
  { city: 'Dubai',     country: 'UAE',        code: 'AE', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80' },
  { city: 'Paris',     country: 'France',     code: 'FR', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80' },
  { city: 'New York',  country: 'USA',        code: 'US', img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&q=80' },
  { city: 'London',    country: 'UK',         code: 'GB', img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&q=80' },
  { city: 'Tokyo',     country: 'Japan',      code: 'JP', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80' },
  { city: 'Lagos',     country: 'Nigeria',    code: 'NG', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80' },
  { city: 'Abuja',     country: 'Nigeria',    code: 'NG', img: 'https://images.unsplash.com/photo-1523978591478-c753949ff840?w=400&q=80' },
  { city: 'Toronto',   country: 'Canada',     code: 'CA', img: 'https://images.unsplash.com/photo-1517090504586-fde19ea6066f?w=400&q=80' },
  { city: 'Sydney',    country: 'Australia',  code: 'AU', img: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400&q=80' },
  { city: 'Cape Town', country: 'S. Africa',  code: 'ZA', img: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=400&q=80' },
];

const getDateString = (offsetDays) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export default function Home() {
  const navigate = useNavigate();
  const { t }    = useLanguage();
  const [heroImg] = useState(HERO_IMAGES[Math.floor(Math.random() * HERO_IMAGES.length)]);
  const destRef   = useRef(null);

  const FEATURES = [
    { icon: '🌍', title: t('feature1Title'), desc: t('feature1Desc') },
    { icon: '💰', title: t('feature2Title'), desc: t('feature2Desc') },
    { icon: '⚡', title: t('feature3Title'), desc: t('feature3Desc') },
    { icon: '🛡️', title: t('feature4Title'), desc: t('feature4Desc') },
    { icon: '🌟', title: t('feature5Title'), desc: t('feature5Desc') },
    { icon: '📞', title: t('feature6Title'), desc: t('feature6Desc') },
  ];

  const handleDestClick = (dest) => {
    const params = new URLSearchParams({
      city:        dest.city,
      countryCode: dest.code,
      checkin:     getDateString(1),
      checkout:    getDateString(2),
      adults:      '2',
      currency:    dest.code === 'NG' ? 'NGN' : 'USD',
    });
    navigate(`/search?${params.toString()}`);
  };

  const scrollDest = (dir) => {
    if (destRef.current) destRef.current.scrollBy({ left: dir * 200, behavior: 'smooth' });
  };

  return (
    <div className="sf-home">

      {/* ── HERO ── */}
      <section className="sf-hero" style={{ backgroundImage: `url(${heroImg})` }}>
        <div className="sf-hero-overlay" />
        <div className="sf-hero-content">
          <span className="sf-hero-eyebrow">{t('heroEyebrow')}</span>
          <h1 className="sf-hero-title">
            {t('heroTitle1')}<br /><em>{t('heroTitle2')}</em>
          </h1>
          <p className="sf-hero-sub">{t('heroSub')}</p>
        </div>
        <div className="sf-hero-search">
          <SearchBar />
        </div>
      </section>

      {/* ── DESTINATIONS ── */}
      <section className="sf-section" id="destinations">
        <div className="sf-section-head">
          <div>
            <p className="sf-section-label">{t('exploreLabel')}</p>
            <h2 className="sf-section-title">{t('popularDestinations')}</h2>
            <p className="sf-section-sub">{t('popularDestinationsSub')}</p>
          </div>
          <div className="sf-scroll-btns">
            <button className="sf-scroll-btn" onClick={() => scrollDest(-1)} aria-label="Scroll left">‹</button>
            <button className="sf-scroll-btn" onClick={() => scrollDest(1)}  aria-label="Scroll right">›</button>
          </div>
        </div>

        <div className="sf-dest-scroll" ref={destRef}>
          {DESTINATIONS.map((dest) => (
            <div
              key={`${dest.city}-${dest.code}`}
              className="sf-dest-card"
              onClick={() => handleDestClick(dest)}
            >
              <img
                src={dest.img} alt={dest.city}
                className="sf-dest-card-bg"
                loading="lazy" decoding="async"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.style.background = 'linear-gradient(135deg, #1e3254, #0d1b2a)';
                }}
              />
              <div className="sf-dest-card-overlay" />
              <div className="sf-dest-card-info">
                <div className="sf-dest-city">{dest.city}</div>
                <div className="sf-dest-country">{dest.country}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="sf-stats-band">
        <div className="sf-stats-inner">
          <div className="sf-stat"><strong className="sf-stat-value">2M+</strong><span className="sf-stat-label">{t('hotels')}</span></div>
          <div className="sf-stat-divider" />
          <div className="sf-stat"><strong className="sf-stat-value">196</strong><span className="sf-stat-label">{t('countries')}</span></div>
          <div className="sf-stat-divider" />
          <div className="sf-stat"><strong className="sf-stat-value">50M+</strong><span className="sf-stat-label">{t('happyGuests')}</span></div>
          <div className="sf-stat-divider" />
          <div className="sf-stat"><strong className="sf-stat-value">4.8★</strong><span className="sf-stat-label">{t('avgRating')}</span></div>
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section className="sf-section sf-section--light" id="features">
        <div className="sf-section-inner">
          <div className="sf-section-head">
            <div>
              <p className="sf-section-label">{t('whyUsLabel')}</p>
              <h2 className="sf-section-title">{t('whyStayFinder')}</h2>
              <p className="sf-section-sub">{t('whyStayFinderSub')}</p>
            </div>
          </div>
          <div className="sf-features-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="sf-feature-card">
                <div className="sf-feature-icon-wrap">{f.icon}</div>
                <h3 className="sf-feature-title">{f.title}</h3>
                <p className="sf-feature-text">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="sf-cta-band">
        <div className="sf-cta-inner">
          <h2 className="sf-cta-title">{t('readyTitle')}</h2>
          <p className="sf-cta-sub">{t('readySub')}</p>
          <button
            className="sf-cta-btn"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            {t('searchNow')}
          </button>
        </div>
      </div>

    </div>
  );
}
