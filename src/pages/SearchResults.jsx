import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchHotels, getHotelRates } from '../services/liteapi';
import HotelCard from '../components/HotelCard';
import SearchBar from '../components/SearchBar';
import { useLanguage } from '../i18n/LanguageContext';

function SkeletonCard() {
  return (
    <div className="sf-skeleton-card">
      <div className="sf-sk-img" />
      <div className="sf-sk-body">
        <div className="sf-sk-line w-80" />
        <div className="sf-sk-line w-55" />
        <div className="sf-sk-line w-35" />
      </div>
    </div>
  );
}

const SCORE_THRESHOLDS = [
  { value: 0, labelKey: 'anyScore' },
  { value: 6, label: '6.0+ Pleasant' },
  { value: 7, label: '7.0+ Good' },
  { value: 8, label: '8.0+ Fabulous' },
  { value: 9, label: '9.0+ Exceptional' },
];

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t }    = useLanguage();

  const city        = searchParams.get('city')        || '';
  const countryCode = searchParams.get('countryCode') || 'NG';
  const checkin     = searchParams.get('checkin')     || '';
  const checkout    = searchParams.get('checkout')    || '';
  const adults      = parseInt(searchParams.get('adults') || '2');
  const currency    = searchParams.get('currency')    || 'NGN';

  const [hotels,       setHotels]       = useState([]);
  const [rates,        setRates]        = useState({});
  const [loading,      setLoading]      = useState(true);
  const [loadingRates, setLoadingRates] = useState(false);
  const [error,        setError]        = useState(null);

  const [sort,         setSort]         = useState('recommended');
  const [view,         setView]         = useState('grid');
  const [filterStars,  setFilterStars]  = useState([]);
  const [filterScore,  setFilterScore]  = useState(0);
  const [filterDrawer, setFilterDrawer] = useState(false);

  const SORT_OPTIONS = [
    { value: 'recommended', label: t('recommended') },
    { value: 'price-asc',   label: t('priceAsc') },
    { value: 'price-desc',  label: t('priceDesc') },
    { value: 'rating',      label: t('topRated') },
    { value: 'stars',       label: t('stars') },
  ];

  useEffect(() => {
    if (!checkin || !checkout) { setLoading(false); return; }
    const run = async () => {
      try {
        setLoading(true); setError(null); setHotels([]); setRates({});
        const hotelList = await searchHotels({ countryCode, cityName: city, limit: 30 });
        if (!hotelList || hotelList.length === 0) { setLoading(false); return; }
        setHotels(hotelList); setLoading(false);
        setLoadingRates(true);
        const hotelIds = hotelList.slice(0, 20).map((h) => h.id);
        const rateData = await getHotelRates({ hotelIds, checkin, checkout, adults, currency, guestNationality: countryCode });
        const rateMap = {};
        if (Array.isArray(rateData)) rateData.forEach((r) => { if (r.hotelId) rateMap[r.hotelId] = r; });
        setRates(rateMap); setLoadingRates(false);
      } catch (err) {
        setError(t('somethingWrong')); setLoading(false); setLoadingRates(false);
      }
    };
    run();
  }, [city, countryCode, checkin, checkout, adults, currency]);

  const toggleStar = (star) => setFilterStars((prev) => prev.includes(star) ? prev.filter((s) => s !== star) : [...prev, star]);
  const clearFilters = () => { setFilterStars([]); setFilterScore(0); setSort('recommended'); };
  const activeFilterCount = filterStars.length + (filterScore > 0 ? 1 : 0);
  const getHotelPrice = (hotel) => rates[hotel.id]?.roomTypes?.[0]?.rates?.[0]?.retailRate?.total?.[0]?.amount;

  const displayHotels = useMemo(() => {
    let filtered = [...hotels];
    if (filterStars.length > 0) filtered = filtered.filter((h) => filterStars.includes(Math.round(h.starRating || h.stars || 0)));
    if (filterScore > 0) filtered = filtered.filter((h) => parseFloat(h.reviewScore || 0) >= filterScore);
    filtered.sort((a, b) => {
      if (sort === 'price-asc' || sort === 'price-desc') {
        const pa = parseFloat(getHotelPrice(a) || 0), pb = parseFloat(getHotelPrice(b) || 0);
        if (!pa && !pb) return 0; if (!pa) return 1; if (!pb) return -1;
        return sort === 'price-asc' ? pa - pb : pb - pa;
      }
      if (sort === 'rating') return parseFloat(b.reviewScore || 0) - parseFloat(a.reviewScore || 0);
      if (sort === 'stars')  return (b.starRating || b.stars || 0) - (a.starRating || a.stars || 0);
      return 0;
    });
    return filtered;
  }, [hotels, rates, filterStars, filterScore, sort]);

  const spObj = { city, countryCode, checkin, checkout, adults, currency };

  const FilterContent = () => (
    <>
      <div className="sf-filter-group">
        <p className="sf-filter-group-title">{t('sortBy').replace(':', '')}</p>
        {SORT_OPTIONS.map((opt) => (
          <label key={opt.value} className="sf-filter-option">
            <input type="radio" name="sort" checked={sort === opt.value} onChange={() => setSort(opt.value)} />
            {opt.label}
          </label>
        ))}
      </div>
      <div className="sf-filter-group">
        <p className="sf-filter-group-title">{t('starRating')}</p>
        {[5, 4, 3, 2, 1].map((star) => (
          <label key={star} className="sf-filter-option">
            <input type="checkbox" checked={filterStars.includes(star)} onChange={() => toggleStar(star)} />
            <span className="sf-filter-stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i < star ? '' : 'sf-filter-stars-gray'}>★</span>
              ))}
            </span>
          </label>
        ))}
      </div>
      <div className="sf-filter-group">
        <p className="sf-filter-group-title">{t('guestRating')}</p>
        {SCORE_THRESHOLDS.map((opt) => (
          <label key={opt.value} className="sf-filter-option">
            <input type="radio" name="score" checked={filterScore === opt.value} onChange={() => setFilterScore(opt.value)} />
            {opt.labelKey ? t(opt.labelKey) : opt.label}
          </label>
        ))}
      </div>
    </>
  );

  return (
    <div className="sf-results-page">
      <div className="sf-results-sticky" style={{ paddingTop: '82px' }}>
        <div className="container"><SearchBar initialValues={spObj} compact /></div>
      </div>

      {loading ? (
        <div className="sf-results-layout">
          <div className="sf-filter-panel" style={{ minHeight: 300 }} />
          <div className="sf-results-main">
            <div className="sf-results-grid">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="container">
          <div className="sf-empty-state">
            <span className="sf-empty-icon">⚠️</span>
            <h3 className="sf-empty-title">{t('somethingWrong')}</h3>
            <p className="sf-empty-text">{error}</p>
            <button className="sf-empty-btn" onClick={() => navigate('/')}>{t('tryAgain')}</button>
          </div>
        </div>
      ) : !checkin || !checkout ? (
        <div className="container">
          <div className="sf-empty-state">
            <span className="sf-empty-icon">🔍</span>
            <h3 className="sf-empty-title">{t('startSearch')}</h3>
            <p className="sf-empty-text">{t('enterDestination')}</p>
          </div>
        </div>
      ) : hotels.length === 0 ? (
        <div className="container">
          <div className="sf-empty-state">
            <span className="sf-empty-icon">🏨</span>
            <h3 className="sf-empty-title">{t('noHotelsFound')}{city ? ` ${t('hotelsIn').split(' ').pop()} ${city}` : ''}</h3>
            <p className="sf-empty-text">{t('tryDifferent')}</p>
            <button className="sf-empty-btn" onClick={() => navigate('/')}>{t('searchAgain')}</button>
          </div>
        </div>
      ) : (
        <div className="sf-results-layout">
          <aside className="sf-filter-panel">
            <div className="sf-filter-panel-header">
              <span className="sf-filter-panel-title">
                🎛 {t('filtersLabel').replace('🎛 ', '')}{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
              </span>
              {activeFilterCount > 0 && (
                <button className="sf-filter-clear" onClick={clearFilters}>{t('clearAll')}</button>
              )}
            </div>
            <FilterContent />
          </aside>

          <div className="sf-results-main">
            <div className="sf-results-toolbar">
              <p className="sf-results-count">
                <strong>{displayHotels.length}</strong> {t('of')} {hotels.length} {t('properties')}{city ? ` ${t('hotelsIn').split(' ').pop()} ${city}` : ''}
                {loadingRates && <span className="sf-results-fetching"> · {t('fetchingPrices')}</span>}
              </p>
              <div className="sf-toolbar-right">
                <div className="sf-sort-wrap">
                  <span className="sf-sort-label">{t('sortBy')}</span>
                  <div className="sf-sort-pills">
                    {SORT_OPTIONS.map((opt) => (
                      <button key={opt.value} className={`sf-sort-pill ${sort === opt.value ? 'active' : ''}`} onClick={() => setSort(opt.value)}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="sf-view-toggle">
                  <button className={`sf-view-btn ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')} title="Grid view">⊞</button>
                  <button className={`sf-view-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')} title="List view">☰</button>
                </div>
              </div>
            </div>

            {displayHotels.length === 0 ? (
              <div className="sf-empty-state">
                <span className="sf-empty-icon">🔍</span>
                <h3 className="sf-empty-title">{t('noResultsMatch')}</h3>
                <p className="sf-empty-text">{t('tryRemovingFilters')}</p>
                <button className="sf-empty-btn" onClick={clearFilters}>{t('clearFilters')}</button>
              </div>
            ) : (
              <div className={view === 'grid' ? 'sf-results-grid' : 'sf-results-list'}>
                {displayHotels.map((hotel) => (
                  <HotelCard
                    key={hotel.id}
                    hotel={hotel}
                    rate={rates[hotel.id] || null}
                    searchParams={spObj}
                    listView={view === 'list'}
                    loadingRates={loadingRates && !rates[hotel.id]}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {!loading && hotels.length > 0 && (
        <button className="sf-filter-fab" style={{ display: 'flex' }} onClick={() => setFilterDrawer(true)}>
          🎛 {t('filterSort').replace('🎛 ', '')}
          {activeFilterCount > 0 && <span className="active-count">{activeFilterCount}</span>}
        </button>
      )}

      <div className={`sf-filter-overlay ${filterDrawer ? 'open' : ''}`} onClick={() => setFilterDrawer(false)} />
      <div className={`sf-filter-drawer ${filterDrawer ? 'open' : ''}`}>
        <div className="sf-filter-drawer-header">
          <span className="sf-filter-drawer-title">{t('filterSort')}</span>
          <button className="sf-filter-drawer-close" onClick={() => setFilterDrawer(false)}>✕</button>
        </div>
        <div className="sf-filter-drawer-body"><FilterContent /></div>
        <div className="sf-filter-drawer-footer">
          <button className="sf-filter-reset-btn" onClick={clearFilters}>{t('reset')}</button>
          <button className="sf-filter-apply-btn" onClick={() => setFilterDrawer(false)}>
            {t('showResults')} {displayHotels.length} {t('results')}
          </button>
        </div>
      </div>
    </div>
  );
}
