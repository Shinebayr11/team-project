"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { DISPLAY_NAME_KEY, useDisplayName } from "@/hooks/useDisplayName"

/**
 * Email signups arrive with no name at all, which used to leave the raw email
 * address on screen. Ask once, store it on the Clerk user so it follows them
 * everywhere, and let UserSync mirror it to our own database.
 */
export const NamePrompt: React.FC = () => {
  const { user } = useUser()
  const { needsName } = useDisplayName()
  const [name, setName] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!needsName || !user) return null

  const save = async () => {
    const trimmed = name.trim()
    if (!trimmed) return

    setSaving(true)
    setError(null)
    try {
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          [DISPLAY_NAME_KEY]: trimmed,
        },
      })
    } catch (updateError) {
      console.error("Failed to save display name:", updateError)
      setError("Нэрийг хадгалж чадсангүй. Дахин оролдоно уу.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-bold tracking-tight text-[var(--wn-ink)]">
          Тавтай морил!
        </h2>
        <p className="mt-2 text-sm text-[var(--wn-ink-3)]">
          Бусдад харагдах нэрээ оруулна уу.
        </p>

        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") save()
          }}
          placeholder="Таны нэр"
          maxLength={40}
          className="mt-5 h-11 w-full rounded-lg border border-[var(--wn-line)] bg-white px-3 text-sm text-[var(--wn-ink)] outline-none focus:ring-2 focus:ring-[var(--wn-accent)]"
        />

        {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

        <Button
          className="mt-4 w-full"
          onClick={save}
          disabled={!name.trim() || saving}
        >
          {saving ? "Хадгалж байна..." : "Үргэлжлүүлэх"}
        </Button>
      </div>
    </div>
  )
}
