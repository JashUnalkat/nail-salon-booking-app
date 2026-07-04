import React from 'react';
import './Home.scss';

function Home() {
  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-overlay">
          <p className="subtitle">Your favourite nail salon in London Ontario</p>
          <h1>Ontario Centre Nails and Spa</h1>
          <p className="description">
            Experience premium nail care crafted by experienced technicians.
          </p>
          <button className="cta-button" onClick={() => window.location.href='/book'}>
            BOOK AN APPOINTMENT 
          </button>
        </div>
      </section>
    </div>
  );
}
export default Home;