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
      <div className="min-h-screen bg-base font-sans flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[100px] pointer-events-none animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[100px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-md"
        >
          <div className="bg-white/70 backdrop-blur-xl p-10 rounded-[2rem] shadow-2xl border border-white/50">
            <div className="text-center mb-8">
              <Link to="/" className="inline-block text-3xl font-heading font-black tracking-tighter mb-2">
                RAJ<span className="font-light">ALU</span>
              </Link>
              <h2 className="text-sm font-bold text-ink/50 uppercase tracking-widest">Admin Portal</h2>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <motion.p 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg"
                >
                  {error}
                </motion.p>
              )}
              
              <div>
                <label className="block text-xs font-bold text-ink/70 mb-2 uppercase tracking-wider">Access Key</label>
                <div className="relative">
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-5 py-4 rounded-xl border-2 border-transparent bg-white shadow-inner focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-ink font-medium tracking-widest"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-ink text-white font-bold py-4 rounded-xl hover:bg-primary transition-all duration-300 disabled:opacity-50 active:scale-[0.98] shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                {loading ? 'Authenticating...' : 'Secure Login'}
              </button>
            </form>
            
            <div className="mt-8 text-center">
              <Link to="/" className="inline-flex items-center text-sm text-ink/40 hover:text-primary transition-colors font-semibold gap-1">
                <FiHome /> Return to Website
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white/80 backdrop-blur-md">
      <div className="p-8 pb-4 flex justify-between items-center">
        <div>
          <Link to="/" className="text-2xl font-heading font-black tracking-tighter hover:text-primary transition-colors">
            RAJ<span className="font-light">ALU</span>
          </Link>
          <p className="text-[10px] text-primary mt-1 uppercase tracking-widest font-black">Admin Panel</p>
        </div>
        {isMobileMenuOpen && (
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden p-2 text-ink/50 hover:bg-ink/5 rounded-full transition-colors">
            <FiX className="text-xl" />
          </button>
        )}
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <Link to="/admin" className="relative block px-4 py-3 rounded-xl text-sm font-bold text-ink/70 hover:text-primary transition-colors group overflow-hidden">
          <span className="relative z-10">Pricing Config</span>
          {location.pathname === '/admin' && (
            <motion.div layoutId="activeNav" className="absolute inset-0 bg-primary/5 rounded-xl z-0 border border-primary/10" />
          )}
          {location.pathname !== '/admin' && (
            <div className="absolute inset-0 bg-ink/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity z-0" />
          )}
        </Link>
        <Link to="/admin/gallery" className="relative block px-4 py-3 rounded-xl text-sm font-bold text-ink/70 hover:text-primary transition-colors group overflow-hidden">
          <span className="relative z-10">Gallery Manager</span>
          {location.pathname === '/admin/gallery' && (
            <motion.div layoutId="activeNav" className="absolute inset-0 bg-primary/5 rounded-xl z-0 border border-primary/10" />
          )}
          {location.pathname !== '/admin/gallery' && (
            <div className="absolute inset-0 bg-ink/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity z-0" />
          )}
        </Link>
      </nav>

      <div className="p-4 mt-auto border-t border-ink/5 bg-base/50">
        <Link to="/" className="block px-4 py-3 rounded-xl text-sm font-bold text-ink/60 hover:bg-white hover:shadow-sm hover:text-ink transition-all flex items-center gap-2 mb-2">
          <FiHome className="text-lg" /> Back to Website
        </Link>
        <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 hover:shadow-sm transition-all flex items-center gap-2 group">
          <FiLogOut className="text-lg group-hover:-translate-x-1 transition-transform" /> Secure Logout
        </button>
      </div>
    </div>
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
      <aside className="w-72 bg-white/50 border-r border-ink/5 flex-col hidden md:flex sticky top-0 h-screen shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
            />
            <motion.aside 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-white z-50 flex flex-col md:hidden shadow-2xl"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-[#F8F9FA] p-4 md:p-10">
        <div className="max-w-7xl mx-auto pb-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
