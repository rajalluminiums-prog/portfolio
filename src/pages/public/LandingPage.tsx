import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Preloader from '../../components/ui/Preloader';
import Hero from '../../components/sections/Hero';
import About from '../../components/sections/About';
import Services from '../../components/sections/Services';
import Portfolio from '../../components/sections/Portfolio';
import Materials from '../../components/sections/Materials';
import QuoteConfigurator from '../../components/sections/QuoteConfigurator';
import WhyChooseUs from '../../components/sections/WhyChooseUs';
import Testimonials from '../../components/sections/Testimonials';
import Process from '../../components/sections/Process';
import Contact from '../../components/sections/Contact';

export default function LandingPage() {
  const [isPreloading, setIsPreloading] = useState(true);
  const [isHeroReady, setIsHeroReady] = useState(false);

  return (
    <main>
      <AnimatePresence>
        {isPreloading && (
          <Preloader 
            key="preloader"
            onComplete={() => {
               setIsHeroReady(true);
               // Wait 1.2s for the shutter opening animation to finish before unmounting
               setTimeout(() => setIsPreloading(false), 1200);
            }} 
          />
        )}
      </AnimatePresence>
      <Hero isReady={isHeroReady} />
      <About />
      <Services />
      <Portfolio />
      <Materials />
      <QuoteConfigurator />
      <WhyChooseUs />
      <Testimonials />
      <Process />
      <Contact />
    </main>
  );
}
