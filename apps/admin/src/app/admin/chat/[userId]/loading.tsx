"use client"

export default function ChatLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Floating Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          {/* Header Skeleton */}
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="w-32 h-4 bg-gray-200 rounded"></div>
                <div className="w-48 h-3 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>

          {/* Chat Container Skeleton */}
          <div className="bg-white/60 backdrop-blur-sm rounded-lg">
            <div className="p-6 space-y-4">
              {/* Message skeletons */}
              <div className="flex justify-end">
                <div className="w-64 h-16 bg-gray-200 rounded-2xl"></div>
              </div>
              <div className="flex justify-start">
                <div className="w-48 h-12 bg-gray-200 rounded-2xl"></div>
              </div>
              <div className="flex justify-end">
                <div className="w-56 h-20 bg-gray-200 rounded-2xl"></div>
              </div>
              <div className="flex justify-start">
                <div className="w-72 h-16 bg-gray-200 rounded-2xl"></div>
              </div>
            </div>

            {/* Input skeleton */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-end space-x-3">
                <div className="flex-1 h-11 bg-gray-200 rounded"></div>
                <div className="w-11 h-11 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}
