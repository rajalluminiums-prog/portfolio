import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import PublicLayout from './components/layout/PublicLayout';
import AdminLayout from './components/layout/AdminLayout';
import LandingPage from './pages/public/LandingPage';
import PricingManager from './pages/admin/PricingManager';
import GalleryManager from './pages/admin/GalleryManager';
import SEO from './components/SEO';

export default function App() {
  return (
    <HelmetProvider>
      <SEO />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<PricingManager />} />
            <Route path="gallery" element={<GalleryManager />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}
