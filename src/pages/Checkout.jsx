import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { prebookRate, bookRate, extractOfferId } from '../services/liteapi';

const BOARD_LABELS = {
  RO: 'Room Only', BB: 'Bed & Breakfast', BI: 'Bed & Breakfast',
  HB: 'Half Board', FB: 'Full Board', AI: 'All Inclusive', AI1: 'All Inclusive',
};

const calcNights = (checkin, checkout) => {
  if (!checkin || !checkout) return 1;
  const diff = new Date(checkout) - new Date(checkin);
  const nights = Math.round(diff / (1000 * 60 * 60 * 24));
  return nights > 0 ? nights : 1;
};

const formatCard = (val) =>
  val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

const formatExpiry = (val) => {
  const digits = val.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
};

// LiteAPI sandbox test cards
const TEST_CARDS = [
  { label: 'Visa (success)',       number: '4111 1111 1111 1111' },
  { label: 'Mastercard (success)', number: '5500 0000 0000 0004' },
  { label: 'Visa (declined)',      number: '4000 0000 0000 0002' },
];

export default function Checkout() {
  const { state }  = useLocation();
  const navigate   = useNavigate();

  const { hotel, room, rate, searchParams } = state || {};

  const [prebookId,    setPrebookId]    = useState(null);
  const [prebookData,  setPrebookData]  = useState(null);
  const [prebooking,   setPrebooking]   = useState(true);
  const [prebookError, setPrebookError] = useState(null);

  const [step,      setStep]      = useState('guest'); // guest | payment | processing
  const [guest,     setGuest]     = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [card,      setCard]      = useState({ number: '', expiry: '', cvc: '', holder: '' });
  const [errors,    setErrors]    = useState({});
  const [bookError, setBookError] = useState(null);

  const nights  = calcNights(searchParams?.checkin, searchParams?.checkout);
  const price   = rate?.retailRate?.total?.[0];

  // Extract offerId using all known key variants
  const offerId = extractOfferId(rate);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });

    if (!rate) {
      setPrebookError('No room rate found. Please go back and select a room.');
      setPrebooking(false);
      return;
    }

    if (!offerId) {
      // Rate exists but has no bookable offerId — sandbox limitation
      setPrebookError(
        'This rate is not bookable in sandbox mode. LiteAPI sandbox only supports booking on select hotels. ' +
        'Switch to the production API key to unlock full booking on all hotels.'
      );
      setPrebooking(false);
      return;
    }

    (async () => {
      const res = await prebookRate({ offerId });
      if (res.error) {
        setPrebookError(res.error);
      } else {
        setPrebookId(res.data?.prebookId || res.data?.id);
        setPrebookData(res.data);
      }
      setPrebooking(false);
    })();
  }, []);

  const validateGuest = () => {
    const e = {};
    if (!guest.firstName.trim()) e.firstName = 'Required';
    if (!guest.lastName.trim())  e.lastName  = 'Required';
    if (!guest.email.trim() || !/\S+@\S+\.\S+/.test(guest.email)) e.email = 'Valid email required';
    if (!guest.phone.trim() || guest.phone.length < 7) e.phone = 'Valid phone required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateCard = () => {
    const e = {};
    const num = card.number.replace(/\s/g, '');
    if (num.length < 13) e.number = 'Invalid card number';
    if (!card.expiry.includes('/') || card.expiry.length < 5) e.expiry = 'Format: MM/YY';
    if (card.cvc.length < 3) e.cvc = '3–4 digits';
    if (!card.holder.trim()) e.holder = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleGuestNext = () => { if (validateGuest()) setStep('payment'); };

  const handleBook = async () => {
    if (!validateCard()) return;
    if (!prebookId) { setBookError('Rate lock expired. Please go back and try again.'); return; }

    setStep('processing');
    setBookError(null);

    const [expMonth, expYear] = card.expiry.split('/');
    const res = await bookRate({
      prebookId,
      guestFirstName:  guest.firstName.trim(),
      guestLastName:   guest.lastName.trim(),
      guestEmail:      guest.email.trim(),
      guestPhone:      guest.phone.trim(),
      cardNumber:      card.number,
      cardExpireMonth: expMonth,
      cardExpireYear:  `20${expYear}`,
      cardCVC:         card.cvc,
      cardHolder:      card.holder.trim(),
    });

    if (res.error) {
      setBookError(res.error);
      setStep('payment');
    } else {
      navigate('/booking-confirmation', {
        state: { booking: res.data, hotel, room, searchParams, price, nights },
        replace: true,
      });
    }
  };

  const fillTestCard = (num) => {
    setCard({
      number: num,
      expiry: '12/26',
      cvc: '123',
      holder: `${guest.firstName || 'Test'} ${guest.lastName || 'User'}`.trim(),
    });
  };

  // ── Loading state ──
  if (prebooking) {
    return (
      <div className="checkout-page">
        <div className="checkout-locking">
          <div className="sf-spinner-ring" style={{ width: 48, height: 48, borderWidth: 4 }} />
          <p>Locking your rate…</p>
          <span>This only takes a second</span>
        </div>
      </div>
    );
  }

  // ── Error state ──
  if (prebookError || !hotel || !room) {
    const isSandboxLimit = prebookError?.includes('sandbox');
    return (
      <div className="checkout-page">
        <div className="checkout-error-wrap">
          <span style={{ fontSize: '2.5rem' }}>{isSandboxLimit ? '🔒' : '⚠️'}</span>
          <h3>{isSandboxLimit ? 'Sandbox Limitation' : 'Unable to proceed'}</h3>
          <p>{prebookError || 'Missing booking details. Please go back and try again.'}</p>
          {isSandboxLimit && (
            <div className="checkout-sandbox-note">
              <p>To test the full booking flow, use one of the sandbox test hotels that support booking, or switch to the LiteAPI production key in your Vercel environment variables.</p>
            </div>
          )}
          <button className="sf-empty-btn" onClick={() => navigate(-1)} style={{ marginTop: 20 }}>
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  const finalPrice = prebookData?.retailRate?.total?.[0] || price;
  const priceChanged = prebookData && price &&
    parseFloat(prebookData?.retailRate?.total?.[0]?.amount) !== parseFloat(price?.amount);

  return (
    <div className="checkout-page">
      <div className="checkout-inner">

        <div className="checkout-header">
          <button className="checkout-back-btn" onClick={() => navigate(-1)}>← Back</button>
          <h1 className="checkout-title">Complete Your Booking</h1>
        </div>

        {priceChanged && (
          <div className="checkout-price-alert">
            ⚠️ Price updated to <strong>{finalPrice?.currency} {parseFloat(finalPrice?.amount).toLocaleString()}</strong> / night.
          </div>
        )}

        <div className="checkout-layout">

          {/* ── FORM ── */}
          <div className="checkout-form-col">

            <div className="checkout-steps">
              <div className={`checkout-step ${step !== 'guest' ? 'done' : 'active'}`}>
                <span className="checkout-step-num">{step !== 'guest' ? '✓' : '1'}</span>
                <span>Guest Details</span>
              </div>
              <div className="checkout-step-line" />
              <div className={`checkout-step ${step === 'payment' || step === 'processing' ? 'active' : ''}`}>
                <span className="checkout-step-num">2</span>
                <span>Payment</span>
              </div>
            </div>

            {/* ── STEP 1: Guest ── */}
            {step === 'guest' && (
              <div className="checkout-card">
                <h2 className="checkout-card-title">👤 Guest Information</h2>
                <p className="checkout-card-sub">Enter the details of the main guest</p>
                <div className="checkout-fields">
                  <div className="checkout-field-row">
                    <div className="checkout-field">
                      <label>First Name</label>
                      <input
                        type="text" placeholder="John"
                        value={guest.firstName}
                        onChange={(e) => setGuest({ ...guest, firstName: e.target.value })}
                        className={errors.firstName ? 'has-error' : ''}
                      />
                      {errors.firstName && <span className="checkout-error">{errors.firstName}</span>}
                    </div>
                    <div className="checkout-field">
                      <label>Last Name</label>
                      <input
                        type="text" placeholder="Doe"
                        value={guest.lastName}
                        onChange={(e) => setGuest({ ...guest, lastName: e.target.value })}
                        className={errors.lastName ? 'has-error' : ''}
                      />
                      {errors.lastName && <span className="checkout-error">{errors.lastName}</span>}
                    </div>
                  </div>
                  <div className="checkout-field">
                    <label>Email Address</label>
                    <input
                      type="email" placeholder="john@example.com"
                      value={guest.email}
                      onChange={(e) => setGuest({ ...guest, email: e.target.value })}
                      className={errors.email ? 'has-error' : ''}
                    />
                    {errors.email && <span className="checkout-error">{errors.email}</span>}
                    <span className="checkout-field-hint">Booking confirmation sent here</span>
                  </div>
                  <div className="checkout-field">
                    <label>Phone Number</label>
                    <input
                      type="tel" placeholder="+234 800 000 0000"
                      value={guest.phone}
                      onChange={(e) => setGuest({ ...guest, phone: e.target.value })}
                      className={errors.phone ? 'has-error' : ''}
                    />
                    {errors.phone && <span className="checkout-error">{errors.phone}</span>}
                  </div>
                </div>
                <button className="checkout-next-btn" onClick={handleGuestNext}>
                  Continue to Payment →
                </button>
              </div>
            )}

            {/* ── STEP 2: Payment ── */}
            {(step === 'payment' || step === 'processing') && (
              <div className="checkout-card">
                <h2 className="checkout-card-title">💳 Payment Details</h2>
                <p className="checkout-card-sub">Your card details are encrypted and secure</p>

                {/* Sandbox test cards */}
                <div className="checkout-test-cards">
                  <p className="checkout-test-label">🧪 Sandbox test cards — tap to fill:</p>
                  {TEST_CARDS.map((tc) => (
                    <button key={tc.number} className="checkout-test-pill" onClick={() => fillTestCard(tc.number)}>
                      {tc.label}: {tc.number}
                    </button>
                  ))}
                </div>

                <div className="checkout-fields">
                  <div className="checkout-field">
                    <label>Cardholder Name</label>
                    <input
                      type="text" placeholder="John Doe"
                      value={card.holder}
                      onChange={(e) => setCard({ ...card, holder: e.target.value })}
                      className={errors.holder ? 'has-error' : ''}
                    />
                    {errors.holder && <span className="checkout-error">{errors.holder}</span>}
                  </div>
                  <div className="checkout-field">
                    <label>Card Number</label>
                    <input
                      type="text" inputMode="numeric"
                      placeholder="1234 5678 9012 3456"
                      value={card.number}
                      onChange={(e) => setCard({ ...card, number: formatCard(e.target.value) })}
                      className={errors.number ? 'has-error' : ''}
                      maxLength={19}
                    />
                    {errors.number && <span className="checkout-error">{errors.number}</span>}
                  </div>
                  <div className="checkout-field-row">
                    <div className="checkout-field">
                      <label>Expiry</label>
                      <input
                        type="text" inputMode="numeric" placeholder="MM/YY"
                        value={card.expiry}
                        onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                        className={errors.expiry ? 'has-error' : ''}
                        maxLength={5}
                      />
                      {errors.expiry && <span className="checkout-error">{errors.expiry}</span>}
                    </div>
                    <div className="checkout-field">
                      <label>CVC / CVV</label>
                      <input
                        type="text" inputMode="numeric" placeholder="123"
                        value={card.cvc}
                        onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                        className={errors.cvc ? 'has-error' : ''}
                        maxLength={4}
                      />
                      {errors.cvc && <span className="checkout-error">{errors.cvc}</span>}
                    </div>
                  </div>
                </div>

                {bookError && <div className="checkout-book-error">❌ {bookError}</div>}

                <div className="checkout-security-note">
                  🔒 256-bit SSL encryption · Your card is never stored
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                  <button
                    className="checkout-back-step-btn"
                    onClick={() => setStep('guest')}
                    disabled={step === 'processing'}
                  >← Back</button>
                  <button
                    className="checkout-pay-btn"
                    onClick={handleBook}
                    disabled={step === 'processing'}
                  >
                    {step === 'processing' ? (
                      <span className="checkout-pay-loading">
                        <span className="checkout-pay-spinner" /> Processing…
                      </span>
                    ) : (
                      <>🔒 Pay {finalPrice
                        ? `${finalPrice.currency} ${(parseFloat(finalPrice.amount) * nights).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
                        : 'Now'
                      }</>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── SUMMARY ── */}
          <div className="checkout-summary">
            <div className="checkout-summary-card">
              <h3 className="checkout-summary-title">Booking Summary</h3>
              {hotel.main_photo && (
                <img src={hotel.main_photo} alt={hotel.name} className="checkout-summary-img" loading="lazy" />
              )}
              <div className="checkout-summary-hotel">
                <p className="checkout-summary-name">{hotel.name}</p>
                <p className="checkout-summary-location">📍 {[hotel.city, hotel.country].filter(Boolean).join(', ')}</p>
              </div>
              <div className="checkout-summary-divider" />
              <div className="checkout-summary-row">
                <span>Room</span><span>{room?.name || 'Standard Room'}</span>
              </div>
              <div className="checkout-summary-row">
                <span>Board</span>
                <span>{BOARD_LABELS[rate?.boardType?.toUpperCase()] || 'Room Only'}</span>
              </div>
              <div className="checkout-summary-row">
                <span>Check-in</span><span>{searchParams?.checkin}</span>
              </div>
              <div className="checkout-summary-row">
                <span>Check-out</span><span>{searchParams?.checkout}</span>
              </div>
              <div className="checkout-summary-row">
                <span>Guests</span>
                <span>{searchParams?.adults || 1} Adult{searchParams?.adults > 1 ? 's' : ''}</span>
              </div>
              <div className="checkout-summary-row">
                <span>Nights</span><span>{nights}</span>
              </div>
              <div className="checkout-summary-divider" />
              {finalPrice && (
                <>
                  <div className="checkout-summary-row">
                    <span>Per night</span>
                    <span>{finalPrice.currency} {parseFloat(finalPrice.amount).toLocaleString()}</span>
                  </div>
                  <div className="checkout-summary-row checkout-summary-total">
                    <span>Total</span>
                    <span>
                      {finalPrice.currency} {(parseFloat(finalPrice.amount) * nights).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </>
              )}
              <div className="checkout-summary-refund">
                {rate?.refundableTag?.toUpperCase() === 'FULLY_REFUNDABLE' || rate?.refundableTag?.toUpperCase() === 'REFUNDABLE'
                  ? '✅ Free cancellation available'
                  : '❌ Non-refundable'}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
