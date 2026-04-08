import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Services from './components/sections/Services'
import Portfolio from './components/sections/Portfolio'
import Materials from './components/sections/Materials'
import WhyChooseUs from './components/sections/WhyChooseUs'
import Testimonials from './components/sections/Testimonials'
import Process from './components/sections/Process'
import Contact from './components/sections/Contact'

import CustomCursor from './components/ui/CustomCursor'
import SmoothScroll from './components/layout/SmoothScroll'
import WhatsAppButton from './components/ui/WhatsAppButton'

export default function App() {
  return (
    <SmoothScroll>
      <div className="min-h-screen bg-base max-w-[100vw] overflow-x-clip" style={{ cursor: 'none' }}>
        <CustomCursor />
        <Navbar />
        <main>
        <Hero />
        <About />
        <Services />
        <Portfolio />
        <Materials />
        <WhyChooseUs />
        <Testimonials />
        <Process />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
      </div>
    </SmoothScroll>
  )
}
