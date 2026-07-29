import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheckCircle } from 'react-icons/fi';
import { Input } from './Input';

interface ReviewSubmissionProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: () => void;
}

const EMOJIS = [
  { char: '🤩', label: 'Excellent', value: 5 },
  { char: '😍', label: 'Great', value: 5 },
  { char: '😊', label: 'Good', value: 4 },
  { char: '😐', label: 'Okay', value: 3 },
  { char: '😞', label: 'Poor', value: 1 },
];

import api from '../../api';

export default function ReviewSubmission({ isOpen, onClose, onSubmitSuccess }: ReviewSubmissionProps) {
  const [selectedEmoji, setSelectedEmoji] = useState<{char: string; value: number} | null>(null);
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setSuccess(false);
        setSelectedEmoji(null);
        setAuthorName('');
        setAuthorRole('');
        setContent('');
      }, 300);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmoji || !authorName.trim() || !content.trim()) return;

    setIsSubmitting(true);
    
    try {
      const res = await api.post('/api/reviews', {
        authorName,
        authorRole,
        content,
        ratingEmoji: selectedEmoji.char,
        numericValue: selectedEmoji.value,
      });
      
      const data = res.data;
      if (data.success) {
        setSuccess(true);
        if (onSubmitSuccess) onSubmitSuccess();
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#1A1C1A]/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md bg-base rounded-[2rem] p-6 sm:p-8 shadow-2xl border border-white/50 z-10 overflow-hidden"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full text-text-muted hover:bg-black/5 hover:text-ink transition-colors"
              aria-label="Close dialog"
            >
              <FiX size={20} />
            </button>

            {success ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-10 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center mb-4">
                  <FiCheckCircle size={32} />
                </div>
                <h3 className="text-xl font-heading font-bold text-ink mb-2">Thank you!</h3>
                <p className="text-sm text-text-muted">Your review has been submitted successfully.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div>
                  <h3 className="text-2xl font-heading font-bold text-ink">Share your experience</h3>
                  <p className="text-sm text-text-muted mt-1">We value your feedback on our architectural execution.</p>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-ink uppercase tracking-wider block">How was it?</label>
                  <div className="flex justify-between bg-white px-4 py-5 pb-8 rounded-2xl shadow-inner border border-[#C4C5D5]/20">
                    {EMOJIS.map((emoji) => (
                      <button
                        key={emoji.char}
                        type="button"
                        onClick={() => setSelectedEmoji(emoji)}
                        className="relative group flex flex-col items-center justify-center outline-none w-10"
                        aria-label={emoji.label}
                      >
                        <span 
                          className={`text-3xl transition-all duration-300 transform ${selectedEmoji?.char === emoji.char ? 'scale-125 filter-none drop-shadow-md z-10' : 'scale-100 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 hover:scale-110'}`}
                          role="img"
                        >
                          {emoji.char}
                        </span>
                        {selectedEmoji?.char === emoji.char && (
                          <motion.span 
                            layoutId="emoji-label"
                            className="absolute -bottom-6 text-[10px] font-bold text-primary uppercase tracking-wider whitespace-nowrap"
                          >
                            {emoji.label}
                          </motion.span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <Input 
                    label="Your Name"
                    type="text" 
                    placeholder="Enter your full name" 
                    required 
                    value={authorName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAuthorName(e.target.value)}
                  />
                  <Input 
                    label="Role (Optional)"
                    type="text" 
                    placeholder="e.g., Homeowner, Architect" 
                    value={authorRole}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAuthorRole(e.target.value)}
                  />
                  <textarea 
                    placeholder="Tell us about your experience..." 
                    required 
                    rows={3}
                    className="w-full px-5 py-4 bg-white/50 border border-[#C4C5D5]/40 rounded-2xl text-base text-ink placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none shadow-sm hover:border-[#C4C5D5]/80"
                    value={content}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={!selectedEmoji || !authorName.trim() || !content.trim() || isSubmitting}
                  className="w-full bg-ink text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-ink/10 flex items-center justify-center h-12"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Submit Review'
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
