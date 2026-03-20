const FEATURES = [
  { icon: '⭐', title: 'Quality Food',   desc: 'Only the freshest ingredients sourced daily from Nairobi markets.' },
  { icon: '🛵', title: 'Fast Delivery',  desc: 'Hot food at your door in 30 minutes or less, guaranteed.'         },
  { icon: '📱', title: 'Pay via M-Pesa', desc: 'Seamless mobile money checkout — truly Kenyan, truly easy.'        },
  { icon: '🧾', title: 'Easy Checkout',  desc: 'Order in 3 taps. No fuss, no queues, just great street food.'     },
]

const BESTSELLERS = [
  { id:1,  name:'Nyama Choma',    price:650,  emoji:'🥩', stars:5, badge:'🔥 Bestseller' },
  { id:2,  name:'Smokie Pasua',   price:80,   emoji:'🌭', stars:5, badge:'⚡ Quick Bite' },
  { id:3,  name:'Samosa (3 pcs)', price:120,  emoji:'🔺', stars:5, badge:'🌿 Veg'        },
  { id:4,  name:'Pilau Special',  price:280,  emoji:'🍚', stars:5, badge:'🏆 Chef Pick'  },
  { id:5,  name:'Mishkaki',       price:200,  emoji:'🍢', stars:5, badge:'🔥 Spicy'      },
  { id:6,  name:'Mandazi (4pcs)', price:60,   emoji:'🍩', stars:5, badge:'🍯 Sweet'      },
]

