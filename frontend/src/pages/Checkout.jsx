import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import api from '../api'

const STEPS = ['Delivery', 'Payment', 'Confirm']

const Checkout = () => {
  const { cart, total, clearCart } = useCart()
  const { user } = useAuth()
  const navigate  = useNavigate()

  const [step,    setStep]    = useState(0)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [orderID, setOrderID] = useState(null)

  const [delivery, setDelivery] = useState({
    address: '',
    phone:   user?.phone || '',
    notes:   '',
  })

  const [payment, setPayment] = useState('mpesa')
  const [mpesaPhone, setMpesaPhone] = useState(user?.phone || '')

  const handleDeliveryChange = e =>
    setDelivery({ ...delivery, [e.target.name]: e.target.value })

  // ── STEP 1: Delivery ──
  const submitDelivery = (e) => {
    e.preventDefault()
    if (!delivery.address || !delivery.phone) {
      return setError('Please fill in your address and phone.')
    }
    setError('')
    setStep(1)
  }

  // ── STEP 2: Payment ──
  const submitPayment = (e) => {
    e.preventDefault()
    if (payment === 'mpesa' && !mpesaPhone) {
      return setError('Please enter your M-Pesa phone number.')
    }
    setError('')
    setStep(2)
  }

  // ── STEP 3: Place Order ──
  const placeOrder = async () => {
    setLoading(true)
    setError('')
    try {
      const orderData = {
        items: cart.map(i => ({
          menu_item_id: i.id,
          quantity:     i.quantity,
          price:        i.price,
        })),
        total_price:   total,
        shipping_info: {
          address:     delivery.address,
          phone:       delivery.phone,
          notes:       delivery.notes,
          payment:     payment,
          mpesa_phone: payment === 'mpesa' ? mpesaPhone : null,
        },
      }
      const res = await api.post('/api/orders/', orderData)
      setOrderID(res.data.id)
      clearCart()
      setStep(3)
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Redirect if cart empty and no order
  if (cart.length === 0 && step !== 3) {
    return (
      <div style={{ textAlign:'center', padding:'5rem 2rem', fontFamily:'Nunito,sans-serif' }}>
        <div style={{ fontSize:'4rem', marginBottom:'1rem' }}>🛒</div>
        <div style={{ fontFamily:'Playfair Display,serif', fontSize:'1.8rem', color:'#ccc', marginBottom:'0.5rem' }}>
          Your cart is empty!
        </div>
        <Link to="/menu" style={{ background:'#E8441A', color:'white', padding:'0.85rem 2rem', borderRadius:'50px', textDecoration:'none', fontWeight:800, fontFamily:'Nunito,sans-serif' }}>
          Browse Menu 🔥
        </Link>
      </div>
    )
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&family=Playfair+Display:wght@700&display=swap');

        .checkout-page {
          background: #FFF8F0;
          min-height: 100vh;
          padding: 3rem;
          font-family: 'Nunito', sans-serif;
        }
        .checkout-sec-label {
          font-size: 0.75rem; font-weight: 900; color: #E8441A;
          letter-spacing: 2px; text-transform: uppercase; margin-bottom: 0.4rem;
        }
        .checkout-sec-title {
          font-family: 'Playfair Display', serif;
          font-size: 2rem; font-weight: 700; color: #1C1C1C;
          margin-bottom: 2rem;
        }

        /* ── STEPPER ── */
        .stepper {
          display: flex; align-items: center;
          gap: 0; margin-bottom: 3rem;
          max-width: 500px;
        }
        .step-item {
          display: flex; flex-direction: column;
          align-items: center; gap: 0.4rem; flex: 1;
        }
        .step-circle {
          width: 40px; height: 40px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-weight: 900; font-size: 0.9rem;
          border: 2px solid #e8dfd4;
          background: white; color: #999;
          transition: all 0.3s;
        }
        .step-circle.active {
          background: #E8441A; border-color: #E8441A;
          color: white; box-shadow: 0 4px 12px rgba(232,68,26,0.3);
        }
        .step-circle.done {
          background: #2D9E5F; border-color: #2D9E5F; color: white;
        }
        .step-label {
          font-size: 0.72rem; font-weight: 800;
          color: #999; text-transform: uppercase; letter-spacing: 1px;
        }
        .step-label.active { color: #E8441A; }
        .step-label.done   { color: #2D9E5F; }
        .step-line {
          height: 2px; flex: 1; background: #e8dfd4;
          margin-bottom: 1.2rem; transition: background 0.3s;
        }
        .step-line.done { background: #2D9E5F; }

        /* ── LAYOUT ── */
        .checkout-layout {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 2rem;
          align-items: start;
          max-width: 1000px;
        }

        /* ── FORM CARD ── */
        .checkout-card {
          background: white; border-radius: 24px;
          padding: 2rem;
          box-shadow: 0 4px 24px rgba(0,0,0,0.07);
          border: 1.5px solid #f5ece0;
        }
        .checkout-card-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.3rem; font-weight: 700;
          color: #1C1C1C; margin-bottom: 1.5rem;
          display: flex; align-items: center; gap: 0.5rem;
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
        textarea.field-input { resize: vertical; min-height: 80px; }

        /* ── PAYMENT OPTIONS ── */
        .payment-options {
          display: flex; flex-direction: column; gap: 0.8rem;
          margin-bottom: 1.5rem;
        }
        .payment-option {
          display: flex; align-items: center; gap: 1rem;
          background: #FFF8F0; border: 1.5px solid #e8dfd4;
          border-radius: 14px; padding: 1rem 1.2rem;
          cursor: pointer; transition: all 0.2s;
        }
        .payment-option:hover { border-color: #E8441A; }
        .payment-option.selected {
          border-color: #E8441A;
          background: rgba(232,68,26,0.05);
        }
        .payment-radio {
          width: 20px; height: 20px; border-radius: 50%;
          border: 2px solid #e8dfd4;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; transition: all 0.2s;
        }
        .payment-radio.selected {
          border-color: #E8441A;
          background: #E8441A;
        }
        .payment-radio.selected::after {
          content: ''; width: 8px; height: 8px;
          border-radius: 50%; background: white;
        }
        .payment-icon  { font-size: 1.5rem; }
        .payment-label { font-weight: 800; font-size: 0.95rem; color: #1C1C1C; }
        .payment-sub   { font-size: 0.78rem; color: #999; font-weight: 600; }

        /* ── ORDER REVIEW ── */
        .review-item {
          display: flex; justify-content: space-between;
          align-items: center; padding: 0.7rem 0;
          border-bottom: 1px solid #f5ece0;
          font-size: 0.88rem;
        }
        .review-item:last-child { border-bottom: none; }
        .review-item-name { font-weight: 700; color: #1C1C1C; }
        .review-item-qty  { color: #999; font-size: 0.8rem; }
        .review-item-price { font-weight: 900; color: #E8441A; }
        .review-info {
          background: #FFF8F0; border-radius: 12px;
          padding: 1rem; margin-top: 1rem;
          font-size: 0.85rem; color: #666; font-weight: 600;
          line-height: 1.7;
        }
        .review-info strong { color: #1C1C1C; }

        /* ── BUTTONS ── */
        .submit-btn {
          width: 100%; padding: 0.95rem; border-radius: 14px; border: none;
          background: #E8441A; color: white;
          font-family: 'Nunito', sans-serif;
          font-size: 1rem; font-weight: 800;
          cursor: pointer; transition: all 0.2s;
          box-shadow: 0 6px 20px rgba(232,68,26,0.3);
          margin-top: 0.5rem;
        }
        .submit-btn:hover { background: #c93510; transform: translateY(-1px); }
        .submit-btn:disabled { background: #f0a898; cursor: not-allowed; transform: none; }
        .back-btn {
          background: transparent; border: 1.5px solid #e8dfd4;
          color: #999; padding: 0.8rem 1.5rem;
          border-radius: 14px; font-family: 'Nunito', sans-serif;
          font-size: 0.9rem; font-weight: 700;
          cursor: pointer; transition: all 0.2s; margin-top: 0.8rem;
          width: 100%;
        }
        .back-btn:hover { border-color: #E8441A; color: #E8441A; }
        .err-msg {
          background: #fff5f5; border: 1px solid #fecaca;
          color: #e53e3e; padding: 0.7rem 1rem;
          border-radius: 10px; font-size: 0.83rem;
          font-weight: 800; margin-bottom: 1rem;
        }

        /* ── ORDER SUMMARY CARD ── */
        .summary-card {
          background: white; border-radius: 24px;
          padding: 1.8rem;
          box-shadow: 0 4px 24px rgba(0,0,0,0.07);
          border: 1.5px solid #f5ece0;
          position: sticky; top: 90px;
        }
        .summary-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.2rem; font-weight: 700;
          color: #1C1C1C; margin-bottom: 1.2rem;
        }
        .summary-row {
          display: flex; justify-content: space-between;
          margin-bottom: 0.7rem; color: #999;
          font-size: 0.88rem; font-weight: 700;
        }
        .summary-divider {
          border: none; border-top: 2px dashed #f0e8e0; margin: 1rem 0;
        }
        .summary-total {
          display: flex; justify-content: space-between;
          font-size: 1.1rem; font-weight: 900; color: #1C1C1C;
        }
        .summary-total span:last-child { color: #E8441A; }
        .mpesa-note {
          display: flex; align-items: center; gap: 0.5rem;
          background: rgba(232,68,26,0.05);
          border: 1px solid rgba(232,68,26,0.15);
          border-radius: 10px; padding: 0.7rem 1rem;
          margin-top: 1rem;
          font-size: 0.78rem; font-weight: 700; color: #999;
        }

        /* ── SUCCESS ── */
        .success-wrap {
          text-align: center; padding: 3rem 2rem;
          max-width: 500px; margin: 0 auto;
        }
        .success-emoji { font-size: 5rem; margin-bottom: 1rem; }
        .success-title {
          font-family: 'Playfair Display', serif;
          font-size: 2.2rem; color: #2D9E5F;
          font-weight: 700; margin-bottom: 0.5rem;
        }
        .success-sub {
          color: #999; font-size: 0.95rem;
          font-weight: 600; line-height: 1.7; margin-bottom: 0.5rem;
        }
        .success-order-id {
          background: rgba(45,158,95,0.1);
          border: 1px solid rgba(45,158,95,0.3);
          color: #2D9E5F; padding: 0.5rem 1.2rem;
          border-radius: 50px; font-size: 0.85rem;
          font-weight: 800; display: inline-block;
          margin: 1rem 0 2rem;
        }
        .success-actions {
          display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;
        }
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
        .btn-outline {
          background: transparent; color: #1C1C1C;
          border: 1.5px solid #ddd;
          padding: 0.85rem 2rem; border-radius: 50px;
          font-family: 'Nunito', sans-serif; font-size: 0.95rem; font-weight: 700;
          cursor: pointer; transition: all 0.2s;
          text-decoration: none; display: inline-flex;
          align-items: center; gap: 0.5rem;
        }
        .btn-outline:hover { border-color: #E8441A; color: #E8441A; }

        @media (max-width: 900px) {
          .checkout-page   { padding: 2rem 1.5rem; }
          .checkout-layout { grid-template-columns: 1fr; }
          .summary-card    { position: static; }
        }
      `}</style>

      <div className="checkout-page">
        <div className="checkout-sec-label">🛍️ Checkout</div>
        <div className="checkout-sec-title">Complete Your Order</div>

        {/* ── SUCCESS STATE ── */}
        {step === 3 ? (
          <div className="success-wrap">
            <div className="success-emoji">🎉</div>
            <div className="success-title">Order Placed!</div>
            <p className="success-sub">
              Your Chacha Street Eats order has been confirmed!
              We're preparing your food right now. 🔥
            </p>
            <p className="success-sub">
              Estimated delivery: <strong>25–35 minutes 🛵</strong>
            </p>
            {orderID && (
              <div className="success-order-id">
                Order #{orderID}
              </div>
            )}
            <div className="success-actions">
              <Link to="/menu"  className="btn-red">Order More 🍲</Link>
              <Link to="/"      className="btn-outline">Go Home</Link>
            </div>
          </div>
        ) : (
          <>
            {/* ── STEPPER ── */}
            <div className="stepper">
              {STEPS.map((s, i) => (
                <>
                  <div key={s} className="step-item">
                    <div className={`step-circle ${i < step ? 'done' : i === step ? 'active' : ''}`}>
                      {i < step ? '✓' : i + 1}
                    </div>
                    <div className={`step-label ${i < step ? 'done' : i === step ? 'active' : ''}`}>
                      {s}
                    </div>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`step-line ${i < step ? 'done' : ''}`} />
                  )}
                </>
              ))}
            </div>

            <div className="checkout-layout">

              {/* ── LEFT: Form ── */}
              <div>
                {error && <div className="err-msg">⚠️ {error}</div>}

                {/* STEP 0: Delivery */}
                {step === 0 && (
                  <div className="checkout-card">
                    <div className="checkout-card-title">📍 Delivery Details</div>
                    <form onSubmit={submitDelivery}>
                      <label className="field-label">Delivery Address *</label>
                      <input
                        className="field-input"
                        name="address"
                        placeholder="e.g. House 4, Mwihoko, Kahawa Sukari"
                        value={delivery.address}
                        onChange={handleDeliveryChange}
                      />
                      <label className="field-label">Phone Number *</label>
                      <input
                        className="field-input"
                        name="phone"
                        placeholder="07XX XXX XXX"
                        value={delivery.phone}
                        onChange={handleDeliveryChange}
                      />
                      <label className="field-label">Delivery Notes (optional)</label>
                      <textarea
                        className="field-input"
                        name="notes"
                        placeholder="e.g. Blue gate, near the shop..."
                        value={delivery.notes}
                        onChange={handleDeliveryChange}
                      />
                      <button type="submit" className="submit-btn">
                        Continue to Payment →
                      </button>
                    </form>
                  </div>
                )}

                {/* STEP 1: Payment */}
                {step === 1 && (
                  <div className="checkout-card">
                    <div className="checkout-card-title">💳 Payment Method</div>
                    <form onSubmit={submitPayment}>
                      <div className="payment-options">
                        {[
                          { id:'mpesa', icon:'📱', label:'M-Pesa',           sub:'Pay via mobile money — instant & secure'     },
                          { id:'cash',  icon:'💵', label:'Cash on Delivery',  sub:'Pay when your order arrives at your door'    },
                          { id:'card',  icon:'💳', label:'Card Payment',      sub:'Visa / Mastercard — paid on delivery'        },
                        ].map(opt => (
                          <div
                            key={opt.id}
                            className={`payment-option ${payment === opt.id ? 'selected' : ''}`}
                            onClick={() => setPayment(opt.id)}
                          >
                            <div className={`payment-radio ${payment === opt.id ? 'selected' : ''}`} />
                            <span className="payment-icon">{opt.icon}</span>
                            <div>
                              <div className="payment-label">{opt.label}</div>
                              <div className="payment-sub">{opt.sub}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* M-Pesa phone input */}
                      {payment === 'mpesa' && (
                        <>
                          <label className="field-label">M-Pesa Phone Number *</label>
                          <input
                            className="field-input"
                            placeholder="07XX XXX XXX"
                            value={mpesaPhone}
                            onChange={e => setMpesaPhone(e.target.value)}
                          />
                          <div className="mpesa-note">
                            📱 You will receive an M-Pesa prompt on this number to complete payment
                          </div>
                        </>
                      )}

                      <button type="submit" className="submit-btn" style={{ marginTop:'1.2rem' }}>
                        Review Order →
                      </button>
                      <button type="button" className="back-btn" onClick={() => setStep(0)}>
                        ← Back to Delivery
                      </button>
                    </form>
                  </div>
                )}

                {/* STEP 2: Confirm */}
                {step === 2 && (
                  <div className="checkout-card">
                    <div className="checkout-card-title">✅ Review & Confirm</div>

                    {/* Order items */}
                    {cart.map(item => (
                      <div key={item.id} className="review-item">
                        <div>
                          <div className="review-item-name">{item.name}</div>
                          <div className="review-item-qty">x{item.quantity}</div>
                        </div>
                        <div className="review-item-price">KSh {item.price * item.quantity}</div>
                      </div>
                    ))}

                    {/* Delivery & payment info */}
                    <div className="review-info">
                      <strong>📍 Delivering to:</strong> {delivery.address}<br/>
                      <strong>📞 Phone:</strong> {delivery.phone}<br/>
                      {delivery.notes && <><strong>📝 Notes:</strong> {delivery.notes}<br/></>}
                      <strong>💳 Payment:</strong> {payment === 'mpesa' ? `M-Pesa (${mpesaPhone})` : payment === 'cash' ? 'Cash on Delivery' : 'Card on Delivery'}
                    </div>

                    <button
                      className="submit-btn"
                      style={{ marginTop:'1.5rem' }}
                      onClick={placeOrder}
                      disabled={loading}
                    >
                      {loading ? 'Placing Order...' : 'Place Order 🔥'}
                    </button>
                    <button className="back-btn" onClick={() => setStep(1)}>
                      ← Back to Payment
                    </button>
                  </div>
                )}
              </div>

              {/* ── RIGHT: Order Summary ── */}
              <div className="summary-card">
                <div className="summary-title">Order Summary</div>
                {cart.map(item => (
                  <div key={item.id} className="summary-row">
                    <span>{item.name} x{item.quantity}</span>
                    <span style={{ color:'#1C1C1C', fontWeight:900 }}>KSh {item.price * item.quantity}</span>
                  </div>
                ))}
                <hr className="summary-divider" />
                <div className="summary-row">
                  <span>Delivery</span>
                  <span style={{ color:'#2D9E5F', fontWeight:800 }}>FREE 🎉</span>
                </div>
                <div className="summary-total">
                  <span>Total</span>
                  <span>KSh {total}</span>
                </div>
                <div className="mpesa-note">
                  📱 M-Pesa · Cash · Card accepted
                </div>
              </div>

            </div>
          </>
        )}
      </div>
    </>
  )
}

export default Checkout