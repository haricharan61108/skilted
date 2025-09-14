export default function UserChatLoading() {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            {/* Back button skeleton */}
            <div className="h-8 bg-gray-200 rounded w-32 mb-4"></div>
  
            {/* Header skeleton */}
            <div className="bg-gray-200 rounded-lg h-20 mb-6"></div>
  
            {/* Messages skeleton */}
            <div className="bg-gray-200 rounded-lg h-96 mb-6"></div>
  
            {/* Input skeleton */}
            <div className="bg-gray-200 rounded-lg h-16"></div>
          </div>
        </div>
      </div>
    )
  }
  