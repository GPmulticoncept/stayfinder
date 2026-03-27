import { useLanguage } from '../i18n/LanguageContext';

const WHATSAPP_NUMBER = '2347034542773';
const WHATSAPP_MSG   = encodeURIComponent('Hello, I need help with StayFinder.');
const WHATSAPP_LIST  = encodeURIComponent('Hello, I would like to list my property on StayFinder.');

export default function Footer() {
  const { t } = useLanguage();

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
            <p className="sf-footer-brand-desc">{t('findBook')}</p>
            <p className="sf-footer-tagline">{t('gpTagline')}</p>
          </div>

          {/* Company */}
          <div>
            <h4 className="sf-footer-col-title">{t('company')}</h4>
            <a href="/#features"     className="sf-footer-link">{t('whyUs')}</a>
            <a href="/#destinations" className="sf-footer-link">{t('destinations')}</a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_LIST}`}
              target="_blank" rel="noreferrer"
              className="sf-footer-link"
            >
              {t('listProperty')}
            </a>
          </div>

          {/* Support */}
          <div>
            <h4 className="sf-footer-col-title">{t('contactUs')}</h4>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}
              target="_blank" rel="noreferrer"
              className="sf-footer-link"
            >
              {t('whatsappSupport')}
            </a>
            <a href="mailto:haggai.enitan.dev@gmail.com" className="sf-footer-link">
              {t('emailUs')}
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_LIST}`}
              target="_blank" rel="noreferrer"
              className="sf-footer-link"
            >
              {t('partnerWithUs')}
            </a>
          </div>

        </div>

        <div className="sf-footer-bottom" style={{ justifyContent: 'center' }}>
          <p className="sf-footer-legal" style={{ textAlign: 'center' }}>
            © {new Date().getFullYear()} StayFinder by GP Tech Studio · GPmulticoncept Enterprises. {t('allRightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  );
}
