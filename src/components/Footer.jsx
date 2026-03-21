export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="logo">
              <span className="logo-icon">🏨</span>
              <span className="logo-text" style={{ color: '#fff' }}>StayFinder</span>
            </div>
            <p>
              Find and book hotels worldwide at the best prices.
              Over 2 million hotels across 196 countries.
            </p>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <a href="#">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Blog</a>
            <a href="#">Press</a>
          </div>

          <div className="footer-col">
            <h4>Support</h4>
            <a href="#">Help Center</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact Us</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} StayFinder. All rights reserved. Powered by LiteAPI.</p>
        </div>
      </div>
    </footer>
  );
}
