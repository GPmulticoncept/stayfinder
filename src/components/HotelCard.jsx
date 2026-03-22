import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HotelCard({ hotel, rate, searchParams }) {
  const navigate = useNavigate();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

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

        {/* Shimmer skeleton — visible until image loads or if no photo */}
        {!imgLoaded && !imgFailed && (
          <div className={`hotel-card-img-skeleton ${photo ? 'hotel-card-img-skeleton--loading' : ''}`}>
            {!photo && <span>🏨</span>}
          </div>
        )}

        {photo && !imgFailed && (
          <img
            src={photo}
            alt={hotel.name}
            className="hotel-card-img"
            loading="lazy"
            decoding="async"
            style={{ opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.3s ease' }}
            onLoad={() => setImgLoaded(true)}
            onError={() => {
              setImgFailed(true);
              setImgLoaded(true);
            }}
          />
        )}

        {imgFailed && (
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
