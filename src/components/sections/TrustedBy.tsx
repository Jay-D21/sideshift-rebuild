export default function TrustedBy() {
  const brands = [
    { name: 'Brex', domain: 'brex.com' },
    { name: 'Microsoft', domain: 'microsoft.com' },
    { name: 'Cursor', domain: 'cursor.sh' },
    { name: 'Replit', domain: 'replit.com' },
    { name: 'Kalshi', domain: 'kalshi.com' },
    { name: 'Paramount+', domain: 'paramountplus.com' },
    { name: 'Yik Yak', domain: 'yikyak.com' },
    { name: 'Grammarly', domain: 'grammarly.com' },
    { name: 'Picsart', domain: 'picsart.com' },
    { name: 'Adobe', domain: 'adobe.com' },
    { name: 'Shopify', domain: 'shopify.com' },
    { name: 'Notion', domain: 'notion.so' }
  ]
  const doubled = [...brands, ...brands]

  return (
    <section className="py-12 px-4 bg-white border-y border-gray-100 overflow-hidden">
      <p className="text-center text-[13px] font-medium tracking-widest uppercase mb-8" style={{ color: 'rgba(32,32,32,0.35)' }}>
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
          className="flex gap-10 items-center w-max"
          style={{ animation: 'marquee 40s linear infinite' }}
        >
          {doubled.map((brand, i) => (
            <div
              key={i}
              className="flex-shrink-0 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity duration-200"
            >
              <img 
                src={`https://logo.clearbit.com/${brand.domain}?size=80`} 
                alt={brand.name} 
                className="h-8 md:h-10 w-auto grayscale hover:grayscale-0 transition-all duration-300"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}