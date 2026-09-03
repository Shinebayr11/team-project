'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Heart, Users } from 'lucide-react'

interface LiveShowHeaderProps {
  showId: string
}

interface ShowData {
  _id?: string
  title?: string
  seller?: { _id?: string; display_name?: string; avatar_url?: string }
  seller_id?: string
  viewer_count?: number
  category?: string
}

export function LiveShowHeader({ showId }: LiveShowHeaderProps) {
  const { userId } = useAuth()
  const [show, setShow] = useState<ShowData | null>(null)
  const [viewerCount, setViewerCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch show details
        const showRes = await fetch(`/api/liveshow/${showId}`)
        if (showRes.ok) {
          const { data } = await showRes.json()
          setShow(data)
        }

        // Fetch viewer count
        const countRes = await fetch(`/api/liveshow/${showId}/participants`)
        if (countRes.ok) {
          const { viewerCount } = await countRes.json()
          setViewerCount(viewerCount || 0)
        }
      } catch (err) {
        console.error('Failed to fetch show data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 5000) // Refresh every 5 seconds
    return () => clearInterval(interval)
  }, [showId])

  const handleFollow = async () => {
    if (!userId || !show?.seller_id) return

    setFollowLoading(true)
    try {
      const endpoint = isFollowing ? '/api/users/unfollow' : '/api/users/follow'
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sellerId: show.seller_id }),
      })

      if (res.ok) {
        setIsFollowing(!isFollowing)
      }
    } catch (err) {
      console.error('Failed to follow:', err)
    } finally {
      setFollowLoading(false)
    }
  }

  if (loading) return null

  const sellerName = show?.seller?.display_name || 'Seller'
  const sellerAvatar = show?.seller?.avatar_url

  return (
    <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/60 to-transparent p-4">
      <div className="flex items-start justify-between">
        {/* Seller Info */}
        <div className="flex items-center gap-3">
          {sellerAvatar ? (
            <img
              src={sellerAvatar}
              alt={sellerName}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
              {sellerName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-white font-bold text-sm truncate">{sellerName}</p>
            {show?.title && (
              <p className="text-white/80 text-xs truncate">{show.title}</p>
            )}
          </div>
        </div>

        {/* Viewer Count + Follow */}
        <div className="flex items-center gap-3">
          {/* Viewer Count */}
          <div className="flex items-center gap-1 bg-black/40 backdrop-blur px-3 py-1.5 rounded-full">
            <Users className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-semibold">{viewerCount}</span>
          </div>

          {/* Follow Button */}
          <button
            onClick={handleFollow}
            disabled={followLoading}
            className={`rounded-full p-2 transition-colors ${
              isFollowing
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-red-500 hover:bg-red-600'
            } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Heart className="w-5 h-5" fill="currentColor" />
          </button>
        </div>
      </div>
    </div>
  )
}
