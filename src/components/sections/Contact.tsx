import { useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../ui/GlassCard';
import SectionHeading from '../ui/SectionHeading';
import Button from '../ui/Button';
import ScrollReveal from '../ui/ScrollReveal';
import { Input, Textarea, Select } from '../ui/Input';
import { HiOutlineLocationMarker, HiOutlinePhone, HiOutlineMail, HiOutlineClock } from 'react-icons/hi';
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';

const CONTACT_INFO = [
  { icon: <HiOutlineLocationMarker className="w-5 h-5" />, label: 'Address', value: '187, GNT Market, Indore(MP)' },
  { icon: <HiOutlinePhone className="w-5 h-5" />, label: 'Phone', value: '+91 8602379396' },
  { icon: <HiOutlineMail className="w-5 h-5" />, label: 'Email', value: 'rajAluminiums@gmail.com' },
  { icon: <HiOutlineClock className="w-5 h-5" />, label: 'Hours', value: 'Mon – Sat: 9:00 AM – 7:00 PM' },
];

const PROJECT_TYPES = ['Select project type...', 'Windows', 'Doors', 'Partitions', 'Custom Fabrication', 'Other'];

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => { 
    e.preventDefault(); 
    setIsSubmitting(true);
    
    try {
      const payload = {
        access_key: "c248e694-8f09-429e-aaee-98d26f1315db", // <--- KEY INJECTED HERE
        subject: `New Lead: ${form.type || 'General Questions'}`,
        from_name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message
      };

      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSubmitted(true); 
        setForm({ name: '', phone: '', email: '', type: '', message: '' });
        setTimeout(() => setSubmitted(false), 5000); 
      } else {
        alert("Something went wrong. Please reach out via WhatsApp directly.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please reach out via WhatsApp directly.");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <section id="contact" className="relative overflow-hidden py-24 md:py-32 bg-base">
      <div className="section-container relative z-10">
        <SectionHeading badge="Get in Touch" title="Let's Build Together" subtitle="Have a project in mind? Drop us a message and we'll get back to you within 24 hours." />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <ScrollReveal className="lg:col-span-3" direction="left">
            <GlassCard variant="strong" className="p-8 md:p-10">
              {submitted ? (
                <motion.div className="flex flex-col items-center justify-center py-12 text-center" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4 bg-green-600/10 text-green-600">✓</div>
                  <h3 className="text-xl font-bold font-heading text-ink">Message Sent!</h3>
                  <p className="text-sm mt-2 text-text-muted">We'll get back to you within 24 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Full Name" type="text" required placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    <Input label="Phone" type="tel" required placeholder="+91 9876543210" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
                  <Input label="Email" type="email" placeholder="you@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  <Select label="Project Type" options={PROJECT_TYPES} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
                  <Textarea label="Message" rows={4} placeholder="Tell us about your project..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                  <Button className="w-full" size="lg" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              )}
            </GlassCard>
          </ScrollReveal>
          <ScrollReveal className="lg:col-span-2 h-full" direction="right">
            <div className="space-y-5 h-full flex flex-col">
              <GlassCard className="p-7">
                <h4 className="font-heading font-bold text-sm uppercase tracking-wider mb-5 text-ink">Contact Information</h4>
                <address className="space-y-4 not-italic">
                  {CONTACT_INFO.map((item) => (
                    <div key={item.label} className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-primary/10 text-primary">{item.icon}</div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-text-muted">{item.label}</p>
                        <p className="text-sm font-medium mt-0.5 text-ink">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </address>
              </GlassCard>
              <GlassCard className="p-7">
                <h4 className="font-heading font-bold text-sm uppercase tracking-wider mb-4 text-ink">Follow Us</h4>
                <div className="flex gap-3">
                  {[
                    { icon: <FaFacebookF />, l: 'Facebook', href: '#' }, 
                    { icon: <FaInstagram />, l: 'Instagram', href: '#' }, 
                    { icon: <FaWhatsapp />, l: 'WhatsApp', isSocial: true, href: 'https://wa.me/918602379396' }
                  ].map((s) => (
                    <a key={s.l} href={s.href} target={s.href !== '#' ? '_blank' : undefined} rel="noopener noreferrer" className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${s.isSocial ? 'bg-green-500/10 text-green-500' : 'bg-primary/10 text-primary'}`} aria-label={s.l}>{s.icon}</a>
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
