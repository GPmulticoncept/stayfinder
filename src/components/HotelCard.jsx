import { useNavigate } from 'react-router-dom';

export default function HotelCard({ hotel, rate, searchParams }) {
  const navigate = useNavigate();

  const stars = hotel.starRating || hotel.stars || 0;
  const photo = hotel.main_photo || hotel.thumbnail || null;
  const lowestPrice = rate?.roomTypes?.[0]?.rates?.[0]?.retailRate?.total?.[0];

  const handleClick = () => {
    navigate(`/hotel/${hotel.id}`, {
      state: { hotel, rate, searchParams },
    });
  };

  return (
    <div className="hotel-card" onClick={handleClick}>
      <div className="hotel-card-img-wrap">
        {photo ? (
          <img
            src={photo}
            alt={hotel.name}
            className="hotel-card-img"
            onError={(e) => { e.currentTarget.parentElement.innerHTML = '<div class="hotel-card-img-placeholder">🏨</div>'; }}
          />
        ) : (
          <div className="hotel-card-img-placeholder">🏨</div>
        )}
        {hotel.reviewScore && (
          <div className="hotel-card-rating-badge">{hotel.reviewScore}</div>
        )}
      </div>

      <div className="hotel-card-body">
        <div className="hotel-card-top">
          <h3 className="hotel-card-name">{hotel.name}</h3>
        </div>

        {stars > 0 && (
          <div className="hotel-stars">
            {Array.from({ length: Math.min(stars, 5) }).map((_, i) => (
              <span key={i} className="star">★</span>
            ))}
          </div>
        )}

        <p className="hotel-location">
          📍 {[hotel.city, hotel.country].filter(Boolean).join(', ')}
        </p>

        <div className="hotel-card-footer">
          <div className="hotel-price">
            {lowestPrice ? (
              <>
                <span className="price-label">From</span>
                <span className="price-amount">
                  {lowestPrice.currency} {parseFloat(lowestPrice.amount).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </span>
                <span className="price-per">per night</span>
              </>
            ) : (
              <span className="price-tbd">View rates →</span>
            )}
          </div>
          <button className="view-btn">View →</button>
        </div>
      </div>
    </div>
  );
}
