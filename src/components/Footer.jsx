const WHATSAPP_NUMBER = '2348000000000';
const WHATSAPP_MSG = encodeURIComponent('Hello, I need help with StayFinder.');
const WHATSAPP_LIST = encodeURIComponent('Hello, I would like to list my property on StayFinder.');

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top footer-top--simple">
          <div className="footer-brand">
            <div className="logo">
              <span className="logo-icon">🏨</span>
              <span className="logo-text" style={{ color: '#fff' }}>StayFinder</span>
            </div>
            <p>
              Find and book hotels worldwide at the best prices.
              Over 2 million hotels across 196 countries.
            </p>
            <p className="footer-tagline">A GP Tech Studio product · GPmulticoncept Enterprises</p>
          </div>

          <div className="footer-col">
            <h4>Contact Us</h4>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}
              target="_blank"
              rel="noreferrer"
            >
              💬 WhatsApp Support
            </a>
            <a href="mailto:haggai.enitan.dev@gmail.com">
              ✉️ Email Us
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_LIST}`}
              target="_blank"
              rel="noreferrer"
            >
              🏠 List Your Property
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} StayFinder by GP Tech Studio · GPmulticoncept Enterprises. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
