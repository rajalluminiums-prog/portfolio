import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, DoorOpen, Columns3, Maximize } from 'lucide-react';

export type CategoryType = 'Window' | 'Door' | 'Partition' | 'Fix' | 'Profile' | 'Windows' | 'Doors' | 'Partitions' | 'Profiles' | 'Cabins' | 'Custom' | 'Tuffan' | '';

export interface QuoteDimensions {
  widthFeet: number;
  widthInches: number;
  heightFeet: number;
  heightInches: number;
}

interface ConfigurationFormProps {
  onSpecsChange: (specs: { category: CategoryType, attributes: Record<string, string>, dimensions: QuoteDimensions }) => void;
}

const CATEGORIES = [
  { id: 'Window', label: 'Window', icon: LayoutGrid },
  { id: 'Door', label: 'Door', icon: DoorOpen },
  { id: 'Partition', label: 'Partition', icon: Columns3 },
  { id: 'Fix', label: 'Fix (Frame)', icon: Maximize },
];

const ATTRIBUTE_OPTIONS = {
  Window: [
    { id: 'track', label: 'Track System', options: ['2T', '3T'] },
    { id: 'gauge', label: 'Gauge', options: ['18G', '20G', '60mm', 'Domal'] },
  ],
  Door: [
    { id: 'material', label: 'Frame Type', options: ['Heavy', 'Medium'] },
    { id: 'sheetType', label: 'Sheet Type', options: ['Plain', 'Wooden'] },
    { id: 'doorType', label: 'Style', options: ['Sliding', 'Openable'] },
  ],
  Partition: [
    { id: 'material', label: 'Material', options: ['Novapan', 'Glass'] },
    { id: 'doorType', label: 'Door Style', options: ['Sliding', 'Openable'] },
  ],
  Fix: [],
  Profile: []
};

