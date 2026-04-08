import { useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../ui/GlassCard';
import SectionHeading from '../ui/SectionHeading';
import Button from '../ui/Button';
import ScrollReveal from '../ui/ScrollReveal';
import { HiOutlineLocationMarker, HiOutlinePhone, HiOutlineMail, HiOutlineClock } from 'react-icons/hi';
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';

const CONTACT_INFO = [
  { icon: <HiOutlineLocationMarker className="w-5 h-5" />, label: 'Address', value: '187, GNT Market, Indore(MP)' },
  { icon: <HiOutlinePhone className="w-5 h-5" />, label: 'Phone', value: '+91 8602379396' },
  { icon: <HiOutlineMail className="w-5 h-5" />, label: 'Email', value: 'rajalluminiums@gmail.com' },
  { icon: <HiOutlineClock className="w-5 h-5" />, label: 'Hours', value: 'Mon – Sat: 9:00 AM – 7:00 PM' },
];

const PROJECT_TYPES = ['Select project type...', 'Windows', 'Doors', 'Partitions', 'Custom Fabrication', 'Other'];

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', type: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => { 
    e.preventDefault(); 
    
    // Construct payload for native email client
    const subject = `Website Inquiry: ${form.type || 'General Questions'}`;
    const body = `Name: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\nProject Type: ${form.type}\n\nMessage:\n${form.message}`;
    
    // Trigger email client
    window.location.href = `mailto:rajalluminiums@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    setSubmitted(true); 
    setForm({ name: '', phone: '', email: '', type: '', message: '' });
    setTimeout(() => setSubmitted(false), 4000); 
  };

  const inputStyle: React.CSSProperties = { backgroundColor: '#FFFFFF', color: '#1A1C1A', border: '1px solid transparent', borderRadius: '0.75rem', padding: '0.75rem 1rem', fontSize: '0.875rem', outline: 'none', width: '100%', transition: 'border-color 0.2s', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.03)' };

  return (
    <section id="contact" className="relative overflow-hidden" style={{ padding: '5rem 0', backgroundColor: '#FAF9F6' }}>
      <div className="section-container relative z-10">
        <SectionHeading badge="Get in Touch" title="Let's Build Together" subtitle="Have a project in mind? Drop us a message and we'll get back to you within 24 hours." />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <ScrollReveal className="lg:col-span-3" direction="left">
            <GlassCard variant="strong" className="p-8 md:p-10">
              {submitted ? (
                <motion.div className="flex flex-col items-center justify-center py-12 text-center" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4" style={{ backgroundColor: 'rgba(22,163,74,0.1)', color: '#16A34A' }}>✓</div>
                  <h3 className="text-xl font-bold font-heading" style={{ color: '#1A1C1A' }}>Message Sent!</h3>
                  <p className="text-sm mt-2" style={{ color: '#444653' }}>We'll get back to you within 24 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider mb-1.5 block" style={{ color: '#444653' }}>Full Name</label>
                      <input type="text" required style={inputStyle} placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} onFocus={(e) => e.target.style.borderColor = '#00288E'} onBlur={(e) => e.target.style.borderColor = 'transparent'} />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider mb-1.5 block" style={{ color: '#444653' }}>Phone</label>
                      <input type="tel" required style={inputStyle} placeholder="+91 9876543210" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} onFocus={(e) => e.target.style.borderColor = '#00288E'} onBlur={(e) => e.target.style.borderColor = 'transparent'} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider mb-1.5 block" style={{ color: '#444653' }}>Email</label>
                    <input type="email" style={inputStyle} placeholder="you@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} onFocus={(e) => e.target.style.borderColor = '#00288E'} onBlur={(e) => e.target.style.borderColor = 'transparent'} />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider mb-1.5 block" style={{ color: '#444653' }}>Project Type</label>
                    <select style={inputStyle} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                      {PROJECT_TYPES.map((t) => <option key={t} value={t === PROJECT_TYPES[0] ? '' : t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider mb-1.5 block" style={{ color: '#444653' }}>Message</label>
                    <textarea rows={4} style={inputStyle} placeholder="Tell us about your project..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} onFocus={(e) => e.target.style.borderColor = '#00288E'} onBlur={(e) => e.target.style.borderColor = 'transparent'} />
                  </div>
                  <Button className="w-full" size="lg" type="submit">Send Message</Button>
                </form>
              )}
            </GlassCard>
          </ScrollReveal>
          <ScrollReveal className="lg:col-span-2 h-full" direction="right">
            <div className="space-y-5 h-full flex flex-col">
              <GlassCard className="p-7">
                <h4 className="font-heading font-bold text-sm uppercase tracking-wider mb-5" style={{ color: '#1A1C1A' }}>Contact Information</h4>
                <address className="space-y-4 not-italic">
                  {CONTACT_INFO.map((item) => (
                    <div key={item.label} className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(0,40,142,0.06)', color: '#00288E' }}>{item.icon}</div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#444653' }}>{item.label}</p>
                        <p className="text-sm font-medium mt-0.5" style={{ color: '#1A1C1A' }}>{item.value}</p>
                      </div>
                    </div>
                  ))}
                </address>
              </GlassCard>
              <GlassCard className="p-7">
                <h4 className="font-heading font-bold text-sm uppercase tracking-wider mb-4" style={{ color: '#1A1C1A' }}>Follow Us</h4>
                <div className="flex gap-3">
                  {[
                    { icon: <FaFacebookF />, l: 'Facebook', href: '#' }, 
                    { icon: <FaInstagram />, l: 'Instagram', href: '#' }, 
                    { icon: <FaWhatsapp />, l: 'WhatsApp', isSocial: true, href: 'https://wa.me/918602379396' }
                  ].map((s) => (
                    <a key={s.l} href={s.href} target={s.href !== '#' ? '_blank' : undefined} rel="noopener noreferrer" className="w-11 h-11 rounded-xl flex items-center justify-center transition-colors" style={s.isSocial ? { backgroundColor: 'rgba(37,211,102,0.1)', color: '#25D366' } : { backgroundColor: 'rgba(0,40,142,0.06)', color: '#00288E' }} aria-label={s.l}>{s.icon}</a>
                  ))}
                </div>
              </GlassCard>
              <GlassCard hover={false} className="flex-1 min-h-[300px] p-2 flex overflow-hidden">
                <div className="w-full h-full rounded-lg overflow-hidden bg-white/50">
                   <iframe 
                     width="100%" 
                     height="100%" 
                     style={{ border: 0 }} 
                     loading="lazy" 
                     allowFullScreen 
                     src="https://maps.google.com/maps?width=100%25&height=600&hl=en&q=Raj%20Aluminium%20And%20Door%20House,%20187%20GNT%20Market,%20Indore,%20Madhya%20Pradesh&t=&z=16&ie=UTF8&iwloc=B&output=embed"
                   ></iframe>
                </div>
              </GlassCard>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
