import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import HotelDetail from './pages/HotelDetail';
import Checkout from './pages/Checkout';
import BookingConfirmation from './pages/BookingConfirmation';
import './App.css';

export default function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="app">
          <Header />
          <main>
            <Routes>
              <Route path="/"                     element={<Home />} />
              <Route path="/search"               element={<SearchResults />} />
              <Route path="/hotel/:hotelId"        element={<HotelDetail />} />
              <Route path="/checkout"             element={<Checkout />} />
              <Route path="/booking-confirmation" element={<BookingConfirmation />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </LanguageProvider>
  );
}
