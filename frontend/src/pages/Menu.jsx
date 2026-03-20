import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import api from '../api'

const CATEGORIES = ['All', 'Grills', 'Street Bites', 'Mains', 'Sweet Treats', 'Drinks']

const Menu = () => {
  const [menuItems, setMenuItems] = useState([])
  const [activeCat, setActiveCat] = useState('All')
  const [added,     setAdded]     = useState({})
  const [loading,   setLoading]   = useState(true)
  const { addToCart } = useCart()

  // Fetch menu from Flask
  useEffect(() => {
    api.get('/api/menu')
      .then(res => setMenuItems(res.data))
      .catch(err => {
        console.error('Menu fetch error:', err)
        setLoading(false)
      })
      .finally(() => setLoading(false))
  }, [])

  const filtered = activeCat === 'All'
    ? menuItems
    : menuItems.filter(i => i.category === activeCat)

  const handleAdd = (item) => {
    addToCart(item)
    setAdded(prev => ({ ...prev, [item.id]: true }))
    setTimeout(() => setAdded(prev => ({ ...prev, [item.id]: false })), 1200)
  }

  if (loading) return (
    <div style={{ textAlign:'center', padding:'5rem', fontFamily:'Nunito,sans-serif', color:'#999' }}>
      <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🍲</div>
      <div style={{ fontWeight:800 }}>Loading menu...</div>
    </div>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&family=Playfair+Display:wght@700&display=swap');

        .menu-page {
          padding: 3rem;
          background: #FFF8F0;
          min-height: 100vh;
          font-family: 'Nunito', sans-serif;
        }
        .menu-sec-label {
          font-size: 0.75rem; font-weight: 900; color: #E8441A;
          letter-spacing: 2px; text-transform: uppercase; margin-bottom: 0.4rem;
        }
        .menu-sec-title {
          font-family: 'Playfair Display', serif;
          font-size: 2rem; font-weight: 700; color: #1C1C1C;
          margin-bottom: 0.5rem;
        }
        .menu-sec-sub {
          color: #999; font-size: 0.9rem; font-weight: 600; margin-bottom: 2rem;
        }
        .cat-tabs {
          display: flex; gap: 0.55rem;
          flex-wrap: wrap; margin-bottom: 2rem;
        }
        .cat-tab {
          padding: 0.48rem 1.2rem; border-radius: 50px;
          border: 1.5px solid #e8dfd4; background: white;
          color: #999; font-weight: 700; font-size: 0.83rem;
          cursor: pointer; transition: all 0.2s;
          font-family: 'Nunito', sans-serif;
        }
        .cat-tab:hover { border-color: #E8441A; color: #E8441A; }
        .cat-tab.active { background: #E8441A; color: white; border-color: #E8441A; }
        .menu-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
          gap: 1.2rem;
        }
        .menu-card {
          background: white; border-radius: 20px; overflow: hidden;
          box-shadow: 0 4px 24px rgba(0,0,0,0.07);
          transition: all 0.25s; border: 1.5px solid transparent;
        }
        .menu-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 48px rgba(0,0,0,0.11);
          border-color: rgba(232,68,26,0.1);
        }
        .menu-card-img {
          width: 100%; height: 170px;
          display: flex; align-items: center; justify-content: center;
          font-size: 4.5rem;
          background: linear-gradient(135deg, #FDEBD0, #FEF3E8);
        }
        .menu-card-body { padding: 1.1rem; }
        .menu-card-top {
          display: flex; justify-content: space-between;
          align-items: flex-start; margin-bottom: 0.35rem;
        }
        .menu-card-name { font-weight: 800; font-size: 0.97rem; color: #1C1C1C; }
        .menu-card-price { font-weight: 900; font-size: 0.97rem; color: #E8441A; white-space: nowrap; }
        .menu-card-desc {
          font-size: 0.8rem; color: #999; line-height: 1.55;
          margin-bottom: 0.85rem; font-weight: 600;
        }
        .menu-card-meta {
          display: flex; align-items: center; gap: 0.5rem;
          flex-wrap: wrap; margin-bottom: 0.85rem;
        }
        .veg-pill {
          background: rgba(45,158,95,0.1); color: #2D9E5F;
          font-size: 0.7rem; font-weight: 800; padding: 0.2rem 0.6rem;
          border-radius: 50px;
        }
        .spice-tag { font-size: 0.78rem; }
        .add-to-cart-btn {
          width: 100%; padding: 0.7rem; border-radius: 12px; border: none;
          background: #E8441A; color: white;
          font-family: 'Nunito', sans-serif; font-weight: 800; font-size: 0.88rem;
          cursor: pointer; transition: all 0.2s;
        }
        .add-to-cart-btn:hover { background: #c93510; }
        .add-to-cart-btn.added { background: #2D9E5F; }

        .empty-menu {
          text-align: center; padding: 4rem 2rem; color: #999;
        }
        .empty-menu-icon { font-size: 3rem; margin-bottom: 1rem; }

        @media (max-width: 768px) {
          .menu-page { padding: 2rem 1.5rem; }
        }
      `}</style>

      <div className="menu-page">
        <div className="menu-sec-label">🍽️ Full Menu</div>
        <div className="menu-sec-title">What Would You Like?</div>
        <div className="menu-sec-sub">Fresh from Mwihoko's streets — made with love every day 🔥</div>

        {/* Category Tabs */}
        <div className="cat-tabs">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`cat-tab ${activeCat === cat ? 'active' : ''}`}
              onClick={() => setActiveCat(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        {filtered.length === 0 ? (
          <div className="empty-menu">
            <div className="empty-menu-icon">🍽️</div>
            <div style={{ fontWeight: 800, fontSize: '1rem' }}>No items in this category yet!</div>
          </div>
        ) : (
          <div className="menu-grid">
            {filtered.map(item => (
              <div key={item.id} className="menu-card">

                {/* Image or emoji fallback */}
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    style={{ width:'100%', height:'170px', objectFit:'cover' }}
                    onError={e => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                ) : null}
                <div
                  className="menu-card-img"
                  style={{ display: item.image_url ? 'none' : 'flex' }}
                >
                  🍽️
                </div>

                <div className="menu-card-body">
                  <div className="menu-card-top">
                    <span className="menu-card-name">{item.name}</span>
                    <span className="menu-card-price">KSh {item.price}</span>
                  </div>
                  <p className="menu-card-desc">{item.description}</p>
                  <div className="menu-card-meta">
                    {item.is_vegetarian && <span className="veg-pill">🥬 Veg</span>}
                    {item.spice_level > 0 && (
                      <span className="spice-tag">{'🌶️'.repeat(item.spice_level)}</span>
                    )}
                  </div>
                  <button
                    className={`add-to-cart-btn ${added[item.id] ? 'added' : ''}`}
                    onClick={() => handleAdd(item)}
                  >
                    {added[item.id] ? '✓ Added!' : 'Add to Cart 🛒'}
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default Menu