import { FadeUp } from '@/components/ui/fade-up'

const quotes = [
  {
    text: 'We ran a campaign with 12 creators in the first week. The content quality blew us away — better than anything our agency had delivered in 6 months.',
    author: 'Priya L.',
    role: 'Brand Director, Grammarly',
    gradient: 'from-blue-400 to-indigo-500',
  },
  {
    text: "CreatorFlow replaced our entire outbound influencer process. Creators apply to us now. It's completely changed how we think about UGC at scale.",
    author: 'James M.',
    role: 'Growth Lead, Cursor',
    gradient: 'from-emerald-400 to-teal-500',
  },
  {
    text: 'Within 24 hours of posting our brief, we had 60+ applications from creators who matched our exact niche. The pipeline view alone is worth the subscription.',
    author: 'Sarah K.',
    role: 'Head of Marketing, Brex',
    gradient: 'from-orange-400 to-pink-500',
  },
]

export default function Testimonials() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="mx-auto max-w-6xl">
        <FadeUp className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#202020] md:text-4xl">Brands love CreatorFlow</h2>
          <p className="mt-3 text-[15px] leading-[145%]" style={{ color: 'rgba(32,32,32,0.55)' }}>
            Real results from real campaigns.
          </p>
        </FadeUp>

        <div className="grid md:grid-cols-3 gap-6">
          {quotes.map((q, i) => (
            <FadeUp key={q.author} delay={i * 0.1}>
              <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm p-7 hover:-translate-y-0.5 transition-transform duration-200 flex flex-col">
                {/* Giant decorative quote mark */}
                <div className="text-[100px] font-bold text-[#E0F5FF] leading-none absolute top-2 left-5 select-none pointer-events-none">&ldquo;</div>
                <div className="relative z-10">
                  <p className="text-[15px] leading-[160%] italic text-[#202020] mb-6 pt-6">{q.text}</p>
                  <div className="flex items-center gap-3 mt-auto">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${q.gradient} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                      {q.author.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#202020]">{q.author}</div>
                      <div className="text-xs" style={{ color: 'rgba(32,32,32,0.55)' }}>{q.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}