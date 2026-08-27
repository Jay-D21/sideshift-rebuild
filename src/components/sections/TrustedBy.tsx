export default function TrustedBy() {
  const brands = ['Brex', 'Microsoft', 'Cursor', 'Replit', 'Kalshi', 'Paramount+', 'Yik Yak', 'Grammarly', 'Picsart']
  const doubled = [...brands, ...brands]

  return (
    <section className="py-12 px-4 bg-white border-y border-gray-100 overflow-hidden">
      <p className="text-center text-[13px] font-medium tracking-widest uppercase mb-8" style={{ color: 'rgba(32,32,32,0.35)' }}>
        Trusted by 3,000+ brands
      </p>
      <div
        className="relative"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
        }}
      >
        <div className="flex animate-marquee gap-8 w-max">
          {doubled.map((brand, i) => (
            <div
              key={i}
              className="flex-shrink-0 rounded-full border border-gray-200 bg-white px-5 py-2 text-sm font-bold text-[rgba(32,32,32,0.6)] hover:border-gray-400 hover:text-[#202020] transition-colors duration-150 cursor-default select-none"
            >
              {brand}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}