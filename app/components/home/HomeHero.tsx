import React from 'react';

const HomeHero: React.FC = () => {
  return (
  <div className="hero min-h-screen"
    style={{
      backgroundImage: "url('/images/hero.jpg')",
    }}>
    <div className="hero-overlay bg-opacity-60"></div>
    <div className="hero-content text-neutral-content text-center">
      <div className="max-w-md">
        <h1 className="mb-5 text-5xl font-bold">Quality Nails For Every Age</h1>
        <p className="mb-5">Discover nail care services and products that combine luxury treatments with everyday affordability for all ages.</p>
        <a href="/gallery" className="btn btn-primary">View Gallery</a>
      </div>
    </div>
  </div>
  );
};

export default HomeHero;
