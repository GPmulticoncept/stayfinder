import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getHotelDetails } from '../services/liteapi';
import LoadingSpinner from '../components/LoadingSpinner';

export default function HotelDetail() {
  const { hotelId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(state?.hotel || null);
  const [loading, setLoading] = useState(!state?.hotel);
  const [error, setError] = useState(null);
  const [imgFailed, setImgFailed] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const rate = state?.rate || null;
  const searchParams = state?.searchParams || {};

  useEffect(() => {
    if (hotel) return;
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const data = await getHotelDetails(hotelId);
        setHotel(data);
      } catch {
        setError('Could not load hotel details.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [hotelId]);

  const handleBookNow = () => {
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 4000);
  };

  if (loading) return <LoadingSpinner text="Loading hotel details..." />;

  if (error || !hotel) {
    return (
      <div className="detail-error-wrap">
        <div className="detail-error-card">
          <span className="detail-error-icon">⚠️</span>
          <h3>Hotel not found</h3>
          <p>We couldn't load this property. Try going back and searching again.</p>
          <button className="detail-home-btn" onClick={() => navigate('/')}>Back to Home</button>
        </div>
      </div>
    );
  }

  const stars = hotel.starRating || hotel.stars || 0;
  const photo = hotel.main_photo || hotel.thumbnail || null;
  const rooms = rate?.roomTypes || [];
  const description = hotel.hotelDescription || hotel.description || '';
  const address = [hotel.address, hotel.city, hotel.country].filter(Boolean).join(', ');

  return (
    <div className="detail-page">

      {/* TOAST NOTIFICATION */}
      <div className={`booking-toast ${toastVisible ? 'booking-toast--visible' : ''}`}>
        <span className="booking-toast-icon">🎉</span>
        <div className="booking-toast-text">
          <strong>Room selected!</strong>
          <p>Booking & payment integration coming in V2.</p>
        </div>
        <button className="booking-toast-close" onClick={() => setToastVisible(false)}>✕</button>
      </div>

      {/* HERO */}
      <div className="detail-hero-wrap">
        {photo && !imgFailed ? (
          <img
            src={photo}
            alt={hotel.name}
            className="detail-hero-img"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="detail-hero-placeholder">🏨</div>
        )}
        <div className="detail-hero-overlay" />
        <button className="detail-back-btn" onClick={() => navigate(-1)}>← Back</button>
        <div className="detail-hero-info">
          <h1 className="detail-hero-name">{hotel.name}</h1>
          {stars > 0 && (
            <div className="detail-hero-stars">
              {Array.from({ length: Math.min(stars, 5) }).map((_, i) => (
                <span key={i}>★</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="detail-content">

        <div className="detail-meta-row">
          {address && <p className="detail-address"><span>📍</span> {address}</p>}
          {hotel.reviewScore && (
            <div className="detail-score">
              <span className="detail-score-num">{hotel.reviewScore}</span>
              <span className="detail-score-label">/ 10</span>
            </div>
          )}
        </div>

        <div className="detail-divider" />

        {description ? (
          <div className="detail-desc-wrap">
            <h2 className="detail-section-title">About this property</h2>
            <div
              className="detail-description"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>
        ) : null}

        <div className="detail-rooms-wrap">
          <h2 className="detail-section-title">
            {rooms.length > 0 ? `Available Rooms (${rooms.length})` : 'Room Information'}
          </h2>

          {rooms.length === 0 ? (
            <div className="detail-no-rooms">
              <span className="detail-no-rooms-icon">🛏️</span>
              <p className="detail-no-rooms-msg">No rooms available for your selected dates.</p>
              {searchParams.checkin && (
                <p className="detail-no-rooms-dates">
                  {searchParams.checkin} → {searchParams.checkout}
                </p>
              )}
              <button className="detail-alt-btn" onClick={() => navigate(-1)}>
                See Other Hotels
              </button>
            </div>
          ) : (
            <div className="detail-rooms-list">
              {rooms.map((room, i) => {
                const firstRate = room.rates?.[0];
                const price = firstRate?.retailRate?.total?.[0];
                return (
                  <div key={i} className="detail-room-card">
                    <div className="detail-room-info">
                      <p className="detail-room-name">{room.name || `Room Type ${i + 1}`}</p>
                      <p className="detail-room-meta">
                        {firstRate?.boardType || 'Room Only'} &middot; Max {firstRate?.maxOccupancy || 2} guests
                      </p>
                    </div>
                    <div className="detail-room-right">
                      {price && (
                        <div className="detail-room-price">
                          <span className="detail-price-amount">
                            {price.currency} {parseFloat(price.amount).toLocaleString()}
                          </span>
                          <span className="detail-price-per">per night</span>
                        </div>
                      )}
                      <button className="detail-book-btn" onClick={handleBookNow}>
                        Book Now
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
