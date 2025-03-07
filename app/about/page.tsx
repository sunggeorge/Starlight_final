// app/about/page.tsx

import AboutContent from '../components/about/AboutContent';

export const metadata = {
  title: 'Nail Shop Online System - About Us',
  description: 'Nail Shop Online System about description',
  keywords: 'next, next.js, react, app, booking',
};

export default function AboutPage() {
  return (
    <main className="about flex flex-col flex-grow w-full">
      <AboutContent/>
    </main>
  );
}
