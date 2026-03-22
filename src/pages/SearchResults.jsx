import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchHotels, getHotelRates } from '../services/liteapi';
import HotelCard from '../components/HotelCard';
import SearchBar from '../components/SearchBar';

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-img" />
      <div className="skeleton-body">
        <div className="skeleton-line wide" />
        <div className="skeleton-line medium" />
        <div className="skeleton-line short" />
      </div>
    </div>
  );
}

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const city        = searchParams.get('city') || '';
  const countryCode = searchParams.get('countryCode') || 'US';
  const checkin     = searchParams.get('checkin') || '';
  const checkout    = searchParams.get('checkout') || '';
  const adults      = parseInt(searchParams.get('adults') || '2');
  const currency    = searchParams.get('currency') || 'USD';

  const [hotels, setHotels]             = useState([]);
  const [rates, setRates]               = useState({});
  const [loading, setLoading]           = useState(true);
  const [loadingRates, setLoadingRates] = useState(false);
  const [error, setError]               = useState(null);

  useEffect(() => {
    if (!checkin || !checkout) {
      setLoading(false);
      return;
    }

    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        setHotels([]);
        setRates({});

        const hotelList = await searchHotels({ countryCode, limit: 30 });

        if (!hotelList || hotelList.length === 0) {
          setLoading(false);
          return;
        }

        setHotels(hotelList);
        setLoading(false);

        setLoadingRates(true);
        const hotelIds = hotelList.slice(0, 20).map((h) => h.id);
        const rateData = await getHotelRates({
          hotelIds, checkin, checkout, adults, currency,
          guestNationality: countryCode,
        });

        const rateMap = {};
        if (Array.isArray(rateData)) {
          rateData.forEach((r) => { if (r.hotelId) rateMap[r.hotelId] = r; });
        }
        setRates(rateMap);
        setLoadingRates(false);
      } catch (err) {
        console.error(err);
        setError('Something went wrong. Please try again.');
        setLoading(false);
        setLoadingRates(false);
      }
    };

    run();
  }, [city, countryCode, checkin, checkout, adults, currency]);

  const spObj = { city, countryCode, checkin, checkout, adults, currency };

  return (
    <div className="results-page">
      <div className="results-search-wrap">
        <div className="container">
          <SearchBar initialValues={spObj} />
        </div>
      </div>

      <div className="container">
        {loading ? (
          <>
            <div className="results-header">
              <div className="skeleton-line wide" style={{ height: 28, marginBottom: 8, borderRadius: 6 }} />
              <div className="skeleton-line medium" style={{ height: 16, borderRadius: 4 }} />
            </div>
            <div className="results-grid">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          </>
        ) : error ? (
          <div className="no-results">
            <div className="no-results-icon">⚠️</div>
            <h3>Something went wrong</h3>
            <p>{error}</p>
            <button className="try-again-btn" onClick={() => navigate('/')}>Try Again</button>
          </div>
        ) : !checkin || !checkout ? (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>Start your search</h3>
            <p>Enter your destination, dates and guests above to find hotels.</p>
          </div>
        ) : hotels.length === 0 ? (
          <div className="no-results">
            <div className="no-results-icon">🏨</div>
            <h3>No hotels found{city ? ` in ${city}` : ''}</h3>
            <p>Try a different country or adjust your dates.</p>
            <button className="try-again-btn" onClick={() => navigate('/')}>Search Again</button>
          </div>
        ) : (
          <>
            <div className="results-header">
              <h2>Hotels{city ? ` in ${city}` : ''}</h2>
              <p className="results-meta">
                {hotels.length} properties · {checkin} → {checkout} · {adults} adult{adults > 1 ? 's' : ''}
                {loadingRates && <span className="results-fetching"> · Fetching prices…</span>}
              </p>
            </div>
            <div className="results-grid">
              {hotels.map((hotel) => (
                <HotelCard
                  key={hotel.id}
                  hotel={hotel}
                  rate={rates[hotel.id] || null}
                  searchParams={spObj}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
