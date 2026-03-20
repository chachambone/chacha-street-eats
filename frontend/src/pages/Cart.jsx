import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const Cart = () => {
  const { cart, removeFromCart, updateQty, total } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleCheckout = () => {
    if (!user) {
      navigate('/login')
    } else {
      navigate('/checkout')
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&family=Playfair+Display:wght@700&display=swap');

        .cart-page {
          padding: 3rem;
          background: #FFF8F0;
          min-height: 100vh;
          font-family: 'Nunito', sans-serif;
        }
        .cart-sec-label {
          font-size: 0.75rem; font-weight: 900; color: #E8441A;
          letter-spacing: 2px; text-transform: uppercase; margin-bottom: 0.4rem;
        }
        .cart-sec-title {
          font-family: 'Playfair Display', serif;
          font-size: 2rem; font-weight: 700; color: #1C1C1C;
          margin-bottom: 2rem;
        }
        .cart-layout {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 2rem;
          align-items: start;
        }
        .cart-item {
          background: white; border-radius: 18px;
          padding: 1.2rem 1.5rem;
          display: flex; align-items: center; gap: 1.2rem;
          margin-bottom: 1rem;
          box-shadow: 0 4px 24px rgba(0,0,0,0.07);
          border: 1.5px solid #f5ece0;
          transition: all 0.2s;
        }
        .cart-item:hover { box-shadow: 0 12px 48px rgba(0,0,0,0.11); }
        .cart-emoji { font-size: 2.5rem; min-width: 50px; text-align: center; }
        .cart-info  { flex: 1; }
        .cart-name  { font-weight: 800; font-size: 1rem; color: #1C1C1C; margin-bottom: 0.15rem; }
        .cart-unit  { font-size: 0.82rem; color: #999; font-weight: 600; }
        .qty-row    { display: flex; align-items: center; gap: 0.6rem; }
        .qty-btn {
          width: 30px; height: 30px; border-radius: 50%;
          border: 1.5px solid #e8dfd4; background: white;
          cursor: pointer; font-size: 1rem;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s; color: #1C1C1C; font-family: 'Nunito', sans-serif;
        }
        .qty-btn:hover { background: #E8441A; border-color: #E8441A; color: white; }
        .qty-num   { font-weight: 800; min-width: 20px; text-align: center; font-size: 0.95rem; }
        .cart-total { font-weight: 900; font-size: 1rem; color: #E8441A; min-width: 80px; text-align: right; }
        .remove-btn {
          background: none; border: none; color: #ccc;
          cursor: pointer; font-size: 1.1rem; padding: 0.3rem;
          transition: color 0.2s;
        }
        .remove-btn:hover { color: #E8441A; }
        .summary-card {
          background: white; border-radius: 20px;
          padding: 1.8rem;
          box-shadow: 0 4px 24px rgba(0,0,0,0.07);
          border: 1.5px solid #f5ece0;
          position: sticky; top: 90px;
        }
        .summary-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.3rem; font-weight: 700; color: #1C1C1C;
          margin-bottom: 1.5rem;
        }
        .summary-row {
          display: flex; justify-content: space-between;
          margin-bottom: 0.8rem; color: #999;
          font-size: 0.9rem; font-weight: 700;
        }
        .summary-divider {
          border: none; border-top: 2px dashed #f0e8e0; margin: 1rem 0;
        }
        .summary-total {
          display: flex; justify-content: space-between;
          font-size: 1.15rem; font-weight: 900; color: #1C1C1C;
        }
        .summary-total span:last-child { color: #E8441A; }
        .checkout-btn {
          width: 100%; margin-top: 1.3rem; padding: 1rem;
          border-radius: 14px; border: none;
          background: #E8441A; color: white;
          font-family: 'Nunito', sans-serif;
          font-size: 1rem; font-weight: 800;
          cursor: pointer; transition: all 0.2s;
          box-shadow: 0 6px 20px rgba(232,68,26,0.3);
        }
        .checkout-btn:hover { background: #c93510; transform: translateY(-2px); }
        .continue-link {
          display: block; text-align: center; margin-top: 1rem;
          color: #999; font-size: 0.85rem; font-weight: 700;
          text-decoration: none;
        }
        .continue-link:hover { color: #E8441A; }
        .mpesa-note {
          display: flex; align-items: center; gap: 0.5rem;
          background: rgba(232,68,26,0.05);
          border: 1px solid rgba(232,68,26,0.15);
          border-radius: 10px; padding: 0.7rem 1rem;
          margin-top: 1rem;
          font-size: 0.8rem; font-weight: 700; color: #999;
        }
        .cart-empty { text-align: center; padding: 5rem 2rem; }
        .cart-empty-emoji { font-size: 5rem; margin-bottom: 1rem; }
        .cart-empty-title {
          font-family: 'Playfair Display', serif;
          font-size: 2rem; color: #ccc; margin-bottom: 0.5rem;
        }
        .cart-empty-sub { color: #999; margin-bottom: 2rem; font-size: 0.93rem; font-weight: 600; }
        .btn-red {
          background: #E8441A; color: white; border: none;
          padding: 0.85rem 2rem; border-radius: 50px;
          font-family: 'Nunito', sans-serif; font-size: 0.95rem; font-weight: 800;
          cursor: pointer; transition: all 0.2s;
          box-shadow: 0 6px 20px rgba(232,68,26,0.35);
          text-decoration: none; display: inline-flex;
          align-items: center; gap: 0.5rem;
        }
        .btn-red:hover { background: #c93510; transform: translateY(-2px); }

        @media (max-width: 900px) {
          .cart-page { padding: 2rem 1.5rem; }
          .cart-layout { grid-template-columns: 1fr; }
          .summary-card { position: static; }
        }
      `}</style>

      <div className="cart-page">
        <div className="cart-sec-label">🛒 Your Order</div>
        <div className="cart-sec-title">Your Cart</div>

        {cart.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-emoji">🛒</div>
            <div className="cart-empty-title">Your cart is empty</div>
            <p className="cart-empty-sub">Looks like you haven't added anything yet!</p>
            <Link to="/menu" className="btn-red">Browse Menu 🔥</Link>
          </div>
        ) : (
          <div className="cart-layout">

            {/* ── LEFT: Cart Items ── */}
            <div>
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <span className="cart-emoji">{item.emoji}</span>
                  <div className="cart-info">
                    <div className="cart-name">{item.name}</div>
                    <div className="cart-unit">KSh {item.price} each</div>
                  </div>
                  <div className="qty-row">
                    <button
                      className="qty-btn"
                      onClick={() => updateQty(item.id, -1)}
                    >−</button>
                    <span className="qty-num">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => updateQty(item.id, +1)}
                    >+</button>
                  </div>
                  <div className="cart-total">KSh {item.price * item.quantity}</div>
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                  >✕</button>
                </div>
              ))}
            </div>

            {/* ── RIGHT: Order Summary ── */}
            <div className="summary-card">
              <div className="summary-title">Order Summary</div>

              {cart.map(item => (
                <div key={item.id} className="summary-row">
                  <span>{item.name} x{item.quantity}</span>
                  <span>KSh {item.price * item.quantity}</span>
                </div>
              ))}

              <hr className="summary-divider" />

              <div className="summary-row">
                <span>Delivery</span>
                <span style={{ color: '#2D9E5F', fontWeight: 800 }}>FREE 🎉</span>
              </div>

              <div className="summary-total">
                <span>Total</span>
                <span>KSh {total}</span>
              </div>

              <button className="checkout-btn">
                Proceed to Checkout →
              </button>

              <Link to="/menu" className="continue-link">
                ← Continue Shopping
              </Link>

              <div className="mpesa-note">
                📱 We accept M-Pesa · Cash · Card
              </div>
            </div>

          </div>
        )}
      </div>
    </>
  )
}

export default Cart