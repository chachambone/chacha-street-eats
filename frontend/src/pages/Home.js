import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="text-center py-20 px-4">
      <h1 className="text-6xl font-bold text-primary mb-6">Chacha Street Eats</h1>
      <p className="text-2xl text-dark mb-12">Authentic Kenyan Street Food Delivered Hot 🔥</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-3xl font-bold text-accent">Nyama Choma</h3>

<grok-card data-id="aba764" data-type="image_card"  data-arg-size="LARGE" ></grok-card>

        </div>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-3xl font-bold text-accent">Samosas</h3>

<grok-card data-id="eeb818" data-type="image_card"  data-arg-size="LARGE" ></grok-card>

        </div>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-3xl font-bold text-accent">Smokie Pasua</h3>

<grok-card data-id="058d9b" data-type="image_card"  data-arg-size="LARGE" ></grok-card>

        </div>
      </div>
      <Link to="/menu" className="mt-12 inline-block bg-primary text-white text-2xl px-12 py-6 rounded-full hover:bg-red-700 transition">
        Order Now 🍲
      </Link>
    </div>
  );
};

export default Home;
