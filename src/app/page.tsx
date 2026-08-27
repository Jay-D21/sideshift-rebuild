import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/sections/Hero'
import TrustedBy from '@/components/sections/TrustedBy'
import Stats from '@/components/sections/Stats'
import HowItWorks from '@/components/sections/HowItWorks'
import Features from '@/components/sections/Features'
import Comparison from '@/components/sections/Comparison'
import Testimonials from '@/components/sections/Testimonials'
import CtaBanner from '@/components/sections/CtaBanner'
import FAQ from '@/components/sections/FAQ'

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col pt-0">
        <Hero />
        <TrustedBy />
        <Stats />
        <HowItWorks />
        <Features />
        <Comparison />
        <Testimonials />
        <CtaBanner />
        <FAQ />
      </main>
      <Footer />
    </>
  )
}
