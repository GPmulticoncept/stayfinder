import { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getHotelDetails } from '../services/liteapi';
import LoadingSpinner from '../components/LoadingSpinner';

const BOARD_LABELS = {
  RO: 'Room Only', BB: 'Bed & Breakfast', BI: 'Bed & Breakfast',
  HB: 'Half Board', FB: 'Full Board', AI: 'All Inclusive', AI1: 'All Inclusive',
};
const getBoardLabel = (code) => BOARD_LABELS[code?.toUpperCase()] || code || 'Room Only';

const getRefundInfo = (rate) => {
  const tag = rate?.refundableTag?.toUpperCase();
  if (tag === 'FULLY_REFUNDABLE' || tag === 'REFUNDABLE') return { label: 'Free cancellation', type: 'refundable' };
  if (tag === 'NON_REFUNDABLE')     return { label: 'Non-refundable',    type: 'non-refundable' };
  if (tag === 'PARTIALLY_REFUNDABLE') return { label: 'Partially refundable', type: 'partial' };
  return { label: 'Check policy', type: 'unknown' };
};

const calcNights = (checkin, checkout) => {
  if (!checkin || !checkout) return 1;
  const diff = new Date(checkout) - new Date(checkin);
  const nights = Math.round(diff / (1000 * 60 * 60 * 24));
  return nights > 0 ? nights : 1;
};

const getScoreLabel = (score) => {
  const s = parseFloat(score);
  if (s >= 9) return 'Exceptional';
  if (s >= 8) return 'Fabulous';
  if (s >= 7) return 'Good';
  if (s >= 6) return 'Pleasant';
  return 'Reviewed';
};

const TRAVELLER_ICONS = { solo: '🧍', business: '💼', couple: '❤️', family: '👨‍👩‍👧', friends: '👥' };
const TABS = ['Overview', 'Rooms', 'Reviews', 'Description'];

