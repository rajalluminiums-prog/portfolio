import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiSettings, FiGrid, FiTrendingUp, FiEdit2, FiX } from 'react-icons/fi';
import type { CategoryType } from '../../components/ui/ConfigurationForm';
import api from '../../api';

interface Rate {
  _id: string;
  category: CategoryType;
  attributes: Record<string, string>;
  pricePerSqFt: number;
  minStandardSqft?: number;
  fixedPriceUnderStandard?: number;
  isActive: boolean;
}

export default function PricingManager() {
  const [rates, setRates] = useState<Rate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // New Rate Form State
  const [category, setCategory] = useState<CategoryType>('Windows');
  const [attributes, setAttributes] = useState<Record<string, string>>({});
  const [price, setPrice] = useState('');
  const [minStandardSqft, setMinStandardSqft] = useState('0');
  const [fixedPriceUnderStandard, setFixedPriceUnderStandard] = useState('0');

  useEffect(() => {
    fetchRates();
  }, []);

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
      const payload = {
        category,
        attributes,
        pricePerSqFt: Number(price),
        minStandardSqft: Number(minStandardSqft) || 0,
        fixedPriceUnderStandard: Number(fixedPriceUnderStandard) || 0
      };

      let res;
      if (editingId) {
        res = await api.put(`/api/rates/${editingId}`, payload);
      } else {
        res = await api.post('/api/rates', payload);
      }

      if (res.data.success) {
        cancelEdit();
        fetchRates();
      } else {
        alert(res.data.error);
      }
    } catch (err) {
      alert(editingId ? 'Failed to update rate' : 'Failed to save rate');
    } finally {
      setIsSaving(false);
    }
  };

  const startEdit = (rate: Rate) => {
    setEditingId(rate._id);
    setCategory(rate.category);
    setAttributes(rate.attributes);
    setPrice(rate.pricePerSqFt.toString());
    setMinStandardSqft((rate.minStandardSqft || 0).toString());
    setFixedPriceUnderStandard((rate.fixedPriceUnderStandard || 0).toString());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setCategory('Windows');
    setAttributes({});
    setPrice('');
    setMinStandardSqft('0');
    setFixedPriceUnderStandard('0');
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
    if (cat === 'Windows') return ['track', 'gauge'];
    if (cat === 'Doors') return ['material', 'sheetType', 'doorType'];
    if (cat === 'Partitions') return ['material', 'doorType'];
    if (cat === 'Profiles' || cat === 'Tuffan') return ['type'];
    return [];
  };

  const renderAttributeSelects = () => {
    const SelectWrapper = ({ label, value, onChange, options }: any) => (
      <div>
        <label className="block text-sm font-bold text-ink/70 mb-2">{label}</label>
        <div className="relative">
          <select 
            value={value} 
            onChange={onChange} 
            className="w-full px-4 py-3 rounded-xl bg-ink/5 border-2 border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-ink appearance-none cursor-pointer"
          >
            <option value="">Select {label}...</option>
            {options.map((opt: string) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>
    );

    switch (category) {
      case 'Windows':
        return (
          <>
            <SelectWrapper label="Track" value={attributes.track || ''} onChange={(e: any) => setAttributes(p => ({...p, track: e.target.value}))} options={['2T', '3T']} />
            <SelectWrapper label="Gauge / Material" value={attributes.gauge || ''} onChange={(e: any) => setAttributes(p => ({...p, gauge: e.target.value}))} options={['16G', '18G', '20G', '60mm', 'Domal']} />
          </>
        );
      case 'Doors':
        return (
          <>
            <SelectWrapper label="Material" value={attributes.material || ''} onChange={(e: any) => setAttributes(p => ({...p, material: e.target.value}))} options={['Heavy', 'Medium']} />
            <SelectWrapper label="Sheet Type" value={attributes.sheetType || ''} onChange={(e: any) => setAttributes(p => ({...p, sheetType: e.target.value}))} options={['Plain', 'Wooden']} />
            <SelectWrapper label="Door Type" value={attributes.doorType || ''} onChange={(e: any) => setAttributes(p => ({...p, doorType: e.target.value}))} options={['Sliding', 'Openable']} />
          </>
        );
      case 'Partitions':
        return (
          <>
            <SelectWrapper label="Material" value={attributes.material || ''} onChange={(e: any) => setAttributes(p => ({...p, material: e.target.value}))} options={['Novapan', 'Glass']} />
            <SelectWrapper label="Door Type" value={attributes.doorType || ''} onChange={(e: any) => setAttributes(p => ({...p, doorType: e.target.value}))} options={['Sliding', 'Openable']} />
          </>
        );
      case 'Profiles':
      case 'Tuffan':
        return (
          <SelectWrapper label="Type" value={attributes.type || ''} onChange={(e: any) => setAttributes(p => ({...p, type: e.target.value}))} options={['10mm', '12mm']} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-heading font-black tracking-tighter flex items-center gap-3">
            <span className="p-2.5 bg-primary/10 text-primary rounded-xl"><FiSettings className="text-2xl" /></span>
            Pricing Engine
          </h1>
          <p className="text-ink/60 mt-2 font-medium">Configure dynamic rates and thresholds for all product matrices.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Create Form */}
        <div className="xl:col-span-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className={`p-6 sm:p-8 rounded-[2rem] shadow-sm border transition-all duration-300 sticky top-24 ${editingId ? 'bg-primary/5 border-primary/20' : 'bg-white border-ink/5'}`}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black flex items-center gap-2 text-ink">
                {editingId ? (
                  <><FiEdit2 className="text-primary" /> Edit Rule</>
                ) : (
                  <><FiPlus className="text-primary" /> Add New Rule</>
                )}
              </h3>
              {editingId && (
                <button type="button" onClick={cancelEdit} className="text-sm font-bold text-ink/50 hover:text-ink transition-colors flex items-center gap-1">
                  <FiX /> Cancel
                </button>
              )}
            </div>
            
            <form onSubmit={handleAddRate} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-ink/70 mb-2">Category</label>
                <div className="relative">
                  <select 
                    value={category} 
                    onChange={handleCategoryChange}
                    className="w-full px-4 py-3 rounded-xl bg-ink/5 border-2 border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-ink appearance-none cursor-pointer"
                  >
                    <option value="Windows">Windows</option>
                    <option value="Doors">Doors</option>
                    <option value="Partitions">Partitions</option>
                    <option value="Profiles">Profiles</option>
                    <option value="Cabins">Cabins</option>
                    <option value="Custom">Custom</option>
                    <option value="Tuffan">Tuffan</option>
                    <option value="Fix">Fix</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Attribute Selects */}
              <AnimatePresence mode="popLayout">
                <motion.div 
                  key={category}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  {renderAttributeSelects()}
                </motion.div>
              </AnimatePresence>

              <hr className="border-ink/5 my-2" />

              <div>
                <label className="block text-sm font-bold text-ink/70 mb-2 flex items-center gap-1"><FiTrendingUp /> Price per sq ft (₹)</label>
                <input 
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 250"
                  required
                  min="0"
                  className="w-full px-4 py-3 rounded-xl bg-ink/5 border-2 border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-ink"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-ink/70 mb-2">Min Size (sqft)</label>
                  <input 
                    type="number"
                    value={minStandardSqft}
                    onChange={(e) => setMinStandardSqft(e.target.value)}
                    placeholder="e.g. 9"
                    min="0"
                    className="w-full px-4 py-3 rounded-xl bg-ink/5 border-2 border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-ink"
                  />
                  <p className="text-[10px] text-ink/50 mt-1.5 font-medium leading-tight">Threshold for flat pricing</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-ink/70 mb-2">Fixed Price (₹)</label>
                  <input 
                    type="number"
                    value={fixedPriceUnderStandard}
                    onChange={(e) => setFixedPriceUnderStandard(e.target.value)}
                    placeholder="e.g. 1500"
                    min="0"
                    className="w-full px-4 py-3 rounded-xl bg-ink/5 border-2 border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-ink"
                  />
                  <p className="text-[10px] text-ink/50 mt-1.5 font-medium leading-tight">Applied if under min size</p>
                </div>
              </div>

              <div className="pt-2">
                <button type="submit" disabled={isSaving} className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary-dark transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 text-base shadow-lg shadow-primary/20">
                  {isSaving ? 'Saving...' : (editingId ? 'Update Rule' : 'Deploy Rule')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>

        {/* Rates Table */}
        <div className="xl:col-span-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white rounded-[2rem] shadow-sm border border-ink/5 overflow-hidden"
          >
            <div className="p-6 border-b border-ink/5 flex items-center gap-2">
              <FiGrid className="text-ink/40 text-xl" />
              <h3 className="font-bold text-ink">Active Rules ({rates.length})</h3>
            </div>
            
            {isLoading ? (
              <div className="p-12 text-center text-ink/50 font-medium">Loading rules matrix...</div>
            ) : rates.length === 0 ? (
              <div className="p-12 text-center text-ink/50 font-medium">No pricing rules configured. Create one to begin.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-base/50 text-ink/50 text-xs uppercase tracking-wider font-bold">
                    <tr>
                      <th className="p-5">Category</th>
                      <th className="p-5">Matrix Configuration</th>
                      <th className="p-5">Base Rate</th>
                      <th className="p-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink/5">
                    <AnimatePresence>
                      {rates.map((rate, i) => (
                        <motion.tr 
                          key={rate._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.2, delay: i * 0.05 }}
                          className={`transition-colors group ${editingId === rate._id ? 'bg-primary/5' : 'hover:bg-primary/5'}`}
                        >
                          <td className="p-5 font-bold text-ink">{rate.category}</td>
                          <td className="p-5">
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(rate.attributes).map(([k, v]) => (
                                <span key={k} className="bg-ink/5 text-ink/70 px-2.5 py-1 rounded-md text-xs font-bold capitalize border border-ink/5">
                                  {v}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="p-5">
                            <div className="font-black text-primary text-base">₹{rate.pricePerSqFt}<span className="text-xs text-ink/40 font-normal">/sqft</span></div>
                            {rate.minStandardSqft && rate.minStandardSqft > 0 ? (
                              <div className="text-[10px] font-bold text-amber-600 mt-1 bg-amber-50 inline-block px-2 py-0.5 rounded border border-amber-100">
                                Min: {rate.minStandardSqft} sqft → ₹{rate.fixedPriceUnderStandard}
                              </div>
                            ) : null}
                          </td>
                          <td className="p-5 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => startEdit(rate)}
                                className="p-2 rounded-lg text-ink/30 hover:bg-ink/5 hover:text-ink transition-colors"
                                title="Edit Rule"
                              >
                                <FiEdit2 className="text-lg" />
                              </button>
                              <button 
                                onClick={() => handleDelete(rate._id)}
                                className="p-2 rounded-lg text-ink/30 hover:bg-red-50 hover:text-red-500 transition-colors"
                                title="Delete Rule"
                              >
                                <FiTrash2 className="text-lg" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>

      </div>
    </div>
  );
}
