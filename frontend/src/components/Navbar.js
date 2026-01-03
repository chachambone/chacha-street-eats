import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);

  return (
    <nav className="bg-dark text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-3xl font-bold text-accent">
          Chacha Street Eats 🔥
        </Link>

        <div className="flex items-center gap-8">
          <Link to="/" className="hover:text-accent transition">Home</Link>
          <Link to="/menu" className="hover:text-accent transition">Menu</Link>
          <Link to="/cart" className="relative hover:text-accent transition">
            Cart 🛒
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-4 bg-primary text-white text-sm rounded-full w-6 h-6 flex items-center justify-center">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <span>Hello, {user.name || user.email}!</span>
              <button onClick={logout} className="bg-primary px-6 py-2 rounded-full hover:bg-red-700 transition">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link to="/login" className="bg-primary px-6 py-2 rounded-full hover:bg-red-700 transition">
                Login
              </Link>
              <Link to="/register" className="border-2 border-accent text-accent px-6 py-2 rounded-full hover:bg-accent hover:text-white transition">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;