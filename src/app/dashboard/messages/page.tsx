import { Search, Edit } from 'lucide-react'

export default function BrandMessagesPage() {
  return (
    <div className="h-full flex flex-col p-6 max-h-screen">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#202020]">Messages</h1>
          <p className="text-sm text-gray-500 mt-1">Communicate with creators for your campaigns.</p>
        </div>
        <button className="bg-[#202020] text-white p-2.5 rounded-lg hover:bg-black/90 transition-colors">
          <Edit className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex min-h-[500px]">
        {/* Sidebar */}
        <div className="w-80 border-r border-gray-100 flex flex-col bg-gray-50">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search messages..."
                className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-gray-400 bg-white"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 text-center text-sm text-gray-500 mt-10">
              No recent conversations.
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col items-center justify-center bg-white text-center p-8">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Edit className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="font-bold text-[#202020] text-lg">Your Messages</h3>
          <p className="text-gray-500 text-sm max-w-sm mt-2">
            Select a conversation from the sidebar or start a new one to chat with creators.
          </p>
        </div>
      </div>
    </div>
  )
}
