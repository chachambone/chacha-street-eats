import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../api'

const STATUS_COLORS = {
  pending:          { bg: '#fff3cd', color: '#856404' },
  processing:       { bg: '#cce5ff', color: '#004085' },
  out_for_delivery: { bg: '#d4edda', color: '#155724' },
  delivered:        { bg: '#d1ecf1', color: '#0c5460' },
  cancelled:        { bg: '#f8d7da', color: '#721c24' },
}

const TABS = ['Dashboard', 'Orders', 'Users', 'Menu']

export default function Admin() {
  const { user } = useAuth()
  const navigate  = useNavigate()

  const [tab,        setTab]        = useState('Dashboard')
  const [stats,      setStats]      = useState(null)
  const [orders,     setOrders]     = useState([])
  const [users,      setUsers]      = useState([])
  const [menuItems,  setMenuItems]  = useState([])
  const [categories, setCategories] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState('')

  // Menu form state
  const [showForm,   setShowForm]   = useState(false)
  const [editItem,   setEditItem]   = useState(null)
  const [form, setForm] = useState({
    name: '', price: '', category_id: '', description: '',
    image_url: '', in_stock: true, spice_level: 0, is_vegetarian: false,
  })

  // Redirect non-admins
  useEffect(() => {
    if (user && user.role !== 'admin') navigate('/')
    if (!user) navigate('/login')
  }, [user])

  // Fetch data based on active tab
  useEffect(() => {
    if (!user || user.role !== 'admin') return
    setLoading(true)
    setError('')

    const fetches = {
      Dashboard: () => api.get('/api/admin/stats').then(r => setStats(r.data)),
      Orders:    () => api.get('/api/admin/orders').then(r => setOrders(r.data)),
      Users:     () => api.get('/api/admin/users').then(r => setUsers(r.data)),
      Menu:      () => Promise.all([
        api.get('/api/admin/menu').then(r => setMenuItems(r.data)),
        api.get('/api/categories').then(r => setCategories(r.data)),
      ]),
    }

    fetches[tab]()
      .catch(() => setError('Failed to load data'))
      .finally(() => setLoading(false))
  }, [tab, user])

  const updateOrderStatus = async (id, status) => {
    await api.patch(`/api/admin/orders/${id}/status`, { status })
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
  }

  const toggleBlock = async (id) => {
    const res = await api.patch(`/api/admin/users/${id}/block`)
    setUsers(prev => prev.map(u => u.id === id ? res.data.user : u))
  }

  const deleteUser = async (id) => {
    if (!confirm('Delete this user?')) return
    await api.delete(`/api/admin/users/${id}`)
    setUsers(prev => prev.filter(u => u.id !== id))
  }

  const openAddForm = () => {
    setEditItem(null)
    setForm({ name: '', price: '', category_id: '', description: '', image_url: '', in_stock: true, spice_level: 0, is_vegetarian: false })
    setShowForm(true)
  }

  const openEditForm = (item) => {
    setEditItem(item)
    setForm({
      name: item.name, price: item.price, category_id: item.category?.id || '',
      description: item.description || '', image_url: item.image_url || '',
      in_stock: item.in_stock, spice_level: item.spice_level, is_vegetarian: item.is_vegetarian,
    })
    setShowForm(true)
  }

  const submitMenuItem = async () => {
    try {
      if (editItem) {
        const res = await api.patch(`/api/admin/menu/${editItem.id}`, form)
        setMenuItems(prev => prev.map(i => i.id === editItem.id ? res.data.item : i))
      } else {
        const res = await api.post('/api/admin/menu', form)
        setMenuItems(prev => [...prev, res.data.item])
      }
      setShowForm(false)
    } catch {
      alert('Failed to save menu item')
    }
  }

  const deleteMenuItem = async (id) => {
    if (!confirm('Delete this menu item?')) return
    await api.delete(`/api/admin/menu/${id}`)
    setMenuItems(prev => prev.filter(i => i.id !== id))
  }

  if (!user || user.role !== 'admin') return null

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&family=Playfair+Display:wght@700&display=swap');

        .admin-wrap { min-height: 100vh; background: #f5f6fa; font-family: 'Nunito', sans-serif; }

        /* HEADER */
        .admin-header {
          background: #E8441A; color: white;
          padding: 1.5rem 2.5rem;
          display: flex; align-items: center; justify-content: space-between;
        }
        .admin-header h1 { font-family: 'Playfair Display', serif; font-size: 1.5rem; }
        .admin-header p  { font-size: 0.82rem; opacity: 0.8; margin-top: 0.2rem; }

        /* TABS */
        .admin-tabs {
          background: white; border-bottom: 2px solid #f0f0f0;
          display: flex; padding: 0 2.5rem; gap: 0;
        }
        .admin-tab {
          padding: 1rem 1.5rem; font-weight: 800; font-size: 0.9rem;
          color: #999; cursor: pointer; border: none; background: none;
          border-bottom: 3px solid transparent; margin-bottom: -2px;
          transition: all 0.2s; font-family: 'Nunito', sans-serif;
        }
        .admin-tab:hover { color: #E8441A; }
        .admin-tab.active { color: #E8441A; border-bottom-color: #E8441A; }

        /* CONTENT */
        .admin-content { padding: 2rem 2.5rem; }

        /* STAT CARDS */
        .stats-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.2rem; margin-bottom: 2rem;
        }
        .stat-card {
          background: white; border-radius: 16px; padding: 1.5rem;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          display: flex; align-items: center; gap: 1rem;
        }
        .stat-icon {
          width: 52px; height: 52px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.4rem; flex-shrink: 0;
        }
        .stat-num { font-size: 1.7rem; font-weight: 900; color: #1C1C1C; line-height: 1; }
        .stat-label { font-size: 0.78rem; color: #999; font-weight: 700; margin-top: 0.2rem; }

        /* RECENT ORDERS TABLE */
        .table-wrap {
          background: white; border-radius: 16px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06); overflow: hidden;
        }
        .table-head {
          padding: 1.2rem 1.5rem; border-bottom: 1px solid #f0f0f0;
          display: flex; align-items: center; justify-content: space-between;
        }
        .table-head h3 { font-size: 1rem; font-weight: 800; color: #1C1C1C; }
        table { width: 100%; border-collapse: collapse; }
        th {
          text-align: left; padding: 0.9rem 1.2rem;
          font-size: 0.72rem; font-weight: 900; color: #999;
          text-transform: uppercase; letter-spacing: 0.5px;
          background: #fafafa; border-bottom: 1px solid #f0f0f0;
        }
        td {
          padding: 0.9rem 1.2rem; font-size: 0.87rem;
          font-weight: 700; color: #1C1C1C;
          border-bottom: 1px solid #f9f9f9;
        }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: #fafafa; }

        /* STATUS BADGE */
        .status-badge {
          display: inline-block; padding: 0.25rem 0.75rem;
          border-radius: 50px; font-size: 0.72rem; font-weight: 900;
          text-transform: capitalize;
        }

        /* STATUS SELECT */
        .status-select {
          border: 1.5px solid #e8dfd4; border-radius: 8px;
          padding: 0.3rem 0.6rem; font-family: 'Nunito', sans-serif;
          font-size: 0.8rem; font-weight: 700; color: #1C1C1C;
          background: white; cursor: pointer;
        }
        .status-select:focus { outline: none; border-color: #E8441A; }

        /* BUTTONS */
        .btn-primary {
          background: #E8441A; color: white; border: none;
          padding: 0.6rem 1.3rem; border-radius: 10px;
          font-family: 'Nunito', sans-serif; font-size: 0.85rem;
          font-weight: 800; cursor: pointer; transition: all 0.2s;
        }
        .btn-primary:hover { background: #c93510; }

        .btn-danger {
          background: #fff5f5; color: #e53e3e; border: 1px solid #fecaca;
          padding: 0.4rem 0.9rem; border-radius: 8px;
          font-family: 'Nunito', sans-serif; font-size: 0.78rem;
          font-weight: 800; cursor: pointer; transition: all 0.2s;
        }
        .btn-danger:hover { background: #fed7d7; }

        .btn-warning {
          background: #fffbeb; color: #d97706; border: 1px solid #fde68a;
          padding: 0.4rem 0.9rem; border-radius: 8px;
          font-family: 'Nunito', sans-serif; font-size: 0.78rem;
          font-weight: 800; cursor: pointer; transition: all 0.2s;
        }
        .btn-warning:hover { background: #fef3c7; }

        .btn-edit {
          background: #eff6ff; color: #3b82f6; border: 1px solid #bfdbfe;
          padding: 0.4rem 0.9rem; border-radius: 8px;
          font-family: 'Nunito', sans-serif; font-size: 0.78rem;
          font-weight: 800; cursor: pointer; transition: all 0.2s;
        }
        .btn-edit:hover { background: #dbeafe; }

        .btn-actions { display: flex; gap: 0.5rem; }

        /* MODAL */
        .modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.5);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000; padding: 1rem;
        }
        .modal {
          background: white; border-radius: 20px; padding: 2rem;
          width: 100%; max-width: 520px; max-height: 90vh; overflow-y: auto;
        }
        .modal h3 { font-size: 1.2rem; font-weight: 800; margin-bottom: 1.5rem; color: #1C1C1C; }
        .form-group { margin-bottom: 1rem; }
        .form-label {
          display: block; font-size: 0.75rem; font-weight: 900;
          color: #1C1C1C; margin-bottom: 0.3rem; text-transform: uppercase;
        }
        .form-input {
          width: 100%; padding: 0.75rem 1rem;
          border: 1.5px solid #e8dfd4; border-radius: 10px;
          font-family: 'Nunito', sans-serif; font-size: 0.9rem; font-weight: 700;
          color: #1C1C1C; background: #FFF8F0; outline: none;
          transition: border-color 0.2s;
        }
        .form-input:focus { border-color: #E8441A; background: white; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .form-check { display: flex; align-items: center; gap: 0.5rem; font-weight: 700; font-size: 0.88rem; }
        .modal-actions { display: flex; gap: 1rem; margin-top: 1.5rem; }
        .btn-cancel {
          flex: 1; padding: 0.8rem; border-radius: 10px;
          border: 1.5px solid #ddd; background: white; color: #999;
          font-family: 'Nunito', sans-serif; font-weight: 700; cursor: pointer;
        }
        .btn-save {
          flex: 1; padding: 0.8rem; border-radius: 10px;
          border: none; background: #E8441A; color: white;
          font-family: 'Nunito', sans-serif; font-weight: 800; cursor: pointer;
        }
        .btn-save:hover { background: #c93510; }

        /* MENU GRID */
        .menu-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 1.2rem;
        }
        .menu-card {
          background: white; border-radius: 16px; overflow: hidden;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06); border: 1.5px solid #f5ece0;
        }
        .menu-card img { width: 100%; height: 140px; object-fit: cover; }
        .menu-card-body { padding: 1rem; }
        .menu-card-name { font-weight: 800; font-size: 0.95rem; color: #1C1C1C; margin-bottom: 0.3rem; }
        .menu-card-price { font-weight: 900; color: #E8441A; font-size: 0.95rem; }
        .menu-card-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 0.8rem; }

        .err { color: #e53e3e; background: #fff5f5; border: 1px solid #fecaca; padding: 0.7rem 1rem; border-radius: 10px; font-size: 0.85rem; margin-bottom: 1rem; }
        .loading { text-align: center; padding: 3rem; color: #999; font-size: 0.95rem; font-weight: 700; }

        @media (max-width: 768px) {
          .admin-content { padding: 1.5rem; }
          .admin-header { padding: 1.2rem 1.5rem; }
          .admin-tabs { padding: 0 1rem; }
          .form-row { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="admin-wrap">

        {/* HEADER */}
        <div className="admin-header">
          <div>
            <h1>🔥 Chacha Admin Panel</h1>
            <p>Welcome back, {user.username}! Manage your restaurant here.</p>
          </div>
          <span style={{ fontSize: '0.82rem', opacity: 0.75 }}>
            {new Date().toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>

        {/* TABS */}
        <div className="admin-tabs">
          {TABS.map(t => (
            <button key={t} className={`admin-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              { t === 'Dashboard' ? '📊' : t === 'Orders' ? '📦' : t === 'Users' ? '👥' : '🍽️' } {t}
            </button>
          ))}
        </div>

        <div className="admin-content">
          {error   && <div className="err">⚠️ {error}</div>}
          {loading && <div className="loading">Loading...</div>}

          {/* ── DASHBOARD ── */}
          {!loading && tab === 'Dashboard' && stats && (
            <>
              <div className="stats-grid">
                {[
                  { icon: '👥', label: 'Total Users',    num: stats.total_users,    bg: '#e0f2fe', color: '#0369a1' },
                  { icon: '📦', label: 'Total Orders',   num: stats.total_orders,   bg: '#dcfce7', color: '#16a34a' },
                  { icon: '⏳', label: 'Pending Orders', num: stats.pending_orders, bg: '#fef9c3', color: '#ca8a04' },
                  { icon: '🍽️', label: 'Menu Items',     num: stats.total_menu,     bg: '#fce7f3', color: '#be185d' },
                  { icon: '💰', label: 'Total Revenue',  num: `KSh ${stats.total_revenue.toLocaleString()}`, bg: '#fff7ed', color: '#ea580c' },
                ].map((s, i) => (
                  <div key={i} className="stat-card">
                    <div className="stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
                    <div>
                      <div className="stat-num">{s.num}</div>
                      <div className="stat-label">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="table-wrap">
                <div className="table-head"><h3>🕐 Recent Orders</h3></div>
                <table>
                  <thead>
                    <tr><th>Order #</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr>
                  </thead>
                  <tbody>
                    {stats.recent_orders.map(o => (
                      <tr key={o.id}>
                        <td>#{o.id}</td>
                        <td>{o.shipping_info?.phone || '—'}</td>
                        <td>KSh {o.total_price}</td>
                        <td>
                          <span className="status-badge" style={STATUS_COLORS[o.status] || {}}>
                            {o.status}
                          </span>
                        </td>
                        <td>{new Date(o.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ── ORDERS ── */}
          {!loading && tab === 'Orders' && (
            <div className="table-wrap">
              <div className="table-head">
                <h3>📦 All Orders ({orders.length})</h3>
              </div>
              <table>
                <thead>
                  <tr><th>Order #</th><th>Address</th><th>Phone</th><th>Payment</th><th>Total</th><th>Status</th><th>Date</th></tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id}>
                      <td>#{o.id}</td>
                      <td style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {o.shipping_info?.address || '—'}
                      </td>
                      <td>{o.shipping_info?.phone || '—'}</td>
                      <td style={{ textTransform: 'capitalize' }}>{o.shipping_info?.payment || '—'}</td>
                      <td>KSh {o.total_price}</td>
                      <td>
                        <select
                          className="status-select"
                          value={o.status}
                          onChange={e => updateOrderStatus(o.id, e.target.value)}
                        >
                          {['pending','processing','out_for_delivery','delivered','cancelled'].map(s => (
                            <option key={s} value={s}>{s.replace(/_/g,' ')}</option>
                          ))}
                        </select>
                      </td>
                      <td>{new Date(o.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── USERS ── */}
          {!loading && tab === 'Users' && (
            <div className="table-wrap">
              <div className="table-head">
                <h3>👥 All Users ({users.length})</h3>
              </div>
              <table>
                <thead>
                  <tr><th>ID</th><th>Username</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td>#{u.id}</td>
                      <td>{u.username}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className="status-badge" style={{ background: u.role === 'admin' ? '#fce7f3' : '#f0fdf4', color: u.role === 'admin' ? '#be185d' : '#16a34a' }}>
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <span className="status-badge" style={{ background: u.blocked ? '#fef2f2' : '#f0fdf4', color: u.blocked ? '#dc2626' : '#16a34a' }}>
                          {u.blocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td>{u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}</td>
                      <td>
                        <div className="btn-actions">
                          <button className="btn-warning" onClick={() => toggleBlock(u.id)}>
                            {u.blocked ? 'Unblock' : 'Block'}
                          </button>
                          {u.role !== 'admin' && (
                            <button className="btn-danger" onClick={() => deleteUser(u.id)}>Delete</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── MENU ── */}
          {!loading && tab === 'Menu' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontWeight: 800, fontSize: '1.1rem' }}>🍽️ Menu Items ({menuItems.length})</h3>
                <button className="btn-primary" onClick={openAddForm}>+ Add Item</button>
              </div>
              <div className="menu-grid">
                {menuItems.map(item => (
                  <div key={item.id} className="menu-card">
                    {item.image_url
                      ? <img src={item.image_url} alt={item.name} onError={e => e.target.style.display='none'} />
                      : <div style={{ height: 140, background: 'linear-gradient(135deg,#FDEBD0,#FEF3E8)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'3rem' }}>🍽️</div>
                    }
                    <div className="menu-card-body">
                      <div className="menu-card-name">{item.name}</div>
                      <div style={{ fontSize: '0.78rem', color: '#999', marginBottom: '0.3rem' }}>{item.description}</div>
                      <div className="menu-card-footer">
                        <span className="menu-card-price">KSh {item.price}</span>
                        <div className="btn-actions">
                          <button className="btn-edit" onClick={() => openEditForm(item)}>Edit</button>
                          <button className="btn-danger" onClick={() => deleteMenuItem(item.id)}>Delete</button>
                        </div>
                      </div>
                      <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <span className="status-badge" style={{ background: item.in_stock ? '#f0fdf4' : '#fef2f2', color: item.in_stock ? '#16a34a' : '#dc2626' }}>
                          {item.in_stock ? 'In Stock' : 'Out of Stock'}
                        </span>
                        {item.is_vegetarian && <span className="status-badge" style={{ background: '#f0fdf4', color: '#16a34a' }}>🥬 Veg</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── MENU ITEM MODAL ── */}
      {showForm && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="modal">
            <h3>{editItem ? '✏️ Edit Menu Item' : '➕ Add Menu Item'}</h3>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Name *</label>
                <input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Nyama Choma" />
              </div>
              <div className="form-group">
                <label className="form-label">Price (KSh) *</label>
                <input className="form-input" type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="e.g. 350" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Category *</label>
              <select className="form-input" value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})}>
                <option value="">Select category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <input className="form-input" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Short description" />
            </div>

            <div className="form-group">
              <label className="form-label">Image URL</label>
              <input className="form-input" value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} placeholder="https://..." />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Spice Level (0–5)</label>
                <input className="form-input" type="number" min="0" max="5" value={form.spice_level} onChange={e => setForm({...form, spice_level: e.target.value})} />
              </div>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '0.6rem', paddingBottom: '0.2rem' }}>
                <label className="form-check">
                  <input type="checkbox" checked={form.in_stock} onChange={e => setForm({...form, in_stock: e.target.checked})} />
                  In Stock
                </label>
                <label className="form-check">
                  <input type="checkbox" checked={form.is_vegetarian} onChange={e => setForm({...form, is_vegetarian: e.target.checked})} />
                  Vegetarian
                </label>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="btn-save" onClick={submitMenuItem}>{editItem ? 'Save Changes' : 'Add Item'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
