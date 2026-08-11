export interface UserProfile {
  username: string
  avatarUrl?: string
  memberSince: string
  followingCount: number
  purchasesCount: number
  savedShowsCount: number
}

export interface FollowedSeller {
  id: string
  username: string
  avatarUrl?: string
  tagline: string
  isLive?: boolean
}
