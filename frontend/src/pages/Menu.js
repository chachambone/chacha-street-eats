import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { CartContext } from '../context/CartContext';

const Menu = () => {
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCat, setActiveCat] = useState('all');
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    axios.get('/api/menu').then(res => setMenu(res.data));
    axios.get('/api/categories').then(res => setCategories(res.data));
  }, []);

  const filtered = activeCat === 'all' ? menu : menu.filter(item => item.category === activeCat);

  return (
    <div className="py-12 px-4 max-w-7xl mx-auto">
      <h1 className="text-5xl font-bold text-center text-primary mb-12">Our Menu 🔥</h1>
      
      <div className="flex justify-center gap-4 mb-12 flex-wrap">
        <button onClick={() => setActiveCat('all')} className={`px-8 py-3 rounded-full ${activeCat === 'all' ? 'bg-primary text-white' : 'bg-gray-200'}`}>All</button>
        {categories.map(cat => (
          <button key={cat.id} onClick={() => setActiveCat(cat.name)} className={`px-8 py-3 rounded-full ${activeCat === cat.name ? 'bg-primary text-white' : 'bg-gray-200'}`}>
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filtered.map(item => (
          <div key={item.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition">
            <img src={item.image_url} alt={item.name} className="w-full h-64 object-cover" />
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2">{item.name}</h3>
              <p className="text-gray-600 mb-4">{item.description}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-3xl font-bold text-primary">KSh {item.price}</span>
                <span className="text-xl">{'🌶️'.repeat(item.spice_level)}</span>
              </div>
              {item.is_vegetarian && <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">🥬 Veg</span>}
              <button onClick={() => addToCart(item)} className="mt-6 w-full bg-accent text-white py-4 rounded-full hover:bg-orange-600 transition text-xl font-bold">
                Add to Cart 🛒
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;