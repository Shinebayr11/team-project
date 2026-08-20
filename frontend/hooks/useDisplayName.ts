"use client"

import { useUser } from "@clerk/nextjs"

/** The name a user typed for themselves, kept in Clerk so every device sees it. */
export const DISPLAY_NAME_KEY = "displayName"

export const readDisplayName = (
  unsafeMetadata: unknown
): string | undefined => {
  const value = (unsafeMetadata as Record<string, unknown> | null | undefined)?.[
    DISPLAY_NAME_KEY
  ]
  return typeof value === "string" && value.trim() ? value.trim() : undefined
}

/**
 * One name for the whole app. Email-only signups have no Clerk name, so we
 * prefer the one the user typed themselves and never fall back to the raw
 * email address — only its local part, as a handle.
 */
export function useDisplayName() {
  const { user, isLoaded } = useUser()

  const chosen = readDisplayName(user?.unsafeMetadata)
  const emailLocalPart =
    user?.primaryEmailAddress?.emailAddress?.split("@")[0] ?? undefined

  const displayName =
    chosen ?? user?.fullName ?? user?.username ?? emailLocalPart ?? "Зочин"
  const handle = user?.username ?? emailLocalPart ?? ""
  const initial = displayName.charAt(0).toUpperCase() || "?"

  return {
    displayName,
    handle,
    initial,
    /** True once we know the user still owes us a name. */
    needsName: isLoaded && !!user && !chosen && !user.fullName && !user.username,
    isLoaded,
  }
}
