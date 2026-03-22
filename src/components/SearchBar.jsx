import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'AE', name: 'UAE' },
  { code: 'TR', name: 'Turkey' },
  { code: 'TH', name: 'Thailand' },
  { code: 'JP', name: 'Japan' },
  { code: 'SG', name: 'Singapore' },
  { code: 'AU', name: 'Australia' },
  { code: 'CA', name: 'Canada' },
  { code: 'IN', name: 'India' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'GH', name: 'Ghana' },
  { code: 'KE', name: 'Kenya' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'EG', name: 'Egypt' },
  { code: 'MA', name: 'Morocco' },
];

const CURRENCIES = [
  { code: 'USD', label: '$ USD' },
  { code: 'EUR', label: '€ EUR' },
  { code: 'GBP', label: '£ GBP' },
  { code: 'AED', label: 'د.إ AED' },
  { code: 'NGN', label: '₦ NGN' },
  { code: 'GHS', label: '₵ GHS' },
  { code: 'ZAR', label: 'R ZAR' },
  { code: 'KES', label: 'Ksh KES' },
  { code: 'JPY', label: '¥ JPY' },
  { code: 'AUD', label: 'A$ AUD' },
  { code: 'CAD', label: 'C$ CAD' },
  { code: 'INR', label: '₹ INR' },
];

const fmt = (d) => d.toISOString().split('T')[0];

const tomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return fmt(d);
};

const dayAfter = () => {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  return fmt(d);
};

export default function SearchBar({ initialValues = {} }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    city: initialValues.city || '',
    countryCode: initialValues.countryCode || 'US',
    checkin: initialValues.checkin || tomorrow(),
    checkout: initialValues.checkout || dayAfter(),
    adults: initialValues.adults || 2,
    currency: initialValues.currency || 'USD',
  });

  const [cityError, setCityError] = useState('');

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'city' && cityError) setCityError('');
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.city.trim()) {
      setCityError('Please enter a destination city.');
      return;
    }
    setCityError('');
    const params = new URLSearchParams({
      city: form.city.trim(),
      countryCode: form.countryCode,
      checkin: form.checkin,
      checkout: form.checkout,
      adults: String(form.adults),
      currency: form.currency,
    });
    navigate(`/search?${params.toString()}`);
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="search-card">
        <div className="search-grid">
          <div className="search-field">
            <label>City</label>
            <input
              type="text"
              name="city"
              placeholder="Paris, Dubai, Lagos..."
              value={form.city}
              onChange={onChange}
              className={cityError ? 'search-input--error' : ''}
            />
            {cityError && <span className="search-field-error">{cityError}</span>}
          </div>

          <div className="search-field">
            <label>Country</label>
            <select name="countryCode" value={form.countryCode} onChange={onChange}>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="search-field">
            <label>Check-in</label>
            <input
              type="date"
              name="checkin"
              value={form.checkin}
              min={tomorrow()}
              onChange={onChange}
            />
          </div>

          <div className="search-field">
            <label>Check-out</label>
            <input
              type="date"
              name="checkout"
              value={form.checkout}
              min={form.checkin}
              onChange={onChange}
            />
          </div>

          <div className="search-field">
            <label>Guests</label>
            <select name="adults" value={form.adults} onChange={onChange}>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>{n} Adult{n > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>

          <div className="search-field">
            <label>Currency</label>
            <select name="currency" value={form.currency} onChange={onChange}>
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className="search-btn-wrap">
            <button type="submit" className="search-btn">
              🔍 Search
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
