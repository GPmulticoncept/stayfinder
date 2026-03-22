import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';

const DESTINATIONS = [
  { city: 'Dubai', country: 'UAE', code: 'AE', emoji: '🇦🇪' },
  { city: 'Paris', country: 'France', code: 'FR', emoji: '🇫🇷' },
  { city: 'New York', country: 'USA', code: 'US', emoji: '🇺🇸' },
  { city: 'London', country: 'UK', code: 'GB', emoji: '🇬🇧' },
  { city: 'Tokyo', country: 'Japan', code: 'JP', emoji: '🇯🇵' },
  { city: 'Lagos', country: 'Nigeria', code: 'NG', emoji: '🇳🇬' },
  { city: 'Toronto', country: 'Canada', code: 'CA', emoji: '🇨🇦' },
  { city: 'Sydney', country: 'Australia', code: 'AU', emoji: '🇦🇺' },
];

const FEATURES = [
  { icon: '🌍', title: '2M+ Hotels Worldwide', desc: 'Access over 2 million hotels across 196 countries at the best rates.' },
  { icon: '💰', title: 'Best Price Guarantee', desc: 'We match any lower price you find. Book with total confidence.' },
  { icon: '⚡', title: 'Instant Confirmation', desc: 'Get your booking confirmed immediately with no waiting time.' },
];

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80',
];

export default function Home() {
  const navigate = useNavigate();
  const [heroImg] = useState(HERO_IMAGES[Math.floor(Math.random() * HERO_IMAGES.length)]);
  const destRef = useRef(null);

  const handleDestClick = (dest) => {
    navigate('/search', {
      state: {
        searchParams: {
          countryCode: dest.code,
          checkin: getTomorrow(),
          checkout: getDayAfter(),
          adults: 2,
          currency: 'USD',
        }
      }
    });
  };

  const getTomorrow = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const getDayAfter = () => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  };

  const scrollDest = (dir) => {
    if (destRef.current) {
      destRef.current.scrollBy({ left: dir * 220, behavior: 'smooth' });
    }
  };

  return (
    <div className="home-page">

      {/* HERO */}
      <section className="home-hero" style={{ backgroundImage: `url(${heroImg})` }}>
        <div className="home-hero-overlay" />
        <div className="home-hero-content">
          <span className="home-hero-badge">✨ 2M+ Hotels in 196 Countries</span>
          <h1 className="home-hero-title">
            Same Stays.<br /><span>Better Prices.</span>
          </h1>
          <p className="home-hero-sub">Find and book the perfect hotel worldwide at the lowest rates.</p>
        </div>
        <div className="home-search-float">
          <SearchBar />
        </div>
      </section>

      {/* DESTINATIONS */}
      <section className="home-section" id="destinations">
        <div className="home-section-head">
          <div>
            <h2>Popular Destinations</h2>
            <p>Explore top travel spots around the world</p>
          </div>
          <div className="home-scroll-btns">
            <button onClick={() => scrollDest(-1)}>‹</button>
            <button onClick={() => scrollDest(1)}>›</button>
          </div>
        </div>
        <div className="home-dest-scroll" ref={destRef}>
          {DESTINATIONS.map((dest) => (
            <div
              key={dest.city}
              className="home-dest-card"
              onClick={() => handleDestClick(dest)}
            >
              <div className="home-dest-emoji">{dest.emoji}</div>
              <div className="home-dest-name">{dest.city}</div>
              <div className="home-dest-country">{dest.country}</div>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="home-stats">
        <div className="home-stats-inner">
          <div className="home-stat">
            <strong>2M+</strong>
            <span>Hotels</span>
          </div>
          <div className="home-stat-divider" />
          <div className="home-stat">
            <strong>196</strong>
            <span>Countries</span>
          </div>
          <div className="home-stat-divider" />
          <div className="home-stat">
            <strong>50M+</strong>
            <span>Happy Guests</span>
          </div>
          <div className="home-stat-divider" />
          <div className="home-stat">
            <strong>4.8★</strong>
            <span>Avg Rating</span>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="home-section home-section--light" id="features">
        <div className="home-section-head">
          <div>
            <h2>Why StayFinder?</h2>
            <p>Everything you need to book the perfect stay</p>
          </div>
        </div>
        <div className="home-features-grid">
          {FEATURES.map((f) => (
            <div key={f.title} className="home-feature-card">
              <div className="home-feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="home-cta">
        <div className="home-cta-inner">
          <h2>Ready to find your perfect stay?</h2>
          <p>Join millions of travellers booking smarter with StayFinder.</p>
          <button
            className="home-cta-btn"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Search Hotels Now
          </button>
        </div>
      </section>

    </div>
  );
}
