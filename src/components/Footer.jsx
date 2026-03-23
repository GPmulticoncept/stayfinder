const WHATSAPP_NUMBER = '2347034542773';
const WHATSAPP_MSG   = encodeURIComponent('Hello, I need help with StayFinder.');
const WHATSAPP_LIST  = encodeURIComponent('Hello, I would like to list my property on StayFinder.');

export default function Footer() {
  return (
    <footer className="sf-footer">
      <div className="sf-footer-inner">
        <div className="sf-footer-top">

          {/* Brand */}
          <div>
            <div className="sf-footer-logo">
              <span className="sf-footer-logo-icon">🏨</span>
              <span className="sf-footer-logo-text">StayFinder</span>
            </div>
            <p className="sf-footer-brand-desc">
              Find and book world-class hotels at the best prices.
              Over 2 million hotels across 196 countries — all in one place.
            </p>
            <p className="sf-footer-tagline">A GP Tech Studio product · GPmulticoncept Enterprises</p>
          </div>

          {/* Company */}
          <div>
            <h4 className="sf-footer-col-title">Company</h4>
            <a href="/#features" className="sf-footer-link">Why StayFinder</a>
            <a href="/#destinations" className="sf-footer-link">Destinations</a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_LIST}`}
              target="_blank" rel="noreferrer"
              className="sf-footer-link"
            >
              List Your Property
            </a>
          </div>

          {/* Support */}
          <div>
            <h4 className="sf-footer-col-title">Contact Us</h4>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}
              target="_blank" rel="noreferrer"
              className="sf-footer-link"
            >
              💬 WhatsApp Support
            </a>
            <a href="mailto:haggai.enitan.dev@gmail.com" className="sf-footer-link">
              ✉️ Email Us
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_LIST}`}
              target="_blank" rel="noreferrer"
              className="sf-footer-link"
            >
              🏠 Partner With Us
            </a>
          </div>

        </div>

        <div className="sf-footer-bottom">
          <p className="sf-footer-legal">
            © {new Date().getFullYear()} StayFinder by GP Tech Studio · GPmulticoncept Enterprises. All rights reserved.
          </p>
          <p className="sf-footer-legal">
            Hotel data powered by LiteAPI
          </p>
        </div>
      </div>
    </footer>
  );
}
