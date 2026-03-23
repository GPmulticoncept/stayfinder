import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BOARD_LABELS = {
  BB: 'Breakfast', BI: 'Breakfast', HB: 'Half Board',
  FB: 'Full Board', AI: 'All Inclusive', AI1: 'All Inclusive',
};

const getScoreClass = (score) => {
  const s = parseFloat(score);
  if (s >= 8)  return 'score-great';
  if (s >= 7)  return 'score-good';
  if (s >= 6)  return 'score-ok';
  if (s > 0)   return 'score-low';
  return 'score-none';
};

const getScoreLabel = (score) => {
  const s = parseFloat(score);
  if (s >= 9)  return 'Exceptional';
  if (s >= 8)  return 'Fabulous';
  if (s >= 7)  return 'Good';
  if (s >= 6)  return 'Pleasant';
  return '';
};

export default function HotelCard({ hotel, rate, searchParams, listView = false, loadingRates = false }) {
  const navigate = useNavigate();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  const stars       = Math.min(Math.round(hotel.starRating || hotel.stars || 0), 5);
  const photo       = hotel.main_photo || hotel.thumbnail || null;
  const reviewScore = hotel.reviewScore || null;
  const reviewCount = hotel.reviewCount || hotel.numberOfReviews || null;

  // Rate data
  const firstRoom   = rate?.roomTypes?.[0];
  const firstRate   = firstRoom?.rates?.[0];
  const lowestPrice = firstRate?.retailRate?.total?.[0];
  const boardType   = firstRate?.boardType?.toUpperCase();
  const refundTag   = firstRate?.refundableTag?.toUpperCase();
  const isFreeCancel = refundTag === 'FULLY_REFUNDABLE' || refundTag === 'REFUNDABLE';
  const hasBreakfast = boardType && boardType !== 'RO' && BOARD_LABELS[boardType];

  const handleClick = () => {
    navigate(`/hotel/${hotel.id}`, {
      state: { hotel, rate, searchParams },
    });
  };

  return (
    <div
      className={`sf-hcard${listView ? ' list-view' : ''}`}
      onClick={handleClick}
    >
      {/* ── Image ── */}
      <div className="sf-hcard-img-wrap">
        {/* Shimmer skeleton */}
        <div className={`sf-hcard-shimmer${imgLoaded || imgFailed ? ' hidden' : ''}`} />

        {photo && !imgFailed && (
          <img
            src={photo}
            alt={hotel.name}
            className={`sf-hcard-img${imgLoaded ? ' loaded' : ''}`}
            loading="lazy"
            decoding="async"
            onLoad={() => setImgLoaded(true)}
            onError={() => { setImgFailed(true); setImgLoaded(true); }}
          />
        )}

        {imgFailed && (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '3rem', background: 'var(--mist)',
          }}>
            🏨
          </div>
        )}

        {/* Bottom gradient */}
        <div className="sf-hcard-img-overlay" />

        {/* Review score badge */}
        {reviewScore && (
          <div className={`sf-hcard-score ${getScoreClass(reviewScore)}`}>
            {reviewScore}
          </div>
        )}
      </div>

      {/* ── Body ── */}
      {listView ? (
        <div className="sf-hcard-body">
          {/* Info (left side in list view) */}
          <div className="sf-hcard-info">
            {stars > 0 && (
              <div className="sf-hcard-stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < stars ? 'sf-hcard-star' : 'sf-hcard-star-empty'}>★</span>
                ))}
              </div>
            )}
            <h3 className="sf-hcard-name">{hotel.name}</h3>
            <p className="sf-hcard-location">
              📍 {[hotel.city, hotel.country].filter(Boolean).join(', ')}
            </p>
            {reviewScore && (
              <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: 6 }}>
                <strong style={{ color: 'var(--ink)' }}>{reviewScore}</strong> {getScoreLabel(reviewScore)}
                {reviewCount && <span style={{ color: 'var(--faint)' }}> · {reviewCount} reviews</span>}
              </p>
            )}
            <div className="sf-hcard-pills">
              {isFreeCancel && (
                <span className="sf-hcard-pill pill-green">✓ Free cancellation</span>
              )}
              {hasBreakfast && (
                <span className="sf-hcard-pill pill-blue">☕ {BOARD_LABELS[boardType]}</span>
              )}
            </div>
          </div>

          {/* Price + CTA (right side in list view) */}
          <div className="sf-hcard-footer">
            <div className="sf-hcard-price">
              {loadingRates ? (
                <span className="sf-hcard-price-loading">Loading price…</span>
              ) : lowestPrice ? (
                <>
                  <span className="sf-hcard-price-from">from</span>
                  <span className="sf-hcard-price-amount">
                    {lowestPrice.currency} {parseFloat(lowestPrice.amount).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </span>
                  <span className="sf-hcard-price-night">/ night</span>
                </>
              ) : (
                <span className="sf-hcard-price-tbd">View rates →</span>
              )}
            </div>
            <button className="sf-hcard-view-btn" onClick={handleClick}>View →</button>
          </div>
        </div>
      ) : (
        <div className="sf-hcard-body">
          {stars > 0 && (
            <div className="sf-hcard-stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i < stars ? 'sf-hcard-star' : 'sf-hcard-star-empty'}>★</span>
              ))}
            </div>
          )}

          <h3 className="sf-hcard-name">{hotel.name}</h3>

          <p className="sf-hcard-location">
            📍 {[hotel.city, hotel.country].filter(Boolean).join(', ')}
          </p>

          {/* Amenity pills */}
          {(isFreeCancel || hasBreakfast) && (
            <div className="sf-hcard-pills">
              {isFreeCancel && (
                <span className="sf-hcard-pill pill-green">✓ Free cancel</span>
              )}
              {hasBreakfast && (
                <span className="sf-hcard-pill pill-blue">☕ {BOARD_LABELS[boardType]}</span>
              )}
            </div>
          )}

          {/* Price + CTA */}
          <div className="sf-hcard-footer">
            <div className="sf-hcard-price">
              {loadingRates ? (
                <span className="sf-hcard-price-loading">Loading…</span>
              ) : lowestPrice ? (
                <>
                  <span className="sf-hcard-price-from">from</span>
                  <span className="sf-hcard-price-amount">
                    {lowestPrice.currency} {parseFloat(lowestPrice.amount).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </span>
                  <span className="sf-hcard-price-night">/ night</span>
                </>
              ) : (
                <span className="sf-hcard-price-tbd">View rates →</span>
              )}
            </div>
            <button className="sf-hcard-view-btn" onClick={handleClick}>View →</button>
          </div>
        </div>
      )}
    </div>
  );
}
