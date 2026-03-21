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

  if (loading) return <LoadingSpinner text="Loading hotel details..." />;

  if (error || !hotel) {
    return (
      <div className="container" style={{ paddingTop: 40 }}>
        <div className="no-results">
          <div className="no-results-icon">⚠️</div>
          <h3>Hotel not found</h3>
          <button className="try-again-btn" onClick={() => navigate('/')}>Go Home</button>
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
      <div className="container">
        <button className="detail-back" onClick={() => navigate(-1)}>
          ← Back to results
        </button>

        {photo ? (
          <img
            src={photo}
            alt={hotel.name}
            className="detail-hero-img"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        ) : (
          <div className="detail-img-placeholder">🏨</div>
        )}

        <div className="detail-header">
          <div>
            <h1>{hotel.name}</h1>
            {stars > 0 && (
              <div className="detail-stars">
                {Array.from({ length: Math.min(stars, 5) }).map((_, i) => (
                  <span key={i} className="star" style={{ fontSize: '1.1rem' }}>★</span>
                ))}
              </div>
            )}
          </div>
          {hotel.reviewScore && (
            <div className="hotel-rating" style={{ fontSize: '1.1rem', padding: '8px 16px' }}>
              {hotel.reviewScore} / 10
            </div>
          )}
        </div>

        {address && <p className="detail-location">📍 {address}</p>}

        {description ? (
          <p className="detail-description">
            {description.length > 600 ? description.slice(0, 600) + '...' : description}
          </p>
        ) : null}

        <div className="rooms-section">
          <h2>{rooms.length > 0 ? 'Available Rooms' : 'Room Information'}</h2>

          {rooms.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--text-secondary)' }}>
              <p>No rooms available for your selected dates.</p>
              {searchParams.checkin && (
                <p style={{ marginTop: 8, fontSize: '0.875rem' }}>
                  {searchParams.checkin} → {searchParams.checkout}
                </p>
              )}
              <button
                className="try-again-btn"
                style={{ marginTop: 16 }}
                onClick={() => navigate(-1)}
              >
                See Other Hotels
              </button>
            </div>
          ) : (
            rooms.map((room, i) => {
              const firstRate = room.rates?.[0];
              const price = firstRate?.retailRate?.total?.[0];
              return (
                <div key={i} className="room-card">
                  <div>
                    <p className="room-name">{room.name || `Room Type ${i + 1}`}</p>
                    <p className="room-info">
                      {firstRate?.boardType || 'Room Only'} · Max {firstRate?.maxOccupancy || 2} guests
                    </p>
                  </div>

                  {price && (
                    <div className="room-price">
                      <span className="amount">
                        {price.currency} {parseFloat(price.amount).toFixed(0)}
                      </span>
                      <span className="per">per night</span>
                    </div>
                  )}

                  <button
                    className="book-btn"
                    onClick={() =>
                      alert('Booking flow coming in V2! Payment integration will complete this step.')
                    }
                  >
                    Book Now
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
