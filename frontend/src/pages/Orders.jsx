import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'

const STATUS_STYLES = {
  pending:          { bg:'rgba(246,173,85,0.12)',  color:'#D69E2E', label:'⏳ Pending'          },
  processing:       { bg:'rgba(66,153,225,0.12)',  color:'#2B6CB0', label:'👨‍🍳 Processing'       },
  out_for_delivery: { bg:'rgba(72,187,120,0.12)',  color:'#276749', label:'🛵 Out for Delivery'  },
  delivered:        { bg:'rgba(45,158,95,0.12)',   color:'#2D9E5F', label:'✅ Delivered'         },
  cancelled:        { bg:'rgba(229,62,62,0.12)',   color:'#C53030', label:'❌ Cancelled'         },
}

const Orders = () => {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')
  const [openId,  setOpenId]  = useState(null)

  useEffect(() => {
    if (authLoading) return
    if (!user) return navigate('/login')
    fetchOrders()
  }, [user, authLoading])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await api.get('/api/orders/')
      setOrders(res.data)
    } catch (err) {
      setError('Failed to load orders. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const toggleOrder = (id) => {
    setOpenId(prev => prev === id ? null : id)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&family=Playfair+Display:wght@700&display=swap');

        .orders-page {
          background: #FFF8F0; min-height: 100vh;
          padding: 3rem; font-family: 'Nunito', sans-serif;
        }
        .orders-header {
          display: flex; justify-content: space-between;
          align-items: flex-start; margin-bottom: 2.5rem;
        }
        .orders-sec-label {
          font-size: 0.75rem; font-weight: 900; color: #E8441A;
          letter-spacing: 2px; text-transform: uppercase; margin-bottom: 0.4rem;
        }
        .orders-sec-title {
          font-family: 'Playfair Display', serif;
          font-size: 2rem; font-weight: 700; color: #1C1C1C;
        }
        .orders-sec-sub {
          color: #999; font-size: 0.88rem; font-weight: 600; margin-top: 0.3rem;
        }
        .refresh-btn {
          background: white; border: 1.5px solid #e8dfd4;
          color: #999; padding: 0.6rem 1.2rem; border-radius: 50px;
          font-family: 'Nunito', sans-serif; font-size: 0.85rem; font-weight: 700;
          cursor: pointer; transition: all 0.2s;
        }
        .refresh-btn:hover { border-color: #E8441A; color: #E8441A; }

        /* ── LOADING ── */
        .loading-wrap {
          text-align: center; padding: 5rem 2rem; color: #999;
        }
        .loading-emoji { font-size: 3rem; margin-bottom: 1rem; animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        /* ── EMPTY ── */
        .orders-empty { text-align: center; padding: 5rem 2rem; }
        .orders-empty-emoji { font-size: 5rem; margin-bottom: 1rem; }
        .orders-empty-title {
          font-family: 'Playfair Display', serif;
          font-size: 2rem; color: #ccc; margin-bottom: 0.5rem;
        }
        .orders-empty-sub {
          color: #999; margin-bottom: 2rem;
          font-size: 0.93rem; font-weight: 600;
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

        /* ── ERROR ── */
        .err-msg {
          background: #fff5f5; border: 1px solid #fecaca;
          color: #e53e3e; padding: 0.9rem 1.2rem;
          border-radius: 12px; font-weight: 800;
          margin-bottom: 1.5rem; font-size: 0.88rem;
        }

        /* ── ORDER CARD ── */
        .order-card {
          background: white; border-radius: 20px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.07);
          border: 1.5px solid #f5ece0;
          margin-bottom: 1.2rem;
          overflow: hidden; transition: all 0.2s;
        }
        .order-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.1); }

        /* Order Header */
        .order-head {
          padding: 1.2rem 1.5rem;
          display: flex; align-items: center;
          justify-content: space-between; flex-wrap: wrap; gap: 1rem;
          cursor: pointer; transition: background 0.2s;
        }
        .order-head:hover { background: #fffaf7; }
        .order-head-left { display: flex; align-items: center; gap: 1.2rem; }
        .order-id {
          font-weight: 900; font-size: 1rem; color: #E8441A;
        }
        .order-date {
          font-size: 0.8rem; color: #999; font-weight: 600;
        }
        .order-items-count {
          font-size: 0.82rem; color: #999; font-weight: 700;
        }
        .order-head-right {
          display: flex; align-items: center; gap: 1rem;
        }
        .order-total {
          font-weight: 900; font-size: 1.05rem; color: #1C1C1C;
        }
        .status-badge {
          display: inline-block; padding: 0.3rem 0.9rem;
          border-radius: 50px; font-size: 0.75rem; font-weight: 800;
        }
        .chevron {
          color: #ccc; font-size: 0.8rem; transition: transform 0.2s;
        }
        .chevron.open { transform: rotate(180deg); }

        /* Order Body */
        .order-body {
          border-top: 1px solid #f5ece0;
          padding: 1.3rem 1.5rem;
          background: #fffaf7;
        }
        .order-body-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 1.5rem; margin-bottom: 1.3rem;
        }
        .order-section-title {
          font-size: 0.72rem; font-weight: 900; color: #E8441A;
          text-transform: uppercase; letter-spacing: 1.5px;
          margin-bottom: 0.7rem;
        }
        .order-info-row {
          display: flex; align-items: flex-start; gap: 0.5rem;
          margin-bottom: 0.5rem; font-size: 0.85rem;
        }
        .order-info-icon { flex-shrink: 0; }
        .order-info-text { color: #666; font-weight: 600; line-height: 1.5; }
        .order-info-text strong { color: #1C1C1C; }

        /* Items list */
        .order-item-row {
          display: flex; justify-content: space-between;
          align-items: center; padding: 0.6rem 0;
          border-bottom: 1px solid #f0e8e0; font-size: 0.88rem;
        }
        .order-item-row:last-child { border-bottom: none; }
        .order-item-name { font-weight: 700; color: #1C1C1C; }
        .order-item-qty  { color: #999; font-size: 0.8rem; margin-top: 0.1rem; }
        .order-item-price { font-weight: 900; color: #E8441A; }

        /* Total row */
        .order-total-row {
          display: flex; justify-content: space-between;
          align-items: center; padding-top: 1rem;
          margin-top: 0.5rem; border-top: 2px dashed #f0e8e0;
          font-size: 1rem; font-weight: 900;
        }
        .order-total-row span:last-child { color: #E8441A; }

        /* Reorder button */
        .reorder-btn {
          background: #E8441A; color: white; border: none;
          padding: 0.6rem 1.4rem; border-radius: 50px;
          font-family: 'Nunito', sans-serif; font-size: 0.85rem; font-weight: 800;
          cursor: pointer; transition: all 0.2s;
          margin-top: 1rem; display: inline-flex;
          align-items: center; gap: 0.4rem;
        }
        .reorder-btn:hover { background: #c93510; }

        @media (max-width: 768px) {
          .orders-page     { padding: 2rem 1.5rem; }
          .order-body-grid { grid-template-columns: 1fr; gap: 1rem; }
          .order-head      { flex-wrap: wrap; }
        }
      `}</style>

      <div className="orders-page">

        {/* ── HEADER ── */}
        <div className="orders-header">
          <div>
            <div className="orders-sec-label">📦 Your Orders</div>
            <div className="orders-sec-title">Order History</div>
            <div className="orders-sec-sub">
              Hey {user?.username}! Here are all your orders 🔥
            </div>
          </div>
          <button className="refresh-btn" onClick={fetchOrders}>🔄 Refresh</button>
        </div>

        {/* ── ERROR ── */}
        {error && <div className="err-msg">⚠️ {error}</div>}

        {/* ── LOADING ── */}
        {loading ? (
          <div className="loading-wrap">
            <div className="loading-emoji">🍲</div>
            <div style={{ fontWeight:800 }}>Loading your orders...</div>
          </div>

        /* ── EMPTY ── */
        ) : orders.length === 0 ? (
          <div className="orders-empty">
            <div className="orders-empty-emoji">📦</div>
            <div className="orders-empty-title">No orders yet!</div>
            <p className="orders-empty-sub">
              You haven't placed any orders yet. Let's fix that!
            </p>
            <Link to="/menu" className="btn-red">Order Now 🔥</Link>
          </div>

        /* ── ORDERS LIST ── */
        ) : (
          <div>
            {orders.map(order => {
              const status = STATUS_STYLES[order.status] || STATUS_STYLES.pending
              const isOpen = openId === order.id

              return (
                <div key={order.id} className="order-card">

                  {/* ── Order Header (clickable) ── */}
                  <div className="order-head" onClick={() => toggleOrder(order.id)}>
                    <div className="order-head-left">
                      <div>
                        <div className="order-id">Order #{order.id}</div>
                        <div className="order-date">
                          {new Date(order.created_at).toLocaleDateString('en-KE', {
                            day:'numeric', month:'short', year:'numeric',
                            hour:'2-digit', minute:'2-digit'
                          })}
                        </div>
                      </div>
                      <div className="order-items-count">
                        {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                      </div>
                    </div>

                    <div className="order-head-right">
                      <div className="order-total">KSh {order.total_price?.toLocaleString()}</div>
                      <span
                        className="status-badge"
                        style={{ background: status.bg, color: status.color }}
                      >
                        {status.label}
                      </span>
                      <span className={`chevron ${isOpen ? 'open' : ''}`}>▼</span>
                    </div>
                  </div>

                  {/* ── Order Body (expandable) ── */}
                  {isOpen && (
                    <div className="order-body">
                      <div className="order-body-grid">

                        {/* Delivery Info */}
                        <div>
                          <div className="order-section-title">📍 Delivery Info</div>
                          <div className="order-info-row">
                            <span className="order-info-icon">📍</span>
                            <div className="order-info-text">
                              <strong>Address:</strong><br/>
                              {order.shipping_info?.address || 'N/A'}
                            </div>
                          </div>
                          <div className="order-info-row">
                            <span className="order-info-icon">📞</span>
                            <div className="order-info-text">
                              <strong>Phone:</strong> {order.shipping_info?.phone || 'N/A'}
                            </div>
                          </div>
                          {order.shipping_info?.notes && (
                            <div className="order-info-row">
                              <span className="order-info-icon">📝</span>
                              <div className="order-info-text">
                                <strong>Notes:</strong> {order.shipping_info.notes}
                              </div>
                            </div>
                          )}
                          <div className="order-info-row">
                            <span className="order-info-icon">💳</span>
                            <div className="order-info-text">
                              <strong>Payment:</strong>{' '}
                              {order.shipping_info?.payment === 'mpesa'
                                ? `M-Pesa (${order.shipping_info?.mpesa_phone})`
                                : order.shipping_info?.payment === 'cash'
                                ? 'Cash on Delivery'
                                : order.shipping_info?.payment || 'N/A'}
                            </div>
                          </div>
                        </div>

                        {/* Order Status */}
                        <div>
                          <div className="order-section-title">📦 Order Status</div>
                          {[
                            { status:'pending',          label:'Order Received',    icon:'✅' },
                            { status:'processing',       label:'Being Prepared',    icon:'👨‍🍳' },
                            { status:'out_for_delivery', label:'Out for Delivery',  icon:'🛵' },
                            { status:'delivered',        label:'Delivered',         icon:'🎉' },
                          ].map((step, i) => {
                            const statuses = ['pending','processing','out_for_delivery','delivered']
                            const currentIndex = statuses.indexOf(order.status)
                            const stepIndex    = statuses.indexOf(step.status)
                            const isDone       = stepIndex <= currentIndex
                            return (
                              <div key={i} className="order-info-row">
                                <span>{step.icon}</span>
                                <div className="order-info-text" style={{
                                  color: isDone ? '#1C1C1C' : '#ccc',
                                  fontWeight: isDone ? 800 : 600,
                                }}>
                                  {step.label}
                                  {isDone && stepIndex === currentIndex && (
                                    <span style={{ color:'#E8441A', marginLeft:'0.4rem' }}>← Now</span>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="order-section-title">🍽️ Items Ordered</div>
                      {order.items?.map(item => (
                        <div key={item.id} className="order-item-row">
                          <div>
                            <div className="order-item-name">
                              {item.menu_item?.name || 'Item'}
                            </div>
                            <div className="order-item-qty">x{item.quantity}</div>
                          </div>
                          <div className="order-item-price">
                            KSh {(item.price_at_order * item.quantity).toLocaleString()}
                          </div>
                        </div>
                      ))}

                      <div className="order-total-row">
                        <span>Total Paid</span>
                        <span>KSh {order.total_price?.toLocaleString()}</span>
                      </div>

                      <Link to="/menu" className="reorder-btn">
                        🔄 Order Again
                      </Link>
                    </div>
                  )}

                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

export default Orders