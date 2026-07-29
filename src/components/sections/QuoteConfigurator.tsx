import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import InteractiveWindowModel from '../ui/InteractiveWindowModel';
import InteractiveDoorModel from '../ui/InteractiveDoorModel';
import SectionHeading from '../ui/SectionHeading';
import ConfigurationForm from '../ui/ConfigurationForm';
import type { CategoryType, QuoteDimensions } from '../ui/ConfigurationForm';
import api from '../../api';

export default function QuoteConfigurator() {
  const [specs, setSpecs] = useState<{ category: CategoryType, attributes: Record<string, string>, dimensions: QuoteDimensions } | null>(null);
  const [quoteResult, setQuoteResult] = useState<{ areaSqFt: number, pricePerSqFt: number, estimatedTotal: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSpecsChange = useCallback(async (newSpecs: any) => {
    setSpecs(newSpecs);
    
    const { category, attributes, dimensions } = newSpecs;
    if (!category || (dimensions.widthFeet === 0 && dimensions.widthInches === 0) || (dimensions.heightFeet === 0 && dimensions.heightInches === 0)) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/api/rates/calculate', {
        category, attributes, dimensions
      });

      const result = response.data;

      if (result.success) {
        setQuoteResult(result.data);
      } else {
        setQuoteResult(null);
        setError(result.error || 'Failed to calculate quote');
      }
    } catch (err) {
      setQuoteResult(null);
      setError('Network error. Unable to calculate quote.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const modelWidth = specs?.dimensions.widthFeet || 6;
  const modelHeight = specs?.dimensions.heightFeet || 5;
  const trackCount = specs?.attributes?.track === '2T' ? 2 : 3;
  const hasMesh = specs?.category === 'Window' ? true : false; 
  const isFix = specs?.category === 'Fix';

  return (
    <section id="quote" className="py-10 bg-base relative flex flex-col justify-center min-h-[calc(100vh-80px)]">
      <div className="section-container max-w-[1400px] mx-auto px-4 md:px-8 w-full">
        
        <SectionHeading 
          align="center"
          badge="Instant Quote"
          title="Architectural Configurator"
          subtitle="Design your perfect setup and get a real-time, mathematically accurate estimate."
          className="mb-8"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch h-full">
          
          {/* Left Column: 3D Visualization & Floating Result */}
          <div className="lg:col-span-7 bg-white/70 rounded-3xl overflow-hidden shadow-[0_4px_40px_rgba(0,0,0,0.03)] border border-ink/5 relative flex items-center justify-center p-8 h-[600px] lg:h-[700px]">
            
            {/* Subtle Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')] pointer-events-none" />

            <div className="relative z-10 w-full max-w-3xl xl:max-w-4xl">
              {!isFix && specs?.category !== 'Profile' ? (
                specs?.category === 'Door' ? (
                  <InteractiveDoorModel 
                    width={modelWidth} 
                    height={modelHeight} 
                    doorType={specs?.attributes?.doorType || 'Openable'} 
                  />
                ) : (
                  <InteractiveWindowModel 
                    width={modelWidth} 
                    height={modelHeight} 
                    trackCount={trackCount}
                    hasMesh={hasMesh}
                  />
                )
              ) : (
                <div className="w-full h-[400px] flex items-center justify-center text-ink/40 font-medium">
                  <p>3D Visualization not applicable for this category.</p>
                </div>
              )}
            </div>

            {/* Floating Quote Result Card */}
            <AnimatePresence>
              {(isLoading || quoteResult || error) && (
                <motion.div 
                  initial={{ opacity: 0, y: 30, scale: 0.95 }} 
                  animate={{ opacity: 1, y: 0, scale: 1 }} 
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  className="absolute bottom-6 left-6 right-6 lg:left-1/2 lg:-translate-x-1/2 lg:right-auto lg:w-[90%] max-w-md bg-white/90 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white z-20 overflow-hidden"
                >
                  {isLoading && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-10">
                      <div className="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
                    </div>
                  )}
                  
                  {error ? (
                    <div className="text-red-500 font-semibold text-center py-4 flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {error}
                    </div>
                  ) : quoteResult ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-ink/5 pb-4">
                        <div>
                          <p className="text-text-muted text-xs font-bold uppercase tracking-widest mb-1">Estimated Total</p>
                          <div className="flex items-baseline gap-2">
                            <h4 className="text-4xl font-heading font-black text-ink">
                              ₹{quoteResult.estimatedTotal.toLocaleString()}
                            </h4>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-text-muted text-xs font-bold uppercase tracking-widest mb-1">Area</p>
                          <p className="font-semibold text-ink">{quoteResult.areaSqFt} <span className="text-sm font-normal text-text-muted">sq ft</span></p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-sm font-medium text-text-muted">
                        <p>Based on exact dimensions</p>
                        <p className="bg-base px-3 py-1 rounded-full text-xs font-bold text-ink">₹{quoteResult.pricePerSqFt}/sqft</p>
                      </div>
                    </div>
                  ) : null}
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Right Column: Configuration Form */}
          <div className="lg:col-span-5 bg-white/70 rounded-3xl p-6 lg:p-8 shadow-[0_4px_40px_rgba(0,0,0,0.03)] border border-ink/5 h-auto lg:h-[700px] w-full">
            <ConfigurationForm 
              onSpecsChange={handleSpecsChange}
            />
          </div>

        </div>
      </div>
    </section>
  );
}
