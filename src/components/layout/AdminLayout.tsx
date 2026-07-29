import { Outlet, Link } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-base font-sans text-ink flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-ink/10 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-ink/10">
          <Link to="/" className="text-xl font-heading font-black tracking-tighter hover:text-primary transition-colors">
            RAJ<span className="font-light">ALU</span>
          </Link>
          <p className="text-xs text-text-muted mt-1 uppercase tracking-wider font-bold">Admin Panel</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/admin" className="block px-4 py-3 rounded text-sm font-medium bg-primary/5 text-primary">
            Pricing Configuration
          </Link>
          <Link to="/" className="block px-4 py-3 rounded text-sm font-medium text-ink/70 hover:bg-ink/5 hover:text-ink transition-colors mt-auto">
            ← Back to Website
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-base p-8">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
