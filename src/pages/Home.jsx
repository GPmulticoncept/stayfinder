import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=85',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1600&q=85',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1600&q=85',
];

const DESTINATIONS = [
  { city: 'Dubai',    country: 'UAE',       code: 'AE', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80' },
  { city: 'Paris',    country: 'France',    code: 'FR', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80' },
  { city: 'New York', country: 'USA',       code: 'US', img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&q=80' },
  { city: 'London',   country: 'UK',        code: 'GB', img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&q=80' },
  { city: 'Tokyo',    country: 'Japan',     code: 'JP', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80' },
  { city: 'Lagos',    country: 'Nigeria',   code: 'NG', img: 'https://images.unsplash.com/photo-1617176488832-b7c5e3f26a46?w=400&q=80' },
  { city: 'Abuja',    country: 'Nigeria',   code: 'NG', img: 'https://images.unsplash.com/photo-1609348445273-3f0b40c14f9e?w=400&q=80' },
  { city: 'Toronto',  country: 'Canada',    code: 'CA', img: 'https://images.unsplash.com/photo-1517090504586-fde19ea6066f?w=400&q=80' },
  { city: 'Sydney',   country: 'Australia', code: 'AU', img: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400&q=80' },
  { city: 'Cape Town',country: 'S. Africa', code: 'ZA', img: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=400&q=80' },
];

const FEATURES = [
  {
    icon: '🌍',
    title: '2M+ Hotels Worldwide',
    desc: 'Access over 2 million verified hotels across 196 countries — from budget to ultra-luxury.',
  },
  {
    icon: '💰',
    title: 'Best Price Guarantee',
    desc: 'We surface the lowest available rates so you never overpay for the same room again.',
  },
  {
    icon: '⚡',
    title: 'Instant Confirmation',
    desc: 'Real-time availability and instant booking confirmation. No waiting, no uncertainty.',
  },
  {
    icon: '🛡️',
    title: 'Secure Booking',
    desc: 'Your payment and personal data are protected with enterprise-grade security at every step.',
  },
  {
    icon: '🌟',
    title: 'Trusted Reviews',
    desc: 'Genuine guest reviews and verified star ratings help you choose with complete confidence.',
  },
  {
    icon: '📞',
    title: '24/7 WhatsApp Support',
    desc: 'Real humans available around the clock on WhatsApp to help with any booking question.',
  },
];

const getDateString = (offsetDays) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export default function Home() {
  const navigate = useNavigate();
  const [heroImg] = useState(HERO_IMAGES[Math.floor(Math.random() * HERO_IMAGES.length)]);
  const destRef = useRef(null);

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
    if (destRef.current) {
      destRef.current.scrollBy({ left: dir * 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="sf-home">

      {/* ── HERO ── */}
      <section className="sf-hero" style={{ backgroundImage: `url(${heroImg})` }}>
        <div className="sf-hero-overlay" />

        <div className="sf-hero-content">
          <span className="sf-hero-eyebrow">✦ 2M+ Hotels · 196 Countries</span>
          <h1 className="sf-hero-title">
            Find Your<br /><em>Perfect Stay.</em>
          </h1>
          <p className="sf-hero-sub">
            Discover and book world-class hotels at rates you won't find anywhere else. Luxury, comfort, and value — all in one search.
          </p>
        </div>

        <div className="sf-hero-search">
          <SearchBar />
        </div>
      </section>

      {/* ── DESTINATIONS ── */}
      <section className="sf-section" id="destinations">
        <div className="sf-section-head">
          <div>
            <p className="sf-section-label">Explore</p>
            <h2 className="sf-section-title">Popular Destinations</h2>
            <p className="sf-section-sub">The world's most sought-after travel spots, ready to book</p>
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
                src={dest.img}
                alt={dest.city}
                className="sf-dest-card-bg"
                loading="lazy"
                decoding="async"
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
          <div className="sf-stat">
            <strong className="sf-stat-value">2M+</strong>
            <span className="sf-stat-label">Hotels</span>
          </div>
          <div className="sf-stat-divider" />
          <div className="sf-stat">
            <strong className="sf-stat-value">196</strong>
            <span className="sf-stat-label">Countries</span>
          </div>
          <div className="sf-stat-divider" />
          <div className="sf-stat">
            <strong className="sf-stat-value">50M+</strong>
            <span className="sf-stat-label">Happy Guests</span>
          </div>
          <div className="sf-stat-divider" />
          <div className="sf-stat">
            <strong className="sf-stat-value">4.8★</strong>
            <span className="sf-stat-label">Avg Rating</span>
          </div>
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section className="sf-section sf-section--light" id="features">
        <div className="sf-section-inner">
          <div className="sf-section-head">
            <div>
              <p className="sf-section-label">Why Us</p>
              <h2 className="sf-section-title">The StayFinder Difference</h2>
              <p className="sf-section-sub">Everything you need for a flawless booking experience</p>
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
          <h2 className="sf-cta-title">Ready to find your perfect stay?</h2>
          <p className="sf-cta-sub">
            Join millions of smart travellers booking better with StayFinder.
          </p>
          <button
            className="sf-cta-btn"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Search Hotels Now →
          </button>
        </div>
      </div>

    </div>
  );
}
