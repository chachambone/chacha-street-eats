import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/menu'); // Redirect to menu after login
    } catch (err) {
      setError('Invalid email or password 😔');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full">
        <h2 className="text-4xl font-bold text-center text-primary mb-8">Login to Chacha 🔥</h2>
        
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-6 py-4 border-2 border-gray-300 rounded-full focus:border-primary outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-6 py-4 border-2 border-gray-300 rounded-full focus:border-primary outline-none"
          />
          <button type="submit" className="w-full bg-primary text-white py-4 rounded-full text-xl font-bold hover:bg-red-700 transition">
            Login
          </button>
        </form>
        
        <p className="text-center mt-6 text-gray-600">
          No account? <Link to="/register" className="text-accent font-bold hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;