"use client"

import { SignOutButton } from "@clerk/nextjs"

export default function SignOutPage() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <SignOutButton redirectUrl="/">
        <button className="rounded-full bg-black px-6 py-3 font-bold text-white">
          Гарах
        </button>
      </SignOutButton>
    </div>
  )
}
