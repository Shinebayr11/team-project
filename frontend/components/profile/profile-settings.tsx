"use client"

import { UserProfile } from "@clerk/nextjs"

export function ProfileSettings() {
  return (
    <div className="flex justify-center">
      <UserProfile
        routing="hash"
        appearance={{
          elements: {
            rootBox: "w-full",
            cardBox: "w-full shadow-none border",
          },
        }}
      />
    </div>
  )
}
