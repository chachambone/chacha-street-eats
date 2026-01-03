import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post('/api/auth/register', formData);
      setSuccess('Registered successfully! 🎉 Now login.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full">
        <h2 className="text-4xl font-bold text-center text-primary mb-8">Join Chacha Street Eats 🇰🇪</h2>
        
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        {success && <p className="text-green-600 text-center mb-4">{success}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required className="w-full px-6 py-4 border-2 border-gray-300 rounded-full focus:border-primary outline-none" />
          <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full px-6 py-4 border-2 border-gray-300 rounded-full focus:border-primary outline-none" />
          <input name="phone" placeholder="Phone (optional)" value={formData.phone} onChange={handleChange} className="w-full px-6 py-4 border-2 border-gray-300 rounded-full focus:border-primary outline-none" />
          <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="w-full px-6 py-4 border-2 border-gray-300 rounded-full focus:border-primary outline-none" />
          <button type="submit" className="w-full bg-primary text-white py-4 rounded-full text-xl font-bold hover:bg-red-700 transition">
            Register
          </button>
        </form>
        
        <p className="text-center mt-6 text-gray-600">
          Already have an account? <Link to="/login" className="text-accent font-bold hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;