import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import SEOHead from './SEOHead';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead />
      <Navbar />
      <main className="flex-1 pt-[60px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
