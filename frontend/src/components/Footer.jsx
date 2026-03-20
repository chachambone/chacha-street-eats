import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&family=Playfair+Display:wght@700&display=swap');

        .footer {
          background: #1C1C1C;
          color: #999;
          font-family: 'Nunito', sans-serif;
          padding: 4rem 3rem 2rem;
        }

        /* ── TOP GRID ── */
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 3rem;
          margin-bottom: 3rem;
        }

        /* Brand column */
        .footer-brand-logo {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 1rem;
          text-decoration: none;
        }
        .footer-logo-box {
          width: 36px; height: 36px;
          background: #E8441A;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.1rem;
          box-shadow: 0 4px 12px rgba(232,68,26,0.4);
          flex-shrink: 0;
        }
        .footer-logo-text {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem; font-weight: 700;
          color: white;
        }
        .footer-brand-desc {
          font-size: 0.85rem; line-height: 1.7;
          color: #666; font-weight: 600;
          max-width: 260px; margin-bottom: 1.5rem;
        }
        .footer-socials {
          display: flex; gap: 0.7rem;
        }
        .social-btn {
          width: 38px; height: 38px;
          background: #2a2a2a;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.1rem; cursor: pointer;
          transition: all 0.2s; text-decoration: none;
          border: 1px solid #333;
        }
        .social-btn:hover {
          background: #E8441A;
          border-color: #E8441A;
          transform: translateY(-2px);
        }

        /* Link columns */
        .footer-col-title {
          font-size: 0.75rem; font-weight: 900;
          color: white; letter-spacing: 2px;
          text-transform: uppercase; margin-bottom: 1.2rem;
        }
        .footer-links {
          display: flex; flex-direction: column; gap: 0.7rem;
        }
        .footer-link {
          font-size: 0.88rem; font-weight: 600;
          color: #666; text-decoration: none;
          transition: color 0.2s; cursor: pointer;
        }
        .footer-link:hover { color: #E8441A; }

        /* Contact items */
        .footer-contact-item {
          display: flex; align-items: flex-start;
          gap: 0.6rem; margin-bottom: 0.8rem;
        }
        .footer-contact-icon {
          font-size: 1rem; margin-top: 0.1rem; flex-shrink: 0;
        }
        .footer-contact-text {
          font-size: 0.85rem; color: #666;
          font-weight: 600; line-height: 1.5;
        }
        .footer-contact-text a {
          color: #F7AC42; text-decoration: none; font-weight: 700;
        }
        .footer-contact-text a:hover { text-decoration: underline; }

        /* ── DIVIDER ── */
        .footer-divider {
          border: none;
          border-top: 1px solid #2a2a2a;
          margin-bottom: 2rem;
        }

        /* ── BOTTOM ── */
        .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .footer-copy {
          font-size: 0.82rem; color: #555; font-weight: 600;
        }
        .footer-copy span { color: #E8441A; }
        .footer-bottom-links {
          display: flex; gap: 1.5rem;
        }
        .footer-bottom-link {
          font-size: 0.82rem; color: #555;
          font-weight: 600; cursor: pointer;
          transition: color 0.2s; text-decoration: none;
        }
        .footer-bottom-link:hover { color: #E8441A; }

        /* ── MPESA BADGE ── */
        .footer-mpesa {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: rgba(232,68,26,0.1);
          border: 1px solid rgba(232,68,26,0.2);
          color: #E8441A; padding: 0.4rem 1rem;
          border-radius: 50px; font-size: 0.78rem;
          font-weight: 800; margin-top: 1rem;
        }

        @media (max-width: 900px) {
          .footer { padding: 3rem 1.5rem 2rem; }
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 2rem; }
        }
        @media (max-width: 560px) {
          .footer-grid { grid-template-columns: 1fr; }
          .footer-bottom { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <footer className="footer">

        {/* ── TOP GRID ── */}
        <div className="footer-grid">

          {/* Brand */}
          <div>
            <Link to="/" className="footer-brand-logo">
              <div className="footer-logo-box">🔥</div>
              <span className="footer-logo-text">Chacha Street Eats</span>
            </Link>
            <p className="footer-brand-desc">
              Authentic Kenyan street food made fresh daily in
              Mwihoko, Kahawa Sukari. Delivered hot to your
              door in 30 minutes flat. 🇰🇪
            </p>
            <div className="footer-socials">
              <a className="social-btn" href="https://wa.me/254792489491" target="_blank" rel="noreferrer">📱</a>
              <a className="social-btn" href="#" >📘</a>
              <a className="social-btn" href="#" >📸</a>
              <a className="social-btn" href="#" >🐦</a>
            </div>
            <div className="footer-mpesa">
              📱 We Accept M-Pesa
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div className="footer-col-title">Quick Links</div>
            <div className="footer-links">
              <Link to="/"        className="footer-link">🏠 Home</Link>
              <Link to="/menu"    className="footer-link">🍽️ Our Menu</Link>
              <Link to="/about"   className="footer-link">👨‍🍳 About Us</Link>
              <Link to="/contact" className="footer-link">📞 Contact</Link>
              <Link to="/cart"    className="footer-link">🛒 Cart</Link>
            </div>
          </div>

          {/* Menu Categories */}
          <div>
            <div className="footer-col-title">Our Food</div>
            <div className="footer-links">
              <Link to="/menu" className="footer-link">🥩 Grills</Link>
              <Link to="/menu" className="footer-link">🌭 Street Bites</Link>
              <Link to="/menu" className="footer-link">🍚 Mains</Link>
              <Link to="/menu" className="footer-link">🍩 Sweet Treats</Link>
              <Link to="/menu" className="footer-link">🍹 Drinks</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <div className="footer-col-title">Contact Us</div>
            <div className="footer-contact-item">
              <span className="footer-contact-icon">📞</span>
              <div className="footer-contact-text">
                <a href="tel:0792489491">0792 489 491</a><br/>
                <a href="https://wa.me/254792489491" target="_blank" rel="noreferrer">WhatsApp Us</a>
              </div>
            </div>
            <div className="footer-contact-item">
              <span className="footer-contact-icon">📍</span>
              <div className="footer-contact-text">
                Mwihoko, Kahawa Sukari<br/>Nairobi, Kenya
              </div>
            </div>
            <div className="footer-contact-item">
              <span className="footer-contact-icon">🕐</span>
              <div className="footer-contact-text">
                Daily: 7:00 AM – 10:00 PM
              </div>
            </div>
            <div className="footer-contact-item">
              <span className="footer-contact-icon">🛵</span>
              <div className="footer-contact-text">
                Delivery: 30 mins or less
              </div>
            </div>
          </div>

        </div>

        <hr className="footer-divider" />

        {/* ── BOTTOM ── */}
        <div className="footer-bottom">
          <div className="footer-copy">
            © 2026 <span>Chacha Street Eats</span>. Made with ❤️ in Mwihoko, Nairobi.
          </div>
          <div className="footer-bottom-links">
            <span className="footer-bottom-link">Privacy Policy</span>
            <span className="footer-bottom-link">Terms & Conditions</span>
            <span className="footer-bottom-link">Refund Policy</span>
          </div>
        </div>

      </footer>
    </>
  )
}

export default Footer