/* ─── Fullscreen Gallery Overlay ─── */
function GalleryOverlay({ images, startIndex, hotelName, onClose }) {
  const [current, setCurrent] = useState(startIndex);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const total = images.length;

  const goTo = (i) => setCurrent(Math.max(0, Math.min(i, total - 1)));
  const prev = (e) => { e.stopPropagation(); goTo(current - 1); };
  const next = (e) => { e.stopPropagation(); goTo(current + 1); };

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    if (Math.abs(dx) > 40 && dy < 60) dx < 0 ? goTo(current + 1) : goTo(current - 1);
    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <div className="gallery-overlay" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="gallery-overlay-header">
        <span className="gallery-overlay-title">{hotelName}</span>
        <span className="gallery-overlay-count">{current + 1} / {total}</span>
        <button className="gallery-overlay-close" onClick={onClose}>✕</button>
      </div>
      <div className="gallery-overlay-img-wrap">
        <img
          src={images[current]}
          alt={`${hotelName} photo ${current + 1}`}
          className="gallery-overlay-img"
          loading="eager"
          decoding="async"
        />
      </div>
      {current > 0 && (
        <button className="gallery-overlay-arrow gallery-overlay-arrow--prev" onClick={prev}>‹</button>
      )}
      {current < total - 1 && (
        <button className="gallery-overlay-arrow gallery-overlay-arrow--next" onClick={next}>›</button>
      )}
      <div className="gallery-thumb-strip">
        {images.slice(Math.max(0, current - 3), current + 8).map((src, idx) => {
          const realIdx = Math.max(0, current - 3) + idx;
          return (
            <div
              key={realIdx}
              className={`gallery-thumb${realIdx === current ? ' gallery-thumb--active' : ''}`}
              onClick={(e) => { e.stopPropagation(); goTo(realIdx); }}
            >
              <img src={src} alt="" loading="lazy" decoding="async" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Photo Carousel ─── */
function PhotoCarousel({ images, hotelName, onOpenGallery }) {
  const [current, setCurrent] = useState(0);
  const [loadedIndexes, setLoadedIndexes] = useState(new Set([0]));
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const total = images.length;

  const goTo = (index) => {
    const clamped = Math.max(0, Math.min(index, total - 1));
    setCurrent(clamped);
    setLoadedIndexes((prev) => new Set([...prev, clamped, clamped + 1]));
  };
  const prev = (e) => { e.stopPropagation(); goTo(current - 1); };
  const next = (e) => { e.stopPropagation(); goTo(current + 1); };

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    if (Math.abs(dx) > 40 && dy < 60) dx < 0 ? goTo(current + 1) : goTo(current - 1);
    touchStartX.current = null;
    touchStartY.current = null;
  };

  if (total === 0) return <div className="detail-hero-placeholder">🏨</div>;

  return (
    <div className="carousel-wrap" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="carousel-track" style={{ transform: `translateX(-${current * 100}%)` }}>
        {images.map((src, i) => (
          <div key={i} className="carousel-slide">
            {loadedIndexes.has(i) ? (
              <img
                src={src}
                alt={`${hotelName} photo ${i + 1}`}
                className="carousel-img"
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
              />
            ) : (
              <div className="carousel-slide-placeholder" />
            )}
          </div>
        ))}
      </div>
      {total > 1 && current > 0 && (
        <button className="carousel-arrow carousel-arrow--prev" onClick={prev} aria-label="Previous photo">‹</button>
      )}
      {total > 1 && current < total - 1 && (
        <button className="carousel-arrow carousel-arrow--next" onClick={next} aria-label="Next photo">›</button>
      )}
      {total > 1 && (
        <div className="carousel-counter">📷 {current + 1} / {total}</div>
      )}
      {total > 1 && total <= 20 && (
        <div className="carousel-dots">
          {images.map((_, i) => (
            <button
              key={i}
              className={`carousel-dot${i === current ? ' carousel-dot--active' : ''}`}
              onClick={(e) => { e.stopPropagation(); goTo(i); }}
              aria-label={`Go to photo ${i + 1}`}
            />
          ))}
        </div>
      )}
      {total > 1 && (
        <button
          className="carousel-view-all"
          onClick={(e) => { e.stopPropagation(); onOpenGallery(current); }}
        >
          🖼 View all {total} photos
        </button>
      )}
    </div>
  );
}

/* ─── Affiliate Comparison Panel ─── */
function AffiliatePanel({ links, hotelName }) {
  const AFFILIATES = [
    {
      key: 'booking',
      logo: 'B.',
      logoClass: 'affiliate-logo--booking',
      name: 'Booking.com',
      tag: 'Best Prices',
      tagClass: 'affiliate-tag--best',
    },
    {
      key: 'agoda',
      logo: 'A',
      logoClass: 'affiliate-logo--agoda',
      name: 'Agoda',
      tag: 'Flash Deals',
      tagClass: 'affiliate-tag--deals',
    },
    {
      key: 'hotels',
      logo: 'H.',
      logoClass: 'affiliate-logo--hotels',
      name: 'Hotels.com',
      tag: 'Loyalty Rewards',
      tagClass: 'affiliate-tag--compare',
    },
    {
      key: 'trip',
      logo: 'T.',
      logoClass: 'affiliate-logo--trip',
      name: 'Trip.com',
      tag: 'Compare Rates',
      tagClass: 'affiliate-tag--compare',
    },
    {
      key: 'expedia',
      logo: 'Ex',
      logoClass: 'affiliate-logo--expedia',
      name: 'Expedia',
      tag: 'Bundle & Save',
      tagClass: 'affiliate-tag--deals',
    },
    {
      key: 'tp',
      logo: 'TP',
      logoClass: 'affiliate-logo--tp',
      name: 'Travelpayouts',
      tag: 'Compare All',
      tagClass: 'affiliate-tag--compare',
    },
  ];

  return (
    <div className="affiliate-panel">
      <div className="affiliate-panel-header">
        <h3 className="affiliate-panel-title">Choose Where to Book</h3>
        <p className="affiliate-panel-sub">
          Compare prices across top platforms and pick the best deal for <strong>{hotelName}</strong>
        </p>
      </div>
      <div className="affiliate-list">
        {AFFILIATES.map((a) => (
          <a
            key={a.key}
            className="affiliate-item"
            href={links[a.key]}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="affiliate-left">
              <div className={`affiliate-logo ${a.logoClass}`}>{a.logo}</div>
              <div className="affiliate-info">
                <p className="affiliate-name">{a.name}</p>
                <span className={`affiliate-tag ${a.tagClass}`}>{a.tag}</span>
              </div>
            </div>
            <div className="affiliate-right">
              <span className="affiliate-book-btn">Book →</span>
            </div>
          </a>
        ))}
      </div>
      <p className="affiliate-note">
        🔒 You'll be taken to the partner's secure site to complete your booking. Prices may vary across platforms.
      </p>
    </div>
  );
}
export default function HotelDetail() {
  const { hotelId } = useParams();
  const { state }   = useLocation();
  const navigate    = useNavigate();

  const [hotel,        setHotel]        = useState(state?.hotel || null);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [activeTab,    setActiveTab]    = useState('Overview');
  const [galleryOpen,  setGalleryOpen]  = useState(false);
  const [galleryStart, setGalleryStart] = useState(0);
  const tabRef       = useRef(null);
  const affiliateRef = useRef(null);

  const openGallery  = (index = 0) => { setGalleryStart(index); setGalleryOpen(true); };
  const closeGallery = () => setGalleryOpen(false);

  const rate         = state?.rate         || null;
  const searchParams = state?.searchParams || {};
  const nights       = calcNights(searchParams.checkin, searchParams.checkout);

  useEffect(() => {
    // Scroll to top — prevents jumping to footer
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Always fetch full hotel details to get the full images array for the carousel
    (async () => {
      try {
        setLoading(true);
        const fullData = await getHotelDetails(hotelId);
        if (fullData) {
          // Merge full API data on top of state data — API response wins
          setHotel((prev) => ({ ...prev, ...fullData }));
        }
      } catch {
        if (!state?.hotel) setError('Could not load hotel details.');
      } finally {
        setLoading(false);
      }
    })();
  }, [hotelId]);

  // ── Affiliate booking links ──
  const buildAffiliateLinks = (targetHotel, sp) => {
    const name     = encodeURIComponent(targetHotel?.name || '');
    const city     = encodeURIComponent(targetHotel?.city || sp?.city || '');
    const checkin  = sp?.checkin  || '';
    const checkout = sp?.checkout || '';
    const adults   = sp?.adults   || 2;

    return {
      booking: `https://www.booking.com/searchresults.html?aid=304142&ss=${name}&checkin=${checkin}&checkout=${checkout}&group_adults=${adults}&no_rooms=1`,
      agoda:   `https://www.agoda.com/search?city=${city}&checkIn=${checkin}&checkOut=${checkout}&adults=${adults}&textToSearch=${name}`,
      hotels:  `https://www.hotels.com/search.do?q-destination=${city}&q-check-in=${checkin}&q-check-out=${checkout}&q-rooms=1&q-room-0-adults=${adults}`,
      trip:    `https://www.trip.com/hotels/list?city=${city}&checkin=${checkin}&checkout=${checkout}&adult=${adults}&keyword=${name}`,
      expedia: `https://www.expedia.com/Hotel-Search?destination=${city}&startDate=${checkin}&endDate=${checkout}&adults=${adults}`,
      tp:      `https://www.travelpayouts.com/hotels?destination=${city}&checkin=${checkin}&checkout=${checkout}&adults=${adults}`,
    };
  };

  const handleAffiliate = (url) => window.open(url, '_blank', 'noopener,noreferrer');

  const switchTab = (tab) => {
    setActiveTab(tab);
    tabRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading && !hotel) return <LoadingSpinner text="Loading hotel details…" />;

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

  const stars = Math.min(Math.round(hotel.starRating || hotel.stars || 0), 5);

  // Build carousel images — try every known LiteAPI key
  const rawImages = hotel.images || hotel.photos || hotel.hotelImages || [];
  const carouselImages = rawImages.length > 0
    ? rawImages
        .map((img) => (typeof img === 'string' ? img : img.url || img.thumbnail || img.original || img.large || ''))
        .filter(Boolean)
    : [hotel.main_photo || hotel.thumbnail].filter(Boolean);

  const rooms         = rate?.roomTypes || [];
  const description   = hotel.hotelDescription || hotel.description || '';
  const address       = [hotel.address, hotel.city, hotel.country].filter(Boolean).join(', ');
  const facilities    = hotel.facilities || hotel.amenities || [];
  const reviewScore   = hotel.reviewScore || null;
  const reviewCount   = hotel.reviewCount || hotel.numberOfReviews || null;
  const reviews       = hotel.reviews || [];
  const lowestPrice   = rooms[0]?.rates?.[0]?.retailRate?.total?.[0];
  const lowestAmt     = lowestPrice ? parseFloat(lowestPrice.amount) : null;
  const affiliateLinks = buildAffiliateLinks(hotel, searchParams);

  return (
    <div className="detail-page">

      {/* ── FULLSCREEN GALLERY ── */}
      {galleryOpen && (
        <GalleryOverlay
          images={carouselImages}
          startIndex={galleryStart}
          hotelName={hotel.name}
          onClose={closeGallery}
        />
      )}

      {/* ── HERO / CAROUSEL ── */}
      <div className="detail-hero-wrap">
        <PhotoCarousel images={carouselImages} hotelName={hotel.name} onOpenGallery={openGallery} />
        <div className="detail-hero-overlay" />
        <button className="detail-back-btn" onClick={() => navigate(-1)}>← Back</button>
        <div className="detail-hero-info">
          <h1 className="detail-hero-name">{hotel.name}</h1>
          {stars > 0 && (
            <div className="detail-hero-stars">
              {Array.from({ length: stars }).map((_, i) => <span key={i}>★</span>)}
            </div>
          )}
        </div>
      </div>

      {/* ── STICKY TABS ── */}
      <div className="detail-tabs-wrap" ref={tabRef}>
        <div className="detail-tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`detail-tab${activeTab === tab ? ' detail-tab--active' : ''}`}
              onClick={() => switchTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="detail-content">

        {/* ════ OVERVIEW ════ */}
        {activeTab === 'Overview' && (
          <>
            <div className="detail-meta-row">
              {address && <p className="detail-address">📍 {address}</p>}
              <div className="detail-meta-right">
                {searchParams.checkin && (
                  <div className="detail-stay-badge">
                    🗓️ {nights} night{nights > 1 ? 's' : ''} · {searchParams.checkin} → {searchParams.checkout}
                  </div>
                )}
                {reviewScore && (
                  <div className="detail-score">
                    <span className="detail-score-num">{reviewScore}</span>
                    <span className="detail-score-label">{getScoreLabel(reviewScore)}</span>
                    {reviewCount && <span className="detail-score-count">{reviewCount} reviews</span>}
                  </div>
                )}
              </div>
            </div>

            <div className="detail-divider" />

            {/* Smart highlights */}
            {description && (
              <div className="detail-section">
                <h2 className="detail-section-title">Smart highlights</h2>
                <div className="detail-highlights-grid">
                  {description.replace(/<[^>]+>/g, '').split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 30).slice(0, 3).map((s, i) => (
                    <div key={i} className="detail-highlight-card">
                      <span className="detail-highlight-icon">✨</span>
                      <p>{s.trim()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Popular facilities */}
            {facilities.length > 0 && (
              <div className="detail-section">
                <div className="detail-section-head">
                  <h2 className="detail-section-title">Popular facilities</h2>
                  <button className="detail-see-all" onClick={() => switchTab('Description')}>See all</button>
                </div>
                <div className="detail-facilities-grid">
                  {facilities.slice(0, 8).map((f, i) => (
                    <div key={i} className="detail-facility-item">
                      <span className="detail-facility-icon">✓</span>
                      <span>{typeof f === 'string' ? f : f.name || f.facilityName || ''}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Review highlights */}
            {reviewScore && (
              <div className="detail-section">
                <div className="detail-section-head">
                  <h2 className="detail-section-title">Review highlights</h2>
                  <button className="detail-see-all" onClick={() => switchTab('Reviews')}>All reviews</button>
                </div>
                <div className="detail-review-summary">
                  <div className="detail-review-score-big">
                    <span className="detail-score-circle">{reviewScore}</span>
                    <div>
                      <p className="detail-score-word">{getScoreLabel(reviewScore)}</p>
                      {reviewCount && <p className="detail-score-based">Based on {reviewCount} reviews</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Who stays here */}
            <div className="detail-section">
              <h2 className="detail-section-title">Who stays here</h2>
              <div className="detail-travellers-row">
                {[{ type: 'Solo', pct: 29 }, { type: 'Business', pct: 27 }, { type: 'Couple', pct: 23 }, { type: 'Family', pct: 9 }, { type: 'Friends', pct: 5 }].map((t) => (
                  <div key={t.type} className="detail-traveller-item">
                    <span className="detail-traveller-icon">{TRAVELLER_ICONS[t.type.toLowerCase()] || '👤'}</span>
                    <span className="detail-traveller-type">{t.type}</span>
                    <span className="detail-traveller-pct">{t.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick room preview */}
            {rooms.length > 0 && (
              <div className="detail-section">
                <div className="detail-section-head">
                  <h2 className="detail-section-title">Choose your room</h2>
                  <button className="detail-see-all" onClick={() => switchTab('Rooms')}>See all rooms</button>
                </div>
                <div className="detail-room-preview-grid">
                  {rooms.slice(0, 2).map((room, i) => {
                    const fr    = room.rates?.[0];
                    const price = fr?.retailRate?.total?.[0];
                    return (
                      <div key={i} className="detail-room-preview-card" onClick={() => handleAffiliate(affiliateLinks.booking)}>
                        <div className="detail-room-preview-img">🛏️</div>
                        <div className="detail-room-preview-info">
                          <p className="detail-room-preview-name">{room.name || `Room Type ${i + 1}`}</p>
                          <p className="detail-room-preview-meta">Sleeps {fr?.maxOccupancy || 2} · {getBoardLabel(fr?.boardType)}</p>
                          {price && (
                            <p className="detail-room-preview-price">
                              {price.currency} {parseFloat(price.amount).toLocaleString()} <span>/ night</span>
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Affiliate booking panel */}
            <div className="detail-section" ref={affiliateRef}>
              <AffiliatePanel links={affiliateLinks} hotelName={hotel.name} />
            </div>
          </>
        )}

        {/* ════ ROOMS ════ */}
        {activeTab === 'Rooms' && (
          <div className="detail-section">
            <h2 className="detail-section-title">
              {rooms.length > 0 ? `Available Rooms (${rooms.length})` : 'Room Information'}
            </h2>

            {searchParams.checkin && (
              <div className="detail-rooms-bar">
                <span>📅 {searchParams.checkin} – {searchParams.checkout}</span>
                <span>👤 {searchParams.adults || 2} Guests</span>
              </div>
            )}

            <div className="detail-filter-pills">
              <span className="detail-pill">☕ Breakfast options</span>
              <span className="detail-pill">✅ Free cancellation</span>
            </div>

            {rooms.length === 0 ? (
              <div className="detail-no-rooms">
                <span className="detail-no-rooms-icon">🛏️</span>
                <p className="detail-no-rooms-msg">No rooms available for your selected dates.</p>
                <p style={{ fontSize: '0.82rem', color: 'var(--muted)', margin: '8px 0 16px' }}>
                  Check availability directly on a booking platform:
                </p>
                <AffiliatePanel links={affiliateLinks} hotelName={hotel.name} />
              </div>
            ) : (
              <div className="detail-rooms-list">
                {rooms.map((room, i) => {
                  const fr       = room.rates?.[0];
                  const price    = fr?.retailRate?.total?.[0];
                  const refund   = getRefundInfo(fr);
                  const perNight = price ? parseFloat(price.amount) : null;
                  const total    = perNight ? perNight * nights : null;
                  const roomsLeft = room.quantity || room.availableRooms || null;
                  return (
                    <div key={i} className="detail-room-card">
                      <div className="detail-room-header">
                        <div className="detail-room-title-row">
                          <p className="detail-room-name">{room.name || `Room Type ${i + 1}`}</p>
                          {roomsLeft !== null && roomsLeft <= 5 && (
                            <span className="detail-rooms-left">🔥 Only {roomsLeft} left</span>
                          )}
                        </div>
                        <div className="detail-room-badges">
                          <span className="detail-badge detail-badge--meal">☕ {getBoardLabel(fr?.boardType)}</span>
                          <span className="detail-badge detail-badge--guests">👤 Max {fr?.maxOccupancy || 2} guests</span>
                          <span className={`detail-badge detail-badge--cancel detail-badge--cancel-${refund.type}`}>
                            {refund.type === 'refundable' ? '✅' : '❌'} {refund.label}
                          </span>
                        </div>
                      </div>
                      <div className="detail-room-pricing">
                        {price ? (
                          <div className="detail-price-block">
                            <div className="detail-price-row">
                              <span className="detail-price-per-night">
                                {price.currency} {perNight?.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                              </span>
                              <span className="detail-price-per-label">/ night</span>
                            </div>
                            {nights > 1 && total && (
                              <div className="detail-price-total">
                                Total: <strong>{price.currency} {total.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</strong>
                                <span> for {nights} nights incl. taxes</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="detail-price-unavailable">Price on request</p>
                        )}
                        <button className="detail-book-btn" onClick={() => handleAffiliate(affiliateLinks.booking)}>Book Now</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ════ REVIEWS ════ */}
        {activeTab === 'Reviews' && (
          <div className="detail-section">
            <h2 className="detail-section-title">Guest reviews</h2>
            {reviewScore && (
              <div className="detail-review-summary">
                <div className="detail-review-score-big">
                  <span className="detail-score-circle">{reviewScore}</span>
                  <div>
                    <p className="detail-score-word">{getScoreLabel(reviewScore)}</p>
                    {reviewCount && <p className="detail-score-based">Based on {reviewCount} reviews</p>}
                  </div>
                </div>
                <div className="detail-travellers-row" style={{ marginTop: 24 }}>
                  {[{ type: 'Solo', pct: 29 }, { type: 'Business', pct: 27 }, { type: 'Couple', pct: 23 }, { type: 'Family', pct: 9 }].map((t) => (
                    <div key={t.type} className="detail-traveller-item">
                      <span className="detail-traveller-icon">{TRAVELLER_ICONS[t.type.toLowerCase()] || '👤'}</span>
                      <span className="detail-traveller-type">{t.type}</span>
                      <span className="detail-traveller-pct">{t.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {reviews.length > 0 ? (
              <div className="detail-reviews-list">
                {reviews.slice(0, 5).map((r, i) => (
                  <div key={i} className="detail-review-card">
                    <div className="detail-review-top">
                      <div className="detail-reviewer-avatar">{r.reviewer?.charAt(0) || '?'}</div>
                      <div>
                        <p className="detail-reviewer-name">{r.reviewer || 'Guest'}</p>
                        <p className="detail-reviewer-meta">{r.travellerType || 'Traveller'} · {r.date || ''}</p>
                      </div>
                      {r.score && <span className="detail-review-score-badge">{r.score}</span>}
                    </div>
                    {r.title       && <p className="detail-review-title">{r.title}</p>}
                    {r.description && <p className="detail-review-body">{r.description}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="detail-no-reviews"><p>No reviews available for this property yet.</p></div>
            )}
          </div>
        )}

        {/* ════ DESCRIPTION ════ */}
        {activeTab === 'Description' && (
          <div className="detail-section">
            {description ? (
              <>
                <h2 className="detail-section-title">About this property</h2>
                <div className="detail-description" dangerouslySetInnerHTML={{ __html: description }} />
              </>
            ) : (
              <p style={{ color: 'var(--faint)' }}>No description available.</p>
            )}
            {facilities.length > 0 && (
              <div style={{ marginTop: 32 }}>
                <h2 className="detail-section-title">All facilities</h2>
                <div className="detail-facilities-full">
                  {facilities.map((f, i) => (
                    <div key={i} className="detail-facility-item">
                      <span className="detail-facility-icon">✓</span>
                      <span>{typeof f === 'string' ? f : f.name || f.facilityName || ''}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* ── STICKY BOTTOM BAR ── */}
      <div className="detail-sticky-bar">
        <div className="detail-sticky-price">
          {lowestAmt ? (
            <>
              <span className="detail-sticky-from">from</span>
              <span className="detail-sticky-amount">
                {lowestPrice.currency} {lowestAmt.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </span>
              <span className="detail-sticky-per">/ night</span>
            </>
          ) : (
            <span className="detail-sticky-from">View rates</span>
          )}
        </div>
        <button className="detail-sticky-btn" onClick={() => {
          setActiveTab('Overview');
          setTimeout(() => affiliateRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
        }}>
          Compare &amp; Book
        </button>
      </div>

    </div>
  );
}
