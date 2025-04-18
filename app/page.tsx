import HomeServicesCategories from './components/home/HomeServicesCategories';
import HomePopularServices from './components/home/HomePopularServices';
import HomeCarousel from './components/home/HomeCarousel';
import HomeHero from './components/home/HomeHero';

export const metadata = {
  title: 'Nail Shop Online System - Home',
  description: 'Nail Shop Online System description',
  keywords: 'next, next.js, react, app, booking',
};

// HomePage
const Home = () => {
  return (
    <div className="home w-full">
      <HomeHero />
      <div className="container mx-auto">
        <HomeServicesCategories title="Categories" />
        <HomePopularServices title="Popular Technicians" />
      </div>
      <HomeCarousel />
    </div>
  );
};

export default Home;
