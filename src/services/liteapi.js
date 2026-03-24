const BASE_URL = 'https://api.liteapi.travel/v3.0';
const API_KEY = import.meta.env.VITE_LITEAPI_KEY;

// GET requests must NOT include Content-Type — triggers CORS preflight
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

// ─── SEARCH HOTELS ───
export const searchHotels = async ({ countryCode, cityName, limit = 30 }) => {
  try {
    const query = { countryCode, limit: String(limit) };
    if (cityName && cityName.trim()) query.cityName = cityName.trim();
    const params = new URLSearchParams(query);
    const res = await fetch(`${BASE_URL}/data/hotels?${params}`, { headers: getHeaders() });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch { return []; }
};

// ─── GET HOTEL RATES ───
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
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch { return []; }
};

// ─── GET HOTEL DETAILS ───
export const getHotelDetails = async (hotelId) => {
  try {
    const res = await fetch(`${BASE_URL}/data/hotel?hotelId=${hotelId}`, { headers: getHeaders() });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || null;
  } catch { return null; }
};

// ─── GET COUNTRIES ───
export const getCountries = async () => {
  try {
    const res = await fetch(`${BASE_URL}/data/countries`, { headers: getHeaders() });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch { return []; }
};

// ─── GET CITIES BY COUNTRY ───
export const getCities = async (countryCode) => {
  try {
    const res = await fetch(`${BASE_URL}/data/cities?countryCode=${countryCode}`, { headers: getHeaders() });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch { return []; }
};

// ─── GET CURRENCIES ───
export const getCurrencies = async () => {
  try {
    const res = await fetch(`${BASE_URL}/data/currencies`, { headers: getHeaders() });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch { return []; }
};

// ─── PREBOOK ───
// Locks the rate and returns a prebookId + final confirmed price
export const prebookRate = async ({ offerId }) => {
  try {
    const res = await fetch(`${BASE_URL}/hotels/prebook`, {
      method: 'POST',
      headers: postHeaders(),
      body: JSON.stringify({ offerId }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { error: data?.message || data?.error || 'Failed to lock this rate. Please try again.' };
    }
    return { data: data.data || data };
  } catch {
    return { error: 'Network error. Please check your connection.' };
  }
};

// ─── BOOK ───
// Completes the booking with guest info + payment card
export const bookRate = async ({
  prebookId,
  guestFirstName,
  guestLastName,
  guestEmail,
  guestPhone,
  cardNumber,
  cardExpireMonth,
  cardExpireYear,
  cardCVC,
  cardHolder,
}) => {
  try {
    const res = await fetch(`${BASE_URL}/hotels/book`, {
      method: 'POST',
      headers: postHeaders(),
      body: JSON.stringify({
        prebookId,
        guestInfo: {
          guestFirstName,
          guestLastName,
          guestEmail,
          guestPhone,
        },
        payment: {
          holderName: cardHolder,
          number:     cardNumber.replace(/\s/g, ''),
          expireDate: `${String(cardExpireMonth).padStart(2, '0')}/${String(cardExpireYear).slice(-2)}`,
          cvc:        cardCVC,
        },
        clientReference: `SF-${Date.now()}`,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { error: data?.message || data?.error || 'Booking failed. Please check your details.' };
    }
    return { data: data.data || data };
  } catch {
    return { error: 'Network error. Please check your connection.' };
  }
};

// ─── GET BOOKING ───
export const getBooking = async (bookingId) => {
  try {
    const res = await fetch(`${BASE_URL}/hotels/booking?bookingId=${bookingId}`, { headers: getHeaders() });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || null;
  } catch { return null; }
};

// ─── GET ALL BOOKINGS ───
export const getAllBookings = async () => {
  try {
    const res = await fetch(`${BASE_URL}/hotels/bookings`, { headers: getHeaders() });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch { return []; }
};

// ─── CANCEL BOOKING ───
export const cancelBooking = async (bookingId) => {
  try {
    const res = await fetch(`${BASE_URL}/hotels/cancel`, {
      method: 'PUT',
      headers: postHeaders(),
      body: JSON.stringify({ bookingId }),
    });
    const data = await res.json();
    if (!res.ok) return { error: data?.message || 'Cancellation failed.' };
    return { data: data.data || data };
  } catch {
    return { error: 'Network error. Please check your connection.' };
  }
};

// ─── HELPER: Extract offerId from a rate object ───
// Checks all known key variants LiteAPI uses across sandbox and production
export const extractOfferId = (rate) => {
  if (!rate) return null;
  return (
    rate.offerId      ||
    rate.rateId       ||
    rate.offerToken   ||
    rate.tokenId      ||
    rate.offer_id     ||
    rate.token        ||
    rate.bookingToken ||
    null
  );
};
