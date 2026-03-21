const BASE_URL = 'https://api.liteapi.travel/v3.0';
const API_KEY = import.meta.env.VITE_LITEAPI_KEY;

const headers = () => ({
  'X-API-Key': API_KEY,
  'Content-Type': 'application/json',
  Accept: 'application/json',
});

export const searchHotels = async ({ countryCode, limit = 30 }) => {
  try {
    const params = new URLSearchParams({ countryCode, limit: String(limit) });
    const res = await fetch(`${BASE_URL}/data/hotels?${params}`, { headers: headers() });
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
      headers: headers(),
      body: JSON.stringify({
        hotelIds,
        checkin,
        checkout,
        occupancies: [{ adults: Number(adults) }],
        currency: currency || 'USD',
        guestNationality: guestNationality || 'US',
      }),
    });
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.error('getHotelRates error:', err);
    return [];
  }
};

export const getHotelDetails = async (hotelId) => {
  try {
    const res = await fetch(`${BASE_URL}/data/hotel?hotelId=${hotelId}`, { headers: headers() });
    const data = await res.json();
    return data.data || null;
  } catch (err) {
    console.error('getHotelDetails error:', err);
    return null;
  }
};
EO
EO
EOf
