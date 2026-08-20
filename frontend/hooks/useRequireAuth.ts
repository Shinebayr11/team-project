"use client"

import { useCallback } from "react"
import { useUser } from "@clerk/nextjs"
import { useNavigate } from "@/lib/router"

/**
 * Watching a live show is open to everyone; taking part in it is not.
 * Commenting, bidding and buying all route signed-out visitors to sign-in
 * first, returning them to where they were.
 */
export function useRequireAuth() {
  const { isSignedIn, isLoaded } = useUser()
  const navigate = useNavigate()

  const requireAuth = useCallback(
    (action: () => void) => {
      if (isSignedIn) {
        action()
        return
      }
      const returnTo =
        typeof window !== "undefined"
          ? `${window.location.pathname}${window.location.search}`
          : "/"
      navigate(`/sign-in?redirect_url=${encodeURIComponent(returnTo)}`)
    },
    [isSignedIn, navigate]
  )

  return { isSignedIn: !!isSignedIn, isLoaded, requireAuth }
}
