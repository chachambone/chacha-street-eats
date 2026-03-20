import { useState } from 'react'

const Contact = () => {
  const [form,    setForm]    = useState({ name:'', email:'', phone:'', message:'' })
  const [sent,    setSent]    = useState(false)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    // 🔌 Wire to backend later
    setSent(true)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&family=Playfair+Display:wght@700&display=swap');

        .contact-page {
          background: #FFF8F0;
          min-height: 100vh;
          font-family: 'Nunito', sans-serif;
        }

        /* ── HERO ── */
        .contact-hero {
          background: linear-gradient(145deg, #f7651a 0%, #E8441A 100%);
          padding: 5rem 3rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .contact-hero::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(circle at 70% 50%, rgba(255,255,255,0.1) 0%, transparent 60%);
        }
        .contact-hero-emoji {
          font-size: 4rem; margin-bottom: 1rem;
          position: relative; z-index: 1;
        }
        .contact-hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 5vw, 3.5rem);
          color: white; font-weight: 700;
          margin-bottom: 1rem;
          position: relative; z-index: 1;
        }
        .contact-hero-sub {
          font-size: 1rem; color: rgba(255,255,255,0.85);
          max-width: 460px; margin: 0 auto;
          line-height: 1.7; font-weight: 600;
          position: relative; z-index: 1;
        }

        /* ── MAIN LAYOUT ── */
        .contact-main {
          padding: 4rem 3rem;
          max-width: 1000px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: start;
        }

        /* ── INFO CARDS ── */
        .contact-info-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.6rem; font-weight: 700;
          color: #1C1C1C; margin-bottom: 0.5rem;
        }
        .contact-info-sub {
          color: #999; font-size: 0.9rem;
          font-weight: 600; margin-bottom: 2rem; line-height: 1.6;
        }
        .info-card {
          background: white; border-radius: 18px;
          padding: 1.3rem 1.5rem;
          display: flex; align-items: center; gap: 1rem;
          margin-bottom: 1rem;
          box-shadow: 0 4px 24px rgba(0,0,0,0.07);
          border: 1.5px solid #f5ece0;
          transition: all 0.2s;
        }
        .info-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }
        .info-icon {
          width: 46px; height: 46px;
          background: rgba(232,68,26,0.1);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.3rem; flex-shrink: 0;
        }
        .info-label {
          font-size: 0.72rem; font-weight: 900; color: #E8441A;
          text-transform: uppercase; letter-spacing: 1px;
          margin-bottom: 0.2rem;
        }
        .info-value {
          font-weight: 800; font-size: 0.95rem; color: #1C1C1C;
        }
        .info-value a {
          color: #1C1C1C; text-decoration: none;
        }
        .info-value a:hover { color: #E8441A; }

        /* ── FORM ── */
        .contact-form-wrap {
          background: white; border-radius: 24px;
          padding: 2rem;
          box-shadow: 0 4px 24px rgba(0,0,0,0.07);
          border: 1.5px solid #f5ece0;
        }
        .form-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem; font-weight: 700;
          color: #1C1C1C; margin-bottom: 1.5rem;
        }
        .field-label {
          display: block; font-size: 0.75rem; font-weight: 900;
          color: #1C1C1C; margin-bottom: 0.3rem;
          letter-spacing: 0.5px; text-transform: uppercase;
        }
        .field-input {
          width: 100%; padding: 0.8rem 1rem;
          border: 1.5px solid #e8dfd4; border-radius: 12px;
          background: #FFF8F0; color: #1C1C1C;
          font-family: 'Nunito', sans-serif;
          font-size: 0.93rem; font-weight: 700;
          transition: border-color 0.2s; outline: none;
          margin-bottom: 1rem;
        }
        .field-input:focus { border-color: #E8441A; background: white; }
        .field-input::placeholder { color: #bbb; font-weight: 500; }
        textarea.field-input {
          resize: vertical; min-height: 120px;
        }
        .submit-btn {
          width: 100%; padding: 0.9rem; border-radius: 12px; border: none;
          background: #E8441A; color: white;
          font-family: 'Nunito', sans-serif;
          font-size: 0.95rem; font-weight: 800;
          cursor: pointer; transition: all 0.2s;
          box-shadow: 0 4px 16px rgba(232,68,26,0.28);
        }
        .submit-btn:hover { background: #c93510; }

        /* ── SUCCESS ── */
        .sent-wrap {
          text-align: center; padding: 2rem;
        }
        .sent-emoji { font-size: 3.5rem; margin-bottom: 1rem; }
        .sent-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem; color: #2D9E5F;
          font-weight: 700; margin-bottom: 0.5rem;
        }
        .sent-sub { color: #999; font-size: 0.9rem; font-weight: 600; }

        @media (max-width: 768px) {
          .contact-hero { padding: 3rem 1.5rem; }
          .contact-main {
            grid-template-columns: 1fr;
            padding: 2.5rem 1.5rem;
            gap: 2rem;
          }
        }
      `}</style>

      <div className="contact-page">

        {/* ── HERO ── */}
        <div className="contact-hero">
          <div className="contact-hero-emoji">📞</div>
          <div className="contact-hero-title">Get in Touch</div>
          <div className="contact-hero-sub">
            Have a question, a special order or just want to say hi?
            We'd love to hear from you! 🔥
          </div>
        </div>

        {/* ── MAIN ── */}
        <div className="contact-main">

          {/* ── LEFT: Info ── */}
          <div>
            <div className="contact-info-title">Contact Chacha 🔥</div>
            <div className="contact-info-sub">
              We're based in Mwihoko, Kahawa Sukari and
              deliver all across Nairobi. Reach us anytime!
            </div>

            {[
              { icon:'📞', label:'Phone / WhatsApp', value: <a href="tel:0792489491">0792 489 491</a> },
              { icon:'📍', label:'Location',         value: 'Mwihoko, Kahawa Sukari, Nairobi' },
              { icon:'🕐', label:'Opening Hours',    value: 'Daily: 7:00 AM – 10:00 PM'       },
              { icon:'📱', label:'M-Pesa',           value: 'Pay via Till / Paybill on checkout' },
            ].map((info, i) => (
              <div key={i} className="info-card">
                <div className="info-icon">{info.icon}</div>
                <div>
                  <div className="info-label">{info.label}</div>
                  <div className="info-value">{info.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── RIGHT: Form ── */}
          <div className="contact-form-wrap">
            {sent ? (
              <div className="sent-wrap">
                <div className="sent-emoji">🎉</div>
                <div className="sent-title">Message Sent!</div>
                <div className="sent-sub">
                  Thanks for reaching out! We'll get back to you shortly. 🔥
                </div>
              </div>
            ) : (
              <>
                <div className="form-title">Send us a Message</div>
                <form onSubmit={handleSubmit}>
                  <label className="field-label">Your Name</label>
                  <input
                    className="field-input"
                    name="name"
                    placeholder="Wanjiku Kamau"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                  <label className="field-label">Email</label>
                  <input
                    className="field-input"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                  <label className="field-label">Phone</label>
                  <input
                    className="field-input"
                    name="phone"
                    placeholder="07XX XXX XXX"
                    value={form.phone}
                    onChange={handleChange}
                  />
                  <label className="field-label">Message</label>
                  <textarea
                    className="field-input"
                    name="message"
                    placeholder="Tell us what you need..."
                    value={form.message}
                    onChange={handleChange}
                    required
                  />
                  <button type="submit" className="submit-btn">
                    Send Message 🔥
                  </button>
                </form>
              </>
            )}
          </div>

        </div>
      </div>
    </>
  )
}

export default Contact