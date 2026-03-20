import { Link } from 'react-router-dom'

const AboutUs = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&family=Playfair+Display:wght@700&display=swap');

        .about-page {
          background: #FFF8F0;
          min-height: 100vh;
          font-family: 'Nunito', sans-serif;
        }

        /* ── HERO ── */
        .about-hero {
          background: linear-gradient(145deg, #f7651a 0%, #E8441A 100%);
          padding: 5rem 3rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .about-hero::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 60%);
        }
        .about-hero-emoji {
          font-size: 4rem;
          margin-bottom: 1rem;
          position: relative; z-index: 1;
        }
        .about-hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 5vw, 3.5rem);
          color: white; font-weight: 700;
          margin-bottom: 1rem;
          position: relative; z-index: 1;
        }
        .about-hero-sub {
          font-size: 1rem; color: rgba(255,255,255,0.85);
          max-width: 500px; margin: 0 auto;
          line-height: 1.7; font-weight: 600;
          position: relative; z-index: 1;
        }

        /* ── STORY ── */
        .about-section {
          padding: 4rem 3rem;
          max-width: 900px;
          margin: 0 auto;
        }
        .about-sec-label {
          font-size: 0.75rem; font-weight: 900; color: #E8441A;
          letter-spacing: 2px; text-transform: uppercase; margin-bottom: 0.4rem;
        }
        .about-sec-title {
          font-family: 'Playfair Display', serif;
          font-size: 2rem; font-weight: 700; color: #1C1C1C;
          margin-bottom: 1.2rem;
        }
        .about-text {
          font-size: 0.97rem; color: #666; line-height: 1.85;
          font-weight: 600; margin-bottom: 1.2rem;
        }

        /* ── VALUES ── */
        .values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 1.2rem;
          margin-top: 1rem;
        }
        .value-card {
          background: white; border-radius: 20px;
          padding: 1.8rem;
          box-shadow: 0 4px 24px rgba(0,0,0,0.07);
          border: 1.5px solid #f5ece0;
          transition: all 0.25s;
        }
        .value-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 48px rgba(0,0,0,0.11);
        }
        .value-icon {
          font-size: 2rem; margin-bottom: 0.8rem;
        }
        .value-title {
          font-weight: 800; font-size: 1rem;
          color: #1C1C1C; margin-bottom: 0.4rem;
        }
        .value-desc {
          font-size: 0.83rem; color: #999;
          line-height: 1.6; font-weight: 600;
        }

        /* ── TEAM ── */
        .about-white {
          background: white;
          padding: 4rem 3rem;
        }
        .about-white-inner {
          max-width: 900px; margin: 0 auto;
        }
        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1.2rem;
          margin-top: 1.5rem;
        }
        .team-card {
          background: #FFF8F0; border-radius: 20px;
          padding: 2rem 1.5rem; text-align: center;
          border: 1.5px solid #f5ece0;
        }
        .team-emoji { font-size: 3rem; margin-bottom: 0.8rem; }
        .team-name { font-weight: 800; font-size: 1rem; color: #1C1C1C; margin-bottom: 0.2rem; }
        .team-role { font-size: 0.82rem; color: #E8441A; font-weight: 700; }

        /* ── CTA ── */
        .about-cta {
          text-align: center;
          padding: 4rem 3rem;
        }
        .about-cta-title {
          font-family: 'Playfair Display', serif;
          font-size: 2rem; font-weight: 700;
          color: #1C1C1C; margin-bottom: 0.7rem;
        }
        .about-cta-sub {
          color: #999; font-size: 0.93rem;
          font-weight: 600; margin-bottom: 2rem;
        }
        .btn-red {
          background: #E8441A; color: white; border: none;
          padding: 0.9rem 2.2rem; border-radius: 50px;
          font-family: 'Nunito', sans-serif; font-size: 0.95rem; font-weight: 800;
          cursor: pointer; transition: all 0.2s;
          box-shadow: 0 6px 20px rgba(232,68,26,0.35);
          text-decoration: none; display: inline-flex;
          align-items: center; gap: 0.5rem;
        }
        .btn-red:hover { background: #c93510; transform: translateY(-2px); }

        @media (max-width: 768px) {
          .about-hero  { padding: 3rem 1.5rem; }
          .about-section { padding: 3rem 1.5rem; }
          .about-white { padding: 3rem 1.5rem; }
          .about-cta   { padding: 3rem 1.5rem; }
        }
      `}</style>

      <div className="about-page">

        {/* ── HERO ── */}
        <div className="about-hero">
          <div className="about-hero-emoji">🔥</div>
          <div className="about-hero-title">Our Story</div>
          <div className="about-hero-sub">
            Born in the streets of Mwihoko, Kahawa Sukari —
            Chacha Street Eats is pure Nairobi on a plate.
          </div>
        </div>

        {/* ── STORY ── */}
        <div className="about-section">
          <div className="about-sec-label">🇰🇪 Who We Are</div>
          <div className="about-sec-title">Made with Love in Mwihoko</div>
          <p className="about-text">
            Chacha Street Eats started as a passion project — bringing the authentic
            taste of Kenyan street food to your doorstep. From the smoky nyama choma
            grills to the crispy samosas fresh out of the fryer, every dish we make
            tells a story of culture, community and flavor.
          </p>
          <p className="about-text">
            We believe great food shouldn't be complicated. Our recipes are passed
            down through generations, made with the freshest local ingredients sourced
            daily from Kahawa Sukari and surrounding markets. No shortcuts, no
            compromises — just real Kenyan food made with real love. 🤍
          </p>

          <div className="values-grid">
            {[
              { icon:'🥩', title:'Always Fresh',      desc:'Ingredients sourced daily from local Nairobi markets. Nothing frozen, nothing artificial.' },
              { icon:'🔥', title:'Cooked with Passion', desc:'Every dish is made to order with the same love we put into cooking for family.' },
              { icon:'🛵', title:'Fast Delivery',      desc:'Hot food at your door in 30 minutes or less. We never keep you waiting.' },
              { icon:'🇰🇪', title:'100% Kenyan',       desc:'Authentic recipes, local ingredients, and a true taste of Nairobi street culture.' },
            ].map((v, i) => (
              <div key={i} className="value-card">
                <div className="value-icon">{v.icon}</div>
                <div className="value-title">{v.title}</div>
                <div className="value-desc">{v.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── TEAM ── */}
        <div className="about-white">
          <div className="about-white-inner">
            <div className="about-sec-label">👨‍🍳 The Team</div>
            <div className="about-sec-title">The People Behind the Food</div>
            <div className="team-grid">
              {[
                { emoji:'👨‍🍳', name:'Chef Chacha',   role:'Founder & Head Chef'   },
                { emoji:'👩‍💼', name:'Mama Wanjiku',  role:'Operations Manager'     },
                { emoji:'🛵',   name:'Delivery Crew', role:'Speed & Smiles'          },
                { emoji:'🔥',   name:'Kitchen Team',  role:'The Magic Makers'        },
              ].map((t, i) => (
                <div key={i} className="team-card">
                  <div className="team-emoji">{t.emoji}</div>
                  <div className="team-name">{t.name}</div>
                  <div className="team-role">{t.role}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="about-cta">
          <div className="about-cta-title">Ready to Order? 🍲</div>
          <div className="about-cta-sub">
            Come taste the love we put into every dish.
          </div>
          <Link to="/menu" className="btn-red">Browse Our Menu 🔥</Link>
        </div>

      </div>
    </>
  )
}

export default AboutUs