export default function ConfigurationForm({ onSpecsChange }: ConfigurationFormProps) {
  const [category, setCategory] = useState<CategoryType>('');
  const [attributes, setAttributes] = useState<Record<string, string>>({});
  const [dimensions, setDimensions] = useState<QuoteDimensions>({ widthFeet: 0, widthInches: 0, heightFeet: 0, heightInches: 0 });

  useEffect(() => {
    if (category && (dimensions.widthFeet > 0 || dimensions.widthInches > 0) && (dimensions.heightFeet > 0 || dimensions.heightInches > 0)) {
      onSpecsChange({ category, attributes, dimensions });
    }
  }, [category, attributes, dimensions, onSpecsChange]);

  const handleCategorySelect = (c: CategoryType) => {
    setCategory(c);
    setAttributes({}); 
  };

  const handleAttributeSelect = (key: string, value: string) => {
    setAttributes(prev => ({ ...prev, [key]: value }));
  };

  const handleDimensionChange = (field: keyof QuoteDimensions, value: number) => {
    const numValue = Math.max(0, value || 0);
    setDimensions(prev => ({ ...prev, [field]: numValue }));
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Category Selection */}
      <div className="space-y-3">
        <label className="block text-xs font-bold uppercase tracking-widest text-text-muted">1. Choose Type</label>
        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id as CategoryType)}
                className={`relative flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                  isSelected 
                    ? 'border-primary ring-1 ring-primary bg-primary/5 text-primary shadow-sm' 
                    : 'border-ink/10 bg-white text-ink/60 hover:bg-base hover:border-ink/20'
                }`}
              >
                <Icon className={`w-6 h-6 mb-2 ${isSelected ? 'text-primary' : 'text-ink/40'}`} strokeWidth={1.5} />
                <span className="font-semibold text-sm">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Attributes Selection */}
      <AnimatePresence mode="wait">
        {category && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-6 overflow-hidden"
          >
            {ATTRIBUTE_OPTIONS[category as keyof typeof ATTRIBUTE_OPTIONS]?.length > 0 && (
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-widest text-text-muted">2. Specifications</label>
                <div className="space-y-4">
                  {ATTRIBUTE_OPTIONS[category as keyof typeof ATTRIBUTE_OPTIONS]?.map(attr => (
                    <div key={attr.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-base/50 rounded-xl border border-ink/5">
                      <span className="text-sm font-semibold text-ink/80">{attr.label}</span>
                      <div className="relative flex flex-wrap p-1 gap-1 bg-[#EAE9E5] rounded-lg w-full sm:w-auto">
                        {attr.options.map(opt => {
                          const isSelected = attributes[attr.id] === opt;
                          return (
                            <button
                              key={opt}
                              onClick={() => handleAttributeSelect(attr.id, opt)}
                              className={`relative flex-1 sm:flex-none min-w-[60px] px-2 sm:px-3 py-1.5 text-xs font-bold transition-colors z-10 cursor-pointer ${
                                isSelected ? 'text-ink' : 'text-text-muted hover:text-ink'
                              }`}
                            >
                              {isSelected && (
                                <motion.div 
                                  layoutId={`bg-${attr.id}`}
                                  className="absolute inset-0 bg-white shadow-sm border border-ink/5 rounded-md -z-10"
                                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                />
                              )}
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Dimensions */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-widest text-text-muted">3. Dimensions</label>
              <div className="grid grid-cols-2 gap-4">
                
                {/* Width */}
                <div className="bg-white border border-ink/10 rounded-xl p-2 sm:p-3 focus-within:border-primary/40 focus-within:ring-1 focus-within:ring-primary/40 transition-all">
                  <span className="block text-[10px] uppercase font-bold text-text-muted mb-1">Width</span>
                  <div className="flex items-baseline justify-between gap-0.5 sm:gap-1">
                    <input 
                      type="number" 
                      min="0"
                      value={dimensions.widthFeet || ''}
                      onChange={(e) => handleDimensionChange('widthFeet', parseInt(e.target.value) || 0)}
                      placeholder="0"
                      className="w-6 sm:w-12 text-lg sm:text-2xl font-black font-heading text-ink bg-transparent outline-none p-0 text-right placeholder:text-ink/20" 
                    />
                    <span className="text-xs sm:text-sm font-bold text-text-muted mr-1 sm:mr-2">ft</span>
                    <input 
                      type="number" 
                      min="0" max="11"
                      value={dimensions.widthInches || ''}
                      onChange={(e) => handleDimensionChange('widthInches', parseInt(e.target.value) || 0)}
                      placeholder="0"
                      className="w-6 sm:w-10 text-base sm:text-xl font-bold font-heading text-ink bg-transparent outline-none p-0 text-right placeholder:text-ink/20" 
                    />
                    <span className="text-xs sm:text-sm font-bold text-text-muted">in</span>
                  </div>
                </div>

                {/* Height */}
                <div className="bg-white border border-ink/10 rounded-xl p-2 sm:p-3 focus-within:border-primary/40 focus-within:ring-1 focus-within:ring-primary/40 transition-all">
                  <span className="block text-[10px] uppercase font-bold text-text-muted mb-1">Height</span>
                  <div className="flex items-baseline justify-between gap-0.5 sm:gap-1">
                    <input 
                      type="number" 
                      min="0"
                      value={dimensions.heightFeet || ''}
                      onChange={(e) => handleDimensionChange('heightFeet', parseInt(e.target.value) || 0)}
                      placeholder="0"
                      className="w-6 sm:w-12 text-lg sm:text-2xl font-black font-heading text-ink bg-transparent outline-none p-0 text-right placeholder:text-ink/20" 
                    />
                    <span className="text-xs sm:text-sm font-bold text-text-muted mr-1 sm:mr-2">ft</span>
                    <input 
                      type="number" 
                      min="0" max="11"
                      value={dimensions.heightInches || ''}
                      onChange={(e) => handleDimensionChange('heightInches', parseInt(e.target.value) || 0)}
                      placeholder="0"
                      className="w-6 sm:w-10 text-base sm:text-xl font-bold font-heading text-ink bg-transparent outline-none p-0 text-right placeholder:text-ink/20" 
                    />
                    <span className="text-xs sm:text-sm font-bold text-text-muted">in</span>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
