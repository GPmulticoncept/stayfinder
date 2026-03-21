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
  {
    icon: '🌍',
    title: '2M+ Hotels Worldwide',
    desc: 'From budget stays to luxury resorts across 196 countries — all in one place.',
  },
  {
    icon: '💰',
    title: 'Best Price Guarantee',
    desc: 'We compare rates in real-time so you always book at the lowest price available.',
  },
  {
    icon: '⚡',
    title: 'Instant Confirmation',
    desc: 'Real-time availability with immediate booking confirmation, every time.',
  },
];

const fmt = (d) => d.toISOString().split('T')[0];

export default function Home() {
  const navigate = useNavigate();

  const handleDestClick = (dest) => {
    const d1 = new Date(); d1.setDate(d1.getDate() + 1);
    const d2 = new Date(); d2.setDate(d2.getDate() + 2);
    const params = new URLSearchParams({
      city: dest.city,
      countryCode: dest.code,
      checkin: fmt(d1),
      checkout: fmt(d2),
      adults: '2',
      currency: 'USD',
    });
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div>
      <section className="hero">
        <div className="hero-badge">✈️ 2,000,000+ hotels worldwide</div>
        <h1>Find Your Perfect <span>Stay</span></h1>
        <p>Compare prices across millions of hotels in 196 countries</p>
        <SearchBar />
        <div className="hero-stats">
          <div className="hero-stat"><strong>2M+</strong><span>Hotels</span></div>
          <div className="hero-stat"><strong>196</strong><span>Countries</span></div>
          <div className="hero-stat"><strong>24/7</strong><span>Support</span></div>
        </div>
      </section>

      <section className="destinations-section">
        <div className="container">
          <div className="section-header">
            <h2>Popular Destinations</h2>
            <p>Explore top cities around the world</p>
          </div>
          <div className="destinations-grid">
            {DESTINATIONS.map((dest) => (
              <div key={dest.city} className="dest-card" onClick={() => handleDestClick(dest)}>
                <div className="dest-inner">
                  <span className="dest-emoji">{dest.emoji}</span>
                  <span className="dest-name">{dest.city}</span>
                  <span className="dest-country">{dest.country}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Why StayFinder?</h2>
            <p>Everything you need to book the perfect stay</p>
          </div>
          <div className="features-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="feature-item">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
