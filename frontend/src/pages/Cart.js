import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cart } = useContext(CartContext);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="text-center py-20 px-4">
        <h2 className="text-5xl font-bold text-primary mb-8">Your Cart is Empty 🛒</h2>
        <Link to="/menu" className="bg-primary text-white px-12 py-6 rounded-full text-3xl hover:bg-red-700 transition inline-block">
          Back to Menu 🔥
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 max-w-6xl mx-auto">
      <h1 className="text-5xl font-bold text-center text-primary mb-12">Your Cart 🛒</h1>
      
      <div className="space-y-8">
        {cart.map(item => (
          <div key={item.id} className="bg-white rounded-2xl shadow-xl p-8 flex flex-col md:flex-row items-center gap-8">
            <img src={item.image_url} alt={item.name} className="w-48 h-48 object-cover rounded-xl" />
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-3xl font-bold mb-2">{item.name}</h3>
              <p className="text-xl text-gray-600 mb-4">KSh {item.price} each</p>
              <p className="text-2xl">Quantity: {item.quantity}</p>
            </div>
            <p className="text-3xl font-bold text-primary">KSh {item.price * item.quantity}</p>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-16 bg-white rounded-2xl shadow-xl p-8">
        <p className="text-5xl font-bold text-primary mb-8">Total: KSh {total}</p>
        <button className="bg-accent text-white px-20 py-8 rounded-full text-4xl font-bold hover:bg-orange-600 transition">
          Proceed to Checkout 🍲
        </button>
      </div>
    </div>
  );
};

export default Cart;