import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Register = () => {
  const [form,    setForm]    = useState({ name:'', email:'', phone:'', password:'' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) {
      return setError('Please fill in all required fields.')
    }
    setLoading(true)
    setError('')
    try {
      await register(form.name, form.email, form.phone, form.password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&family=Playfair+Display:wght@700&display=swap');

        .auth-page {
          min-height: calc(100vh - 70px);
          display: flex; align-items: center; justify-content: center;
          padding: 2rem; background: #FFF8F0;
          font-family: 'Nunito', sans-serif;
        }
        .auth-wrap {
          display: grid; grid-template-columns: 1fr 1fr;
          max-width: 860px; width: 100%;
          background: white; border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.1);
        }
        .auth-left {
          background: linear-gradient(145deg, #f7651a 0%, #E8441A 100%);
          padding: 3rem;
          display: flex; flex-direction: column;
          justify-content: center; align-items: center;
          text-align: center;
        }
        .auth-left-emoji { font-size: 4rem; margin-bottom: 1rem; }
        .auth-left-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.75rem; color: white;
          font-weight: 700; margin-bottom: 0.7rem;
        }
        .auth-left-sub {
          font-size: 0.9rem; color: rgba(255,255,255,0.8);
          line-height: 1.65; font-weight: 600;
        }
        .auth-right { padding: 2.5rem; }
        .auth-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.6rem; font-weight: 700;
          color: #1C1C1C; margin-bottom: 0.35rem;
        }
        .auth-sub {
          color: #999; font-size: 0.88rem;
          margin-bottom: 1.8rem; font-weight: 600;
        }
        .auth-link {
          color: #E8441A; cursor: pointer;
          font-weight: 900; text-decoration: none;
        }
        .auth-link:hover { text-decoration: underline; }
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
        .err-msg {
          background: #fff5f5; border: 1px solid #fecaca;
          color: #e53e3e; padding: 0.7rem 1rem;
          border-radius: 10px; font-size: 0.83rem;
          font-weight: 800; margin-bottom: 1rem;
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
        .submit-btn:disabled { background: #f0a898; cursor: not-allowed; }
        .auth-footer {
          text-align: center; margin-top: 1.2rem;
          font-size: 0.88rem; color: #999; font-weight: 700;
        }

        @media (max-width: 700px) {
          .auth-wrap  { grid-template-columns: 1fr; }
          .auth-left  { display: none; }
          .auth-right { padding: 2rem 1.5rem; }
        }
      `}</style>

      <div className="auth-page">
        <div className="auth-wrap">

          {/* ── LEFT PANEL ── */}
          <div className="auth-left">
            <div className="auth-left-emoji">🇰🇪</div>
            <div className="auth-left-title">Join Chacha!</div>
            <div className="auth-left-sub">
              Create an account to enjoy
              exclusive deals, fast reordering
              and Chacha loyalty points.
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div className="auth-right">
            <div className="auth-title">Create Account</div>
            <div className="auth-sub">
              Already have one?{' '}
              <Link to="/login" className="auth-link">Login here →</Link>
            </div>

            {error && <div className="err-msg">⚠️ {error}</div>}

            <form onSubmit={handleSubmit}>
              <label className="field-label">Full Name *</label>
              <input
                className="field-input"
                name="name"
                placeholder="Wanjiku Kamau"
                value={form.name}
                onChange={handleChange}
              />
              <label className="field-label">Email *</label>
              <input
                className="field-input"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
              />
              <label className="field-label">Phone</label>
              <input
                className="field-input"
                name="phone"
                placeholder="07XX XXX XXX"
                value={form.phone}
                onChange={handleChange}
              />
              <label className="field-label">Password *</label>
              <input
                className="field-input"
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
              />
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account →'}
              </button>
            </form>

            <div className="auth-footer">
              By signing up you agree to our{' '}
              <span className="auth-link">Terms & Conditions</span>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default Register