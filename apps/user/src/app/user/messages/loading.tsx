export default function MessagesLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>

            {/* Search skeleton */}
            <div className="h-12 bg-gray-200 rounded-lg mb-8"></div>
          </div>

          {/* Conversations skeleton */}
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg p-6">
                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 bg-gray-300 rounded-full flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
