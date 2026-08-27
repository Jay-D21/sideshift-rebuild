'use client'

import { 
  FaMicrosoft, FaApple, FaAmazon, FaSpotify, 
  FaStripe, FaShopify, FaSlack, FaGoogle, 
  FaSalesforce, FaDropbox, FaFigma, FaAirbnb
} from 'react-icons/fa'

export default function TrustedBy() {
  const brands = [
    { name: 'Microsoft', Icon: FaMicrosoft },
    { name: 'Apple', Icon: FaApple },
    { name: 'Amazon', Icon: FaAmazon },
    { name: 'Spotify', Icon: FaSpotify },
    { name: 'Stripe', Icon: FaStripe },
    { name: 'Shopify', Icon: FaShopify },
    { name: 'Slack', Icon: FaSlack },
    { name: 'Google', Icon: FaGoogle },
    { name: 'Salesforce', Icon: FaSalesforce },
    { name: 'Dropbox', Icon: FaDropbox },
    { name: 'Figma', Icon: FaFigma },
    { name: 'Airbnb', Icon: FaAirbnb },
  ]
  const doubled = [...brands, ...brands]

  return (
    <section className="py-12 px-4 bg-white border-y border-gray-100 overflow-hidden">
      <p className="text-center text-[13px] font-medium tracking-widest uppercase mb-10" style={{ color: 'rgba(32,32,32,0.35)' }}>
        Trusted by 3,000+ brands
      </p>
      <div
        className="relative overflow-hidden max-w-7xl mx-auto"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        }}
      >
        <div
          className="flex gap-16 items-center w-max"
          style={{ animation: 'marquee 40s linear infinite' }}
        >
          {doubled.map((brand, i) => (
            <div
              key={i}
              className="flex-shrink-0 flex items-center justify-center gap-2 opacity-50 hover:opacity-100 transition-opacity duration-200 grayscale hover:grayscale-0"
              title={brand.name}
            >
              <brand.Icon className="w-8 h-8 md:w-10 md:h-10 text-[#202020]" />
              <span className="text-xl md:text-2xl font-bold text-[#202020] tracking-tight">{brand.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}