const Home = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');

        /* ── HERO ── */
        .hero {
          padding: 5rem 3rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: center;
          min-height: calc(100vh - 70px);
          position: relative;
          overflow: hidden;
          background: #FFF8F0;
        }
        .hero-glow {
          position: absolute;
          top: -80px; right: -80px;
          width: 480px; height: 480px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(247,172,66,0.2) 0%, transparent 70%);
          pointer-events: none;
        }
        .hero-left { position: relative; z-index: 1; }
        .hero-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(232,68,26,0.1);
          border: 1px solid rgba(232,68,26,0.2);
          color: #E8441A;
          padding: 0.35rem 1rem;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 900;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 1.5rem;
          font-family: 'Nunito', sans-serif;
        }
        .hero-h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.6rem, 4.5vw, 4rem);
          line-height: 1.1;
          color: #1C1C1C;
          margin-bottom: 1.2rem;
          font-weight: 700;
        }
        .hero-h1 .highlight {
          background: #E8441A;
          color: white;
          padding: 0.05em 0.22em;
          border-radius: 10px;
          font-style: italic;
          display: inline-block;
        }
        .hero-p {
          font-size: 0.97rem;
          color: #999;
          line-height: 1.75;
          max-width: 430px;
          margin-bottom: 2rem;
          font-weight: 600;
          font-family: 'Nunito', sans-serif;
        }
        .hero-btns { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 2.2rem; }
        .btn-red {
          background: #E8441A; color: white; border: none;
          padding: 0.85rem 2rem; border-radius: 50px;
          font-family: 'Nunito', sans-serif; font-size: 0.95rem; font-weight: 800;
          cursor: pointer; transition: all 0.2s;
          box-shadow: 0 6px 20px rgba(232,68,26,0.35);
          text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem;
        }
        .btn-red:hover { background: #c93510; transform: translateY(-2px); }
        .btn-dark {
          background: #1C1C1C; color: white; border: none;
          padding: 0.85rem 2rem; border-radius: 50px;
          font-family: 'Nunito', sans-serif; font-size: 0.95rem; font-weight: 700;
          cursor: pointer; transition: all 0.2s;
          text-decoration: none; display: inline-flex; align-items: center;
        }
        .btn-dark:hover { background: #333; }
        .hero-pills { display: flex; gap: 0.8rem; flex-wrap: wrap; }
        .pill {
          display: flex; align-items: center; gap: 0.4rem;
          background: white; border: 1px solid #ece4da;
          padding: 0.5rem 1rem; border-radius: 50px;
          font-size: 0.8rem; font-weight: 700; color: #1C1C1C;
          box-shadow: 0 4px 24px rgba(0,0,0,0.07);
          font-family: 'Nunito', sans-serif;
        }
        .hero-right {
          position: relative; display: flex;
          align-items: center; justify-content: center;
        }
        .img-wrap {
          width: 360px; height: 400px; border-radius: 36px;
          background: linear-gradient(145deg, #F7AC42 0%, #E8441A 100%);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 24px 64px rgba(232,68,26,0.22);
          position: relative;
        }
        .main-emoji { font-size: 9rem; filter: drop-shadow(0 8px 20px rgba(0,0,0,0.18)); }
        .float-card {
          position: absolute; background: white; border-radius: 16px;
          padding: 0.85rem 1.1rem; box-shadow: 0 8px 28px rgba(0,0,0,0.1);
          display: flex; align-items: center; gap: 0.65rem;
          animation: floatUp 3s ease-in-out infinite;
        }
        .float-card.top-left { top: 0.8rem;  left: -2.5rem; animation-delay: 0s;   }
        .float-card.bot-right { bottom: 4rem; right: -2.5rem; animation-delay: 1.5s; }
        @keyframes floatUp {
          0%, 100% { transform: translateY(0);    }
          50%       { transform: translateY(-8px); }
        }
        .fc-icon  { font-size: 1.4rem; }
        .fc-title { font-size: 0.73rem; font-weight: 800; color: #1C1C1C; font-family: 'Nunito', sans-serif; }
        .fc-sub   { font-size: 0.65rem; color: #999; font-weight: 600; font-family: 'Nunito', sans-serif; }
        .fc-stars { color: #F7AC42; font-size: 0.65rem; }

        /* ── FEATURES ── */
        .features {
          background: white; padding: 3rem;
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 2rem; border-top: 1px solid #f0e8df; border-bottom: 1px solid #f0e8df;
        }
        .feat { text-align: center; padding: 0.8rem; }
        .feat-ico {
          width: 54px; height: 54px; border-radius: 16px;
          background: rgba(232,68,26,0.08);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.4rem; margin: 0 auto 0.9rem;
        }
        .feat-title { font-weight: 800; font-size: 0.97rem; color: #1C1C1C; margin-bottom: 0.35rem; font-family: 'Nunito', sans-serif; }
        .feat-desc  { font-size: 0.8rem; color: #999; line-height: 1.55; font-weight: 600; font-family: 'Nunito', sans-serif; }
        .feat-more  { color: #E8441A; font-size: 0.8rem; font-weight: 800; cursor: pointer; display: inline-block; margin-top: 0.5rem; font-family: 'Nunito', sans-serif; }
        .feat-more:hover { text-decoration: underline; }

        /* ── BESTSELLERS ── */
        .sec { padding: 4rem 3rem; background: #FFF8F0; }
        .sec-label {
          font-size: 0.75rem; font-weight: 900; color: #E8441A;
          letter-spacing: 2px; text-transform: uppercase;
          margin-bottom: 0.4rem; font-family: 'Nunito', sans-serif;
        }
        .sec-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.9rem; font-weight: 700; color: #1C1C1C;
        }
        .sec-head {
          display: flex; align-items: flex-end;
          justify-content: space-between; margin-bottom: 2.2rem;
        }
        .see-all {
          background: none; border: none; color: #E8441A;
          font-family: 'Nunito', sans-serif; font-size: 0.87rem;
          font-weight: 800; cursor: pointer; text-decoration: none;
        }
        .see-all:hover { text-decoration: underline; }
        .bs-row {
          display: flex; gap: 1.2rem;
          overflow-x: auto; padding-bottom: 0.5rem;
        }
        .bs-row::-webkit-scrollbar { height: 4px; }
        .bs-row::-webkit-scrollbar-thumb { background: #f0e0d0; border-radius: 2px; }
        .bs-card {
          min-width: 200px; background: white; border-radius: 20px;
          overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.07);
          transition: all 0.25s; cursor: pointer; border: 1.5px solid transparent;
          flex-shrink: 0;
        }
        .bs-card:hover { transform: translateY(-4px); box-shadow: 0 12px 48px rgba(0,0,0,0.11); border-color: rgba(232,68,26,0.12); }
        .bs-ph {
          width: 100%; height: 130px;
          display: flex; align-items: center; justify-content: center;
          font-size: 3.5rem;
          background: linear-gradient(135deg, #FDEBD0, #FEF3E8);
        }
        .bs-body { padding: 0.9rem; }
        .bs-badge {
          display: inline-block; background: rgba(232,68,26,0.1); color: #E8441A;
          font-size: 0.65rem; font-weight: 900; padding: 0.18rem 0.6rem;
          border-radius: 50px; margin-bottom: 0.45rem; font-family: 'Nunito', sans-serif;
        }
        .bs-name  { font-weight: 800; font-size: 0.92rem; color: #1C1C1C; margin-bottom: 0.2rem; font-family: 'Nunito', sans-serif; }
        .bs-stars { color: #F7AC42; font-size: 0.72rem; margin-bottom: 0.55rem; }
        .bs-footer { display: flex; justify-content: space-between; align-items: center; }
        .bs-price  { font-weight: 900; font-size: 0.95rem; color: #1C1C1C; font-family: 'Nunito', sans-serif; }
        .bs-buy {
          background: #E8441A; color: white; border: none;
          padding: 0.3rem 0.85rem; border-radius: 50px;
          font-size: 0.73rem; font-weight: 800; cursor: pointer;
          font-family: 'Nunito', sans-serif; transition: all 0.2s;
        }
        .bs-buy:hover { background: #c93510; }
        .bs-buy.added { background: #2D9E5F; }

        /* ── FOOTER STRIP ── */
        .contact-strip {
          background: #1C1C1C;
          padding: 2rem 3rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          font-family: 'Nunito', sans-serif;
        }
        .contact-strip-logo {
          font-family: 'Playfair Display', serif;
          font-size: 1.2rem;
          font-weight: 700;
          color: white;
        }
        .contact-strip-info {
          display: flex;
          gap: 2rem;
          flex-wrap: wrap;
        }
        .contact-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #999;
          font-size: 0.88rem;
          font-weight: 700;
        }
        .contact-item a {
          color: #F7AC42;
          text-decoration: none;
          font-weight: 800;
        }
        .contact-item a:hover { text-decoration: underline; }

        @media (max-width: 900px) {
          .hero { grid-template-columns: 1fr; min-height: auto; padding: 3rem 1.5rem; }
          .hero-right { display: none; }
          .features { grid-template-columns: repeat(2, 1fr); padding: 2rem 1.5rem; }
          .sec { padding: 3rem 1.5rem; }
          .contact-strip { padding: 2rem 1.5rem; flex-direction: column; align-items: flex-start; }
        }
        @media (max-width: 480px) {
          .features { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-left">
          <div className="hero-tag">🇰🇪 Kahawa Sukari's Finest Street Food</div>
          <h1 className="hero-h1">
            Desire <span className="highlight">Food</span><br />
            for Your Taste
          </h1>
          <p className="hero-p">
            Authentic Kenyan street food made fresh daily in Mwihoko —
            delivered hot to your door in 30 minutes flat.
          </p>
          <div className="hero-btns">
            <a href="/menu" className="btn-red">Order Now 🍲</a>
            <a href="/menu" className="btn-dark">Our Menu</a>
          </div>
          <div className="hero-pills">
            <div className="pill">🛵 Delivery in 30 min</div>
            <div className="pill">⭐ 4.9 Rating</div>
            <div className="pill">📍 Mwihoko, Kahawa Sukari</div>
          </div>
        </div>

        <div className="hero-right">
          <div className="img-wrap">
            <span className="main-emoji">🥩</span>
          </div>
          <div className="float-card top-left">
            <span className="fc-icon">👨‍🍳</span>
            <div>
              <div className="fc-title">Chef Chacha</div>
              <div className="fc-stars">★★★★★</div>
              <div className="fc-sub">1.2k happy customers</div>
            </div>
          </div>
          <div className="float-card bot-right">
            <span className="fc-icon">📍</span>
            <div>
              <div className="fc-title">Mwihoko</div>
              <div className="fc-sub">Kahawa Sukari, Nairobi</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <div className="features">
        {FEATURES.map((f, i) => (
          <div key={i} className="feat">
            <div className="feat-ico">{f.icon}</div>
            <div className="feat-title">{f.title}</div>
            <div className="feat-desc">{f.desc}</div>
            <span className="feat-more">Learn More →</span>
          </div>
        ))}
      </div>

      {/* ── BESTSELLERS ── */}
      <section className="sec">
        <div className="sec-head">
          <div>
            <div className="sec-label">🔥 Hot Right Now</div>
            <div className="sec-title">Our Best Seller Dishes 🔥</div>
          </div>
          <a href="/menu" className="see-all">See Full Menu →</a>
        </div>
        <div className="bs-row">
          {BESTSELLERS.map(item => (
            <div key={item.id} className="bs-card">
              <div className="bs-ph">{item.emoji}</div>
              <div className="bs-body">
                <div className="bs-badge">{item.badge}</div>
                <div className="bs-name">{item.name}</div>
                <div className="bs-stars">{'★'.repeat(item.stars)}</div>
                <div className="bs-footer">
                  <span className="bs-price">KSh {item.price}</span>
                  <button className="bs-buy">Order</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CONTACT STRIP ── */}
      <div className="contact-strip">
        <div className="contact-strip-logo">🔥 Chacha Street Eats</div>
        <div className="contact-strip-info">
          <div className="contact-item">
            📞 <a href="tel:0792489491">0792 489 491</a>
          </div>
          <div className="contact-item">
            📍 Mwihoko, Kahawa Sukari, Nairobi
          </div>
          <div className="contact-item">
            🕐 Open Daily: 7AM – 10PM
          </div>
        </div>
      </div>
    </>
  )
}

export default Home