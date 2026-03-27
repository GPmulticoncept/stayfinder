import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';

const COUNTRIES = [
  { code: 'US', name: 'United States' },{ code: 'GB', name: 'United Kingdom' },
  { code: 'FR', name: 'France' },       { code: 'DE', name: 'Germany' },
  { code: 'IT', name: 'Italy' },        { code: 'ES', name: 'Spain' },
  { code: 'AE', name: 'UAE' },          { code: 'TR', name: 'Turkey' },
  { code: 'TH', name: 'Thailand' },     { code: 'JP', name: 'Japan' },
  { code: 'SG', name: 'Singapore' },    { code: 'AU', name: 'Australia' },
  { code: 'CA', name: 'Canada' },       { code: 'IN', name: 'India' },
  { code: 'BR', name: 'Brazil' },       { code: 'MX', name: 'Mexico' },
  { code: 'NG', name: 'Nigeria' },      { code: 'GH', name: 'Ghana' },
  { code: 'KE', name: 'Kenya' },        { code: 'ZA', name: 'South Africa' },
  { code: 'EG', name: 'Egypt' },        { code: 'MA', name: 'Morocco' },
  { code: 'TZ', name: 'Tanzania' },     { code: 'SN', name: 'Senegal' },
  { code: 'CI', name: "Côte d'Ivoire" },
];

const CURRENCIES = [
  { code: 'USD', label: '$ USD' },{ code: 'EUR', label: '€ EUR' },
  { code: 'GBP', label: '£ GBP' },{ code: 'AED', label: 'AED' },
  { code: 'NGN', label: '₦ NGN' },{ code: 'GHS', label: '₵ GHS' },
  { code: 'ZAR', label: 'R ZAR' },{ code: 'KES', label: 'KES' },
  { code: 'JPY', label: '¥ JPY' },{ code: 'AUD', label: 'A$ AUD' },
  { code: 'CAD', label: 'C$ CAD' },{ code: 'INR', label: '₹ INR' },
  { code: 'BRL', label: 'R$ BRL' },{ code: 'MXN', label: 'MX$ MXN' },
];

const fmt       = (d) => d.toISOString().split('T')[0];
const tomorrow  = () => { const d = new Date(); d.setDate(d.getDate() + 1); return fmt(d); };
const dayAfter  = () => { const d = new Date(); d.setDate(d.getDate() + 2); return fmt(d); };

export default function SearchBar({ initialValues = {}, compact = false }) {
  const navigate = useNavigate();
  const { t }    = useLanguage();

  const [form, setForm] = useState({
    city:        initialValues.city        || '',
    countryCode: initialValues.countryCode || 'NG',
    checkin:     initialValues.checkin     || tomorrow(),
    checkout:    initialValues.checkout    || dayAfter(),
    adults:      initialValues.adults      || 2,
    currency:    initialValues.currency    || 'NGN',
  });
  const [cityError, setCityError] = useState('');

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'city' && cityError) setCityError('');
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.city.trim()) { setCityError(t('cityRequired')); return; }
    setCityError('');
    const params = new URLSearchParams({
      city:        form.city.trim(),
      countryCode: form.countryCode,
      checkin:     form.checkin,
      checkout:    form.checkout,
      adults:      String(form.adults),
      currency:    form.currency,
    });
    navigate(`/search?${params.toString()}`);
  };

  return (
    <form className="sf-search-form" onSubmit={onSubmit}>
      <div className={`sf-search-card ${compact ? 'sf-search-card--compact' : ''}`}>
        <div className="sf-search-fields">

          <div className="sf-field">
            <label className="sf-field-label">
              <span className="sf-field-label-icon">📍</span> {t('destination')}
            </label>
            <input
              type="text" name="city"
              placeholder={t('destinationPlaceholder')}
              value={form.city} onChange={onChange} autoComplete="off"
              className={cityError ? 'has-error' : ''}
            />
            {cityError && <span className="sf-field-error-msg">{cityError}</span>}
          </div>

          <div className="sf-field">
            <label className="sf-field-label">
              <span className="sf-field-label-icon">🌍</span> {t('country')}
            </label>
            <select name="countryCode" value={form.countryCode} onChange={onChange}>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="sf-field">
            <label className="sf-field-label">
              <span className="sf-field-label-icon">📅</span> {t('checkIn')}
            </label>
            <input type="date" name="checkin" value={form.checkin} min={tomorrow()} onChange={onChange} />
          </div>

          <div className="sf-field">
            <label className="sf-field-label">
              <span className="sf-field-label-icon">📅</span> {t('checkOut')}
            </label>
            <input type="date" name="checkout" value={form.checkout} min={form.checkin} onChange={onChange} />
          </div>

          <div className="sf-field">
            <label className="sf-field-label">
              <span className="sf-field-label-icon">👤</span> {t('guests')}
            </label>
            <select name="adults" value={form.adults} onChange={onChange}>
              {[1,2,3,4,5,6].map((n) => (
                <option key={n} value={n}>{n} {n > 1 ? t('adults') : t('adult')}</option>
              ))}
            </select>
          </div>

          <div className="sf-field">
            <label className="sf-field-label">
              <span className="sf-field-label-icon">💱</span> {t('currency')}
            </label>
            <select name="currency" value={form.currency} onChange={onChange}>
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className="sf-search-submit">
            <button type="submit" className="sf-search-btn">
              🔍 {t('searchBtn')}
            </button>
          </div>

        </div>
      </div>
    </form>
  );
}
