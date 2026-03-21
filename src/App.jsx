import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import HotelDetail from './pages/HotelDetail';
import './App.css';

export default function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/hotel/:hotelId" element={<HotelDetail />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
