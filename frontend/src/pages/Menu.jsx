import { useState } from 'react'

const CATEGORIES = ['All', 'Grills', 'Street Bites', 'Mains', 'Sweet Treats', 'Drinks']

const MENU_ITEMS = [
  { id:1,  name:'Nyama Choma',    cat:'Grills',       price:650, spice:2, veg:false, desc:'Slow-roasted goat over open charcoal, served with kachumbari & ugali.',     emoji:'🥩', badge:'🔥 Bestseller' },
  { id:2,  name:'Mishkaki',       cat:'Grills',       price:200, spice:3, veg:false, desc:'Juicy beef skewers marinated in garlic, ginger, chili & lemon.',            emoji:'🍢', badge:'🔥 Spicy'      },
  { id:3,  name:'Smokie Pasua',   cat:'Street Bites', price:80,  spice:3, veg:false, desc:'Split smoked sausage stuffed with kachumbari, chili & tomato sauce.',       emoji:'🌭', badge:'⚡ Quick Bite' },
  { id:4,  name:'Samosa (3 pcs)', cat:'Street Bites', price:120, spice:1, veg:true,  desc:'Crispy golden triangles filled with spiced beef or veggies.',               emoji:'🔺', badge:'🌿 Veg'        },
  { id:5,  name:'Chips Mwitu',    cat:'Street Bites', price:100, spice:2, veg:true,  desc:'Nairobi street-style fries tossed in kachumbari, chili & lemon.',           emoji:'🍟', badge:'⚡ Quick Bite' },
  { id:6,  name:'Mutura',         cat:'Street Bites', price:150, spice:4, veg:false, desc:'Traditional Kenyan blood sausage, spiced and fire-grilled to perfection.',  emoji:'🌑', badge:'🌶️ Very Spicy' },
  { id:7,  name:'Pilau Special',  cat:'Mains',        price:280, spice:2, veg:false, desc:'Fragrant Swahili pilau rice with tender beef & whole spices.',               emoji:'🍚', badge:'🏆 Chef Pick'  },
  { id:8,  name:'Ugali & Sukuma', cat:'Mains',        price:180, spice:0, veg:true,  desc:'Hearty white maize ugali with sautéed sukuma wiki and tomatoes.',           emoji:'🌽', badge:'🌿 Veg'        },
  { id:9,  name:'Githeri Bowl',   cat:'Mains',        price:150, spice:1, veg:true,  desc:'Hearty mix of boiled maize & beans fried with tomatoes & spices.',          emoji:'🫘', badge:'💪 Filling'    },
  { id:10, name:'Mandazi (4pcs)', cat:'Sweet Treats', price:60,  spice:0, veg:true,  desc:'Fluffy East African doughnuts — coconut-kissed and lightly sweet.',         emoji:'🍩', badge:'🍯 Sweet'      },
  { id:11, name:'Mabuyu',         cat:'Sweet Treats', price:50,  spice:1, veg:true,  desc:'Baobab seeds in tangy-sweet chili sugar syrup. Nairobi nostalgia.',         emoji:'🫐', badge:'🍬 Snack'      },
  { id:12, name:'Tangawizi Chai', cat:'Drinks',       price:80,  spice:1, veg:true,  desc:'Strong masala ginger tea brewed with fresh tangawizi & spices.',            emoji:'☕', badge:'☕ Warm'        },
  { id:13, name:'Dawa Cocktail',  cat:'Drinks',       price:350, spice:0, veg:true,  desc:"Kenya's iconic honey-lime-vodka cocktail, stirred with a muddler.",         emoji:'🍹', badge:'🍹 Signature'  },
  { id:14, name:'Juice ya Matunda', cat:'Drinks',     price:100, spice:0, veg:true,  desc:'Fresh blended fruit juice — mango, passion or mix. Made to order.',        emoji:'🥤', badge:'🌿 Fresh'      },
]

const Menu = () => {
  const [activeCat, setActiveCat] = useState('All')
  const [added, setAdded] = useState({})

  const filtered = activeCat === 'All'
    ? MENU_ITEMS
    : MENU_ITEMS.filter(i => i.cat === activeCat)

  const handleAdd = (item) => {
    setAdded(prev => ({ ...prev, [item.id]: true }))
    setTimeout(() => setAdded(prev => ({ ...prev, [item.id]: false })), 1200)
  }

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

        /* Category tabs */
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

        /* Menu grid */
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
        .badge-pill {
          display: inline-block; background: rgba(232,68,26,0.1); color: #E8441A;
          font-size: 0.68rem; font-weight: 900; padding: 0.2rem 0.65rem;
          border-radius: 50px;
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
        <div className="menu-grid">
          {filtered.map(item => (
            <div key={item.id} className="menu-card">
              <div className="menu-card-img">{item.emoji}</div>
              <div className="menu-card-body">
                <div className="menu-card-top">
                  <span className="menu-card-name">{item.name}</span>
                  <span className="menu-card-price">KSh {item.price}</span>
                </div>
                <p className="menu-card-desc">{item.desc}</p>
                <div className="menu-card-meta">
                  <span className="badge-pill">{item.badge}</span>
                  {item.veg && <span className="veg-pill">🥬 Veg</span>}
                  {item.spice > 0 && <span className="spice-tag">{'🌶️'.repeat(item.spice)}</span>}
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
      </div>
    </>
  )
}

export default Menu