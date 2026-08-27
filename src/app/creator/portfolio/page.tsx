import { Plus, Video, Play, ExternalLink } from 'lucide-react'

export default function PortfolioPage() {
  // Mock portfolio data since we don't have a portfolio table yet
  const portfolio = [
    { id: 1, title: 'Summer Skincare Routine', type: 'TikTok', views: '45.2K', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&q=80' },
    { id: 2, title: 'Tech Unboxing: New Headphones', type: 'YouTube Shorts', views: '120K', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80' },
    { id: 3, title: 'Morning Coffee Recipe', type: 'Instagram Reel', views: '12K', image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=500&q=80' },
  ]

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#202020]">Portfolio</h1>
          <p className="text-sm text-gray-500 mt-1">Showcase your best performing content to brands.</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-[#202020] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-black/90 transition-colors">
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolio.map(item => (
          <div key={item.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm group">
            <div className="relative aspect-[9/16] bg-gray-100 overflow-hidden">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center shadow-lg">
                  <Play className="w-5 h-5 text-white fill-white" />
                </div>
              </div>
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-2 py-1 rounded-md flex items-center gap-1.5">
                <Video className="w-3 h-3" /> {item.type}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-[#202020] mb-1 line-clamp-1">{item.title}</h3>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 font-medium">{item.views} views</span>
                <button className="text-[#3C83F9] font-medium hover:underline flex items-center gap-1">
                  View <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
