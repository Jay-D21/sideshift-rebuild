export default function TrustedBy() {
  const brands = ['Brex', 'Microsoft', 'Cursor', 'Replit', 'Kalshi', 'Paramount+', 'Yik Yak', 'Grammarly', 'Picsart', 'Adobe', 'Shopify', 'Notion']
  const doubled = [...brands, ...brands]

  return (
    <section className="py-12 px-4 bg-white border-y border-gray-100 overflow-hidden">
      <p className="text-center text-[13px] font-medium tracking-widest uppercase mb-8" style={{ color: 'rgba(32,32,32,0.35)' }}>
        Trusted by 3,000+ brands
      </p>
      <div
        className="relative overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        }}
      >
        <div
          className="flex gap-6 w-max"
          style={{ animation: 'marquee 20s linear infinite' }}
        >
          {doubled.map((brand, i) => (
            <div
              key={i}
              className="flex-shrink-0 rounded-full border border-gray-200 bg-white px-5 py-2 text-sm font-bold cursor-default select-none hover:border-gray-400 hover:text-[#202020] transition-colors duration-150"
              style={{ color: 'rgba(32,32,32,0.6)' }}
            >
              {brand}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}