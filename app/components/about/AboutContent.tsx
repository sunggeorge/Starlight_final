import React from 'react';

const AboutContent: React.FC = () => {
  return (
    // <div style={{ padding: '20px', textAlign: 'center' }}>
    //   <h1>About Us</h1>
    //   <section style={{ marginBottom: '20px' }}>
    //     <h2>Our Story</h2>
    //     <p>
    //       At STARLIGHT Nails, we believe that every detail matters. Founded in 2020, our nail salon has become a sanctuary for those seeking relaxation and beauty. With a passion for nails and a commitment to quality, we strive to create an unforgettable experience for every client.
    //     </p>
    //   </section>
    //   {/* <section style={{ marginBottom: '20px' }}>
    //     <h2>Our Mission</h2>
    //     <p>
    //       Our mission is to provide exceptional nail care services while ensuring our clients feel pampered and rejuvenated. We use only the highest quality products and prioritize hygiene and safety in every treatment.
    //     </p>
    //   </section> */}
    //   <section>
    //     <h2>Contact Us</h2>
    //     <p>
    //       <strong>STARLIGHT Nails</strong><br />
    //       Address: <br />
    //       Telephone number: <br />
    //       Email: <br />
    //       <strong>Hours of Operation:</strong><br />
    //       Open today: 10:00 am – 07:30 pm<br />
    //     </p>
    //   </section>
    // </div>


    <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>About Us</h1>
      <section style={{ marginBottom: '20px' }}>
        <h2 style={{ color: '#555' }}>Our Story</h2>
        <p style={{ lineHeight: '1.6', color: '#666' }}>
          At <strong>STARLIGHT Nails</strong>, we believe that every detail matters. Founded in 2020, our nail salon has become a sanctuary for those seeking relaxation and beauty. With a passion for nails and a commitment to quality, we strive to create an unforgettable experience for every client.
        </p>
      </section>
      <section>
        <h2 style={{ color: '#555' }}>Contact Us</h2>
        <p style={{ lineHeight: '1.6', color: '#666', margin: '10px 0' }}>
          <strong>STARLIGHT Nails</strong><br />
          Address: <br />
          Telephone number: <br />
          Email: <br />
          <strong>Hours of Operation:</strong><br />
          Open today: 10:00 am – 07:30 pm<br />
        </p>
      </section>
    </div>
  );
};

export default AboutContent;