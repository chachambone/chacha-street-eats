import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/chacha-logo.png'

const Navbar = () => {
  const location         = useLocation()
  const { count }        = useCart()
  const { user, logout } = useAuth()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&family=Playfair+Display:wght@700&display=swap');

        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(255, 248, 240, 0.97);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(232, 68, 26, 0.08);
          height: 70px;
          padding: 0 3rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: 'Nunito', sans-serif;
        }
        .nav-logo {
          display: flex;
          align-items: center;
          text-decoration: none;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 2.5rem;
        }
        .nav-link {
          font-size: 0.92rem;
          font-weight: 700;
          color: #999;
          cursor: pointer;
          padding-bottom: 3px;
          border-bottom: 2px solid transparent;
          transition: color 0.2s, border-color 0.2s;
          text-decoration: none;
        }
        .nav-link:hover { color: #1C1C1C; }
        .nav-link.active {
          color: #E8441A;
          border-bottom-color: #E8441A;
        }
        .nav-right {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }
        .btn-login {
          background: transparent;
          border: 1.5px solid #ddd;
          color: #1C1C1C;
          padding: 0.5rem 1.3rem;
          border-radius: 50px;
          cursor: pointer;
          font-family: 'Nunito', sans-serif;
          font-size: 0.88rem;
          font-weight: 700;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
        }
        .btn-login:hover { border-color: #E8441A; color: #E8441A; }
        .btn-register {
          background: transparent;
          border: 1.5px solid #E8441A;
          color: #E8441A;
          padding: 0.5rem 1.3rem;
          border-radius: 50px;
          font-family: 'Nunito', sans-serif;
          font-size: 0.88rem;
          font-weight: 700;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
        }
        .btn-register:hover { background: #E8441A; color: white; }
        .btn-orders {
          background: transparent;
          border: 1.5px solid #ddd;
          color: #1C1C1C;
          padding: 0.5rem 1.3rem;
          border-radius: 50px;
          cursor: pointer;
          font-family: 'Nunito', sans-serif;
          font-size: 0.88rem;
          font-weight: 700;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
        }
        .btn-orders:hover { border-color: #E8441A; color: #E8441A; }
        .btn-admin {
          background: rgba(232,68,26,0.1);
          border: 1.5px solid rgba(232,68,26,0.3);
          color: #E8441A;
          padding: 0.5rem 1.3rem;
          border-radius: 50px;
          cursor: pointer;
          font-family: 'Nunito', sans-serif;
          font-size: 0.88rem;
          font-weight: 800;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
        }
        .btn-admin:hover { background: #E8441A; color: white; }
        .btn-cart {
          position: relative;
          background: #E8441A;
          color: white;
          border: none;
          padding: 0.55rem 1.4rem;
          border-radius: 50px;
          cursor: pointer;
          font-family: 'Nunito', sans-serif;
          font-size: 0.88rem;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          transition: all 0.2s;
          box-shadow: 0 4px 14px rgba(232, 68, 26, 0.3);
          text-decoration: none;
        }
        .btn-cart:hover { background: #c93510; transform: translateY(-1px); }
        .cart-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #1C1C1C;
          color: white;
          font-size: 0.62rem;
          font-weight: 900;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .btn-logout {
          background: transparent;
          border: 1.5px solid #ddd;
          color: #999;
          padding: 0.5rem 1.3rem;
          border-radius: 50px;
          cursor: pointer;
          font-family: 'Nunito', sans-serif;
          font-size: 0.88rem;
          font-weight: 700;
          transition: all 0.2s;
        }
        .btn-logout:hover { border-color: #E8441A; color: #E8441A; }
        .nav-greeting {
          font-size: 0.85rem; font-weight: 700; color: #999;
          white-space: nowrap;
        }

        @media (max-width: 768px) {
          .navbar { padding: 0 1.5rem; }
          .nav-links { display: none; }
          .nav-greeting { display: none; }
        }
        @media (max-width: 480px) {
          .btn-orders { display: none; }
        }
      `}</style>

      <nav className="navbar">

        {/* ── Logo ── */}
        <Link to="/" className="nav-logo">
          <img
            src={logo}
            alt="Chacha Street Eats"
            style={{ height: '55px', objectFit: 'contain' }}
          />
        </Link>

        {/* ── Middle Links ── */}
        <div className="nav-links">
          <Link to="/"        className={`nav-link ${location.pathname === '/'        ? 'active' : ''}`}>Home</Link>
          <Link to="/menu"    className={`nav-link ${location.pathname === '/menu'    ? 'active' : ''}`}>Our Menu</Link>
          <Link to="/about"   className={`nav-link ${location.pathname === '/about'   ? 'active' : ''}`}>About Us</Link>
          <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>Contact</Link>
        </div>

        {/* ── Right Side ── */}
        <div className="nav-right">
          {user ? (
            <>
              <span className="nav-greeting">Hey {user.username}! 👋</span>
              <Link to="/orders" className={`btn-orders ${location.pathname === '/orders' ? 'active' : ''}`}>
                📦 My Orders
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="btn-admin">
                  ⚙️ Admin
                </Link>
              )}
              <button className="btn-logout" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login"    className="btn-login">Login</Link>
              <Link to="/register" className="btn-register">Register</Link>
            </>
          )}
          <Link to="/cart" className="btn-cart">
            🛒 Cart
            {count > 0 && <span className="cart-badge">{count}</span>}
          </Link>
        </div>

      </nav>
    </>
  )
}

export default Navbar