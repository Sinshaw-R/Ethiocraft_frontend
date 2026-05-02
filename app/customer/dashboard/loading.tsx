export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
        <p className="text-gray-600">Loading your dashboard...</p>
      </div>
    </div>
  )
}