import React from 'react';

const AboutContent: React.FC = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      
      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ 
          color: '#333', 
          fontSize: '1.8rem',
          marginBottom: '20px',
          fontWeight: '500'
        }}>Our Story</h2>
        <p style={{ lineHeight: '1.8', color: '#666', fontSize: '1.1rem' }}>
          At <strong>HANNA Nail Salon</strong>, we believe that every detail matters. Founded in 2020, our nail salon has become a sanctuary for those seeking relaxation and beauty. With a passion for nails and a commitment to quality, we strive to create an unforgettable experience for every client.
        </p>
      </section>
      
      <section>
        <h2 style={{ 
          color: '#333', 
          fontSize: '1.8rem',
          marginBottom: '20px',
          fontWeight: '500'
        }}>Contact Us</h2>

        <p style={{ lineHeight: '1.8', color: '#666', margin: '15px auto', fontSize: '1.1rem', textAlign: 'left', maxWidth: '600px' }}>
          <strong style={{ display: 'block', textAlign: 'center' }}>HANNA Nail Salon</strong>
          <span style={{ display: 'block' }}>
            Address: 97 Rua de Pereira, 4th Floor, Shop T, Yuhow Building, Macau.<br />
            Telephone number: +853 6555 8867<br />
            Email: hanna_beauty_studio_macau@gmail.com<br />
            <br />
            <strong style={{ display: 'block', textAlign: 'center' }}>Hours of Operation:</strong>
            Open today: 10:00 am – 07:30 pm<br />
          </span>
        </p>
      </section>
    </div>
  );
};

export default AboutContent;
