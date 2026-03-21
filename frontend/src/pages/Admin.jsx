import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'

const Admin = () => {
  const navigate  = useNavigate()
  const { user, loading: authLoading } = useAuth()

  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats,     setStats]     = useState(null)
  const [orders,    setOrders]    = useState([])
  const [users,     setUsers]     = useState([])
  const [menu,      setMenu]      = useState([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState('')

  // New menu item form
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [menuForm,    setMenuForm]    = useState({
    name: '', price: '', category_id: '1',
    description: '', image_url: '',
    spice_level: '0', is_vegetarian: false, in_stock: true,
  })

  // Redirect if not admin
  useEffect(() => {
  if (authLoading) return // wait for auth to finish loading
  if (!user) {
    navigate('/login')
    return
  }
  if (user.role !== 'admin') {
    navigate('/')
    return
  }
}, [user, authLoading])

useEffect(() => {
  if (authLoading) return
  if (!user || user.role !== 'admin') return
  fetchAll()
}, [user, authLoading])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [statsRes, ordersRes, usersRes, menuRes] = await Promise.all([
        api.get('/api/admin/stats'),
        api.get('/api/admin/orders'),
        api.get('/api/admin/users'),
        api.get('/api/admin/menu'),
      ])
      setStats(statsRes.data)
      setOrders(ordersRes.data)
      setUsers(usersRes.data)
      setMenu(menuRes.data)
    } catch (err) {
      setError('Failed to load admin data. Make sure you are logged in as admin.')
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (id, status) => {
    try {
      await api.patch(`/api/admin/orders/${id}/status`, { status })
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
    } catch (err) {
      alert('Failed to update order status')
    }
  }

  const toggleBlockUser = async (id) => {
    try {
      const res = await api.patch(`/api/admin/users/${id}/block`)
      setUsers(prev => prev.map(u => u.id === id ? res.data.user : u))
    } catch (err) {
      alert('Failed to update user')
    }
  }

  const deleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    try {
      await api.delete(`/api/admin/users/${id}`)
      setUsers(prev => prev.filter(u => u.id !== id))
    } catch (err) {
      alert('Failed to delete user')
    }
  }

  const deleteMenuItem = async (id) => {
    if (!confirm('Delete this menu item?')) return
    try {
      await api.delete(`/api/admin/menu/${id}`)
      setMenu(prev => prev.filter(m => m.id !== id))
    } catch (err) {
      alert('Failed to delete menu item')
    }
  }

  const addMenuItem = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/api/admin/menu', {
        ...menuForm,
        price:       parseFloat(menuForm.price),
        category_id: parseInt(menuForm.category_id),
        spice_level: parseInt(menuForm.spice_level),
      })
      setMenu(prev => [...prev, res.data.item])
      setShowAddMenu(false)
      setMenuForm({ name:'', price:'', category_id:'1', description:'', image_url:'', spice_level:'0', is_vegetarian:false, in_stock:true })
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add menu item')
    }
  }

  const STATUS_COLORS = {
    pending:          { bg:'rgba(246,173,85,0.15)',  color:'#D69E2E' },
    processing:       { bg:'rgba(66,153,225,0.15)',  color:'#2B6CB0' },
    out_for_delivery: { bg:'rgba(72,187,120,0.15)',  color:'#276749' },
    delivered:        { bg:'rgba(45,158,95,0.15)',   color:'#2D9E5F' },
    cancelled:        { bg:'rgba(229,62,62,0.15)',   color:'#C53030' },
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&family=Playfair+Display:wght@700&display=swap');

        .admin-page {
          background: #F7F8FA;
          min-height: 100vh;
          font-family: 'Nunito', sans-serif;
          display: flex;
        }

        /* ── SIDEBAR ── */
        .admin-sidebar {
          width: 240px; flex-shrink: 0;
          background: #1C1C1C;
          padding: 2rem 0;
          position: sticky; top: 0;
          height: 100vh; overflow-y: auto;
        }
        .sidebar-logo {
          padding: 0 1.5rem 2rem;
          border-bottom: 1px solid #2a2a2a;
          margin-bottom: 1.5rem;
        }
        .sidebar-logo-text {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem; color: white; font-weight: 700;
        }
        .sidebar-logo-sub {
          font-size: 0.72rem; color: #E8441A;
          font-weight: 800; text-transform: uppercase; letter-spacing: 1px;
        }
        .sidebar-nav { padding: 0 0.8rem; }
        .sidebar-item {
          display: flex; align-items: center; gap: 0.8rem;
          padding: 0.75rem 1rem; border-radius: 12px;
          cursor: pointer; transition: all 0.2s;
          color: #666; font-weight: 700; font-size: 0.88rem;
          margin-bottom: 0.3rem;
        }
        .sidebar-item:hover { background: #2a2a2a; color: #999; }
        .sidebar-item.active { background: #E8441A; color: white; }
        .sidebar-icon { font-size: 1.1rem; min-width: 20px; }
        .sidebar-divider {
          height: 1px; background: #2a2a2a;
          margin: 1rem 1rem; 
        }
        .sidebar-back {
          display: flex; align-items: center; gap: 0.8rem;
          padding: 0.75rem 1.8rem; cursor: pointer;
          color: #555; font-weight: 700; font-size: 0.85rem;
          transition: color 0.2s; margin-top: 1rem;
        }
        .sidebar-back:hover { color: #E8441A; }

        /* ── MAIN CONTENT ── */
        .admin-main {
          flex: 1; padding: 2.5rem; overflow-y: auto;
        }
        .admin-header {
          display: flex; justify-content: space-between;
          align-items: center; margin-bottom: 2rem;
        }
        .admin-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.8rem; font-weight: 700; color: #1C1C1C;
        }
        .admin-sub { color: #999; font-size: 0.88rem; font-weight: 600; margin-top: 0.2rem; }

        /* ── STAT CARDS ── */
        .stats-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1.2rem; margin-bottom: 2rem;
        }
        .stat-card {
          background: white; border-radius: 18px; padding: 1.5rem;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          border: 1.5px solid #f0f0f0;
          transition: all 0.2s;
        }
        .stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
        .stat-icon {
          width: 46px; height: 46px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.3rem; margin-bottom: 1rem;
        }
        .stat-value {
          font-family: 'Playfair Display', serif;
          font-size: 1.9rem; font-weight: 700; color: #1C1C1C; line-height: 1;
        }
        .stat-label { font-size: 0.8rem; color: #999; font-weight: 700; margin-top: 0.3rem; }
        .stat-trend { font-size: 0.75rem; font-weight: 800; margin-top: 0.5rem; }

        /* ── TABLE ── */
        .table-card {
          background: white; border-radius: 20px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          border: 1.5px solid #f0f0f0; overflow: hidden;
          margin-bottom: 2rem;
        }
        .table-header {
          padding: 1.3rem 1.5rem;
          border-bottom: 1px solid #f5f5f5;
          display: flex; justify-content: space-between; align-items: center;
        }
        .table-title {
          font-weight: 800; font-size: 1rem; color: #1C1C1C;
        }
        .table-count {
          background: #f5f5f5; color: #999;
          font-size: 0.75rem; font-weight: 800;
          padding: 0.2rem 0.7rem; border-radius: 50px;
        }
        table { width: 100%; border-collapse: collapse; }
        th {
          text-align: left; padding: 0.9rem 1.5rem;
          font-size: 0.72rem; font-weight: 900;
          color: #999; text-transform: uppercase; letter-spacing: 1px;
          border-bottom: 1px solid #f5f5f5; background: #fafafa;
        }
        td {
          padding: 1rem 1.5rem; font-size: 0.88rem;
          font-weight: 700; color: #1C1C1C;
          border-bottom: 1px solid #f9f9f9;
        }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: #fafafa; }

        /* STATUS BADGE */
        .status-badge {
          display: inline-block; padding: 0.25rem 0.8rem;
          border-radius: 50px; font-size: 0.73rem; font-weight: 800;
        }
        .status-select {
          border: 1.5px solid #e8e8e8; border-radius: 8px;
          padding: 0.3rem 0.6rem; font-family: 'Nunito', sans-serif;
          font-size: 0.8rem; font-weight: 700; cursor: pointer;
          background: white; outline: none; color: #1C1C1C;
        }
        .status-select:focus { border-color: #E8441A; }

        /* BUTTONS */
        .btn-red {
          background: #E8441A; color: white; border: none;
          padding: 0.55rem 1.2rem; border-radius: 10px;
          font-family: 'Nunito', sans-serif; font-size: 0.82rem; font-weight: 800;
          cursor: pointer; transition: all 0.2s;
        }
        .btn-red:hover { background: #c93510; }
        .btn-ghost {
          background: transparent; color: #999;
          border: 1.5px solid #e8e8e8; padding: 0.55rem 1.2rem;
          border-radius: 10px; font-family: 'Nunito', sans-serif;
          font-size: 0.82rem; font-weight: 800; cursor: pointer; transition: all 0.2s;
        }
        .btn-ghost:hover { border-color: #E8441A; color: #E8441A; }
        .btn-danger {
          background: rgba(229,62,62,0.1); color: #C53030;
          border: none; padding: 0.55rem 1.2rem; border-radius: 10px;
          font-family: 'Nunito', sans-serif; font-size: 0.82rem; font-weight: 800;
          cursor: pointer; transition: all 0.2s;
        }
        .btn-danger:hover { background: rgba(229,62,62,0.2); }
        .btn-warning {
          background: rgba(246,173,85,0.15); color: #D69E2E;
          border: none; padding: 0.55rem 1.2rem; border-radius: 10px;
          font-family: 'Nunito', sans-serif; font-size: 0.82rem; font-weight: 800;
          cursor: pointer; transition: all 0.2s;
        }
        .btn-warning:hover { background: rgba(246,173,85,0.3); }
        .action-row { display: flex; gap: 0.5rem; }

        /* MODAL */
        .overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.5);
          z-index: 999; display: flex; align-items: center;
          justify-content: center; padding: 2rem;
          backdrop-filter: blur(4px);
        }
        .modal {
          background: white; border-radius: 24px; padding: 2rem;
          max-width: 500px; width: 100%; position: relative;
          box-shadow: 0 24px 80px rgba(0,0,0,0.2);
          max-height: 90vh; overflow-y: auto;
        }
        .modal-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem; font-weight: 700; color: #1C1C1C; margin-bottom: 1.5rem;
        }
        .field-label {
          display: block; font-size: 0.72rem; font-weight: 900;
          color: #1C1C1C; margin-bottom: 0.3rem;
          letter-spacing: 0.5px; text-transform: uppercase;
        }
        .field-input {
          width: 100%; padding: 0.75rem 1rem;
          border: 1.5px solid #e8e8e8; border-radius: 12px;
          background: #fafafa; color: #1C1C1C;
          font-family: 'Nunito', sans-serif; font-size: 0.9rem; font-weight: 700;
          transition: border-color 0.2s; outline: none; margin-bottom: 0.9rem;
        }
        .field-input:focus { border-color: #E8441A; background: white; }
        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; }
        .checkbox-row {
          display: flex; align-items: center; gap: 0.6rem;
          margin-bottom: 0.9rem; cursor: pointer;
        }
        .checkbox-row input { width: 18px; height: 18px; cursor: pointer; accent-color: #E8441A; }
        .checkbox-label { font-size: 0.88rem; font-weight: 700; color: #1C1C1C; }

        /* LOADING */
        .loading-wrap {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 5rem; color: #999;
        }
        .loading-icon { font-size: 3rem; margin-bottom: 1rem; animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        /* ERROR */
        .err-banner {
          background: #fff5f5; border: 1px solid #fecaca;
          color: #C53030; padding: 1rem 1.5rem; border-radius: 14px;
          font-weight: 700; margin-bottom: 1.5rem;
        }

        /* RECENT ORDERS */
        .recent-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;
        }

        @media (max-width: 1024px) {
          .admin-sidebar { width: 200px; }
          .recent-grid   { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) {
          .admin-page    { flex-direction: column; }
          .admin-sidebar { width: 100%; height: auto; position: static; }
          .sidebar-nav   { display: flex; flex-wrap: wrap; gap: 0.4rem; padding: 0 1rem 1rem; }
          .admin-main    { padding: 1.5rem; }
          .stats-grid    { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <div className="admin-page">

        {/* ── SIDEBAR ── */}
        <div className="admin-sidebar">
          <div className="sidebar-logo">
            <div style={{ fontSize:'1.5rem', marginBottom:'0.3rem' }}>🔥</div>
            <div className="sidebar-logo-text">Chacha Eats</div>
            <div className="sidebar-logo-sub">Admin Panel</div>
          </div>

          <div className="sidebar-nav">
            {[
              { id:'dashboard', icon:'📊', label:'Dashboard'  },
              { id:'orders',    icon:'🛒', label:'Orders'     },
              { id:'menu',      icon:'🍽️', label:'Menu Items' },
              { id:'users',     icon:'👥', label:'Users'      },
            ].map(item => (
              <div
                key={item.id}
                className={`sidebar-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <span className="sidebar-icon">{item.icon}</span>
                {item.label}
              </div>
            ))}

            <div className="sidebar-divider" />

            <div className="sidebar-back" onClick={() => navigate('/')}>
              ← Back to Site
            </div>
          </div>
        </div>

        {/* ── MAIN ── */}
        <div className="admin-main">

          {loading ? (
            <div className="loading-wrap">
              <div className="loading-icon">⚙️</div>
              <div style={{ fontWeight:800 }}>Loading admin data...</div>
            </div>
          ) : error ? (
            <div className="err-banner">⚠️ {error}</div>
          ) : (
            <>
              {/* ══ DASHBOARD ══ */}
              {activeTab === 'dashboard' && stats && (
                <>
                  <div className="admin-header">
                    <div>
                      <div className="admin-title">Dashboard 📊</div>
                      <div className="admin-sub">Welcome back, {user?.username}! Here's what's happening.</div>
                    </div>
                    <button className="btn-red" onClick={fetchAll}>🔄 Refresh</button>
                  </div>

                  {/* Stat Cards */}
                  <div className="stats-grid">
                    {[
                      { icon:'🛒', label:'Total Orders',   value: stats.total_orders,   bg:'rgba(232,68,26,0.08)',   color:'#E8441A', trend:'All time' },
                      { icon:'💰', label:'Total Revenue',  value:`KSh ${stats.total_revenue.toLocaleString()}`, bg:'rgba(45,158,95,0.08)', color:'#2D9E5F', trend:'All time' },
                      { icon:'👥', label:'Total Users',    value: stats.total_users,    bg:'rgba(66,153,225,0.08)', color:'#2B6CB0', trend:'Registered' },
                      { icon:'⏳', label:'Pending Orders', value: stats.pending_orders, bg:'rgba(246,173,85,0.08)', color:'#D69E2E', trend:'Need action' },
                      { icon:'🍽️', label:'Menu Items',     value: stats.total_menu,     bg:'rgba(159,122,234,0.08)',color:'#6B46C1', trend:'Active items' },
                    ].map((s, i) => (
                      <div key={i} className="stat-card">
                        <div className="stat-icon" style={{ background: s.bg }}>
                          {s.icon}
                        </div>
                        <div className="stat-value">{s.value}</div>
                        <div className="stat-label">{s.label}</div>
                        <div className="stat-trend" style={{ color: s.color }}>{s.trend}</div>
                      </div>
                    ))}
                  </div>

                  {/* Recent Orders */}
                  <div className="table-card">
                    <div className="table-header">
                      <div className="table-title">Recent Orders</div>
                      <button className="btn-ghost" onClick={() => setActiveTab('orders')}>See All →</button>
                    </div>
                    <table>
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Customer</th>
                          <th>Total</th>
                          <th>Status</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.recent_orders.map(o => (
                          <tr key={o.id}>
                            <td style={{ color:'#E8441A' }}>#{o.id}</td>
                            <td>User #{o.user_id}</td>
                            <td style={{ fontWeight:900 }}>KSh {o.total_price?.toLocaleString()}</td>
                            <td>
                              <span className="status-badge" style={STATUS_COLORS[o.status] || {}}>
                                {o.status}
                              </span>
                            </td>
                            <td style={{ color:'#999' }}>
                              {new Date(o.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {/* ══ ORDERS ══ */}
              {activeTab === 'orders' && (
                <>
                  <div className="admin-header">
                    <div>
                      <div className="admin-title">Orders 🛒</div>
                      <div className="admin-sub">{orders.length} total orders</div>
                    </div>
                    <button className="btn-red" onClick={fetchAll}>🔄 Refresh</button>
                  </div>

                  <div className="table-card">
                    <div className="table-header">
                      <div className="table-title">All Orders</div>
                      <span className="table-count">{orders.length}</span>
                    </div>
                    <table>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Customer</th>
                          <th>Items</th>
                          <th>Total</th>
                          <th>Payment</th>
                          <th>Status</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map(o => (
                          <tr key={o.id}>
                            <td style={{ color:'#E8441A', fontWeight:900 }}>#{o.id}</td>
                            <td>User #{o.user_id}</td>
                            <td style={{ color:'#999' }}>{o.items?.length || 0} items</td>
                            <td style={{ fontWeight:900 }}>KSh {o.total_price?.toLocaleString()}</td>
                            <td style={{ color:'#999', fontSize:'0.8rem' }}>
                              {o.shipping_info?.payment || 'N/A'}
                            </td>
                            <td>
                              <select
                                className="status-select"
                                value={o.status}
                                onChange={e => updateOrderStatus(o.id, e.target.value)}
                                style={STATUS_COLORS[o.status] || {}}
                              >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="out_for_delivery">Out for Delivery</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td style={{ color:'#999', fontSize:'0.82rem' }}>
                              {new Date(o.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {/* ══ MENU ══ */}
              {activeTab === 'menu' && (
                <>
                  <div className="admin-header">
                    <div>
                      <div className="admin-title">Menu Items 🍽️</div>
                      <div className="admin-sub">{menu.length} items on the menu</div>
                    </div>
                    <button className="btn-red" onClick={() => setShowAddMenu(true)}>
                      + Add Item
                    </button>
                  </div>

                  <div className="table-card">
                    <div className="table-header">
                      <div className="table-title">All Menu Items</div>
                      <span className="table-count">{menu.length}</span>
                    </div>
                    <table>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Price</th>
                          <th>Category</th>
                          <th>Spice</th>
                          <th>Veg</th>
                          <th>In Stock</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {menu.map(item => (
                          <tr key={item.id}>
                            <td style={{ fontWeight:800 }}>{item.name}</td>
                            <td style={{ color:'#E8441A', fontWeight:900 }}>KSh {item.price}</td>
                            <td style={{ color:'#999' }}>{item.category}</td>
                            <td>{'🌶️'.repeat(item.spice_level || 0) || '—'}</td>
                            <td>{item.is_vegetarian ? '🥬 Yes' : '—'}</td>
                            <td>
                              <span style={{
                                background: item.in_stock ? 'rgba(45,158,95,0.1)' : 'rgba(229,62,62,0.1)',
                                color: item.in_stock ? '#2D9E5F' : '#C53030',
                                padding:'0.2rem 0.6rem', borderRadius:'50px',
                                fontSize:'0.73rem', fontWeight:800
                              }}>
                                {item.in_stock ? '✓ In Stock' : '✕ Out'}
                              </span>
                            </td>
                            <td>
                              <div className="action-row">
                                <button className="btn-danger" onClick={() => deleteMenuItem(item.id)}>
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {/* ══ USERS ══ */}
              {activeTab === 'users' && (
                <>
                  <div className="admin-header">
                    <div>
                      <div className="admin-title">Users 👥</div>
                      <div className="admin-sub">{users.length} registered users</div>
                    </div>
                    <button className="btn-red" onClick={fetchAll}>🔄 Refresh</button>
                  </div>

                  <div className="table-card">
                    <div className="table-header">
                      <div className="table-title">All Users</div>
                      <span className="table-count">{users.length}</span>
                    </div>
                    <table>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Username</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Status</th>
                          <th>Joined</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(u => (
                          <tr key={u.id}>
                            <td style={{ color:'#999' }}>#{u.id}</td>
                            <td style={{ fontWeight:800 }}>{u.username}</td>
                            <td style={{ color:'#999', fontSize:'0.82rem' }}>{u.email}</td>
                            <td>
                              <span style={{
                                background: u.role === 'admin' ? 'rgba(232,68,26,0.1)' : 'rgba(66,153,225,0.1)',
                                color: u.role === 'admin' ? '#E8441A' : '#2B6CB0',
                                padding:'0.2rem 0.6rem', borderRadius:'50px',
                                fontSize:'0.73rem', fontWeight:800
                              }}>
                                {u.role}
                              </span>
                            </td>
                            <td>
                              <span style={{
                                background: u.blocked ? 'rgba(229,62,62,0.1)' : 'rgba(45,158,95,0.1)',
                                color: u.blocked ? '#C53030' : '#2D9E5F',
                                padding:'0.2rem 0.6rem', borderRadius:'50px',
                                fontSize:'0.73rem', fontWeight:800
                              }}>
                                {u.blocked ? '🚫 Blocked' : '✓ Active'}
                              </span>
                            </td>
                            <td style={{ color:'#999', fontSize:'0.82rem' }}>
                              {new Date(u.created_at).toLocaleDateString()}
                            </td>
                            <td>
                              <div className="action-row">
                                <button
                                  className="btn-warning"
                                  onClick={() => toggleBlockUser(u.id)}
                                >
                                  {u.blocked ? 'Unblock' : 'Block'}
                                </button>
                                {u.role !== 'admin' && (
                                  <button className="btn-danger" onClick={() => deleteUser(u.id)}>
                                    Delete
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── ADD MENU MODAL ── */}
      {showAddMenu && (
        <div className="overlay" onClick={() => setShowAddMenu(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">➕ Add Menu Item</div>
            <form onSubmit={addMenuItem}>
              <label className="field-label">Name *</label>
              <input
                className="field-input" placeholder="e.g. Nyama Choma"
                value={menuForm.name}
                onChange={e => setMenuForm({...menuForm, name: e.target.value})}
                required
              />
              <div className="field-row">
                <div>
                  <label className="field-label">Price (KSh) *</label>
                  <input
                    className="field-input" type="number" placeholder="650"
                    value={menuForm.price}
                    onChange={e => setMenuForm({...menuForm, price: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="field-label">Category ID *</label>
                  <input
                    className="field-input" type="number" placeholder="1"
                    value={menuForm.category_id}
                    onChange={e => setMenuForm({...menuForm, category_id: e.target.value})}
                  />
                </div>
              </div>
              <label className="field-label">Description</label>
              <input
                className="field-input" placeholder="Describe the dish..."
                value={menuForm.description}
                onChange={e => setMenuForm({...menuForm, description: e.target.value})}
              />
              <label className="field-label">Image URL</label>
              <input
                className="field-input" placeholder="https://..."
                value={menuForm.image_url}
                onChange={e => setMenuForm({...menuForm, image_url: e.target.value})}
              />
              <div className="field-row">
                <div>
                  <label className="field-label">Spice Level (0-5)</label>
                  <input
                    className="field-input" type="number" min="0" max="5"
                    value={menuForm.spice_level}
                    onChange={e => setMenuForm({...menuForm, spice_level: e.target.value})}
                  />
                </div>
              </div>
              <label className="checkbox-row">
                <input
                  type="checkbox" checked={menuForm.is_vegetarian}
                  onChange={e => setMenuForm({...menuForm, is_vegetarian: e.target.checked})}
                />
                <span className="checkbox-label">🥬 Vegetarian</span>
              </label>
              <label className="checkbox-row">
                <input
                  type="checkbox" checked={menuForm.in_stock}
                  onChange={e => setMenuForm({...menuForm, in_stock: e.target.checked})}
                />
                <span className="checkbox-label">✓ In Stock</span>
              </label>
              <div style={{ display:'flex', gap:'0.8rem', marginTop:'0.5rem' }}>
                <button type="submit" className="btn-red" style={{ flex:1, padding:'0.85rem' }}>
                  Add Item 🔥
                </button>
                <button type="button" className="btn-ghost" style={{ flex:1, padding:'0.85rem' }} onClick={() => setShowAddMenu(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default Admin