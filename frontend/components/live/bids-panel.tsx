"use client"

import { Avatar } from "@/components/ui/Avatar"

interface Bid {
  name: string
  amount: number
}

// Mock data: bids are not wired to live shows on the backend yet (the Bid model
// hangs off product listings, and viewers have no way to bid from the room).
const MOCK_BIDS: Bid[] = [
  { name: "kewpiepie_vintage", amount: 240 },
  { name: "sallysnow", amount: 225 },
  { name: "vintagecurator", amount: 210 },
  { name: "kentuckymomvintage", amount: 195 },
  { name: "suzlack5", amount: 180 },
  { name: "missa_rissa3", amount: 165 },
]

/** Who is bidding right now, for the host's console. */
export function BidsPanel() {
  const [highest] = MOCK_BIDS

  return (
    <div className="flex h-full w-[280px] shrink-0 flex-col overflow-hidden rounded-[20px] border border-[var(--wn-line)] bg-white">
      <div className="flex items-center justify-between border-b border-[var(--wn-line)] p-3">
        <h2 className="text-[14px] font-[800] text-[var(--wn-ink)]">
          Үнийн санал
        </h2>
        <span className="text-[12px] font-[600] text-[var(--wn-ink-3)]">
          {MOCK_BIDS.length} санал
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {MOCK_BIDS.map((bid) => {
          const isHighest = bid === highest
          return (
            <div
              key={bid.name}
              className={`flex items-center gap-3 rounded-xl p-2 transition-colors ${
                isHighest
                  ? "bg-[var(--wn-accent-soft)]"
                  : "hover:bg-[var(--wn-surface-2)]"
              }`}
            >
              <Avatar name={bid.name} size={32} tint="var(--wn-surface-2)" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-[600] text-[var(--wn-ink)]">
                  {bid.name}
                </div>
                {isHighest && (
                  <div className="text-[11px] font-[700] text-[var(--wn-accent)]">
                    Хамгийн өндөр
                  </div>
                )}
              </div>
              <span className="shrink-0 text-[13px] font-[700] text-[var(--wn-ink-2)]">
                ₮{bid.amount}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
