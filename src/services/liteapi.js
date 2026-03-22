const BASE_URL = 'https://api.liteapi.travel/v3.0';
const API_KEY = import.meta.env.VITE_LITEAPI_KEY;

// GET requests must NOT include Content-Type — it triggers CORS preflight and silently fails
const getHeaders = () => ({
  'X-API-Key': API_KEY,
  'Accept': 'application/json',
});

// POST requests need Content-Type
const postHeaders = () => ({
  'X-API-Key': API_KEY,
  'Content-Type': 'application/json',
  'Accept': 'application/json',
});

export const searchHotels = async ({ countryCode, cityName, limit = 30 }) => {
  try {
    const query = { countryCode, limit: String(limit) };
    if (cityName && cityName.trim()) query.cityName = cityName.trim();
    const params = new URLSearchParams(query);
    const res = await fetch(`${BASE_URL}/data/hotels?${params}`, { headers: getHeaders() });
    if (!res.ok) {
      console.error('searchHotels HTTP error:', res.status, res.statusText);
      return [];
    }
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.error('searchHotels error:', err);
    return [];
  }
};

export const getHotelRates = async ({ hotelIds, checkin, checkout, adults, currency, guestNationality }) => {
  try {
    const res = await fetch(`${BASE_URL}/hotels/rates`, {
      method: 'POST',
      headers: postHeaders(),
      body: JSON.stringify({
        hotelIds,
        checkin,
        checkout,
        occupancies: [{ adults: Number(adults) }],
        currency: currency || 'USD',
        guestNationality: guestNationality || 'US',
      }),
    });
    if (!res.ok) {
      console.error('getHotelRates HTTP error:', res.status, res.statusText);
      return [];
    }
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.error('getHotelRates error:', err);
    return [];
  }
};

export const getHotelDetails = async (hotelId) => {
  try {
    const res = await fetch(`${BASE_URL}/data/hotel?hotelId=${hotelId}`, { headers: getHeaders() });
    if (!res.ok) {
      console.error('getHotelDetails HTTP error:', res.status, res.statusText);
      return null;
    }
    const data = await res.json();
    return data.data || null;
  } catch (err) {
    console.error('getHotelDetails error:', err);
    return null;
  }
};
