'use client'

import { LiveVideoPlayer } from '@/components/liveshow/LiveVideoPlayer'
import { LiveShowHeader } from '@/components/liveshow/LiveShowHeader'
import { useAuth } from '@clerk/nextjs'
import { useParams } from 'next/navigation'

export default function LiveViewPage() {
  const { userId, isLoaded } = useAuth()
  const params = useParams()
  const showId = params.id as string

  if (!isLoaded) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    )
  }

  return (
    <div className="w-full h-screen relative">
      <LiveVideoPlayer
        showId={showId}
        userName={`User-${userId?.slice(0, 8) || 'guest'}`}
      />
      <LiveShowHeader showId={showId} />
    </div>
  )
}
