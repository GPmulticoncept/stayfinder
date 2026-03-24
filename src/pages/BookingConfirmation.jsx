import { useLocation, useNavigate } from 'react-router-dom';

export default function BookingConfirmation() {
  const { state }  = useLocation();
  const navigate   = useNavigate();

  const { booking, hotel, room, searchParams, price, nights } = state || {};

  if (!booking || !hotel) {
    return (
      <div className="confirm-page">
        <div className="confirm-error">
          <span style={{ fontSize: '2.5rem' }}>⚠️</span>
          <h3>No booking found</h3>
          <p>It looks like you arrived here directly. Please make a booking first.</p>
          <button className="sf-empty-btn" onClick={() => navigate('/')}>Back to Home</button>
        </div>
      </div>
    );
  }

  const bookingId  = booking.bookingId || booking.id || booking.confirmationNumber || '—';
  const finalPrice = booking.retailRate?.total?.[0] || price;
  const total      = finalPrice ? (parseFloat(finalPrice.amount) * (nights || 1)).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : null;

  return (
    <div className="confirm-page">
      <div className="confirm-inner">

        {/* Success badge */}
        <div className="confirm-badge">
          <div className="confirm-check">✓</div>
          <h1 className="confirm-title">Booking Confirmed!</h1>
          <p className="confirm-sub">
            Your reservation is confirmed. A confirmation email has been sent to your inbox.
          </p>
        </div>

        {/* Booking reference */}
        <div className="confirm-ref-card">
          <p className="confirm-ref-label">Booking Reference</p>
          <p className="confirm-ref-number">{bookingId}</p>
          <p className="confirm-ref-hint">Save this number for your records</p>
        </div>

        {/* Hotel summary */}
        <div className="confirm-summary-card">
          {hotel.main_photo && (
            <img
              src={hotel.main_photo}
              alt={hotel.name}
              className="confirm-hotel-img"
              loading="lazy"
            />
          )}
          <div className="confirm-hotel-info">
            <h2 className="confirm-hotel-name">{hotel.name}</h2>
            <p className="confirm-hotel-location">📍 {[hotel.city, hotel.country].filter(Boolean).join(', ')}</p>
          </div>

          <div className="confirm-details-grid">
            <div className="confirm-detail">
              <span className="confirm-detail-label">Check-in</span>
              <span className="confirm-detail-value">{searchParams?.checkin}</span>
            </div>
            <div className="confirm-detail">
              <span className="confirm-detail-label">Check-out</span>
              <span className="confirm-detail-value">{searchParams?.checkout}</span>
            </div>
            <div className="confirm-detail">
              <span className="confirm-detail-label">Guests</span>
              <span className="confirm-detail-value">{searchParams?.adults || 1} Adult{searchParams?.adults > 1 ? 's' : ''}</span>
            </div>
            <div className="confirm-detail">
              <span className="confirm-detail-label">Nights</span>
              <span className="confirm-detail-value">{nights}</span>
            </div>
            <div className="confirm-detail">
              <span className="confirm-detail-label">Room</span>
              <span className="confirm-detail-value">{room?.name || 'Standard Room'}</span>
            </div>
            {total && finalPrice && (
              <div className="confirm-detail">
                <span className="confirm-detail-label">Total Paid</span>
                <span className="confirm-detail-value confirm-detail-price">
                  {finalPrice.currency} {total}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Important info */}
        <div className="confirm-info-card">
          <h3 className="confirm-info-title">What's next?</h3>
          <div className="confirm-info-items">
            <div className="confirm-info-item">
              <span className="confirm-info-icon">📧</span>
              <p>Check your email for the full booking voucher with check-in instructions.</p>
            </div>
            <div className="confirm-info-item">
              <span className="confirm-info-icon">🏨</span>
              <p>Present your booking reference at the hotel reception on arrival.</p>
            </div>
            <div className="confirm-info-item">
              <span className="confirm-info-icon">📞</span>
              <p>
                Need help? <a href="https://wa.me/2347034542773" target="_blank" rel="noreferrer">Contact us on WhatsApp</a>
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="confirm-actions">
          <button className="confirm-home-btn" onClick={() => navigate('/')}>
            🏠 Back to Home
          </button>
          <button className="confirm-search-btn" onClick={() => navigate(-3)}>
            🔍 Search More Hotels
          </button>
        </div>

      </div>
    </div>
  );
}
