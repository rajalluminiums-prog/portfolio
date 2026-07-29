import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CustomCursor from '../ui/CustomCursor';
import SmoothScroll from './SmoothScroll';
import WhatsAppButton from '../ui/WhatsAppButton';

export default function PublicLayout() {
  return (
    <SmoothScroll>
      <div className="min-h-screen bg-base max-w-[100vw] overflow-x-clip" style={{ cursor: 'none' }}>
        <CustomCursor />
        <Navbar />
        <Outlet />
        <Footer />
        <WhatsAppButton />
      </div>
    </SmoothScroll>
  );
}
