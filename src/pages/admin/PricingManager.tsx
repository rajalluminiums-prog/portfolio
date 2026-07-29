import { useState } from 'react';
import type { CategoryType } from '../../components/ui/ConfigurationForm';
import api from '../../api';
interface Rate {
  _id: string;
  category: CategoryType;
  attributes: Record<string, string>;
  pricePerSqFt: number;
  isActive: boolean;
}

export default function PricingManager() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  const [rates, setRates] = useState<Rate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // New Rate Form State
  const [category, setCategory] = useState<CategoryType>('Window');
  const [attributes, setAttributes] = useState<Record<string, string>>({});
  const [price, setPrice] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') { // Hardcoded for MVP as discussed
      setIsAuthenticated(true);
      fetchRates();
    } else {
      alert('Invalid Password');
    }
  };

  const fetchRates = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/api/rates');
      if (res.data.success) setRates(res.data.data);
    } catch (err) {
      console.error('Failed to fetch rates', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation to ensure they selected the dropdowns
    const requiredKeys = getRequiredKeys(category);
    for (const key of requiredKeys) {
      if (!attributes[key]) {
        alert(`Please select a value for ${key}`);
        return;
      }
    }

    setIsSaving(true);
    try {
      const res = await api.post('/api/rates', {
        category,
        attributes,
        pricePerSqFt: Number(price)
      });
      if (res.data.success) {
        setCategory('Window');
        setAttributes({});
        setPrice('');
        fetchRates();
      } else {
        alert(res.data.error);
      }
    } catch (err) {
      alert('Failed to save rate');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this pricing rule?')) return;
    
    try {
      const res = await api.delete(`/api/rates/${id}`);
      if (res.data.success) {
        fetchRates();
      }
    } catch (err) {
      alert('Failed to delete rate');
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value as CategoryType);
    setAttributes({}); // Reset attributes when category changes
  };

  const getRequiredKeys = (cat: CategoryType) => {
    if (cat === 'Window') return ['track', 'gauge'];
    if (cat === 'Door') return ['material', 'sheetType', 'doorType'];
    if (cat === 'Partition') return ['material', 'doorType'];
    return [];
  };

  const renderAttributeSelects = () => {
    switch (category) {
      case 'Window':
        return (
          <>
            <div>
              <label className="block text-sm font-semibold mb-1">Track</label>
              <select value={attributes.track || ''} onChange={(e) => setAttributes(p => ({...p, track: e.target.value}))} className="w-full p-2 rounded border border-ink/10 bg-base outline-none">
                <option value="">Select Track...</option>
                <option value="2T">2T</option>
                <option value="3T">3T</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Gauge / Material</label>
              <select value={attributes.gauge || ''} onChange={(e) => setAttributes(p => ({...p, gauge: e.target.value}))} className="w-full p-2 rounded border border-ink/10 bg-base outline-none">
                <option value="">Select Gauge...</option>
                <option value="16G">16G</option>
                <option value="18G">18G</option>
                <option value="20G">20G</option>
                <option value="60mm">60mm</option>
                <option value="Domal">Domal</option>
              </select>
            </div>
          </>
        );
      case 'Door':
        return (
          <>
            <div>
              <label className="block text-sm font-semibold mb-1">Material</label>
              <select value={attributes.material || ''} onChange={(e) => setAttributes(p => ({...p, material: e.target.value}))} className="w-full p-2 rounded border border-ink/10 bg-base outline-none">
                <option value="">Select Material...</option>
                <option value="Heavy">Heavy</option>
                <option value="Medium">Medium</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Sheet Type</label>
              <select value={attributes.sheetType || ''} onChange={(e) => setAttributes(p => ({...p, sheetType: e.target.value}))} className="w-full p-2 rounded border border-ink/10 bg-base outline-none">
                <option value="">Select Sheet Type...</option>
                <option value="Plain">Plain</option>
                <option value="Wooden">Wooden</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Door Type</label>
              <select value={attributes.doorType || ''} onChange={(e) => setAttributes(p => ({...p, doorType: e.target.value}))} className="w-full p-2 rounded border border-ink/10 bg-base outline-none">
                <option value="">Select Door Type...</option>
                <option value="Sliding">Sliding</option>
                <option value="Openable">Openable</option>
              </select>
            </div>
          </>
        );
      case 'Partition':
        return (
          <>
            <div>
              <label className="block text-sm font-semibold mb-1">Material</label>
              <select value={attributes.material || ''} onChange={(e) => setAttributes(p => ({...p, material: e.target.value}))} className="w-full p-2 rounded border border-ink/10 bg-base outline-none">
                <option value="">Select Material...</option>
                <option value="Novapan">Novapan</option>
                <option value="Glass">Glass</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Door Type</label>
              <select value={attributes.doorType || ''} onChange={(e) => setAttributes(p => ({...p, doorType: e.target.value}))} className="w-full p-2 rounded border border-ink/10 bg-base outline-none">
                <option value="">Select Door Type...</option>
                <option value="Sliding">Sliding</option>
                <option value="Openable">Openable</option>
              </select>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-sm border border-ink/10 max-w-sm w-full">
          <h2 className="text-2xl font-heading font-black mb-6 text-center">Admin Access</h2>
          <input 
            type="password" 
            placeholder="Enter Admin Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 rounded border border-ink/10 bg-base focus:border-primary outline-none"
          />
          <button type="submit" className="w-full bg-ink text-white py-3 rounded font-bold hover:bg-ink/90 transition">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-heading font-black">Pricing Configuration</h1>
          <p className="text-text-muted mt-1">Manage dynamic rates for all product combinations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Create Form */}
        <div className="lg:col-span-1">
          <form onSubmit={handleAddRate} className="bg-white p-6 rounded-2xl shadow-sm border border-ink/5">
            <h3 className="text-lg font-bold mb-4">Add New Rule</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Category</label>
                <select 
                  value={category} 
                  onChange={handleCategoryChange}
                  className="w-full p-2 rounded border border-ink/10 bg-base outline-none"
                >
                  <option value="Window">Window</option>
                  <option value="Door">Door</option>
                  <option value="Partition">Partition</option>
                  <option value="Fix">Fix</option>
                </select>
              </div>

              {/* Dynamic Attribute Selects */}
              {renderAttributeSelects()}

              <div>
                <label className="block text-sm font-semibold mb-1">Price per sq ft (₹)</label>
                <input 
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 250"
                  required
                  min="0"
                  className="w-full p-2 rounded border border-ink/10 bg-base outline-none"
                />
              </div>

              <button type="submit" disabled={isSaving} className="w-full bg-primary text-white py-2 rounded font-bold hover:bg-primary/90 transition disabled:opacity-50">
                {isSaving ? 'Saving...' : 'Save Rule'}
              </button>
            </div>
          </form>
        </div>

        {/* Rates Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-ink/5 overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center text-text-muted">Loading rates...</div>
            ) : rates.length === 0 ? (
              <div className="p-8 text-center text-text-muted">No pricing rules configured yet.</div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-base border-b border-ink/5 text-ink/60">
                  <tr>
                    <th className="p-4 font-semibold">Category</th>
                    <th className="p-4 font-semibold">Attributes</th>
                    <th className="p-4 font-semibold">Rate (/sq ft)</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/5">
                  {rates.map(rate => (
                    <tr key={rate._id} className="hover:bg-base/50">
                      <td className="p-4 font-medium">{rate.category}</td>
                      <td className="p-4 font-mono text-xs text-ink/60 flex flex-wrap gap-1">
                        {Object.entries(rate.attributes).map(([k, v]) => (
                          <span key={k} className="bg-ink/5 px-2 py-1 rounded">{k}: {v}</span>
                        ))}
                      </td>
                      <td className="p-4 font-bold text-primary">₹{rate.pricePerSqFt}</td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleDelete(rate._id)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
