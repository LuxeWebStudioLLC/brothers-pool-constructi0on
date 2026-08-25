import { useEffect } from 'react'
import { ScrollTrigger } from './lib/anim'

import ScrollProgress from './components/ScrollProgress'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Services from './components/Services'
import Craft from './components/Craft'
import CaseStudy from './components/CaseStudy'
import Projects from './components/Projects'
import AreaMarquee from './components/AreaMarquee'
import Contact from './components/Contact'
import Heritage from './components/Heritage'
import Testimonials from './components/Testimonials'
import Process from './components/Process'
import Faq from './components/Faq'
import Footer from './components/Footer'
import QuotePopup from './components/QuotePopup'

export default function App() {
  // Images finishing late would otherwise leave every trigger measuring stale
  // positions, so refresh once the page is fully loaded.
  useEffect(() => {
    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)
    return () => window.removeEventListener('load', onLoad)
  }, [])

  return (
    <>
      <a
        href="#services"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-aqua focus:px-4 focus:py-2 focus:font-display focus:text-sm focus:text-ink"
      >
        Skip to content
      </a>

      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <Services />
        <Craft />
        <CaseStudy />
        <Projects />
        <AreaMarquee />
        <Contact />
        <Heritage />
        <Testimonials />
        <Process />
        <Faq />
      </main>
      <Footer />
      <QuotePopup />
    </>
  )
}
