import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiLogOut, FiHome } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api';

export default function AdminLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) setIsAuthenticated(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Using API baseURL for full deployment portability
      const res = await api.post('/api/gallery/login', { password });
      if (res.data.success) {
        localStorage.setItem('adminToken', res.data.token);
        setIsAuthenticated(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Check server connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-base font-sans flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm border border-ink/5">
          <h2 className="text-2xl font-heading font-black mb-6 text-center">Admin Access</h2>
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          <div className="mb-6">
            <label className="block text-sm font-bold text-ink/70 mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-ink/10 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              placeholder="Enter admin password"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-ink text-white font-bold py-3 rounded-xl hover:bg-ink/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Login'}
          </button>
          <Link to="/" className="block mt-4 text-center text-sm text-ink/60 hover:text-ink">
            ← Return to Website
          </Link>
        </form>
      </div>
    );
  }

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-ink/10 flex justify-between items-center">
        <div>
          <Link to="/" className="text-xl font-heading font-black tracking-tighter hover:text-primary transition-colors">
            RAJ<span className="font-light">ALU</span>
          </Link>
          <p className="text-xs text-text-muted mt-1 uppercase tracking-wider font-bold">Admin Panel</p>
        </div>
        {isMobileMenuOpen && (
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden p-2 text-ink/70 hover:bg-ink/5 rounded-lg">
            <FiX className="text-xl" />
          </button>
        )}
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        <Link to="/admin" className="block px-4 py-3 rounded text-sm font-medium hover:bg-primary/5 text-ink/70 hover:text-primary transition-colors">
          Pricing Configuration
        </Link>
        <Link to="/admin/gallery" className="block px-4 py-3 rounded text-sm font-medium hover:bg-primary/5 text-ink/70 hover:text-primary transition-colors">
          Gallery Manager
        </Link>
        <div className="pt-8 mt-auto">
          <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded text-sm font-medium text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2">
            <FiLogOut /> Logout
          </button>
          <Link to="/" className="block px-4 py-3 rounded text-sm font-medium text-ink/70 hover:bg-ink/5 hover:text-ink transition-colors mt-2 flex items-center gap-2">
            <FiHome /> Back to Website
          </Link>
        </div>
      </nav>
    </>
  );

  return (
    <div className="min-h-screen bg-base font-sans text-ink flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-ink/10 p-4 flex justify-between items-center sticky top-0 z-40">
        <Link to="/" className="text-xl font-heading font-black tracking-tighter">
          RAJ<span className="font-light">ALU</span>
        </Link>
        <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-ink hover:bg-ink/5 rounded-lg transition-colors">
          <FiMenu className="text-2xl" />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r border-ink/10 flex-col hidden md:flex sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
            />
            <motion.aside 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed top-0 left-0 bottom-0 w-64 bg-white z-50 flex flex-col md:hidden shadow-2xl"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-base p-4 md:p-8">
        <div className="max-w-6xl mx-auto pb-20">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
